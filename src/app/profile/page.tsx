'use client';

import React from 'react';
import styles from './profile.module.css';

const ProfilePage = () => {
  return (
    <div className={styles.profileContainer}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <span>Home</span>
        <span>/</span>
        <span>Profile</span>
      </div>

      <div className={styles.profileForm}>
        {/* Left Section */}
        <div className={styles.formSection}>
          {/* Name Field */}
          <h3 className={styles.sectionTitle}>Name</h3>
          <div className={styles.fieldGroup}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>First Name</label>
                <input type="text" defaultValue="John" />
              </div>
              <div className={styles.inputGroup}>
                <label>Last Name</label>
                <input type="text" defaultValue="Doe" />
              </div>
            </div>
            <button className={styles.updateButton}>Update</button>
          </div>

          {/* Email Field */}
          <h3 className={styles.sectionTitle}>E-mail</h3>
          <div className={styles.fieldGroup}>
            <div className={styles.currentValue}>Username: johndoe@gmail.com</div>
            <div className={styles.inputGroup}>
              <label>The New Email Address</label>
              <input type="email" placeholder="Enter new email" />
            </div>
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />
            </div>
            <button className={styles.updateButton}>Update</button>
          </div>

          {/* Password Field */}
          <h3 className={styles.sectionTitle}>Password</h3>
          <div className={styles.fieldGroup}>
            <div className={styles.inputGroup}>
              <label>The Current Password</label>
              <input type="password" placeholder="Enter current password" />
            </div>
            <div className={styles.inputGroup}>
              <label>The New Password</label>
              <input type="password" placeholder="Enter new password" />
            </div>
            <div className={styles.inputGroup}>
              <label>The New Password Confirmation</label>
              <input type="password" placeholder="Confirm new password" />
            </div>
            <button className={styles.updateButton}>Update</button>
          </div>
        </div>

        {/* Right Section */}
        <div className={styles.formSection}>
          {/* Phone Number Field */}
          <h3 className={styles.sectionTitle}>Phone Number</h3>
          <div className={styles.fieldGroup}>
            <div className={styles.currentValue}>Current: *972500000000</div>
            <div className={styles.inputGroup}>
              <label>The New Phone Number</label>
              <input type="tel" placeholder="Enter new phone number" />
            </div>
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />
            </div>
            <button className={styles.updateButton}>Update</button>
          </div>

          {/* Date of Birth Field */}
          <h3 className={styles.sectionTitle}>Date of Birth</h3>
          <div className={styles.fieldGroup}>
            <div className={styles.currentValue}>Current: 00-00-0000</div>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Day</label>
                <input type="text" placeholder="DD" />
              </div>
              <div className={styles.inputGroup}>
                <label>Month</label>
                <input type="text" placeholder="MM" />
              </div>
              <div className={styles.inputGroup}>
                <label>Year</label>
                <input type="text" placeholder="YYYY" />
              </div>
            </div>
            <button className={styles.updateButton}>Update</button>
          </div>

          {/* Shipping Address Field */}
          <h3 className={styles.sectionTitle}>Shipping Address</h3>
          <div className={styles.fieldGroup}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>First Name</label>
                <input type="text" defaultValue="John" />
              </div>
              <div className={styles.inputGroup}>
                <label>Second Name</label>
                <input type="text" defaultValue="Doe" />
              </div>
            </div>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>City</label>
                <input type="text" defaultValue="New York" />
              </div>
              <div className={styles.inputGroup}>
                <label>ZIP Code</label>
                <input type="text" defaultValue="10001" />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Country</label>
              <select>
                <option>Select Country</option>
                <option>USA</option>
                <option>UK</option>
                <option>Israel</option>
                <option>Europe</option>
              </select>
            </div>
            <button className={styles.updateButton}>Update</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;