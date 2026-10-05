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

const MAX_EMAILS_PER_RUN = 10;
const MAX_AUTOMATED_EMAIL_ATTEMPTS = 8;
const EMAIL_RETRY_INTERVAL_MS = 60 * 60 * 1000;

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

  for (const applicant of eligibleApplicants) {
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
      result.details.push({
        applicationId: applicant.applicationId,
        fullName: applicant.fullName,
        status: 'ACCEPTED',
        emailSent: false,
      });
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

  if (!settings.auto_email_enabled) {
    return result;
  }

  const retryCutoff = new Date(Date.now() - EMAIL_RETRY_INTERVAL_MS);
  const emailCandidates = await prisma.applicant.findMany({
    where: {
      status: 'ACCEPTED',
      acceptedAt: { not: null },
      emailSentAt: null,
      emailSendAttempts: { lt: MAX_AUTOMATED_EMAIL_ATTEMPTS },
      emailLogs: { none: { sentAt: { gte: retryCutoff } } },
    },
    orderBy: [{ acceptedAt: 'asc' }, { createdAt: 'asc' }],
    take: MAX_EMAILS_PER_RUN,
  });

  for (let i = 0; i < emailCandidates.length; i += 1) {
    const applicant = emailCandidates[i];
    try {
      const reservation = await prisma.applicant.updateMany({
        where: {
          id: applicant.id,
          status: 'ACCEPTED',
          emailSentAt: null,
          emailSendAttempts: applicant.emailSendAttempts,
        },
        data: { emailSendAttempts: { increment: 1 } },
      });
      if (reservation.count === 0) {
        continue;
      }

      const emailResult = await sendAcceptanceEmail({
        applicantId: applicant.id,
        email: applicant.email,
        fullName: applicant.fullName,
        applicationId: applicant.applicationId,
        acceptedAt: applicant.acceptedAt || undefined,
        attemptAlreadyCounted: true,
      });

      const detail = result.details.find((item) => item.applicationId === applicant.applicationId);
      if (emailResult.success && emailResult.deliveryStatus === 'SENT') {
        result.emailsSentCount += 1;
        if (detail) {
          detail.emailSent = true;
        } else {
          result.details.push({
            applicationId: applicant.applicationId,
            fullName: applicant.fullName,
            status: 'ACCEPTED',
            emailSent: true,
          });
        }
      } else if (!emailResult.success) {
        result.errorsCount += 1;
        if (detail) {
          detail.emailSent = false;
          detail.error = emailResult.error;
        } else {
          result.details.push({
            applicationId: applicant.applicationId,
            fullName: applicant.fullName,
            status: 'ACCEPTED',
            emailSent: false,
            error: emailResult.error,
          });
        }
      }

      if (i < emailCandidates.length - 1 && !options?.skipDelay && emailIntervalMs > 0) {
        console.log(`[EMAIL-INTERVAL] Waiting ${emailIntervalMs / 1000}s before sending next email...`);
        await new Promise((resolve) => setTimeout(resolve, emailIntervalMs));
      }
    } catch (err: any) {
      result.errorsCount += 1;
      result.details.push({
        applicationId: applicant.applicationId,
        fullName: applicant.fullName,
        status: 'ACCEPTED',
        emailSent: false,
        error: err?.message || 'Unknown email processing error',
      });
    }
  }

  return result;
}
