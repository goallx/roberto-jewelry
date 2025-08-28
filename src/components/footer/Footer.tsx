'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.footerContent}>
      {/* Logo */}
      <div className={styles.footerLogo}>
        <Link href="/" aria-label="Home" className={styles.logoWrapper}>
          <Image
            className={styles.logoMain}
            src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Froberto-logo-1.png?alt=media&token=cacc86a9-43aa-4090-99da-9ed54525ee2d"
            alt="Roberto Logo"
            width={150}
            height={60}
            priority
          />
          <Image
            className={styles.logoSecond}
            src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Froberto-logo-2.png?alt=media&token=0983bebe-a48b-4a69-9583-01bb56d4f325"
            alt="Jewelry"
            width={72}
            height={20}
            priority
          />
        </Link>
        <p className={styles.logoDescription}>
          Crafting exceptional jewelry since 1985. Each piece tells a story of elegance and timeless beauty.
        </p>
      </div>

      {/* Shop */}
      <div className={styles.footerColumn}>
        <h4 className={styles.columnTitle}>Shop</h4>
        <ul className={styles.linkList}>
          <li><Link href="/shop/rings">Rings</Link></li>
          <li><Link href="/shop/necklaces">Necklaces</Link></li>
          <li><Link href="/shop/bracelets">Bracelets</Link></li>
          <li><Link href="/shop/earrings">Earrings</Link></li>
        </ul>
      </div>

      {/* Customer Care */}
      <div className={styles.footerColumn}>
        <h4 className={styles.columnTitle}>Customer Care</h4>
        <ul className={styles.linkList}>
          <li><Link href="/contact">Contact Us</Link></li>
          <li><Link href="/about">About Roberto</Link></li>
          <li><Link href="/custom-jewelry">Custom Jewelry</Link></li>
          <li><Link href="/shipping-returns">Shipping & Returns</Link></li>
        </ul>
      </div>

      {/* Connect */}
      <div className={styles.footerColumn}>
        <h4 className={styles.columnTitle}>Connect</h4>
        <p className={styles.contactInfo}>hello@roberto.com</p>
        <p className={styles.contactInfo}>+1 (555) 123‑4567</p>
        <div className={styles.socialIcons}>
          <FaInstagram className={styles.icon} />
          <FaFacebookF className={styles.icon} />
          <FaTwitter className={styles.icon} />
        </div>
      </div>
    </div>

    {/* Bottom */}
    <div className={styles.footerBottom}>
      <p>© {new Date().getFullYear()} Roberto Jewelry. All rights reserved.</p>
      <p>POWERED BY <span className={styles.boldrBrandz}>BOLDRBRANDZ</span></p>
    </div>
  </footer>
);

export default Footer;
