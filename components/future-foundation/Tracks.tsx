import React from 'react';
import { BarChart3, Code, Cpu, Compass, CheckCircle2, Lightbulb, Sparkles } from 'lucide-react';

export const Tracks: React.FC = () => {
  const tracks = [
    {
      id: 'data',
      title: 'Data & Analytical Thinking',
      titleAr: 'تحليل البيانات والتفكير التحليلي',
      icon: <BarChart3 className="w-6 h-6 text-kemix-blue" />,
      desc: 'بناء أساس معرفي متين في فهم البيانات وقراءتها وتطوير مهارات التفكير المنطقي والتحليلي باستخدام أدوات التحليل والاستكشاف الحديثة.',
      skills: ['أساسيات لغة Python', 'الاستعلام وتحليل البيانات', 'استكشاف الأنماط والرؤى', 'بناء التفكير المنطقي'],
    },
    {
      id: 'prog',
      title: 'Software Foundations & Web',
      titleAr: 'البرمجة وبناء الحلول الرقمية',
      icon: <Code className="w-6 h-6 text-kemix-blue" />,
      desc: 'اكتشاف وتنمية مهارات التفكير الخوارزمي وهندسة البرمجيات، وتطوير المهارات التقنية في بناء تطبيقات وتجارب ويب تفاعلية متكاملة.',
      skills: ['التفكير البرمجي الخوارزمي', 'تطوير واجهات وتجارب المستخدم', 'بناء النظم والتطبيقات', 'التعلم المستمر للمفاهيم'],
    },
    {
      id: 'ai',
      title: 'Artificial Intelligence & Exploration',
      titleAr: 'الذكاء الاصطناعي واستكشاف التقنيات',
      icon: <Cpu className="w-6 h-6 text-kemix-blue" />,
      desc: 'التعرف على المفاهيم الجوهرية للذكاء الاصطناعي والتعلم الآلي، واستكشاف إمكانيات النماذج التوليدية لتوسيع آفاق الابتكار والمعرفة.',
      skills: ['مفاهيم الذكاء الاصطناعي الحديثة', 'هندسة الأوامر والتفاعل الذكي', 'استكشاف النماذج التوليدية', 'التفكير الابتكاري'],
    },
    {
      id: 'business',
      title: 'Personal Skills & Future Readiness',
      titleAr: 'المهارات الشخصية والاستعداد للمستقبل',
      icon: <Compass className="w-6 h-6 text-kemix-blue" />,
      desc: 'صقل وتطوير المهارات الشخصية والقيادية، وتعلم أساليب التفكير النقدي وحل المشكلات والتواصل الفعال لتحقيق التطور المستمر.',
      skills: ['التفكير النقدي وحل المشكلات', 'التواصل والتعبير الرقمي', 'التخطيط والتعلم الذاتي', 'إدارة الوقت والمبادرات'],
    },
  ];

  return (
    <section id="tracks" className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-wider text-kemix-blue uppercase bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            المجالات التعليمية
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-kemix-navy mt-3 mb-4">
            مسارات لتطوير المهارات واكتشاف القدرات
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            تجربة تعليمية متكاملة ومتنوعة تمنحك فرصة استكشاف اهتماماتك، وتنمية قدراتك الذاتية، وبناء أساس معرفي قوي يدعم تطورك المستمر.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-brand-lg transition-all duration-300 hover:border-kemix-blue/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    {track.icon}
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                    {track.title}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-kemix-navy mb-2">{track.titleAr}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{track.desc}</p>
              </div>

              <div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-500 mb-3">المهارات المكتسبة:</div>
                  <div className="flex flex-wrap gap-2">
                    {track.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-50 text-slate-700 px-3 py-1 rounded-lg border border-slate-200"
                      >
                        <CheckCircle2 className="w-3 h-3 text-kemix-blue" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
