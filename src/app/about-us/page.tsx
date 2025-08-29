"use client";

import Image from "next/image";
import { useTranslation } from 'react-i18next';

// Define types for our translation objects
interface Award {
  name: string;
  alt: string;
  src: string;
}

const AboutUs = () => {
  const { t } = useTranslation('about');

  return (
    <div className="min-h-screen mt-36 px-4 lg:px-14 text-center flex flex-col justify-start items-center gap-24">
      {/* Main About Section */}
      <section className="flex flex-col justify-start items-center gap-7 w-auto">
        <h1 className="font-amandine text-3xl font-bold">{t('about.title')}</h1>
        <div className="flex flex-col lg:flex-row items-center justify-evenly gap-5 w-3/4">
          <div className="lg:w-1/2 w-full flex justify-center">
            <Image
              width={400}
              height={400}
              src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Fabout-us-img.png?alt=media&token=07889f5a-0828-4a31-8f6b-00d830f5d4a1"
              alt={t('about.imageAlt')}
              priority
            />
          </div>
          <div className="lg:w-1/2 w-full text-left h-full self-start">
            <p className="text-gray-f leading-7">
              {t('about.description')}
            </p>
          </div>
        </div>
      </section>

      {/* What We Believe Section */}
      <section className="flex flex-col justify-start items-center gap-10 w-[90vw] mx-auto md:w-[70vw]">
        <h1 className="font-amandine text-3xl md:text-4xl font-bold text-center">
          {t('beliefs.title')}
        </h1>
        <p className="self-start text-center md:text-left">
          {t('beliefs.subtitle')}
        </p>

        <div className="flex flex-col justify-start items-center gap-10 md:gap-10 md:justify-between md:flex-row w-full">
          {['craftsmanship', 'materials', 'connection'].map((item, index) => (
            <div key={item} className="flex flex-col gap-4">
              <div 
                className={`text-lg md:text-2xl border-l-8 ${index === 0 ? 'border-[rgba(140,52,2,1)]' : index === 1 ? 'border-[rgba(167,95,55,1)]' : 'border-[rgba(242,116,5,1)]'} h-auto flex items-center pl-4 w-full text-start`}
                dangerouslySetInnerHTML={{ __html: t(`beliefs.items.${item}.title`) }}
              />
              <div className="text-base font-extralight md:text-base border-l-2 border-black h-24 flex items-start pl-5 w-full text-start">
                {t(`beliefs.items.${item}.description`)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recognitions Section */}
      <section className="flex flex-col justify-start items-center gap-10 w-[90vw] mx-auto md:w-[60vw]">
        <h1 className="font-amandine text-3xl md:text-4xl font-bold text-center">
          {t('recognitions.title')}
        </h1>
        <div className="flex flex-col justify-start gap-5 items-center md:flex-row md:justify-center md:gap-10">
          <div className="flex-[0.5] text-left flex flex-col gap-3 text-base font-extralight">
            <p>{t('recognitions.introduction')}</p>
            <ul className="flex flex-col gap-3 list-disc pl-5">
              {(t('recognitions.achievements', { returnObjects: true }) as string[]).map((achievement: string, index: number) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-[0.5] flex-wrap gap-5 justify-evenly items-center">
            {/* Award images */}
            {(t('recognitions.awards', { returnObjects: true }) as Award[]).map((award: Award) => (
              <Image
                key={award.name}
                width={150}
                height={150}
                className="object-contain md:grayscale md:hover:grayscale-0 transition duration-300"
                alt={award.alt}
                src={award.src}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Roberto Section */}
      <section className="flex flex-col justify-start items-center gap-10 w-[90vw] mx-auto md:w-[60vw] mb-40">
        <h1 className="font-amandine text-3xl md:text-4xl font-bold text-center">
          {t('whyChoose.title')}
        </h1>
        <div className="flex flex-col justify-start gap-5 items-center md:flex-row md:justify-center md:gap-10">
          <div className="flex flex-[0.4] flex-col items-center justify-center">
            <Image
              width={150}
              height={150}
              src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2FRRRLOGO.png?alt=media&token=cef283ed-6b48-48bd-bf35-1f06249b93e4"
              alt={t('whyChoose.logoAlt1')}
            />
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Froberto-logo-2.png?alt=media&token=0983bebe-a48b-4a69-9583-01bb56d4f325"
              alt={t('whyChoose.logoAlt2')}
              width={70}
              height={30}
              priority
            />
          </div>
          <div className="flex flex-[0.6] text-left text-base font-extralight leading-6">
            {t('whyChoose.description')}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;