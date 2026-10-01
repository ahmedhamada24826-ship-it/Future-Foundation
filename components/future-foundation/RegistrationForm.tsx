'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SuccessModal } from './SuccessModal';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Layers,
  AlertCircle,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

const GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الدقهلية (المنصورة)',
  'البحر الأحمر',
  'البحيرة',
  'الفيوم',
  'الغربية (طنطا)',
  'الإسماعيلية',
  'المنوفية (شبين الكوم)',
  'المنيا',
  'القليوبية (بنها)',
  'الوادي الجديد',
  'السويس',
  'أسوان',
  'أسيوط',
  'بني سويف',
  'بورسعيد',
  'دمياط',
  'الشرقية (الزقازيق)',
  'جنوب سيناء',
  'كفر الشيخ',
  'مطروح',
  'الأقصر',
  'قنا',
  'شمال سيناء',
  'سوهاج',
  'خارج مصر (عربي / دولي)',
];

const EDUCATION_LEVELS = [
  'طالب جامعي (Undergraduate)',
  'بكالوريوس / ليسانس (حديث تخرج)',
  'بكالوريوس / ليسانس (خبرة عملية)',
  'دراسات عليا (ماجستير / دكتوراه)',
  'ثانوية عامة / ما يعادلها',
  'تعليم فني / معهد متوسط',
];

const OCCUPATION_OPTIONS = [
  'طالب بدوام كامل',
  'خريج حديث / باحث عن فرص تعلم',
  'موظف بدوام كامل (Full-time)',
  'موظف بدوام جزئي (Part-time)',
  'مستقل / عمل حر (Freelancer)',
  'مهتم بالتعلم الذاتي والتطوير',
  'أخرى',
];

const INTEREST_OPTIONS = [
  'تحليل البيانات والتفكير التحليلي (Data & Analytical Thinking)',
  'البرمجة وبناء الحلول الرقمية (Software Foundations & Web)',
  'الذكاء الاصطناعي واستكشاف التقنيات (AI & Exploration)',
  'المهارات الشخصية والاستعداد للمستقبل (Personal Skills & Future Readiness)',
  'الأمن السيبراني وحماية النظم (Cybersecurity)',
  'تصميم تجربة وواجهة المستخدم (UI / UX Design)',
];

const REFERRAL_SOURCES = [
  'LinkedIn',
  'Facebook',
  'Instagram',
  'موقع Kemix Acadmey',
  'صديق أو زميل دراسة',
  'ملتقى تعليمي أو مؤتمر',
  'مجموعات واتساب / تليجرام',
  'أخرى',
];

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    governorate: '',
    age: '',
    educationLevel: '',
    occupation: '',
    interests: [] as string[],
    motivation: '',
    linkedinUrl: '',
    referralSource: '',
    agreement: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((item) => item !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
    if (errors.interests) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.interests;
        return next;
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    setGlobalError(null);
  };

  const validateClient = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'يرجى إدخال الاسم الكامل بشكل صحيح (3 أحرف على الأقل).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'يرجى كتابة بريد إلكتروني صحيح.';
    }

    const phoneClean = formData.phone.replace(/[\s-]/g, '');
    if (!phoneClean || phoneClean.length < 8) {
      newErrors.phone = 'يرجى إدخال رقم هاتف صحيح ومتاح على الواتساب.';
    }

    if (!formData.governorate) {
      newErrors.governorate = 'يرجى اختيار المحافظة.';
    }

    const ageNum = parseInt(formData.age, 10);
    if (!formData.age || isNaN(ageNum) || ageNum < 15 || ageNum > 75) {
      newErrors.age = 'يرجى كتابة عمر صحيح (بين 15 و 75 عاماً).';
    }

    if (!formData.educationLevel) {
      newErrors.educationLevel = 'يرجى تحديد المستوى التعليمي.';
    }

    if (!formData.occupation) {
      newErrors.occupation = 'يرجى تحديد الحالة التعليمية / المهنية.';
    }

    if (formData.interests.length === 0) {
      newErrors.interests = 'يرجى تحديد مجال اهتمام واحد على الأقل.';
    }

    if (!formData.motivation.trim() || formData.motivation.trim().length < 10) {
      newErrors.motivation = 'يرجى توضيح سبب رغبتك في الانضمام (10 أحرف على الأقل).';
    }

    if (!formData.referralSource) {
      newErrors.referralSource = 'يرجى تحديد كيف سمعت عن المبادرة.';
    }

    if (!formData.agreement) {
      newErrors.agreement = 'يجب الموافقة على الشروط لإتمام التسجيل.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateClient()) {
      const firstError = document.querySelector('.text-red-600');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setGlobalError(null);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        setGlobalError(data.message || 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
        return;
      }

      setSuccessData(data.data);
      setIsSuccessModalOpen(true);

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        governorate: '',
        age: '',
        educationLevel: '',
        occupation: '',
        interests: [],
        motivation: '',
        linkedinUrl: '',
        referralSource: '',
        agreement: false,
      });
      setErrors({});
    } catch (err: any) {
      setGlobalError('حدث خطأ في الاتصال بالخادم. يرجى التأكد من اتصال الإنترنت والمحاولة ثانية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="registration-section" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-kemix-blue px-4 py-1 rounded-full text-xs font-bold mb-3 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>استمارة التسجيل الرسمية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-kemix-navy mb-3">
            انضم إلى Future Foundation
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            املأ بياناتك بدقة لتأكيد تسجيلك في المبادرة والبدء في رحلتك التعليمية مجانًا.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-brand-lg p-6 sm:p-10">
          
          {globalError && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">تنبيه:</p>
                <p>{globalError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            
            {/* Section 1: Basic Information */}
            <div>
              <h3 className="text-lg font-bold text-kemix-navy pb-3 border-b border-slate-100 mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-kemix-blue" />
                <span>المعلومات الشخصية</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="مثال: أحمد محمود إبراهيم"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.fullName
                        ? 'border-red-300 focus:ring-red-400 bg-red-50/20'
                        : 'border-slate-200 focus:border-kemix-blue focus:ring-kemix-blue/20 bg-slate-50/40 hover:bg-white'
                    }`}
                  />
                  {errors.fullName && <p className="text-xs text-red-600 mt-1 font-medium">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    dir="ltr"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all text-left focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-400 bg-red-50/20'
                        : 'border-slate-200 focus:border-kemix-blue focus:ring-kemix-blue/20 bg-slate-50/40 hover:bg-white'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1 font-medium">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    رقم الهاتف / الواتساب <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    dir="ltr"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+20 10X XXX XXXX"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all text-left focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? 'border-red-300 focus:ring-red-400 bg-red-50/20'
                        : 'border-slate-200 focus:border-kemix-blue focus:ring-kemix-blue/20 bg-slate-50/40 hover:bg-white'
                    }`}
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    العمر <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    min="15"
                    max="75"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="مثال: 22"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.age
                        ? 'border-red-300 focus:ring-red-400 bg-red-50/20'
                        : 'border-slate-200 focus:border-kemix-blue focus:ring-kemix-blue/20 bg-slate-50/40 hover:bg-white'
                    }`}
                  />
                  {errors.age && <p className="text-xs text-red-600 mt-1 font-medium">{errors.age}</p>}
                </div>

                {/* Governorate */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    المحافظة / مكان الإقامة <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.governorate
                        ? 'border-red-300 focus:ring-red-400 bg-red-50/20'
                        : 'border-slate-200 focus:border-kemix-blue focus:ring-kemix-blue/20 bg-slate-50/40 hover:bg-white'
                    }`}
                  >
                    <option value="">-- اختر المحافظة --</option>
                    {GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                  {errors.governorate && <p className="text-xs text-red-600 mt-1 font-medium">{errors.governorate}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Education & Status */}
            <div>
              <h3 className="text-lg font-bold text-kemix-navy pb-3 border-b border-slate-100 mb-5 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-kemix-blue" />
                <span>المستوى التعليمي والاهتمامات</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Education Level */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    المستوى التعليمي <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.educationLevel
                        ? 'border-red-300 focus:ring-red-400 bg-red-50/20'
                        : 'border-slate-200 focus:border-kemix-blue focus:ring-kemix-blue/20 bg-slate-50/40 hover:bg-white'
                    }`}
                  >
                    <option value="">-- حدد المستوى التعليمي --</option>
                    {EDUCATION_LEVELS.map((edu) => (
                      <option key={edu} value={edu}>
                        {edu}
                      </option>
                    ))}
                  </select>
                  {errors.educationLevel && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.educationLevel}</p>
                  )}
                </div>

                {/* Occupation */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    الحالة الحالية <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.occupation
                        ? 'border-red-300 focus:ring-red-400 bg-red-50/20'
                        : 'border-slate-200 focus:border-kemix-blue focus:ring-kemix-blue/20 bg-slate-50/40 hover:bg-white'
                    }`}
                  >
                    <option value="">-- اختر الحالة --</option>
                    {OCCUPATION_OPTIONS.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                  {errors.occupation && <p className="text-xs text-red-600 mt-1 font-medium">{errors.occupation}</p>}
                </div>
              </div>
            </div>

            {/* Section 3: Interests & Motivation */}
            <div>
              <h3 className="text-lg font-bold text-kemix-navy pb-3 border-b border-slate-100 mb-5 flex items-center gap-2">
                <Layers className="w-5 h-5 text-kemix-blue" />
                <span>المجالات المفضلة ودافع الانضمام</span>
              </h3>

              {/* Areas of Interest Multi-select checkboxes */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  المجالات التي ترغب في استكشافها وتطوير مهاراتك فيها <span className="text-red-500">* (يمكنك اختيار أكثر من مجال)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INTEREST_OPTIONS.map((interest) => {
                    const isSelected = formData.interests.includes(interest);
                    return (
                      <div
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all flex items-center gap-3 select-none ${
                          isSelected
                            ? 'bg-blue-50 border-kemix-blue text-kemix-navy shadow-sm'
                            : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100/80 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            isSelected ? 'bg-kemix-blue border-kemix-blue text-white' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span>{interest}</span>
                      </div>
                    );
                  })}
                </div>
                {errors.interests && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.interests}</p>}
              </div>

              {/* Motivation */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  لماذا ترغب في الانضمام إلى Future Foundation؟ <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="motivation"
                  rows={3}
                  value={formData.motivation}
                  onChange={handleInputChange}
                  placeholder="اكتب باختصار عن أهدافك وما تطمح لاكتسابه وتطويره من خلال هذه التجربة التعليمية..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.motivation
                      ? 'border-red-300 focus:ring-red-400 bg-red-50/20'
                      : 'border-slate-200 focus:border-kemix-blue focus:ring-kemix-blue/20 bg-slate-50/40 hover:bg-white'
                  }`}
                />
                {errors.motivation && <p className="text-xs text-red-600 mt-1 font-medium">{errors.motivation}</p>}
              </div>

              {/* LinkedIn URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    رابط ملفك على LinkedIn <span className="text-slate-400 text-xs">(اختياري)</span>
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    dir="ltr"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all text-left focus:outline-none focus:ring-2 ${
                      errors.linkedinUrl
                        ? 'border-red-300 focus:ring-red-400 bg-red-50/20'
                        : 'border-slate-200 focus:border-kemix-blue focus:ring-kemix-blue/20 bg-slate-50/40 hover:bg-white'
                    }`}
                  />
                  {errors.linkedinUrl && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.linkedinUrl}</p>
                  )}
                </div>

                {/* Referral Source */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    كيف سمعت عن Future Foundation؟ <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="referralSource"
                    value={formData.referralSource}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.referralSource
                        ? 'border-red-300 focus:ring-red-400 bg-red-50/20'
                        : 'border-slate-200 focus:border-kemix-blue focus:ring-kemix-blue/20 bg-slate-50/40 hover:bg-white'
                    }`}
                  >
                    <option value="">-- اختر وسيلة المعرفة --</option>
                    {REFERRAL_SOURCES.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                  {errors.referralSource && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.referralSource}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Terms & Agreement */}
            <div className="pt-4 border-t border-slate-100 space-y-4">

              {/* Main Agreement */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="agreement"
                  checked={formData.agreement}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 rounded text-kemix-blue focus:ring-kemix-blue border-slate-300 cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  أقر بصحة البيانات المدخلة وأوافق على الالتزام بآداب وسياق التعامل والمشاركة الإيجابية في التجربة التعليمية المقدمة من <strong>Kemix Acadmey</strong>.
                </span>
              </label>
              {errors.agreement && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.agreement}</p>}

              {/* Penalty Notice Box */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 text-lg leading-none mt-0.5">⚠️</span>
                  <div>
                    <p className="font-bold mb-1">إقرار بالغرامة المالية</p>
                    <p>
                      في حالة عدم الالتزام بآداب وسياق التعامل مع المحاضرين أو الزملاء، يحق لـ <strong>Kemix Acadmey</strong> توقيع غرامة مالية قدرها{' '}
                      <strong className="text-red-700">5,000 جنيه مصري</strong>{' '}
                      وفق الشروط والأحكام المعتمدة للمبادرة.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-kemix-blue hover:bg-blue-700 text-white font-extrabold text-base sm:text-lg py-4 px-6 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>جاري معالجة الطلب وتوليد رقم التسجيل...</span>
                  </>
                ) : (
                  <>
                    <span>إرسال طلب التسجيل في Future Foundation</span>
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        applicantData={successData}
      />
    </section>
  );
};
