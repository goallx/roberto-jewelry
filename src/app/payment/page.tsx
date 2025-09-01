'use client';

import { useState, useEffect } from 'react'; // Add useEffect
import Image from 'next/image';
import { MinusOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Cart from './components/Cart';

interface CartItem {
  id: number;
  nameKey: string; // Change from name to nameKey
  price: number;
  quantity: number;
  material: string;
  size: number;
  image: string;
}

const PaymentPage = () => {
  const { t, i18n } = useTranslation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Initialize cart items after component mounts to ensure translations are available
  useEffect(() => {
    setCartItems([
      {
        id: 1,
        nameKey: 'payment.products.product1.name', // Use translation key instead of hardcoded name
        price: 1000,
        quantity: 1,
        material: t('payment.materials.gold', 'Gold'),
        size: 9,
        image: '/images/product1.jpg'
      },
      {
        id: 2,
        nameKey: 'payment.products.product2.name',
        price: 1000,
        quantity: 1,
        material: t('payment.materials.gold', 'Gold'),
        size: 9,
        image: '/images/product2.jpg'
      },
      {
        id: 3,
        nameKey: 'payment.products.product3.name',
        price: 1000,
        quantity: 1,
        material: t('payment.materials.gold', 'Gold'),
        size: 9,
        image: '/images/product3.jpg'
      }
    ]);
  }, [t]); // Re-initialize when translation function changes

  // Update material translations when language changes
  useEffect(() => {
    setCartItems(prevItems =>
      prevItems.map(item => ({
        ...item,
        material: t('payment.materials.gold', 'Gold')
      }))
    );
  }, [i18n.language, t]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb - Moved down with more padding */}
      <div className="bg-gray-50 pt-32 pb-4">
        <div className="container mx-auto px-6">
          <div className="text-sm text-gray-500">
            {t('payment.breadcrumb', 'Home / Cart / Payment')}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-8 bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Billing Info & Credit Card */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Billing Information */}
              <div>
                <h1 className="text-2xl font-amandine mb-6">
                  {t('payment.billingInfo.title', 'Billing info')}
                </h1>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('payment.billingInfo.firstName', 'First Name')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('payment.billingInfo.lastName', 'Last Name')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('payment.billingInfo.city', 'City')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('payment.billingInfo.zipCode', 'ZIP Code')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('payment.billingInfo.country', 'Country')}
                  </label>
                  <select className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black">
                    <option value="">{t('payment.billingInfo.chooseCountry', 'Choose country')}</option>
                    <option value="United States">{t('payment.countries.usa', 'United States')}</option>
                    <option value="United Kingdom">{t('payment.countries.uk', 'United Kingdom')}</option>
                    <option value="Israel">{t('payment.countries.israel', 'Israel')}</option>
                  </select>
                </div>
              </div>

              {/* Credit Card Information */}
              <div>
                <h1 className="text-2xl font-amandine mb-6">
                  {t('payment.creditCard.title', 'Credit Card Info')}
                </h1>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('payment.creditCard.cardNumber', 'Card Number')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder={t('payment.creditCard.cardNumberPlaceholder', '1234 5678 9012 3456')}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('payment.creditCard.cardHolder', 'Card Holder Name')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder={t('payment.creditCard.cardHolderPlaceholder', 'John Doe')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('payment.creditCard.expiryDate', 'Expires Date')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder={t('payment.creditCard.expiryPlaceholder', 'MM/YY')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('payment.creditCard.cvv', 'CVV')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder={t('payment.creditCard.cvvPlaceholder', '123')}
                    />
                  </div>
                </div>

                <button className="w-full bg-black text-white py-3 px-4 hover:bg-gray-800 transition-colors mb-6">
                  {t('payment.confirmOrder', 'Confirm Your Order')}
                </button>

                <div className="flex items-center mb-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 text-sm text-gray-500">
                    {t('payment.orPayWith', 'Or Pay With')}
                  </span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Payment buttons stacked vertically */}
                <div className="flex flex-col gap-4">
                  <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Image
                      src="/icons/A Pay.svg"
                      alt={t('payment.applePay', 'Apple Pay')}
                      width={50}
                      height={50}
                    />
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Image
                      src="/icons/G Mark.svg"
                      alt={t('payment.googlePay', 'Google Pay')}
                      width={30}
                      height={20}
                    />
                    <span>{t('payment.pay', 'Pay')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Cart />
        </div>
      </div>
    </div>
  );
}


export default PaymentPage
