'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/admin/AdminNav';
import { PartnerLogo } from '@/components/ui/PartnerLogo';
import {
  Handshake,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  Eye,
  EyeOff,
  Moon,
  Sun,
  X,
  ArrowUpDown,
  FileText,
  Layers,
} from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
  darkCard: boolean;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SectionInfo {
  title: string;
  subtitle: string;
  badge: string;
}

export default function AdminPartnersPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [partners, setPartners] = useState<Partner[]>([]);
  const [sectionInfo, setSectionInfo] = useState<SectionInfo>({
    title: 'شركاء النجاح',
    subtitle:
      'نعتز بالتعاون والشراكة مع نخبة من المؤسسات والكيانات والمجتمعات الرائدة لدعم الشباب وبناء مهارات المستقبل.',
    badge: 'شركاء المسيرة والنجاح',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingTexts, setIsSavingTexts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    logoUrl: '',
    darkCard: false,
    order: 1,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPartnersData = async () => {
    try {
      const res = await fetch('/api/partners?all=true');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setPartners(data.data);
        if (data.section) {
          setSectionInfo(data.section);
        }
      }
    } catch (e) {
      showToast('فشل تحميل بيانات الشركاء', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnersData();
  }, [router]);

  const handleSaveSectionTexts = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTexts(true);
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'section_texts',
          ...sectionInfo,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('تم حفظ نصوص قسم الشركاء بنجاح');
      } else {
        showToast(data.message || 'فشل حفظ النصوص', 'error');
      }
    } catch (e) {
      showToast('حدث خطأ أثناء حفظ النصوص', 'error');
    } finally {
      setIsSavingTexts(false);
    }
  };

  const openAddModal = () => {
    setEditingPartner(null);
    setFormData({
      name: '',
      category: '',
      logoUrl: '',
      darkCard: false,
      order: partners.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      category: partner.category,
      logoUrl: partner.logoUrl,
      darkCard: partner.darkCard,
      order: partner.order,
      isActive: partner.isActive,
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, logoUrl: data.url }));
        showToast('تم رفع صورة الشعار بنجاح');
      } else {
        showToast(data.message || 'فشل رفع الشعار', 'error');
      }
    } catch (e) {
      showToast('خطأ في الاتصال أثناء رفع الملف', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.logoUrl.trim()) {
      showToast('يرجى إدخال اسم الشريك وتحديد رابط الشعار', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingPartner ? `/api/partners/${editingPartner.id}` : '/api/partners';
      const method = editingPartner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(editingPartner ? 'تم تعديل بيانات الشريك بنجاح' : 'تمت إضافة الشريك بنجاح');
        setModalOpen(false);
        fetchPartnersData();
      } else {
        showToast(data.message || 'فشل حفظ بيانات الشريك', 'error');
      }
    } catch (e) {
      showToast('خطأ في الاتصال بالخادم', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePartner = async (id: string) => {
    try {
      const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showToast('تم حذف الشريك بنجاح');
        setDeleteConfirmId(null);
        fetchPartnersData();
      } else {
        showToast(data.message || 'فشل حذف الشريك', 'error');
      }
    } catch (e) {
      showToast('خطأ في الاتصال بالخادم', 'error');
    }
  };

  const togglePartnerStatus = async (partner: Partner) => {
    try {
      const res = await fetch(`/api/partners/${partner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !partner.isActive }),
      });
      if (res.ok) {
        showToast(partner.isActive ? 'تم إخفاء الشريك من العرض' : 'تم تفعيل ظهور الشريك');
        fetchPartnersData();
      }
    } catch (e) {
      showToast('فشل تحديث الحالة', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" dir="rtl">
      <AdminNav />

      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 left-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold text-white transition-all animate-in slide-in-from-bottom-5 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-kemix-blue mb-1">
              <Handshake className="w-4 h-4" />
              <span>إدارة المحتوى والعلاقات</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-kemix-navy">
              إدارة شركاء النجاح
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              إضافة وتعديل وحذف شعارات شركاء النجاح والتحكم في نصوص القسم المعروضة في الصفحة الرئيسية.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="bg-kemix-blue hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة شريك جديد</span>
          </button>
        </div>

        {/* Card 1: Section Texts & Customization */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-kemix-navy flex items-center gap-2">
              <FileText className="w-5 h-5 text-kemix-blue" />
              <span>نصوص قسم «شركاء النجاح» في الموقع</span>
            </h2>
            <span className="text-xs text-slate-400">تظهر هذه النصوص في الواجهة العامة للزوار</span>
          </div>

          <form onSubmit={handleSaveSectionTexts} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                  العنوان الرئيسي للقسم (Section Title)
                </label>
                <input
                  type="text"
                  value={sectionInfo.title}
                  onChange={(e) => setSectionInfo({ ...sectionInfo, title: e.target.value })}
                  placeholder="شركاء النجاح"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                  البادج العلوي (Badge Tag)
                </label>
                <input
                  type="text"
                  value={sectionInfo.badge}
                  onChange={(e) => setSectionInfo({ ...sectionInfo, badge: e.target.value })}
                  placeholder="شركاء المسيرة والنجاح"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                الوصف والنبذة التقديمية (Subtitle)
              </label>
              <textarea
                rows={2}
                value={sectionInfo.subtitle}
                onChange={(e) => setSectionInfo({ ...sectionInfo, subtitle: e.target.value })}
                placeholder="نعتز بالتعاون والشراكة مع نخبة من المؤسسات والكيانات..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingTexts}
                className="bg-kemix-navy hover:bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all disabled:opacity-60"
              >
                {isSavingTexts ? (
                  <span>جاري الحفظ...</span>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>حفظ نصوص القسم</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Card 2: Partners List Table & Cards */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-kemix-blue" />
              <h2 className="text-base font-extrabold text-kemix-navy">
                قائمة الشركاء الحاليين ({partners.length})
              </h2>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-sm">جاري تحميل بيانات الشركاء...</div>
          ) : partners.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Handshake className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-500 font-bold">لا يوجد شركاء مسجلين حالياً</p>
              <button
                onClick={openAddModal}
                className="text-xs text-kemix-blue hover:underline font-bold"
              >
                + أضف الشريك الأول الآن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className={`rounded-2xl border p-5 transition-all relative flex flex-col justify-between ${
                    partner.isActive
                      ? 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                      : 'border-dashed border-slate-300 bg-slate-50/60 opacity-70'
                  }`}
                >
                  {/* Card Top / Badges */}
                  <div className="flex items-center justify-between mb-3 text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      <ArrowUpDown className="w-3 h-3" />
                      <span>الترتيب: {partner.order}</span>
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        partner.darkCard
                          ? 'bg-slate-900 text-blue-300'
                          : 'bg-blue-50 text-kemix-blue'
                      }`}
                    >
                      {partner.darkCard ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                      <span>{partner.darkCard ? 'بطاقة داكنة' : 'بطاقة فاتحة'}</span>
                    </span>
                  </div>

                  {/* Logo Display */}
                  <div
                    className={`w-full h-28 rounded-xl flex items-center justify-center p-3 mb-4 border ${
                      partner.darkCard
                        ? 'bg-slate-950 border-slate-800'
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <PartnerLogo
                      src={partner.logoUrl}
                      alt={partner.name}
                      name={partner.name}
                      darkCard={partner.darkCard}
                      className="max-h-full max-w-full object-contain"
                      fallbackClassName="h-full w-full"
                    />
                  </div>

                  {/* Info */}
                  <div className="text-right space-y-1 mb-4 flex-1">
                    <h3 className="font-extrabold text-sm text-kemix-navy">{partner.name}</h3>
                    <p className="text-xs text-slate-500 truncate">{partner.category || '—'}</p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => togglePartnerStatus(partner)}
                      className={`flex items-center gap-1 font-semibold ${
                        partner.isActive ? 'text-emerald-600 hover:text-emerald-700' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={partner.isActive ? 'تعطيل الظهور' : 'تفعيل الظهور'}
                    >
                      {partner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      <span>{partner.isActive ? 'نشط' : 'مخفي'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(partner)}
                        className="p-1.5 text-slate-500 hover:text-kemix-blue hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {deleteConfirmId === partner.id ? (
                        <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                          <button
                            onClick={() => handleDeletePartner(partner.id)}
                            className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold hover:bg-red-700"
                          >
                            تأكيد الحذف
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-[10px] text-slate-500 hover:text-slate-700 px-1"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(partner.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Add / Edit Partner Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-lg font-bold text-kemix-navy flex items-center gap-2">
                <Handshake className="w-5 h-5 text-kemix-blue" />
                <span>{editingPartner ? 'تعديل بيانات الشريك' : 'إضافة شريك نجاح جديد'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePartnerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم الشريك / الكيان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: وزارة الشباب والرياضة"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  التصنيف أو الوصف المختصر
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="مثال: شريك تكنولوجي واستثماري"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
                />
              </div>

              {/* Logo Selection / Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  شعار الشريك (Logo) <span className="text-red-500">*</span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="/images/partners/partner-name.png أو رابط صورة"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-left focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
                  />

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'جاري الرفع...' : 'رفع صورة'}</span>
                  </button>
                </div>
              </div>

              {/* Logo Live Preview */}
              {formData.logoUrl && (
                <div
                  className={`p-4 rounded-xl border flex items-center justify-center h-24 ${
                    formData.darkCard
                      ? 'bg-slate-950 border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <PartnerLogo
                    src={formData.logoUrl}
                    alt={formData.name || 'Logo Preview'}
                    name={formData.name || 'Partner'}
                    darkCard={formData.darkCard}
                    className="max-h-full max-w-full object-contain"
                    fallbackClassName="h-full w-full"
                  />
                </div>
              )}

              {/* Dark Card & Order */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الترتيب الرقمي
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.darkCard}
                      onChange={(e) => setFormData({ ...formData, darkCard: e.target.checked })}
                      className="w-4 h-4 rounded text-kemix-blue"
                    />
                    <span className="text-xs font-bold text-slate-700">بطاقة داكنة (Dark Glow)</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-kemix-blue"
                  />
                  <span className="text-xs font-bold text-slate-700">تفعيل ظهور الشريك في الموقع العام</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-kemix-blue hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-60"
                >
                  {isSubmitting ? 'جاري الحفظ...' : editingPartner ? 'حفظ التعديلات' : 'إضافة الشريك'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
