import { prisma } from '@/lib/db/prisma';
import { getSystemSettings } from '@/lib/settings/settings';
import { sendAcceptanceEmail } from '@/lib/email/service';

export interface AutomationResult {
  processedCount: number;
  acceptedCount: number;
  emailsSentCount: number;
  errorsCount: number;
  details: Array<{
    applicationId: string;
    fullName: string;
    status: string;
    emailSent: boolean;
    error?: string;
  }>;
}

export interface AutomationOptions {
  skipDelay?: boolean;
}

export async function processAutomaticAcceptance(options?: AutomationOptions): Promise<AutomationResult> {
  const settings = await getSystemSettings();

  if (!settings.auto_acceptance_enabled) {
    return {
      processedCount: 0,
      acceptedCount: 0,
      emailsSentCount: 0,
      errorsCount: 0,
      details: [],
    };
  }

  // Calculate cutoff timestamp: now - acceptance_delay_hours (sourced strictly from settings)
  const delayHours = Math.max(0, Number(settings.acceptance_delay_hours) || 24);
  const cutoffDate = new Date(Date.now() - delayHours * 3600 * 1000);
  const emailIntervalMs = Math.max(0, (Number(settings.email_delay_seconds) ?? 60) * 1000);

  // Find all PENDING applicants who registered before the cutoff time
  const eligibleApplicants = await prisma.applicant.findMany({
    where: {
      status: 'PENDING',
      registeredAt: {
        lte: cutoffDate,
      },
    },
    orderBy: {
      registeredAt: 'asc',
    },
  });

  const result: AutomationResult = {
    processedCount: eligibleApplicants.length,
    acceptedCount: 0,
    emailsSentCount: 0,
    errorsCount: 0,
    details: [],
  };

  for (let i = 0; i < eligibleApplicants.length; i++) {
    const applicant = eligibleApplicants[i];
    try {
      const acceptedAt = new Date();

      // Atomic Status Transition: Prevents Race Conditions under concurrent Cron invocations
      const updateResult = await prisma.applicant.updateMany({
        where: {
          id: applicant.id,
          status: 'PENDING', // Ensures only one concurrent thread wins
        },
        data: {
          status: 'ACCEPTED',
          acceptedAt: acceptedAt,
        },
      });

      // If another concurrent process already transitioned this applicant, skip
      if (updateResult.count === 0) {
        continue;
      }

      result.acceptedCount += 1;
      let emailSent = false;
      let errorMsg: string | undefined = undefined;

      // Send acceptance email if auto email enabled and not already sent (Idempotency guarantee)
      if (settings.auto_email_enabled) {
        // Re-verify current record has not already sent email
        const currentRecord = await prisma.applicant.findUnique({
          where: { id: applicant.id },
          select: { emailSentAt: true },
        });

        if (!currentRecord?.emailSentAt) {
          const emailResult = await sendAcceptanceEmail({
            applicantId: applicant.id,
            email: applicant.email,
            fullName: applicant.fullName,
            applicationId: applicant.applicationId,
            acceptedAt: acceptedAt,
          });

          if (emailResult.success) {
            result.emailsSentCount += 1;
            emailSent = true;
          } else {
            result.errorsCount += 1;
            errorMsg = emailResult.error;
          }
        }
      }

      result.details.push({
        applicationId: applicant.applicationId,
        fullName: applicant.fullName,
        status: 'ACCEPTED',
        emailSent,
        error: errorMsg,
      });

      // If an email was sent, and there are more applicants in the queue, apply rate limit delay (default 60s)
      if (emailSent && i < eligibleApplicants.length - 1 && !options?.skipDelay && emailIntervalMs > 0) {
        console.log(`[EMAIL-INTERVAL] Waiting ${emailIntervalMs / 1000}s before sending next email...`);
        await new Promise((resolve) => setTimeout(resolve, emailIntervalMs));
      }
    } catch (err: any) {
      result.errorsCount += 1;
      result.details.push({
        applicationId: applicant.applicationId,
        fullName: applicant.fullName,
        status: 'ERROR',
        emailSent: false,
        error: err?.message || 'Unknown processing error',
      });
    }
  }

  return result;
}
