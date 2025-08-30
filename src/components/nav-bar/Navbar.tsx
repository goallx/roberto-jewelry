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
  const { toggleLang, lang } = useLanguage()

  const { isAuthenticated, logout, user } = useAuth();

  const { cartStore, profileStore, wishlistStore } = useStores();

  const profileRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navbarRef = useRef<HTMLElement | null>(null);

  const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 100);
    };

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
      router.push('/login')
    } else {
      setProfileOpen((p) => !p);
    }
  };

  const toggleMenu = () => setMenuOpen((m) => !m);
  const toggleDropdown = () => setDropdownOpen((d) => !d);

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
        <div className={styles.hamburger} onClick={toggleMenu} role="button" aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </div>

        <div className={styles.navbarLeft}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>

          <div className={styles.jewelryWrap} ref={dropdownRef}>
            <button
              className={styles.jewelryTitle}
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
            >
              Jewelry
            </button>

            {dropdownOpen && (
              <div className={styles.dropdownMenu} role="menu" aria-label="Jewelry menu">
                {/* Frosted glass background for dropdown */}
                <div className={styles.frostedGlass}></div>

                <div className={styles.dropdownContent}>
                  <div className={styles.dropdownInner}>
                    <div className={styles.columns}>
                      <div className={styles.col}>
                        <h4>WOMEN</h4>
                        <Link href="/products?category=bracelets" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>Bracelets</Link>
                        <Link href="/products?category=earrings" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>Earrings</Link>
                        <Link href="/products?category=rings" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>Rings</Link>
                        <Link href="/products?category=necklaces" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>Necklaces</Link>
                        <Link href="/products?category=pendants" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>Pendants</Link>
                      </div>

                      <div className={styles.col}>
                        <h4>MEN</h4>
                        <Link href="/products?category=men-bracelets" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>Bracelets</Link>
                        <Link href="/products?category=men-earrings" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>Earrings</Link>
                        <Link href="/products?category=men-rings" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>Rings</Link>
                        <Link href="/products?category=men-necklaces" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>Necklaces</Link>
                        <Link href="/products?category=men-pendants" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>Pendants</Link>
                      </div>

                      <div className={styles.col}>
                        <h4>SIGNATURE</h4>
                        <Link href="/products?category=signature-bracelets" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>Bracelets</Link>
                        <Link href="/products?category=signature-earrings" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>Earrings</Link>
                        <Link href="/products?category=signature-rings" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>Rings</Link>
                        <Link href="/products?category=signature-necklaces" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>Necklaces</Link>
                        <Link href="/products?category=signature-pendants" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>Pendants</Link>
                      </div>
                    </div>

                    <div className={styles.dropdownImageWrapper}>
                      <Image
                        src="/image/dropdown.jpg"
                        alt="Jewelry collection"
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

          <Link href="/collections" className={styles.navLink}>
            Collections
          </Link>

          <Link href="/customize" className={styles.navLink}>
            Customize
          </Link>

          <Link href="/about-us" className={styles.navLink}>
            About us
          </Link>
        </div>
      </div>

      {/* LOGO (centered) */}
      <div className={styles.navbarLogo}>
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
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.navbarRight}>
        <button
          className={`${styles.langBtn} ${styles.langBtnEnhanced}`}
          onClick={toggleLang}
          aria-label="Toggle language"
        >
          <FontAwesomeIcon icon={faGlobe} className={styles.globeIcon} />
          {lang}
        </button>

        <div className={styles.profileWrap} ref={profileRef}>
          <button className={`${styles.iconBtn} ${styles.profileIcon}`} aria-label="Profile" onClick={handleProfileClick}>
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
          <button aria-label="Wishlist" className={styles.iconBtn} onClick={() => navigate('/wishlist')}>
            <Badge count={wishlistStore?.items.length} overflowCount={99}>
              <HeartIcon className={styles.iconSvg} />
            </Badge>
          </button>
        )}

        {isAuthenticated && (
          <button
            className={styles.iconBtn}
            aria-label="Cart"
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
              <li className={styles.mobileHeader}>HOME</li>

              <li className={styles.mobileHeader}>WOMEN</li>
              <li><Link href="/products?category=bracelets" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>BRACELETS</Link></li>
              <li><Link href="/products?category=earrings" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>EARRINGS</Link></li>
              <li><Link href="/products?category=rings" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>RINGS</Link></li>
              <li><Link href="/products?category=necklaces" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>NECKLACES</Link></li>

              <li className={styles.mobileHeader}>MEN</li>
              <li><Link href="/products?category=men-bracelets" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>BRACELETS</Link></li>
              <li><Link href="/products?category=men-earrings" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>EARRINGS</Link></li>
              <li><Link href="/products?category=men-rings" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>RINGS</Link></li>

              <li className={styles.mobileHeader}>SIGNATURE</li>
              <li><Link href="/products?category=signature-bracelets" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>BRACELETS</Link></li>
              <li><Link href="/products?category=signature-earrings" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>EARRINGS</Link></li>

              <li className={styles.mobileHeader}>COLLECTIONS</li>
              <li><Link href="/collections" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Collections</Link></li>
              <li><Link href="/customize" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Customise</Link></li>
              <li><Link href="/about-us" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>About us</Link></li>
            </ul>

            <div className={styles.mobileIcons}>
              <Link href="/profile" className={styles.mobileLink}><UserIcon className={styles.iconSvg} /> Profile</Link>
              <Link href="/orders" className={styles.mobileLink}><FontAwesomeIcon icon={faCreditCard} className={styles.smallIcon} /> My Orders</Link>
              <Link href="/history" className={styles.mobileLink}><FontAwesomeIcon icon={faIdCard} className={styles.smallIcon} /> History</Link>
              <Link href="/wishlist" className={styles.mobileLink}><HeartIcon className={styles.iconSvg} /> Wishlist</Link>
              <Link href="/reviews" className={styles.mobileLink}><FontAwesomeIcon icon={faPenToSquare} className={styles.smallIcon} /> To Review</Link>
            </div>

            {isAuthenticated && (
              <button className={styles.signOutBtn} onClick={handleLogout}>
                {isLoading ? <Loader /> : 'Sign Out'}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
});

export default Navbar;