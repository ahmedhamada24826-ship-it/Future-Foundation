'use client';

import { useRef, useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';

interface LinkedInShareActionsProps {
  shareUrl: string;
  postText: string;
}

export function LinkedInShareActions({ shareUrl, postText }: LinkedInShareActionsProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [copyMessage, setCopyMessage] = useState('');

  const copyPostText = async () => {
    try {
      await navigator.clipboard.writeText(postText);
      setCopyMessage('تم نسخ نص المنشور. افتح LinkedIn والصقه في مربع كتابة المنشور.');
    } catch {
      textAreaRef.current?.focus();
      textAreaRef.current?.select();
      setCopyMessage('تعذر النسخ تلقائيًا. تم تحديد النص؛ انسخه ثم الصقه في LinkedIn.');
    }
  };

  return (
    <section className="pt-2 space-y-4 text-right" aria-labelledby="linkedin-share-title">
      <div>
        <h2 id="linkedin-share-title" className="text-lg font-extrabold text-kemix-navy">
          شارك خبر قبولك على LinkedIn
        </h2>
        <p className="mt-1 text-sm leading-7 text-slate-600">
          انسخ النص الجاهز أولًا، ثم افتح LinkedIn والصقه في المنشور. رابط المشاركة يفتح LinkedIn مع بطاقة القبول؛ LinkedIn لا يملأ نص المنشور تلقائيًا.
        </p>
      </div>

      <textarea
        ref={textAreaRef}
        aria-label="نص منشور LinkedIn"
        readOnly
        value={postText}
        rows={8}
        dir="auto"
        className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-800"
      />

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyPostText}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-800 px-6 py-3 font-bold text-white transition-colors hover:bg-slate-700"
        >
          {copyMessage.startsWith('تم نسخ') ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          انسخ نص المنشور
        </button>
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0A66C2] px-6 py-3 font-bold text-white shadow-lg shadow-blue-700/25 transition-colors hover:bg-[#084e96]"
        >
          <ExternalLink className="h-5 w-5" />
          افتح المشاركة على LinkedIn
        </a>
      </div>

      <p className="min-h-6 text-center text-sm text-emerald-700" role="status" aria-live="polite">
        {copyMessage}
      </p>
      <p className="text-center text-xs text-slate-500">
        ستظهر صورة المبادرة من بطاقة القبول عند إتاحتها علنًا لـ LinkedIn، وقد يحتاج LinkedIn إلى تحديث معاينة الرابط.
      </p>
    </section>
  );
}
