'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);
  
  // Detect if current language is RTL
  useEffect(() => {
    setIsRTL(i18n.language === 'he');
  }, [i18n.language]);

  return (
    <footer className={styles.footer} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={styles.footerContent}>
        {/* Logo */}
        <div className={styles.footerLogo}>
          <Link href="/" aria-label="Home" className={styles.logoWrapper}>
            <Image
              className={styles.logoMain}
              src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Froberto-logo-1.png?alt=media&token=cacc86a9-43aa-4090-99da-9ed54525ee2d"
              alt={t('footer.logoAlt', 'Roberto Logo')}
              width={150}
              height={60}
              priority
            />
            <Image
              className={styles.logoSecond}
              src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Froberto-logo-2.png?alt=media&token=0983bebe-a48b-4a69-9583-01bb56d4f325"
              alt={t('footer.jewelryAlt', 'Jewelry')}
              width={72}
              height={20}
              priority
            />
          </Link>
          <p className={styles.logoDescription}>
            {t('footer.description', 'Crafting exceptional jewelry since 1985. Each piece tells a story of elegance and timeless beauty.')}
          </p>
        </div>

        {/* Shop */}
        <div className={styles.footerColumn}>
          <h4 className={styles.columnTitle}>{t('footer.shopTitle', 'Shop')}</h4>
          <ul className={styles.linkList}>
            <li><Link href="/shop/rings">{t('rings', 'Rings')}</Link></li>
            <li><Link href="/shop/necklaces">{t('necklaces', 'Necklaces')}</Link></li>
            <li><Link href="/shop/bracelets">{t('bracelets', 'Bracelets')}</Link></li>
            <li><Link href="/shop/earrings">{t('earrings', 'Earrings')}</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className={styles.footerColumn}>
          <h4 className={styles.columnTitle}>{t('footer.customerCareTitle', 'Customer Care')}</h4>
          <ul className={styles.linkList}>
            <li><Link href="/contact">{t('footer.contactUs', 'Contact Us')}</Link></li>
            <li><Link href="/about">{t('footer.aboutRoberto', 'About Roberto')}</Link></li>
            <li><Link href="/custom-jewelry">{t('footer.customJewelry', 'Custom Jewelry')}</Link></li>
            <li><Link href="/shipping-returns">{t('footer.shippingReturns', 'Shipping & Returns')}</Link></li>
          </ul>
        </div>

        {/* Connect */}
        <div className={styles.footerColumn}>
          <h4 className={styles.columnTitle}>{t('footer.connectTitle', 'Connect')}</h4>
          <p className={styles.contactInfo}>{t('footer.email', 'hello@roberto.com')}</p>
          <p className={styles.contactInfo}>{t('footer.phone', '+1 (555) 123‑4567')}</p>
          <div className={styles.socialIcons}>
            <FaInstagram className={styles.icon} aria-label={t('footer.instagram', 'Instagram')} />
            <FaFacebookF className={styles.icon} aria-label={t('footer.facebook', 'Facebook')} />
            <FaTwitter className={styles.icon} aria-label={t('footer.twitter', 'Twitter')} />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} {t('footer.copyright', 'Roberto Jewelry. All rights reserved.')}</p>
        <p>{t('footer.poweredBy', 'POWERED BY')} <span className={styles.boldrBrandz}>BOLDRBRANDZ</span></p>
      </div>
    </footer>
  );
};

export default Footer;