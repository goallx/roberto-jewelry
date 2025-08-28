'use client';

import { useRouter } from 'next/navigation';
import BillingInfo from "./components/BillingInfo";
import Cart from "./components/Cart";
import { useStores } from "@/context/StoreContext";
import { observer } from "mobx-react-lite";

const PaymentPage = observer(() => {
  const { cartStore } = useStores();
  const router = useRouter();

  const handleRefresh = () => {
    window.location.reload();
  };

  // ⚠️ TEMPORARILY REMOVED THE EMPTY CART CHECK
  // if (!cartStore?.cart?.items || cartStore.cart.items.length === 0) {
  //   return (
  //     <div className="min-h-screen mt-24 flex items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
  //         <button 
  //           onClick={() => router.push('/')}
  //           className="bg-black text-white px-6 py-2 rounded-md"
  //         >
  //           Continue Shopping
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen mt-24 flex flex-col">
      {/* Breadcrumb with Refresh Button */}
      <div className="mt-4 px-8 flex items-center justify-between">
        <div className="text-sm text-gray-600 mb-6">
          <span>Home</span> / <span>Cart</span> / <span className="text-gray-900">Payment</span>
        </div>

        {/* Refresh Page Button */}
        <button
          onClick={handleRefresh}
          aria-label="Refresh Page"
          className="text-gray-600 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9"/>
          </svg>
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row p-6 gap-8 justify-center w-full max-w-7xl mx-auto">
        {/* Left Column - Billing Info & Credit Card */}
        <div className="flex-1 max-w-2xl">
          <BillingInfo />
        </div>
        
        {/* Right Column - Cart Summary */}
        <div className="w-full lg:w-96">
          <Cart />
        </div>
      </div>
    </div>
  );
});

export default PaymentPage;