'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './ProfileForm.module.css';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Updated to match IProfile structure from your store
interface IProfile {
  phoneNumber?: string;
  address?: {
    city: string;
    zip: string;
    country: string;
    street: string;
  } | null;
  dateOfBirth?: string;
}

interface ProfileFormProps {
  user: User;
  profile: IProfile | null;
  onUpdate: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Extract address properties or use empty strings
  const address = profile?.address || { city: '', zip: '', country: '', street: '' };
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: profile?.phoneNumber || '',
    street: address.street || '',
    city: address.city || '',
    country: address.country || '',
    postalCode: address.zip || '',
    dateOfBirth: profile?.dateOfBirth || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Prepare data in IProfile format
      const profileData = {
        phoneNumber: formData.phoneNumber,
        address: {
          street: formData.street,
          city: formData.city,
          zip: formData.postalCode,
          country: formData.country
        },
        dateOfBirth: formData.dateOfBirth
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Profile updated:', profileData);
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const address = profile?.address || { city: '', zip: '', country: '', street: '' };
    
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: profile?.phoneNumber || '',
      street: address.street || '',
      city: address.city || '',
      country: address.country || '',
      postalCode: address.zip || '',
      dateOfBirth: profile?.dateOfBirth || ''
    });
    setIsEditing(false);
  };

  return (
    <div className={styles.profileForm}>
      <div className={styles.formHeader}>
        <h2>Personal Information</h2>
        {!isEditing && (
          <button 
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="firstName">First Name</label>
            <div className={styles.inputWithIcon}>
              <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? styles.disabled : ''}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="lastName">Last Name</label>
            <div className={styles.inputWithIcon}>
              <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? styles.disabled : ''}
              />
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email Address</label>
          <div className={styles.inputWithIcon}>
            <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={true}
              className={styles.disabled}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phoneNumber">Phone Number</label>
          <div className={styles.inputWithIcon}>
            <FontAwesomeIcon icon={faPhone} className={styles.inputIcon} />
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
              className={!isEditing ? styles.disabled : ''}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            disabled={!isEditing}
            className={!isEditing ? styles.disabled : ''}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="street">Street Address</label>
          <div className={styles.inputWithIcon}>
            <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.inputIcon} />
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              disabled={!isEditing}
              className={!isEditing ? styles.disabled : ''}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!isEditing}
              className={!isEditing ? styles.disabled : ''}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={!isEditing}
              className={!isEditing ? styles.disabled : ''}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              disabled={!isEditing}
              className={!isEditing ? styles.disabled : ''}
            />
          </div>
        </div>

        {isEditing && (
          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;