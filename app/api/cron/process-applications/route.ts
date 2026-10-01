import { NextRequest, NextResponse } from 'next/server';
import { processAutomaticAcceptance } from '@/lib/automation/processor';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handleCron(req);
}

export async function POST(req: NextRequest) {
  return handleCron(req);
}

async function handleCron(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    // Rate limit cron triggers (max 30 per minute)
    const rateLimit = checkRateLimit(`cron_${ip}`, { windowMs: 60 * 1000, max: 30 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many cron trigger requests' },
        { status: 429 }
      );
    }

    const authHeader = req.headers.get('authorization');
    const { searchParams } = new URL(req.url);
    const tokenQuery = searchParams.get('token') || searchParams.get('secret');

    const expectedSecret = process.env.CRON_SECRET;
    if (!expectedSecret) {
      console.error('[CRON-CONFIG-ERROR] CRON_SECRET is not defined in environment variables');
      return NextResponse.json(
        { success: false, message: 'CRON_SECRET is not configured on server' },
        { status: 500 }
      );
    }

    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const providedToken = bearerToken || tokenQuery;

    if (!providedToken || providedToken !== expectedSecret) {
      console.warn(`[CRON-UNAUTHORIZED] Unauthorized cron attempt from IP: ${ip}`);
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Invalid or missing CRON secret token.' },
        { status: 401 }
      );
    }

    const startTime = Date.now();
    const result = await processAutomaticAcceptance();
    const duration = Date.now() - startTime;

    console.log(`[CRON-SUCCESS] Executed automatic acceptance in ${duration}ms: Processed: ${result.processedCount}, Accepted: ${result.acceptedCount}, Emails: ${result.emailsSentCount}`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      durationMs: duration,
      data: result,
    });
  } catch (error: any) {
    console.error('[CRON-ERROR]', error?.message || error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error during automatic acceptance execution',
      },
      { status: 500 }
    );
  }
}
