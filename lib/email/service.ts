import { prisma } from '@/lib/db/prisma';
import { renderAcceptanceEmailHtml } from './template';
import { getSystemSettings } from '@/lib/settings/settings';
import nodemailer from 'nodemailer';

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
  provider: 'resend' | 'smtp' | 'mock' | 'unconfigured';
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

  const fromAddress = `"${settings.email_sender_name}" <${settings.email_sender_address}>`;
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
    // 1. Production check: If Resend API Key is configured
    if (resendApiKey && resendApiKey.startsWith('re_')) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [params.email],
          subject: subject,
          html: htmlContent,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.id) {
        result = {
          success: true,
          deliveryStatus: 'SENT',
          messageId: resData.id,
          provider: 'resend',
        };
      } else {
        result = {
          success: false,
          deliveryStatus: 'FAILED',
          error: resData.message || JSON.stringify(resData),
          provider: 'resend',
        };
      }
    }
    // 2. If Custom SMTP is configured
    else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: fromAddress,
        to: params.email,
        subject: subject,
        html: htmlContent,
      });

      result = {
        success: true,
        deliveryStatus: 'SENT',
        messageId: info.messageId,
        provider: 'smtp',
      };
    }
    // 3. If in Production and NO provider is configured: FAIL EXPLICITLY
    else if (isProduction) {
      const errorMsg = 'Email service is unconfigured in production. Please configure RESEND_API_KEY or SMTP credentials in environment variables.';
      console.error(`[EMAIL-CONFIG-ERROR] ${errorMsg}`);
      result = {
        success: false,
        deliveryStatus: 'FAILED',
        error: errorMsg,
        provider: 'unconfigured',
      };
    }
    // 4. In Development mode only: Explicit MOCK mode (with clear logs and MOCKED status)
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
  } catch (err: any) {
    const errorMsg = err?.message || 'Unknown email service error';
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
