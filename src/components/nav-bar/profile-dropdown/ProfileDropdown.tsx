import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileLines,
  faEye,
  faHeart,
  faComment,
  faUserCircle,
} from '@fortawesome/free-regular-svg-icons';
import { Loader } from '@/components/loader/Loader';
import styles from './ProfileDropdown.module.css';

interface ProfileDropdownProps {
  isOpen: boolean;
  user: any;
  profileStore: any;
  isLoading: boolean;
  onLogout: () => void;
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  user,
  profileStore,
  isLoading,
  onLogout,
  onClose,
}) => {
  const router = useRouter();
  
  if (!isOpen) return null;

  const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');
  const fullName = `${capitalize(user?.firstName || '')} ${capitalize(user?.lastName || '')}`.trim();

  const handleProfileClick = () => {
    router.push('/profile');
    onClose();
  };

  return (
    <div className={styles.profileDropdown}>
      {/* Frosted glass background overlay */}
      <div className={styles.frostedGlass}></div>
      
      {/* Content container */}
      <div className={styles.dropdownContent}>
        {/* User Header Section with Profile Picture - Clickable */}
        <div className={styles.userHeader} onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
          <div className={styles.profileImageContainer}>
            {user?.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt="Profile" 
                className={styles.profileImage}
              />
            ) : (
              <FontAwesomeIcon icon={faUserCircle} className={styles.profilePlaceholder} />
            )}
          </div>
          <h3 className={styles.userName}>{fullName || 'User Name'}</h3>
        </div>

        <div className={styles.separator} />

        {/* Navigation Links */}
        <div className={styles.navigationSection}>
          <nav className={styles.navMenu}>
            {/* Changed to /my-orders */}
            <Link href="/my-orders" className={styles.navItem} onClick={onClose}>
              <FontAwesomeIcon icon={faFileLines} className={styles.navIcon} />
              <span>My Orders</span>
            </Link>
            
            <Link href="/history" className={styles.navItem} onClick={onClose}>
              <FontAwesomeIcon icon={faEye} className={styles.navIcon} />
              <span>History</span>
            </Link>
            
            <Link href="/wishlist" className={styles.navItem} onClick={onClose}>
              <FontAwesomeIcon icon={faHeart} className={styles.navIcon} />
              <span>Wishlist</span>
            </Link>
            
            <Link href="/reviews" className={styles.navItem} onClick={onClose}>
              <FontAwesomeIcon icon={faComment} className={styles.navIcon} />
              <span>To Review</span>
            </Link>
          </nav>
        </div>

        <div className={styles.separator} />

        {/* Logout Section */}
        <div className={styles.logoutSection}>
          <button 
            className={styles.logoutButton} 
            onClick={onLogout} 
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader />
            ) : (
              <span>Sign Out</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;