'use client'

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useEffect, useState } from "react";

const CreativeVision = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);
  
  // Detect if current language is RTL
  useEffect(() => {
    setIsRTL(i18n.language === 'he');
  }, [i18n.language]);

  return (
    <section
      className="py-12 px-4 text-center"
      style={{
        background: "linear-gradient(90deg, #262626 0%, #404040 100%)",
      }}
    >
      <h1 className="text-4xl font-amandine mb-4 text-white">
        {t('creativeVision.title', 'The Creative Vision Of Roberto')}
      </h1>
      <p className="text-xl mb-6 text-white">
        {t('creativeVision.subtitle', 'Shape the Sparkle of Your Design Vision')}
      </p>
      <button
        onClick={() => router.push("/customize")}
        style={{
          position: "relative",
          minWidth: 300,
          height: 50,
          background: "linear-gradient(90deg, #D9946C 0%, #F27405 100%)",
          borderRadius: 6,
          fontWeight: "600",
          fontSize: 18,
          color: "white",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: isRTL ? 20 : 40, // Adjust padding based on language direction
          paddingRight: isRTL ? 40 : 20,
          border: "none",
          cursor: "pointer",
        }}
      >
        <Image
          src="/icons/star.png"
          alt={t('common.ariaLabels.starIcon', 'Star Icon')}
          width={18}
          height={18}
          style={{
            position: "absolute",
            [isRTL ? 'right' : 'left']: 12, // Position icon based on language direction
            width: 18,
            height: 18,
            pointerEvents: "none",
          }}
        />
        {t('creativeVision.button', 'Design Your Signature Piece!')}
      </button>
    </section>
  );
};

export default CreativeVision;