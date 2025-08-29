import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);
  
  // Detect if current language is RTL
  useEffect(() => {
    setIsRTL(i18n.language === 'he');
  }, [i18n.language]);
  
  return (
    <header 
      className={`relative w-full h-[600px] md:h-[650px] pt-16 md:pt-20 ${isRTL ? 'rtl' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background Image */}
      <Image
        src="/image/hero.png"
        alt={t('hero.altText', 'Timeless Elegance - Roberto Jewelry')}
        fill
        className="absolute inset-0 w-full h-full object-cover z-0"
        priority
      />

      {/* Gradient Overlay - Adjust direction based on language */}
      <div 
        className={`absolute inset-0 z-10 ${
          isRTL 
            ? 'bg-gradient-to-l from-[#F8F8F6] via-[#F8F8F6]/50 to-transparent' 
            : 'bg-gradient-to-r from-[#F8F8F6] via-[#F8F8F6]/50 to-transparent'
        }`} 
      />

      {/* Content - Adjust positioning based on language */}
      <div 
        className={`relative z-20 flex flex-col justify-center h-full px-6 md:px-16 max-w-4xl ${
          isRTL 
            ? 'mr-auto md:mr-[15%] text-right' 
            : 'ml-auto md:ml-[15%] text-left'
        }`}
      >
        <h1 className="text-5xl md:text-6xl leading-tight text-black">
          <span className="block font-geist font-semibold">
            {t('hero.titlePart1')}
          </span>
          <span className="block text-orange-500 font-amandine font-semibold">
            {t('hero.titlePart2')}
          </span>
        </h1>

        <p className="mt-4 text-base text-black font-redhat font-normal max-w-md leading-relaxed">
          {t('hero.description')}
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          {/* Primary CTA - Explore Collection */}
          <Link href="/collections">
            <button className="bg-[#b16339] text-white text-sm px-10 py-1 rounded-none shadow flex items-center gap-2 font-geist font-semibold tracking-wide hover:bg-[#5a2f1a] transition-colors">
              {t('hero.button1')}
              <Image 
                src="/icons/arrow.png" 
                alt={t('common.ariaLabels.arrowIcon')} 
                width={16} 
                height={16} 
                className="w-4 h-4" 
              />
            </button>
          </Link>

          {/* Secondary CTA - Design Your Signature Piece */}
          <Link href="/customize">
            <button className="bg-white text-sm px-5 py-1 rounded-none shadow flex items-center gap-2 font-geist font-medium text-black hover:bg-gray-50 transition-colors">
              {t('hero.button2')}
              {/* Smaller star icon */}
              <Image
                src="/icons/dark-star.png"
                alt={t('common.ariaLabels.starIcon')}
                width={12}
                height={12}
                className="w-3 h-3"
              />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Hero;