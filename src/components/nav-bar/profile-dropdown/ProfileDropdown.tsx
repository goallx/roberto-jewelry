'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faHeart, faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { Loader } from '@/components/loader/Loader';
import styles from './ProfileDropdown.module.css';
import { useTranslation } from 'react-i18next';

interface ProfileDropdownProps {
  isOpen: boolean;
  user: any;
  isLoading: boolean;
  onLogout: () => void;
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, user, isLoading, onLogout, onClose }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  if (!isOpen) return null;

  const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');
  const fullName = `${capitalize(user?.firstName || '')} ${capitalize(user?.lastName || '')}`.trim();

  const handleProfileClick = () => {
    router.push('/profile');
    onClose();
  };

  const isRTL = i18n.language === 'he';

  return (
    <div className={styles.profileDropdown} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={styles.frostedGlass}></div>
      <div className={styles.dropdownContent}>
        {/* User Header */}
        <div
          className={styles.userHeader}
          style={{ cursor: 'pointer', textAlign: isRTL ? 'right' : 'left' }}
          onClick={handleProfileClick}
        >
          {/* Display "User Name" in English and its translation in Hebrew */}
          <h3 className={styles.userName}>
            {isRTL ? 'שם משתמש' : 'User Name'}: {fullName || ''}
          </h3>
          {/* Email under the name */}
          {user?.email && <p className="font-light text-sm">{user.email}</p>}
        </div>

        <div className={styles.separator} />

        {/* Navigation */}
        <nav className={styles.navMenu}>
          <Link
            href="/profile"
            className={styles.navItem}
            onClick={onClose}
            style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
          >
            <FontAwesomeIcon icon={faUserCircle} className={styles.navIcon} />
            <span>{t('profile')}</span>
          </Link>
          <Link
            href="/my-orders"
            className={styles.navItem}
            onClick={onClose}
            style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
          >
            <FontAwesomeIcon icon={faFileLines} className={styles.navIcon} />
            <span>{t('myOrders')}</span>
          </Link>
          <Link
            href="/wishlist"
            className={styles.navItem}
            onClick={onClose}
            style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
          >
            <FontAwesomeIcon icon={faHeart} className={styles.navIcon} />
            <span>{t('wishlist.title')}</span> {/* Fixed: use wishlist.title instead of wishlist */}
          </Link>
        </nav>

        <div className={styles.separator} />

        {/* Logout */}
        <div className={styles.logoutSection} style={{ justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
          <button className={styles.logoutButton} onClick={onLogout} disabled={isLoading}>
            {isLoading ? <Loader /> : <span>{t('signOut')}</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;