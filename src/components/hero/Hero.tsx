import Link from 'next/link';

const Hero = () => {
  return (
    <header className="relative w-full h-[600px] md:h-[650px]">
      {/* Background Image */}
      <img
        src="/image/hero.png"
        alt="Timeless Elegance - Roberto Jewelry"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F8F8F6] via-[#F8F8F6]/50 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center h-full px-6 md:px-16 max-w-4xl ml-auto md:ml-[15%]">
        <h1 className="text-5xl md:text-6xl leading-tight text-black">
          <span className="block font-geist font-semibold">Timeless</span>
          <span className="block text-orange-500 font-amandine font-semibold">Elegance</span>
        </h1>

        <p className="mt-4 text-base text-black font-redhat font-normal max-w-md leading-relaxed">
          Discover our exquisite collection of handcrafted jewelry, where every
          piece tells a story of luxury, love, and lasting beauty.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          {/* Primary CTA - Explore Collection */}
          <Link href="/collections">
            <button className="bg-[#b16339] text-white text-sm px-10 py-1 rounded-none shadow flex items-center gap-2 font-geist font-semibold tracking-wide hover:bg-[#5a2f1a] transition-colors">
              Explore Collection
              <img src="/icons/arrow.png" alt="Arrow Icon" className="w-4 h-4" />
            </button>
          </Link>

          {/* Secondary CTA - Design Your Signature Piece */}
          <Link href="/customize">
            <button className="bg-white text-sm px-5 py-1 rounded-none shadow flex items-center gap-2 font-geist font-medium text-black hover:bg-gray-50 transition-colors">
              Design Your Signature Piece!
              {/* Smaller star icon */}
              <img
                src="/icons/dark-star.png"
                alt="Star Icon"
                className="w-3 h-3"
              />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Hero;
