'use client';

import Image from "next/image";
import { useTranslation } from "react-i18next";

const awards = [
  { href: "https://competition.adesignaward.com/gooddesigner.php?profile=227701", src: "/image/a aard.jpg", width: 80, height: 40 },
  { href: "https://www.bestdesigners.org/227701", src: "/image/best.png", width: 80, height: 40 },
  { href: "https://designclassifications.com/", src: "/image/dac.png", width: 80, height: 40 },
  { href: "https://www.designassociation.net/member-details.php?u=227701", src: "/image/Design Club.png", width: 80, height: 40 },
  { href: "https://www.icci.com", src: "/image/icci.png", width: 80, height: 40 },
  { href: "", src: "/image/ISPM.png", width: 80, height: 40 },
  { href: "https://www.worlddesignrankings.com/country-level-rankings.php?COUNTRY=83&NAME=Israel#home", src: "/image/R.png", width: 80, height: 40 },
  { href: "https://www.worlddesignconsortium.com/partner.php?portfolio=18577100", src: "/image/W.png", width: 80, height: 40 },
];

export const Awards = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 px-4 lg:px-14 bg-[#F5F5F5] text-center flex flex-col gap-5">
      <h2 className="font-amandine text-3xl font-bold text-black mb-4">
        {t('awards.title')}
      </h2>
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
        {awards.map(({ href, src, width, height }, i) => (
          <a
            key={i}
            href={href || undefined}
            target={href ? "_blank" : undefined}
            rel={href ? "noopener noreferrer" : undefined}
            className="flex items-center justify-center p-2 transition-transform duration-300 hover:scale-105"
          >
            <div className="relative flex items-center justify-center w-[120px] h-[70px]">
              <Image
                src={src}
                alt={t(`awards.alt${i + 1}`, `Award ${i + 1}`)}
                width={width}
                height={height}
                loading="lazy"
                className="object-contain grayscale hover:grayscale-0 transition duration-300"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
