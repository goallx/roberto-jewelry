'use client';

import React from 'react';
import Image from 'next/image';

// Placeholder orders data with images
const orders = [
  {
    id: 1,
    orderNumber: '6794239bc6a67f8b8ef51f3d2c',
    itemsCount: 6,
    total: 792,
    date: 'Jan 12, 2025',
    image: '/images/silver-ring.jpg', // Custom image for ring
  },
  {
    id: 2,
    orderNumber: '6794239bc6a67f8b8ef51f3d2c',
    itemsCount: 4,
    total: 420,
    date: 'Feb 20, 2025',
    image: '/images/necklace-homepage-card.png', // Custom image for necklace
  },
  {
    id: 3,
    orderNumber: '6794239bc6a67f8b8ef51f3d2c',
    itemsCount: 3,
    total: 1350,
    date: 'Mar 15, 2025',
    image: '/images/diamond-drop-earrings.jpg', // Custom image for earrings
  },
];

const OrdersPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-8"> {/* Added padding to prevent navbar overlap */}
      {/* Orders Section */}
      <div className="w-full max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-semibold mb-8">My Orders</h1>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#F2F2F2] rounded-lg shadow-md p-6 flex flex-col lg:flex-row justify-between items-center" // Layout with flexbox for responsive design
            >
              {/* Left Column (Order Number, Items Count) */}
              <div className="flex flex-col items-start w-full lg:w-1/4 mb-4 lg:mb-0">
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Order Number:</strong> {order.orderNumber}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Items:</strong> {order.itemsCount} items
                </div>
              </div>

              {/* Image */}
              <div className="flex justify-center items-center w-1/2 mb-4 lg:mb-0">
                <Image
                  src={order.image}
                  alt="Product"
                  width={120}
                  height={120}
                  className="object-cover rounded-md"
                />
              </div>

              {/* Right Column (Date, Total Price) */}
              <div className="flex flex-col items-end w-full lg:w-1/4 mb-4 lg:mb-0">
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Date:</strong> {order.date}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Total:</strong> ${order.total.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
