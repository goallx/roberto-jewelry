'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faIdCard,
  faPenToSquare,
  faCreditCard,
  faCheckCircle,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { Loader } from '../loader/Loader';
import { Badge } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/context/StoreContext';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ProfileDropdown from './profile-dropdown/ProfileDropdown';
import { useLanguage } from '@/context/LanguageProvider';
import { useTranslation } from 'react-i18next';

const menuVariants = {
  open: { opacity: 1, x: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  closed: { opacity: 0, x: '-100%', transition: { duration: 0.28, ease: 'easeInOut' } },
};

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="6.2" />
    <line x1="20" y1="20" x2="16.65" y2="16.65" />
  </svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="8" r="3.2" />
    <path d="M4 20c0-4 4.5-6 8-6s8 2 8 6" />
  </svg>
);

const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.6 7.1c-1.6-2-4.5-2.4-6.4-1L12 8 9.8 6.1C7.9 4.6 5 5 3.4 7.1 1.8 9.2 2.1 12 4.2 13.6L12 20l7.8-6.4c2.1-1.6 2.4-4.4.8-6.5z" />
  </svg>
);

const BagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 7l1-2a3 3 0 0 1 2.7-1.6h2.6A3 3 0 0 1 16 5l1 2" />
    <rect x="3" y="7" width="18" height="14" rx="2" />
    <path d="M16 11a4 4 0 0 1-8 0" />
  </svg>
);

const Navbar = observer(() => {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);

  const { toggleLang, lang } = useLanguage();
  const { t } = useTranslation();

  const { cartStore, profileStore, wishlistStore, categoryStore } = useStores();
  const { isAuthenticated, logout } = useAuth();

  const profileRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navbarRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 100);
    };

    const fetchCategories = async () => await categoryStore?.fetchCategories()
    if (!categoryStore?.categories) fetchCategories()

    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && cartStore) cartStore.fetchUserCart();
  }, [isAuthenticated, cartStore]);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
    setMenuOpen(false);
    setProfileOpen(false);
    router.push('/');
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setProfileOpen((p: boolean) => !p);
    }
  };

  const toggleMenu = () => setMenuOpen((m: boolean) => !m);
  const toggleDropdown = () => setDropdownOpen((d: boolean) => !d);

  if (pathname?.includes('admin')) return null;

  const navigate = (href: string) => {
    setMenuOpen(false);
    setDropdownOpen(false);
    router.push(href);
  };

  const handleCartClick = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
    router.push('/payment');
  };

  const shouldBeWhite = isScrolled || isNavbarHovered || menuOpen || dropdownOpen || profileOpen;

  return (
    <nav
      ref={navbarRef}
      className={`${styles.navbar} ${shouldBeWhite ? styles.navbarWhite : ''}`}
      onMouseEnter={() => setIsNavbarHovered(true)}
      onMouseLeave={() => setIsNavbarHovered(false)}
      style={{ zIndex: 99999 }}
    >
      {/* LEFT AREA */}
      <div className={styles.leftArea}>
        <div className={styles.hamburger} onClick={toggleMenu} role="button" aria-label={t('navigation.toggleMenu')}>
          <span />
          <span />
          <span />
        </div>

        <div className={styles.navbarLeft}>
          <Link href="/" className={styles.navLink}>
            {t('home')}
          </Link>

          <div className={styles.jewelryWrap} ref={dropdownRef}>
            <button
              className={styles.jewelryTitle}
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
            >
              {t('jewelry')}
            </button>

            {dropdownOpen && (
              <div className={styles.dropdownMenu} role="menu" aria-label={t('navigation.jewelryMenu')}>
                {/* Frosted glass background for dropdown */}
                <div className={styles.frostedGlass}></div>

                <div className={styles.dropdownContent}>
                  <div className={styles.dropdownInner}>
                    <div className={styles.columns}>
                      <div className={styles.col}>
                        <h4>{t('women')}</h4>
                        <Link prefetch href="/collections?category=rings&gender=female" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>
                          {t('rings')}
                        </Link>
                        <Link prefetch href="/collections?category=earrings&gender=female" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>
                          {t('earrings')}
                        </Link>
                        <Link prefetch href="/collections?category=necklaces&gender=female" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>
                          {t('necklaces')}
                        </Link>
                      </div>

                      <div className={styles.col}>
                        <h4>{t('men')}</h4>
                        <Link prefetch href="/collections?category=rings&gender=male" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>
                          {t('rings')}
                        </Link>
                        <Link prefetch href="/collections?category=earrings&gender=male" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>
                          {t('earrings')}
                        </Link>
                        <Link prefetch href="/collections?category=necklaces&gender=male" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>
                          {t('necklaces')}
                        </Link>
                      </div>
                    </div>

                    <div className={styles.dropdownImageWrapper}>
                      <Image
                        src="/image/dropdown.jpg"
                        alt={t('navigation.jewelryCollection')}
                        width={960}
                        height={320}
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link prefetch href="/collections" className={styles.navLink}>
            {t('collections')}
          </Link>

          <Link prefetch href="/customize" className={styles.navLink}>
            {t('customize')}
          </Link>

          <Link prefetch href="/about-us" className={styles.navLink}>
            {t('aboutUs')}
          </Link>
        </div>
      </div>

      {/* LOGO (centered) */}
      <div className={styles.navbarLogo}>
        <Link href="/" aria-label={t('home')} className={styles.logoWrapper}>
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
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.navbarRight}>
        <button
          className={`${styles.langBtn} ${styles.langBtnEnhanced}`}
          onClick={() => toggleLang()}
          aria-label={t('navigation.toggleLanguage')}
        >
          <FontAwesomeIcon icon={faGlobe} className={styles.globeIcon} />
          {lang.toUpperCase()}
        </button>

        <div className={styles.profileWrap} ref={profileRef}>
          <button className={`${styles.iconBtn} ${styles.profileIcon}`} aria-label={t('navigation.profile')} onClick={handleProfileClick}>
            <UserIcon className={styles.iconSvg} />
          </button>

          <ProfileDropdown
            isOpen={isAuthenticated && profileOpen}
            user={profileStore?.profile}
            isLoading={isLoading}
            onLogout={handleLogout}
            onClose={() => setProfileOpen(false)}
          />
        </div>

        {isAuthenticated && (
          <button aria-label={t('wishlist.title')} className={styles.iconBtn} onClick={() => navigate('/wishlist')}>
            <Badge count={wishlistStore?.items.length} overflowCount={99}>
              <HeartIcon className={styles.iconSvg} />
            </Badge>
          </button>
        )}

        {isAuthenticated && (
          <button
            className={styles.iconBtn}
            aria-label={t('navigation.cart')}
            onClick={handleCartClick}
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <Badge count={cartStore?.numOfCartItems ?? 0} overflowCount={99}>
              <BagIcon className={styles.iconSvg} />
            </Badge>
          </button>
        )}
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <motion.div className={styles.mobileMenu} initial="closed" animate="open" variants={menuVariants}>
          <div className={styles.mobileInner}>
            <ul className={styles.mobileList}>
              <li className={styles.mobileHeader}>{t('home')}</li>

              <li className={styles.mobileHeader}>{t('women')}</li>
              <li><Link href="/collections?category=rings&gender=female" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('rings')}</Link></li>
              <li><Link href="/collections?category=earrings&gender=female" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('earrings')}</Link></li>
              <li><Link href="/collections?category=necklaces&gender=female" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('necklaces')}</Link></li>

              <li className={styles.mobileHeader}>{t('men')}</li>
              <li><Link href="/collections?category=rings&gender=male" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('rings')}</Link></li>
              <li><Link href="/collections?category=earrings&gender=male" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('earrings')}</Link></li>
              <li><Link href="/collections?category=necklaces&gender=male" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('necklaces')}</Link></li>

              <li className={styles.mobileHeader}>{t('collections')}</li>
              <li><Link href="/collections" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('collections')}</Link></li>
              <li><Link href="/customize" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('customize')}</Link></li>
              <li><Link href="/about-us" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('aboutUs')}</Link></li>
            </ul>

            <div className={styles.mobileIcons}>
              <Link href="/profile" className={styles.mobileLink}><UserIcon className={styles.iconSvg} /> {t('profile')}</Link>
              <Link href="/orders" className={styles.mobileLink}><FontAwesomeIcon icon={faCreditCard} className={styles.smallIcon} /> {t('myOrders')}</Link>
              <Link href="/history" className={styles.mobileLink}><FontAwesomeIcon icon={faIdCard} className={styles.smallIcon} /> {t('navigation.history')}</Link>
              <Link href="/wishlist" className={styles.mobileLink}><HeartIcon className={styles.iconSvg} /> {t('wishlist.title')}</Link>
              <Link href="/reviews" className={styles.mobileLink}><FontAwesomeIcon icon={faPenToSquare} className={styles.smallIcon} /> {t('navigation.toReview')}</Link>
            </div>

            {isAuthenticated && (
              <button className={styles.signOutBtn} onClick={handleLogout}>
                {isLoading ? <Loader /> : t('signOut')}
              </button>
            )} 
          </div>
        </motion.div>
      )}
    </nav>
  );
});

export default Navbar;