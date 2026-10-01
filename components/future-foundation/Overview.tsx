import React from 'react';
import { Target, Users, BookOpen, CheckCircle, Sparkles, Trophy, Clock, Compass, Lightbulb } from 'lucide-react';

export const Overview: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-wider text-kemix-blue uppercase bg-blue-50 px-3.5 py-1.5 rounded-full">
            عن المبادرة
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-kemix-navy mt-3 mb-4">
            ما هي مبادرة Future Foundation؟
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            مبادرة تعليمية وتطويرية شاملة أطلقتها <strong>Kemix Acadmey</strong> تهدف إلى اكتشاف قدرات الشباب وتنميتها، وبناء أساس معرفي متين، وصقل المهارات الشخصية والتقنية في بيئة تعليمية محفزة تدعم التعلم والتطور المستمر والاستعداد للمستقبل.
          </p>
        </div>

        {/* 3 Main Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Card 1 */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:border-kemix-blue/30 group">
            <div className="w-12 h-12 rounded-xl bg-blue-100/80 flex items-center justify-center text-kemix-blue mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-kemix-navy mb-3">من يمكنه الانضمام؟</h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-kemix-blue shrink-0 mt-0.5" />
                <span>طلاب الجامعات والمعاهد بمختلف التخصصات</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-kemix-blue shrink-0 mt-0.5" />
                <span>الراغبون في استكشاف مجالات حديثة واكتساب معارف جديدة</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-kemix-blue shrink-0 mt-0.5" />
                <span>الشغوفون بالتعلم الذاتي والتطور المستمر</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-kemix-blue shrink-0 mt-0.5" />
                <span>كل من يسعى لبناء أساس علمي وعملي متكامل</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:border-kemix-blue/30 group">
            <div className="w-12 h-12 rounded-xl bg-blue-100/80 flex items-center justify-center text-kemix-blue mb-6 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-kemix-navy mb-3">ماذا ستحصل عليه؟</h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-kemix-blue shrink-0 mt-0.5" />
                <span>تطوير المهارات الشخصية والتقنية والتحليلية</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-kemix-blue shrink-0 mt-0.5" />
                <span>بناء أساس معرفي قوي في التخصصات الحديثة</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-kemix-blue shrink-0 mt-0.5" />
                <span>إرشاد وتوجيه مستمر لدعم مسيرتك التعليمية</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-kemix-blue shrink-0 mt-0.5" />
                <span>شهادة إتمام معتمدة من Kemix Acadmey</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:border-kemix-blue/30 group">
            <div className="w-12 h-12 rounded-xl bg-blue-100/80 flex items-center justify-center text-kemix-blue mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-kemix-navy mb-3">رحلة المشاركة</h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-kemix-blue/10 text-kemix-blue text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>تعبئة استمارة التسجيل الإلكترونية</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-kemix-blue/10 text-kemix-blue text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>استلام رقم الطلب التعريفي الخاص بك</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-kemix-blue/10 text-kemix-blue text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>معالجة بيانات الطلب ومراجعتها</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-kemix-blue/10 text-kemix-blue text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                <span>استلام إشعار القبول الرسمي عبر البريد الإلكتروني</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
