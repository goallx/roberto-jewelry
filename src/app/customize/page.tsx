'use client';

import { useMemo, useState } from 'react';
import Head from 'next/head';
import { Breadcrumb } from '@/components/breadcrumbs/Breadcrumb';
import {
  UploadOutlined,
  MessageOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import type { UploadFile, UploadProps } from 'antd';
import UploadsManager from '@/utils/UploadsManager';
import type { UploadedImagesResponse } from '../api/uploads/images/manager';
import type { Customise } from '@/models/customise';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const COLORS = {
  text: '#141414',
  muted: '#666666',
  accent: '#F27405',
  surface: '#FFFFFF',
  subtle: '#F5F3EF',
  page: '#F8F8F6',
};

const BUDGETS = [
  { key: 'u500', labelKey: 'customizePage.budgetOptions.u500', min: 0, max: 500 },
  { key: '500-2000', labelKey: 'customizePage.budgetOptions.500-2000', min: 500, max: 2000 },
  { key: '2k-5k', labelKey: 'customizePage.budgetOptions.2k-5k', min: 2000, max: 5000 },
  { key: '5k+', labelKey: 'customizePage.budgetOptions.5k+', min: 5000, max: 999999 },
];

function StepItem({ step, titleKey, descKey }: { step: number; titleKey: string; descKey: string }) {
  const { t } = useTranslation();
  
  return (
    <li className="flex gap-4 items-start">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full font-semibold text-sm shadow-md"
        style={{ background: COLORS.accent, color: '#000' }}
      >
        {step}
      </span>
      <div>
        <p className="font-semibold text-base font-[Amandine]" style={{ color: COLORS.text }}>
          {t(titleKey)}
        </p>
        <p className="text-sm" style={{ color: COLORS.muted }}>
          {t(descKey)}
        </p>
      </div>
    </li>
  );
}

function WhyItem({ titleKey, descKey }: { titleKey: string; descKey: string }) {
  const { t } = useTranslation();
  
  return (
    <li className="flex gap-3 items-start">
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full"
        style={{ background: COLORS.accent, color: '#fff' }}
      >
        <CheckOutlined style={{ fontSize: 12 }} />
      </span>
      <div>
        <p className="font-semibold text-base font-[Amandine]" style={{ color: COLORS.text }}>
          {t(titleKey)}
        </p>
        <p className="text-sm" style={{ color: COLORS.muted }}>
          {t(descKey)}
        </p>
      </div>
    </li>
  );
}

export default function CustomizePage() {
  const { t, i18n } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designDesc, setDesignDesc] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [budgetKey, setBudgetKey] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [uploadedImages, setUploadedImages] = useState<UploadedImagesResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const uploadProps = useMemo<UploadProps>(
    () => ({
      name: 'file',
      multiple: true,
      accept: 'image/*',
      customRequest: async ({ file, onSuccess, onError }) => {
        try {
          const res = await UploadsManager.uploadImages([file as File]);
          if (res?.length) {
            onSuccess?.(res[0]);
            setUploadedImages((prev) => [...prev, res[0]]);
          }
        } catch (e) {
          onError?.(e as any);
        }
      },
      onRemove: async (file: UploadFile) => {
        const name = (file as any)?.response?.fileName;
        if (!name) return false;
        const ok = await UploadsManager.deleteImages([name]);
        if (ok) {
          setUploadedImages((prev) => prev.filter((img) => img.fileName !== name));
        }
        return ok;
      },
    }),
    []
  );

  const onBudgetChange = (val: string) => {
    setBudgetKey(val);
    const found = BUDGETS.find((b) => b.key === val);
    if (found) setPriceRange({ min: found.min, max: found.max });
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    const extra = [
      fullName ? `${t('customizePage.fullName')}: ${fullName}` : '',
      email ? `${t('email')}: ${email}` : '',
      phone ? `${t('customizePage.phone')}: ${phone}` : '',
      designDesc ? `${t('customizePage.designDescription')}: ${designDesc}` : '',
      additionalNotes ? `${t('customizePage.additionalNotes')}: ${additionalNotes}` : '',
      budgetKey ? `${t('customizePage.budget')}: ${t(BUDGETS.find((b) => b.key === budgetKey)?.labelKey || '')}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const body: Partial<Customise> = {
      images: uploadedImages,
      priceRange,
      additional: extra,
    };

    try {
      const res = await fetch('/api/customise', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) setError(t('customizePage.errorMessage'));
    } catch (e: any) {
      setError(e?.message || t('customizePage.networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t('customizePage.pageTitle')}</title>
      </Head>

      <div className="min-h-screen pb-24 pt-28" style={{ background: COLORS.page }} dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
        <div className="max-w-6xl mx-auto px-6 pt-8">
          <Breadcrumb />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT */}
          <section
            className="border shadow-md p-6"
            style={{ background: COLORS.surface, borderColor: '#ececec' }}
          >
            <h2 className="text-2xl font-bold mb-1 font-[Amandine]" style={{ color: COLORS.text }}>
              {t('customizePage.startDesign')}
            </h2>
            <p className="text-sm mb-5" style={{ color: COLORS.muted }}>
              {t('customizePage.visionDescription')}
            </p>

            {/* Upload */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                {t('customizePage.uploadReferences')}
              </h3>
              <Dragger
                {...uploadProps}
                className="!bg-transparent !p-6"
                style={{ borderColor: '#dcdcdc' }}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ color: '#666666', fontSize: 36 }} />
                </p>
                <p className="ant-upload-text">{t('customizePage.uploadText')}</p>
                <button
                  type="button"
                  className="mt-3 px-4 py-1 text-sm font-medium"
                  style={{ background: COLORS.accent, color: '#fff' }}
                >
                  {t('customizePage.chooseFile')}
                </button>
                <p className="ant-upload-hint mt-2" style={{ color: COLORS.muted }}>
                  {t('customizePage.uploadHint')}
                </p>
              </Dragger>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: COLORS.text }}>
                    {t('customizePage.fullName')}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border px-3 py-2"
                    style={{ borderColor: '#dcdcdc', background: COLORS.subtle }}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1" style={{ color: COLORS.text }}>
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border px-3 py-2"
                    style={{ borderColor: '#dcdcdc', background: COLORS.subtle }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: COLORS.text }}>
                  {t('customizePage.phone')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border px-3 py-2"
                  style={{ borderColor: '#dcdcdc', background: COLORS.subtle }}
                />
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: COLORS.text }}>
                  {t('customizePage.designDescription')}
                </label>
                <textarea
                  value={designDesc}
                  onChange={(e) => setDesignDesc(e.target.value)}
                  className="w-full border px-3 py-2 min-h-[100px]"
                  style={{ borderColor: '#dcdcdc', background: COLORS.subtle }}
                />
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: COLORS.text }}>
                  {t('customizePage.budget')}
                </label>
                <select
                  value={budgetKey}
                  onChange={(e) => onBudgetChange(e.target.value)}
                  className="w-full border px-3 py-2"
                  style={{ borderColor: '#dcdcdc', background: COLORS.subtle }}
                >
                  <option value="">{t('customizePage.selectBudget')}</option>
                  {BUDGETS.map((b) => (
                    <option key={b.key} value={b.key}>
                      {t(b.labelKey)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 text-white font-semibold shadow-md transition hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(90deg, #F29D38 0%, #F27405 100%)',
                }}
              >
                {loading ? t('customizePage.submitting') : <><img src="/icons/star.png" alt={t('common.ariaLabels.starIcon')} className="w-4 h-4" /> {t('customizePage.submitButton')}</>}
              </button>
              {error ? (
                <p className="mt-3 text-sm" style={{ color: '#b00020' }}>
                  {error}
                </p>
              ) : null}
            </div>
          </section>

          {/* RIGHT */}
          <section className="space-y-6">
            {/* How It Works */}
            <div
              className="border shadow-md p-11"
              style={{ background: COLORS.surface, borderColor: '#ececec' }}
            >
              <h3 className="text-lg font-bold mb-4 tracking-wide font-[Amandine]" style={{ color: COLORS.text }}>
                {t('customizePage.howItWorks')}
              </h3>
              <ul className="space-y-4">
                <StepItem step={1} titleKey="customizePage.step1.title" descKey="customizePage.step1.description" />
                <StepItem step={2} titleKey="customizePage.step2.title" descKey="customizePage.step2.description" />
                <StepItem step={3} titleKey="customizePage.step3.title" descKey="customizePage.step3.description" />
              </ul>
            </div>

            {/* Why Choose Custom? */}
            <div
              className="border shadow-md p-11"
              style={{ background: COLORS.surface, borderColor: '#ececec' }}
            >
              <h3 className="text-lg font-bold mb-4 tracking-wide font-[Amandine]" style={{ color: COLORS.text }}>
                {t('customizePage.whyCustom')}
              </h3>
              <ul className="space-y-3">
                <WhyItem titleKey="customizePage.reason1.title" descKey="customizePage.reason1.description" />
                <WhyItem titleKey="customizePage.reason2.title" descKey="customizePage.reason2.description" />
                <WhyItem titleKey="customizePage.reason3.title" descKey="customizePage.reason3.description" />
                <WhyItem titleKey="customizePage.reason4.title" descKey="customizePage.reason4.description" />
              </ul>
            </div>

            {/* Need Help */}
            <div
              className="border shadow-md p-5"
              style={{ background: COLORS.surface, borderColor: '#ececec' }}
            >
              <h3 className="flex items-center gap-2 text-lg font-bold mb-2 tracking-wide font-[Amandine]" style={{ color: COLORS.text }}>
                <MessageOutlined style={{ color: COLORS.accent }} /> {t('customizePage.needHelp')}
              </h3>
              <p className="text-sm mb-4" style={{ color: COLORS.muted }}>
                {t('customizePage.consultationText')}
              </p>
              <button
                className="w-full border px-4 py-4 font-medium transition"
                style={{
                  background: COLORS.subtle,
                  borderColor: '#e5e5e5',
                  color: COLORS.text,
                }}
              >
                {t('customizePage.bookConsultation')}
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}