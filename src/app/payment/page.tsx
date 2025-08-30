'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MinusOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

const PaymentPage = () => {
  const [cartItems, setCartItems] = useState([
    { 
      id: 1, 
      name: 'Product Name', 
      price: 1000, 
      quantity: 1, 
      material: 'Gold', 
      size: 9,
      image: '/images/product1.jpg'
    },
    { 
      id: 2, 
      name: 'Product Name', 
      price: 1000, 
      quantity: 1, 
      material: 'Gold', 
      size: 9,
      image: '/images/product2.jpg'
    },
    { 
      id: 3, 
      name: 'Product Name', 
      price: 1000, 
      quantity: 1, 
      material: 'Gold', 
      size: 9,
      image: '/images/product3.jpg'
    }
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? {...item, quantity: newQuantity} : item
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
            Home / Needless / Product Name / Payment Page
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
                <h1 className="text-2xl font-amandine mb-6">Billing info</h1>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Second Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black">
                    <option value="">Choose country</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Israel">Israel</option>
                  </select>
                </div>
              </div>

              {/* Credit Card Information */}
              <div>
                <h1 className="text-2xl font-amandine mb-6">Credit Card Info</h1>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expires Date</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="123"
                    />
                  </div>
                </div>
                
                <button className="w-full bg-black text-white py-3 px-4 hover:bg-gray-800 transition-colors mb-6">
                  Confirm Your Order
                </button>
                
                <div className="flex items-center mb-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 text-sm text-gray-500">Or Pay With</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
                
                {/* Payment buttons stacked vertically */}
                <div className="flex flex-col gap-4">
                  <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Image 
                      src="/icons/A Pay.svg" 
                      alt="Apple Pay" 
                      width={50} 
                      height={50} 
                    />
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Image 
                      src="/icons/G Mark.svg" 
                      alt="Google Pay" 
                      width={30} 
                      height={20} 
                    />
                    <span>Pay</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Cart Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-[#F2EFED] p-6">
              <h1 className="text-2xl font-amandine mb-6">Cart</h1>

              {/* Cart Items */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {cartItems.length === 0 ? (
                  <p className="my-4 font-light text-center">No items in the cart</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="bg-white p-4 border border-gray-200 relative">
                      {/* Delete button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                      >
                        <CloseOutlined />
                      </button>

                      <div className="flex gap-4">
                        {/* Product image */}
                        <div className="w-20 h-20 bg-gray-200 flex items-center justify-center">
                          {item.image ? (
                            <Image 
                              src={item.image} 
                              alt={item.name} 
                              width={80} 
                              height={80} 
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-medium mb-2">{item.name}</h3>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <span className="mr-2">Quantity:</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded-full hover:bg-gray-100"
                              >
                                <MinusOutlined />
                              </button>
                              <span className="mx-2">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded-full hover:bg-gray-100"
                              >
                                <PlusOutlined />
                              </button>
                            </div>

                            {item.material && (
                              <p>
                                Material: <span className="font-medium">{item.material}</span>
                              </p>
                            )}

                            <p>
                              Size: <span className="font-medium">{item.size || '-'}</span>
                            </p>
                          </div>

                          {/* Price */}
                          <p className="text-right font-semibold mt-2">
                            Price: {(item.price * item.quantity).toLocaleString('en-US')}$ 
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total */}
              <div className="border-t border-gray-300 mt-6 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold">{total.toLocaleString('en-US')}$</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
