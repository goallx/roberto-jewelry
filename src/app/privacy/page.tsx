"use server";

const page = () => {
  return (
    <div className="w-full my-28 min-h-screen flex flex-col px-4 items-center">
      {/* Privacy Policy Section */}
      <section className="w-full md:w-[80%] lg:w-[60%] mb-14">
        <h1 className="font-amandine text-2xl sm:text-3xl font-extrabold text-center mb-8">
          Privacy Policy
        </h1>
        <pre className="mb-10 text-sm sm:text-base">
          Effective Date: [02/05/2025] <br />
          Business Name: Roberto Jewelry LLC <br />
          Address: Salezian St 35, Nazareth, Israel <br />
          Email: info@robertojewelry.com <br />
          Phone: +972 52 566 3705
        </pre>
        <ol className="list-decimal pl-5 space-y-6 font-bold text-lg sm:text-xl">
          <li>
            Information We Collect
            <p className="font-light text-base sm:text-lg">
              We collect only the necessary information required to provide our
              services. This includes:
            </p>
            <ul className="list-disc pl-9 font-light text-base sm:text-lg">
              <li>
                Personal Information: Name, email address, shipping address
                (collected during order placement or membership registration).
              </li>
              <li>
                Automatic Data Collection: Basic cookies used for website
                functionality. No tracking or third-party marketing cookies are
                used.
              </li>
            </ul>
            <p className="font-light text-base sm:text-lg">
              We do not store or process payment information. Payments are
              securely handled by third-party payment processors.
            </p>
          </li>
          <li>
            How We Use Your Information
            <p className="font-light text-base sm:text-lg">
              We use your personal data only for:
            </p>
            <ul className="list-disc pl-9 font-light text-base sm:text-lg">
              <li>Processing and delivering orders.</li>
              <li>Providing customer service.</li>
              <li>Sending marketing emails only with your explicit consent.</li>
            </ul>
          </li>
          <li>
            Data Protection & Security
            <p className="font-light text-base sm:text-lg">
              We ensure your data is protected through SSL encryption and secure
              storage. No customer data is shared with third parties.
            </p>
          </li>
          <li>
            Customer Rights
            <p className="font-light text-base sm:text-lg">
              You have the right to access, update, or delete your personal
              information. To request changes, contact us at
              info@robertojewelry.com.
            </p>
          </li>
          <li>
            Compliance
            <p className="font-light text-base sm:text-lg">
              Roberto Jewelry complies with Israeli Consumer Protection Laws,
              GDPR (for EU customers), and U.S. consumer laws.
            </p>
          </li>
        </ol>
      </section>

      {/* Disclaimer Section */}
      <section className="w-full md:w-[80%] lg:w-[60%] mb-14">
        <h1 className="font-amandine text-2xl sm:text-3xl font-extrabold text-center mb-8">
          Disclaimer
        </h1>
        <ol className="list-decimal pl-5 space-y-6 font-bold text-lg sm:text-xl">
          <li>
            Product Authenticity & Materials
            <ul className="list-disc pl-9 font-light text-base sm:text-lg">
              <li>
                All jewelry is handmade and crafted from 100% first-grade gold.
              </li>
              <li>Every piece comes with a lifetime warranty.</li>
              <li>
                As all items are handmade, slight variations in craftsmanship
                may occur.
              </li>
            </ul>
          </li>
          <li>
            Liability & Allergies
            <ul className="list-disc pl-9 font-light text-base sm:text-lg">
              <li>
                We guarantee the purity of our gold but cannot predict or be
                held liable for allergic reactions.
              </li>
              <li>
                Jewelry must be handled with care. We are not responsible for
                damages caused by improper use, exposure to harsh chemicals, or
                accidents.
              </li>
            </ul>
          </li>
          <li>
            Custom Orders & Engravings
            <ul className="list-disc pl-9 font-light text-base sm:text-lg">
              <li>
                All custom and engraved orders are made per the client’s
                request.
              </li>
              <li>
                Once customized, the item cannot be returned or exchanged unless
                defective.
              </li>
            </ul>
          </li>
          <li>
            Warranty & Repairs
            <ul className="list-disc pl-9 font-light text-base sm:text-lg">
              <li>
                Our lifetime warranty covers craftsmanship defects but does not
                cover normal wear and tear.
              </li>
              <li>
                If repairs are needed due to non-manufacturing defects, charges
                may apply.
              </li>
            </ul>
          </li>
        </ol>
      </section>

      {/* Shipping & Return Policy Section */}
      <section className="w-full md:w-[80%] lg:w-[60%] mb-14">
        <h1 className="font-amandine text-2xl sm:text-3xl font-extrabold text-center mb-8">
          Shipping & Return Policy
        </h1>
        <ol className="list-decimal pl-5 space-y-6 font-bold text-lg sm:text-xl">
          <li>
            Shipping Information
            <ul className="list-disc pl-9 font-light text-base sm:text-lg">
              <li>
                We offer global shipping via FedEx, DHL, and other premium
                carriers.
              </li>
              <li>Shipping is included in the product price—no extra costs.</li>
              <li>Processing time: 3-8 business days.</li>
              <li>
                Shipping time: 4-10 business days, depending on the destination.
              </li>
              <li>All shipments are insured against loss or damage.</li>
              <li>
                Upon delivery, customers must sign for the package—once
                received, Roberto Jewelry is no longer responsible for loss or
                theft.
              </li>
            </ul>
          </li>
          <li>
            Customs & Duties
            <ul className="list-disc pl-9 font-light text-base sm:text-lg">
              <li>
                To our knowledge, no additional customs fees apply to our
                shipments. However, customers are responsible for verifying
                local regulations.
              </li>
            </ul>
          </li>
          <li>
            Order Cancellations
            <ul className="list-disc pl-9 font-light text-base sm:text-lg">
              <li>
                Cancellations are accepted only within 48 hours of purchase.
              </li>
              <li>
                Custom or engraved orders cannot be canceled after production
                starts.
              </li>
            </ul>
          </li>
          <li>
            Returns & Refunds
            <ul className="list-disc pl-9 font-light text-base sm:text-lg">
              <li>Return Period: 14 days from delivery.</li>
              <li>
                Items must be unused, in original condition and packaging.
              </li>
              <li>Custom-made and engraved jewelry cannot be returned.</li>
              <li>
                Refund Process: Once we receive and inspect the returned item,
                refunds are processed within 14 days.
              </li>
              <li>
                Customers are responsible for return shipping costs unless the
                item is defective.
              </li>
            </ul>
          </li>
        </ol>
      </section>

      {/* Contact Section */}
      <section className="w-full md:w-[80%] lg:w-[60%] mb-14">
        <h1 className="font-amandine text-2xl sm:text-3xl font-extrabold text-center mb-8">
          For Any Inquiries, Please Contact Us At:
        </h1>
        <div className="flex flex-col space-y-10 sm:space-y-0 sm:flex-row sm:justify-evenly font-semibold">
          <a
            className="flex flex-col justify-center items-center mb-6 sm:mb-0"
            href="tel:+972525663705"
          >
            <img
              className="size-12 sm:size-16 mb-3"
              src="https://firebasestorage.googleapis.com/v0/b/roberto-jewerly.firebasestorage.app/o/svg%2Fphone.svg?alt=media&token=948522c9-e9ad-45d4-b96e-2615cd80cd26"
              alt="Phone"
            />
            <span className="text-sm sm:text-base">+972 52 566 3705</span>
          </a>
          <a
            className="flex flex-col justify-center items-center mb-6 sm:mb-0"
            href="https://www.google.com/maps/place/%D7%A1%D7%9C%D7%96%D7%99%D7%90%D7%9F+35,+%D7%A0%D7%A6%D7%A8%D7%AA%E2%80%AD/@32.7100079,35.2989464,14.67z/data=!4m6!3m5!1s0x151c4c28d713e9b5:0x442fe90d5de77ff6!8m2!3d32.7090195!4d35.2978154!16s%2Fg%2F11f6y9g7zr?entry=ttu&g_ep=EgoyMDI1MDIwNS4xIKXMDSoASAFQAw%3D%3D"
            target="_blank"
          >
            <img
              className="size-12 sm:size-16 mb-3"
              src="https://firebasestorage.googleapis.com/v0/b/roberto-jewerly.firebasestorage.app/o/svg%2Flocation.svg?alt=media&token=4aeb2a84-1400-452a-a57d-7de38321d1c0"
              alt="Location"
            />
            <span className="text-sm sm:text-base text-center">
              Salezian St 35, Nazareth, Israel
            </span>
          </a>
          <a
            className="flex flex-col justify-center items-center mb-6 sm:mb-0"
            href="mailto:info@robertojewelry.com"
          >
            <img
              className="size-12 sm:size-16 mb-3"
              src="https://firebasestorage.googleapis.com/v0/b/roberto-jewerly.firebasestorage.app/o/svg%2Fmail.svg?alt=media&token=460c915e-5a85-48ae-9f70-95bf77ab2a50"
              alt="Mail"
            />
            <span className="text-sm sm:text-base">info@robertojewelry.com</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default page;