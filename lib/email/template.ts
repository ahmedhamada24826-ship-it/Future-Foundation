import { getPublicAppUrl } from '@/lib/public-url';

export interface EmailTemplateData {
  fullName?: string | null;
  applicationId?: string | null;
  acceptedAt?: string | Date | null;
  programName?: string | null;
  mainTagline?: string | null;
  supportingTagline?: string | null;
  websiteUrl?: string | null;
}

export function renderAcceptanceEmailHtml(data: EmailTemplateData): string {
  const safeFullName = (data.fullName && typeof data.fullName === 'string' && data.fullName.trim()) || 'عزيزي المتقدم';
  const safeAppId = (data.applicationId && typeof data.applicationId === 'string' && data.applicationId.trim()) || 'FF-2026-XXXXXX';
  const safeProgramName = (data.programName && typeof data.programName === 'string' && data.programName.trim()) || 'Future Foundation';
  const safeMainTagline = (data.mainTagline && typeof data.mainTagline === 'string' && data.mainTagline.trim()) || 'بناء مهاراتك اليوم.. لمستقبل الغد';
  const safeSupportingTagline = (data.supportingTagline && typeof data.supportingTagline === 'string' && data.supportingTagline.trim()) || 'رحلتك تبدأ من هنا مجانًا';
  const safeWebsiteUrl = (data.websiteUrl && typeof data.websiteUrl === 'string' && data.websiteUrl.trim()) || 'https://kemics.academy';

  let formattedDate: string;
  try {
    if (data.acceptedAt instanceof Date) {
      formattedDate = new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(data.acceptedAt);
    } else if (typeof data.acceptedAt === 'string' && data.acceptedAt.trim()) {
      const parsed = new Date(data.acceptedAt);
      formattedDate = isNaN(parsed.getTime())
        ? data.acceptedAt
        : new Intl.DateTimeFormat('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(parsed);
    } else {
      formattedDate = new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date());
    }
  } catch (e) {
    formattedDate = new Date().toLocaleDateString('ar-EG');
  }

  const publicAppUrl = getPublicAppUrl(safeWebsiteUrl);
  const shareTargetUrl = `${publicAppUrl}/acceptance/${encodeURIComponent(safeAppId)}`;

  const bannerImageUrl = `${publicAppUrl}/images/acceptance-banner.png`;

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تهانينا! تم قبولك في مبادرة ${safeProgramName}</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #F8FAFC; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 10px !important; }
      .banner-img { width: 100% !important; height: auto !important; }
      .header-title { font-size: 20px !important; }
      .banner-name { font-size: 22px !important; }
      .cta-button { width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
    }
  </style>
</head>
<body style="background-color: #F8FAFC; margin: 0; padding: 25px 10px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" class="email-container" width="620" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(11, 45, 91, 0.08); border: 1px solid #E2E8F0; max-width: 620px;">
          
          <!-- 1. Official Acceptance Graphic Banner -->
          <tr>
            <td align="center" style="background-color: #FFFFFF; padding: 0; line-height: 0; border-bottom: 1px solid #E2E8F0;">
              <a href="${shareTargetUrl}" target="_blank" style="display: block; text-decoration: none;">
                <img
                  src="${bannerImageUrl}"
                  alt="Congratulations! You've been accepted into Future Foundation with Kemix Academy"
                  class="banner-img"
                  width="620"
                  style="width: 100%; max-width: 620px; height: auto; display: block; border-top-left-radius: 16px; border-top-right-radius: 16px;"
                />
              </a>
            </td>
          </tr>

          <!-- 2. Dynamic Acceptance Hero Details -->
          <tr>
            <td style="background: linear-gradient(180deg, #F0F7FF 0%, #FFFFFF 100%); padding: 30px 30px 20px 30px; text-align: center; border-bottom: 1px solid #E2E8F0;">
              
              <div style="display: inline-block; background-color: #2563EB; color: #FFFFFF; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px;">
                🎉 إشعار القبول الرسمي • OFFICIAL ACCEPTANCE
              </div>

              <h1 class="header-title" style="margin: 0 0 10px 0; color: #0B2D5B; font-size: 26px; font-weight: 800; line-height: 1.3;">
                تهانينا، <span class="banner-name" style="color: #2563EB;">${safeFullName}</span>!
              </h1>
              
              <p style="margin: 0 0 6px 0; color: #1E293B; font-size: 16px; font-weight: 600;">
                يسعدنا إبلاغك بقبول انضمامك إلى مبادرة:
              </p>
              
              <div style="font-size: 22px; font-weight: 900; color: #0B2D5B; margin-top: 4px; letter-spacing: 0.5px;">
                ${safeProgramName.toUpperCase()}
              </div>
              <div style="font-size: 14px; color: #2563EB; font-weight: 600; margin-top: 4px;">
                "${safeMainTagline}"
              </div>
            </td>
          </tr>

          <!-- 3. Body Content -->
          <tr>
            <td style="padding: 30px; color: #334155; font-size: 15px; line-height: 1.8;">
              
              <p style="margin-top: 0; font-size: 16px; color: #0F172A; font-weight: 600;">
                أهلاً بك في رحلتك الجديدة نحو التعلم وتطوير المهارات! 🚀
              </p>
              
              <p style="color: #475569; margin-bottom: 24px;">
                تم اختيارك بعد مراجعة بيانات تسجيلك، ونحن في <strong>Kemix Acadmey</strong> متحمسون جدًا لوجودك معنا في هذه التجربة التعليمية المصممة لاكتشاف قدراتك وتنميتها وبناء أساس معرفي قوي يدعم تطورك المستمر.
              </p>

              <!-- Application Details Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 0; color: #64748B; font-size: 14px; width: 40%;">
                          رقم الطلب (Application ID):
                        </td>
                        <td style="padding: 6px 0; color: #0B2D5B; font-size: 15px; font-weight: 700; font-family: monospace; direction: ltr; text-align: left;">
                          ${safeAppId}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748B; font-size: 14px;">
                          تاريخ القبول:
                        </td>
                        <td style="padding: 6px 0; color: #0F172A; font-size: 14px; font-weight: 600; text-align: left;">
                          ${formattedDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748B; font-size: 14px;">
                          حالة الطلب:
                        </td>
                        <td style="padding: 6px 0; text-align: left;">
                          <span style="background-color: #DCFCE7; color: #166534; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 6px; display: inline-block;">
                            تم القبول بنجاح (ACCEPTED)
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Action CTAs Section -->
              <div style="text-align: center; margin: 32px 0 16px 0;">
                
                <p style="font-size: 15px; font-weight: 700; color: #0B2D5B; margin-bottom: 14px;">
                  شارك نجاحك وانضمامك للبرنامج مع شبكة علاقاتك على LinkedIn بالبانر الرسمي:
                </p>

                <!-- LinkedIn Share Button -->
                <a href="${shareTargetUrl}" target="_blank" rel="noopener noreferrer" class="cta-button" style="display: inline-block; background-color: #0A66C2; color: #FFFFFF; font-size: 15px; font-weight: 700; padding: 14px 28px; border-radius: 10px; text-decoration: none; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(10, 102, 194, 0.25);">
                  <span style="margin-left: 8px;">🔗</span> افتح بطاقة القبول وانسخ نص المشاركة إلى LinkedIn
                </a>

                <!-- WhatsApp Group Button -->
                <div style="margin-top: 8px;">
                  <a href="https://chat.whatsapp.com/Iye3ObKoHFXKCgMJccVdgY" target="_blank" style="display: inline-block; background-color: #25D366; color: #FFFFFF; font-size: 15px; font-weight: 700; padding: 14px 28px; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);">
                    <span style="margin-left: 8px;">💬</span> انضم إلى مجموعة واتساب
                  </a>
                </div>

                <!-- Secondary Website CTA -->
                <div style="margin-top: 10px;">
                  <a href="${safeWebsiteUrl}" target="_blank" style="color: #2563EB; font-size: 14px; font-weight: 600; text-decoration: none;">
                    اكتشف تفاصيل البرنامج والأكاديمية ←
                  </a>
                </div>

              </div>

            </td>
          </tr>

          <!-- Next Steps Alert -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #EFF6FF; border-left: 4px solid #2563EB; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px 18px; color: #1E40AF; font-size: 13px; line-height: 1.6;">
                    <strong>📌 الخطوات القادمة:</strong> سيتم إرسال جدول المواعيد والمصادر التدريبية وروابط المجموعات التفاعلية خلال الأيام القادمة عبر بريدك الإلكتروني. يرجى متابعة صندوق الوارد وصندوق الرسائل الترويجية (Spam/Promotions).
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0F172A; padding: 25px 30px; text-align: center; color: #94A3B8; font-size: 12px; line-height: 1.7; border-top: 1px solid #1E293B;">
              <div style="font-weight: 700; color: #FFFFFF; font-size: 14px; margin-bottom: 4px;">
                Kemix Acadmey
              </div>
              <div>مبادرة ${safeProgramName} • ${safeSupportingTagline}</div>
              <div style="margin-top: 10px; color: #64748B;">
                لأي استفسارات يمكنك التواصل معنا عبر: 
                <a href="mailto:kemixacademy1@gmail.com" style="color: #60A5FA; text-decoration: none;">kemixacademy1@gmail.com</a>
              </div>
              <div style="margin-top: 12px; font-size: 11px; color: #475569;">
                © ${new Date().getFullYear()} Kemix Acadmey. جميع الحقوق محفوظة.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
