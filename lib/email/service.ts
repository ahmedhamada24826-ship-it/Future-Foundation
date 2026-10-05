import { prisma } from '@/lib/db/prisma';
import { renderAcceptanceEmailHtml } from './template';
import { getSystemSettings } from '@/lib/settings/settings';

export interface SendAcceptanceEmailParams {
  applicantId: string;
  email: string;
  fullName: string;
  applicationId: string;
  acceptedAt?: Date;
  attemptAlreadyCounted?: boolean;
}

export type EmailDeliveryStatus = 'SENT' | 'FAILED' | 'MOCKED';

export interface EmailSendResult {
  success: boolean;
  deliveryStatus: EmailDeliveryStatus;
  messageId?: string;
  error?: string;
  provider: 'resend' | 'mock' | 'unconfigured';
}

export async function sendAcceptanceEmail(params: SendAcceptanceEmailParams): Promise<EmailSendResult> {
  const settings = await getSystemSettings();
  const subject = `تهانينا! تم قبولك في مبادرة ${settings.program_name} 🎉`;
  const htmlContent = renderAcceptanceEmailHtml({
    fullName: params.fullName,
    applicationId: params.applicationId,
    acceptedAt: params.acceptedAt || new Date(),
    programName: settings.program_name,
    mainTagline: settings.main_tagline,
    supportingTagline: settings.supporting_tagline,
    websiteUrl: settings.program_website_url,
  });

  const fromAddress = '"Future Foundation | KEMIX Academy" <notifications@kemixacademy.me>';
  const resendApiKey = process.env.RESEND_API_KEY;
  const isProduction = process.env.NODE_ENV === 'production';

  let result: EmailSendResult = {
    success: false,
    deliveryStatus: 'FAILED',
    provider: 'unconfigured',
  };
  const attemptCountUpdate = params.attemptAlreadyCounted
    ? {}
    : { emailSendAttempts: { increment: 1 } };

  try {
    if (resendApiKey) {
      if (!resendApiKey.startsWith('re_')) {
        result = {
          success: false,
          deliveryStatus: 'FAILED',
          error: 'RESEND_API_KEY is invalid. Configure a valid Resend API key.',
          provider: 'unconfigured',
        };
      } else {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [params.email],
            subject,
            html: htmlContent,
          }),
          cache: 'no-store',
        });

        let responseData: unknown;
        try {
          responseData = await response.json();
        } catch {
          responseData = null;
        }

        const responseObject =
          responseData && typeof responseData === 'object'
            ? (responseData as { id?: unknown; message?: unknown })
            : null;
        const errorMessage =
          responseObject && typeof responseObject.message === 'string'
            ? responseObject.message
            : `Resend API returned HTTP ${response.status}`;

        if (response.ok && typeof responseObject?.id === 'string') {
          result = {
            success: true,
            deliveryStatus: 'SENT',
            messageId: responseObject.id,
            provider: 'resend',
          };
        } else {
          result = {
            success: false,
            deliveryStatus: 'FAILED',
            error: errorMessage,
            provider: 'resend',
          };
        }
      }
    }
    // Production fails explicitly when Resend is not configured; local development retains mock delivery.
    else if (isProduction) {
      const errorMsg = 'Email service is unconfigured in production. Please configure RESEND_API_KEY.';
      console.error(`[EMAIL-CONFIG-ERROR] ${errorMsg}`);
      result = {
        success: false,
        deliveryStatus: 'FAILED',
        error: errorMsg,
        provider: 'unconfigured',
      };
    }
    // In development without Resend configured, retain explicit mock delivery.
    else {
      console.log(`[EMAIL-SERVICE: DEV/MOCK] Simulating email delivery to: ${params.email} (${params.fullName})`);
      result = {
        success: true,
        deliveryStatus: 'MOCKED',
        messageId: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        provider: 'mock',
      };
    }

    // Save Email Log in database with clear status ('SENT' | 'FAILED' | 'MOCKED')
    await prisma.emailLog.create({
      data: {
        applicantId: params.applicantId,
        recipient: params.email,
        subject: subject,
        status: result.deliveryStatus,
        error: result.error || (result.deliveryStatus === 'MOCKED' ? 'Simulated delivery in local development environment' : null),
      },
    });

    // Update Applicant Email tracking
    if (result.success && result.deliveryStatus === 'SENT') {
      await prisma.applicant.update({
        where: { id: params.applicantId },
        data: {
          emailSentAt: new Date(),
          emailLastError: null,
          ...attemptCountUpdate,
        },
      });
    } else if (result.success && result.deliveryStatus === 'MOCKED') {
      await prisma.applicant.update({
        where: { id: params.applicantId },
        data: {
          emailSentAt: null,
          emailLastError: '[DEV-MOCK] Simulated in development',
          ...attemptCountUpdate,
        },
      });
    } else {
      await prisma.applicant.update({
        where: { id: params.applicantId },
        data: {
          emailLastError: result.error || 'Failed to dispatch email',
          ...attemptCountUpdate,
        },
      });
    }

    return result;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown email service error';
    console.error(`[EMAIL-SERVICE-EXCEPTION] Failed to send email to ${params.email}:`, errorMsg);

    await prisma.emailLog.create({
      data: {
        applicantId: params.applicantId,
        recipient: params.email,
        subject: subject,
        status: 'FAILED',
        error: errorMsg,
      },
    });

    await prisma.applicant.update({
      where: { id: params.applicantId },
      data: {
        emailLastError: errorMsg,
        ...attemptCountUpdate,
      },
    });

    return {
      success: false,
      deliveryStatus: 'FAILED',
      error: errorMsg,
      provider: result.provider,
    };
  }
}
