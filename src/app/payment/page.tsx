import BillingInfo from "./components/BillingInfo";
import Cart from "./components/Cart";

const PaymentPage = () => {

  return (
    <div className="min-h-screen mt-24 flex flex-col">

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
};

export default PaymentPage;