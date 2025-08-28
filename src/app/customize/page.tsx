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

const COLORS = {
  text: '#141414',
  muted: '#666666',
  accent: '#F27405',
  surface: '#FFFFFF',
  subtle: '#F5F3EF',
  page: '#F8F8F6',
};

const BUDGETS = [
  { key: 'u500', label: 'Under $500', min: 0, max: 500 },
  { key: '500-2000', label: '$500 – $2,000', min: 500, max: 2000 },
  { key: '2k-5k', label: '$2,000 – $5,000', min: 2000, max: 5000 },
  { key: '5k+', label: '$5,000+', min: 5000, max: 999999 },
];

function StepItem({ step, title, desc }: { step: number; title: string; desc: string }) {
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
          {title}
        </p>
        <p className="text-sm" style={{ color: COLORS.muted }}>
          {desc}
        </p>
      </div>
    </li>
  );
}

function WhyItem({ title, desc }: { title: string; desc: string }) {
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
          {title}
        </p>
        <p className="text-sm" style={{ color: COLORS.muted }}>
          {desc}
        </p>
      </div>
    </li>
  );
}

export default function CustomizePage() {
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
      fullName ? `Full Name: ${fullName}` : '',
      email ? `Email: ${email}` : '',
      phone ? `Phone: ${phone}` : '',
      designDesc ? `Design Description: ${designDesc}` : '',
      additionalNotes ? `Additional Notes: ${additionalNotes}` : '',
      budgetKey ? `Budget: ${BUDGETS.find((b) => b.key === budgetKey)?.label}` : '',
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
      if (!res.ok) setError('Something went wrong, please try again!');
    } catch (e: any) {
      setError(e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Customize | Roberto Jewelry</title>
      </Head>

      <div className="min-h-screen pb-24 pt-28" style={{ background: COLORS.page }}>
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
              Start Your Design
            </h2>
            <p className="text-sm mb-5" style={{ color: COLORS.muted }}>
              Tell us about your vision and upload any inspiration images
            </p>

            {/* Upload */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
                Upload Reference Images
              </h3>
              <Dragger
                {...uploadProps}
                className="!bg-transparent !p-6"
                style={{ borderColor: '#dcdcdc' }}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ color: '#666666', fontSize: 36 }} />
                </p>
                <p className="ant-upload-text">Click or drag files here to upload</p>
                <button
                  type="button"
                  className="mt-3 px-4 py-1 text-sm font-medium"
                  style={{ background: COLORS.accent, color: '#fff' }}
                >
                  Choose File
                </button>
                <p className="ant-upload-hint mt-2" style={{ color: COLORS.muted }}>
                  Support for single or bulk upload.
                </p>
              </Dragger>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: COLORS.text }}>
                    Full Name
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
                    Email
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
                  Phone
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
                  Design Description
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
                  Budget
                </label>
                <select
                  value={budgetKey}
                  onChange={(e) => onBudgetChange(e.target.value)}
                  className="w-full border px-3 py-2"
                  style={{ borderColor: '#dcdcdc', background: COLORS.subtle }}
                >
                  <option value="">Select Budget</option>
                  {BUDGETS.map((b) => (
                    <option key={b.key} value={b.key}>
                      {b.label}
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
                {loading ? 'Submitting...' : <><img src="/icons/star.png" alt="Star" className="w-4 h-4" /> Start Your Design Journey</>}
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
                How It Works
              </h3>
              <ul className="space-y-4">
                <StepItem step={1} title="Share Your Vision" desc="Upload reference images and describe your dream piece." />
                <StepItem step={2} title="Collaborate & Refine" desc="Work with our master craftsman to perfect the design." />
                <StepItem step={3} title="Handcrafted Excellence" desc="Watch your custom piece come to life with premium materials." />
              </ul>
            </div>

            {/* Why Choose Custom? */}
            <div
              className="border shadow-md p-11"
              style={{ background: COLORS.surface, borderColor: '#ececec' }}
            >
              <h3 className="text-lg font-bold mb-4 tracking-wide font-[Amandine]" style={{ color: COLORS.text }}>
                Why Choose Custom?
              </h3>
              <ul className="space-y-3">
                <WhyItem title="Unique Design" desc="One-of-a-kind piece crafted exclusively for you." />
                <WhyItem title="Premium Materials" desc="Only the finest carefully sourced materials." />
                <WhyItem title="Master Craftsmanship" desc="Handcrafted by skilled artisans." />
                <WhyItem title="Lifetime Warranty" desc="Guaranteed craftsmanship for life." />
              </ul>
            </div>

            {/* Need Help */}
            <div
              className="border shadow-md p-5"
              style={{ background: COLORS.surface, borderColor: '#ececec' }}
            >
              <h3 className="flex items-center gap-2 text-lg font-bold mb-2 tracking-wide font-[Amandine]" style={{ color: COLORS.text }}>
                <MessageOutlined style={{ color: COLORS.accent }} /> Need Help?
              </h3>
              <p className="text-sm mb-4" style={{ color: COLORS.muted }}>
                Talk to our designer — schedule a consultation call.
              </p>
              <button
                className="w-full border px-4 py-4 font-medium transition"
                style={{
                  background: COLORS.subtle,
                  borderColor: '#e5e5e5',
                  color: COLORS.text,
                }}
              >
                Book Consultation
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
