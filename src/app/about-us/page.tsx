"use server";

import Image from "next/image";

const img =
  "https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Fabout-us-img.png?alt=media&token=07889f5a-0828-4a31-8f6b-00d830f5d4a1";

const AboutUs = () => {
  return (
    <div className="min-h-screen mt-36 px-4 lg:px-14 text-center flex flex-col justify-start items-center gap-24">
      <section className="flex flex-col justify-start items-center gap-7 w-auto">
        <h1 className="font-amandine text-3xl font-bold">About us</h1>
        <div className="flex flex-col lg:flex-row items-center justify-evenly gap-5 w-3/4">
          <div className="lg:w-1/2 w-full flex justify-center">
            <Image
              width={400}
              height={400}
              src={img}
              alt="about-us-img"
              priority
            />
          </div>

          <div className="lg:w-1/2 w-full text-left h-full self-start">
            <p className="text-gray-f leading-7">
              At Roberto Jewelry, every piece is personal. We come from a long
              tradition of craftsmanship in the Nijem family, where
              jewelry making is more than a skill it’s a way of life. Passed
              down through three generations, this tradition began in Nazareth,
              a city known for its rich history and artistry.

              Founded by Viktor Nijem Senior, his Grandfather, Roberto Jewelry
              brings a modern touch to this heritage. Viktor’s grandfather, a
              skilled craftsman who worked for decades in the field in a known
              custom made crafts for jewelry and gold called Qatuf, inspired a
              love for creating jewelry that lasts a lifetime. Today, Viktor
              combines time honored techniques with a fresh, thoughtful approach
              to design, making each piece feel special and unique with awards
              from world renowned clubs and associations to prove his passion
              for crafting unique one of a kind pieces.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-start items-center gap-10 w-[90vw] mx-auto md:w-[70vw]">
        <h1 className="font-amandine text-3xl md:text-4xl font-bold text-center">
          What We Believe
        </h1>
        <p className="self-start text-center md:text-left">
          Jewelry should go beyond beauty it should be as unique as you are.
          At Roberto, we focus on:
        </p>

        <div className="flex flex-col justify-start items-center gap-10 md:gap-10 md:justify-between md:flex-row w-full">
          <div className="flex flex-col gap-4">
            <div className="text-lg md:text-2xl border-l-8 border-[rgba(140,52,2,1)] h-auto flex items-center pl-4 w-full text-start">
              ONE-OF-A-KIND
              <br />
              CRAFTSMANSHIP
            </div>
            <div className="text-base font-extralight md:text-base border-l-2 border-black h-24 flex items-start pl-5 w-full text-start">
              Every piece is custom made by hand, ensuring it’s truly yours.
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-lg md:text-2xl border-l-8 border-[rgba(167,95,55,1)] h-auto flex items-center pl-4 w-full text-start">
              QUALITY
              <br />
              MATERIALS
            </div>
            <div className="text-base font-extralight md:text-base border-l-2 border-black h-24 flex items-start pl-5 w-full text-start">
              Using solid gold, natural gems, and responsibly sourced diamonds
              to create jewelry that lasts.
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-lg md:text-2xl border-l-8 border-[rgba(242,116,5,1)] h-auto flex items-center pl-4 w-full text-start">
              PERSONAL
              <br />
              CONNECTION
            </div>
            <div className="text-base font-extralight md:text-base border-l-2 border-black h-24 flex items-start pl-5 w-full text-start">
              Designs that incorporate meaningful details, like calligraphy, to
              celebrate your individuality.
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-start items-center gap-10 w-[90vw] mx-auto md:w-[60vw]">
        <h1 className="font-amandine text-3xl md:text-4xl font-bold text-center">
          Recognitions and Achievements
        </h1>
        <div className="flex flex-col justify-start gap-5 items-center md:flex-row md:justify-center md:gap-10">
          <div className="flex-[0.5] text-left flex flex-col gap-3 text-base font-extralight">
            <p>
              Viktor’s passion for craftsmanship and innovation has earned him
              recognition from some of the most prestigious organizations in the
              world of fine jewelry:
            </p>
            <ul className="flex flex-col gap-3 list-disc pl-5">
              <li>
                A’ Design Award Winner (2018-2019): Celebrated for the Global
                Warming Ring, a design that masterfully blends artistry with a
                powerful message of sustainability.
              </li>
              <li>
                Membership in Esteemed Associations: Viktor’s contributions to
                innovation and craftsmanship have been acknowledged by leading
                organizations such as the International Society of Product
                Manufacturers, the Design Association, and the World Design
                Consortium.
              </li>
              <li>
                Honored by the International Council of Creative Industries
                Design: Recognized for redefining sustainable and artistic
                jewelry, pushing the boundaries of design and creativity.
              </li>
            </ul>
          </div>
          <div className="flex flex-[0.5] flex-wrap gap-5 justify-evenly items-center">
            <Image
              width={150}
              height={150}
              className="object-contain md:grayscale md:hover:grayscale-0 transition duration-300"
              alt="award-1"
              src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Fa%20aard.png?alt=media&token=02e1d8e6-a514-4684-83a2-e38dfc8f35ea"
            />
            <Image
              width={150}
              height={150}
              className="object-contain md:grayscale md:hover:grayscale-0 transition duration-300"
              alt="award-2"
              src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Fbest.png?alt=media&token=64d3362d-d7f0-4930-9652-b4bb3f0b9c2c"
            />
            <Image
              width={150}
              height={150}
              className="object-contain md:grayscale md:hover:grayscale-0 transition duration-300"
              alt="award-3"
              src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Fdac.png?alt=media&token=ab78149c-0e84-45e1-a0a2-0d61bb98b30a"
            />
            <Image
              width={150}
              height={150}
              className="object-contain md:grayscale md:hover:grayscale-0 transition duration-300"
              alt="award-4"
              src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2FDesign%20Club.png?alt=media&token=24e098a2-9f84-44e2-89e8-2d749aec96a5"
            />
            <Image
              width={150}
              height={150}
              className="object-contain md:grayscale md:hover:grayscale-0 transition duration-300"
              alt="award-5"
              src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2FISPM.png?alt=media&token=7cb58c20-3619-497c-b738-b461609516cf"
            />
            <Image
              width={150}
              height={150}
              className="object-contain md:grayscale md:hover:grayscale-0 transition duration-300"
              alt="award-6"
              src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2FR.png?alt=media&token=88f4f069-772f-4b7b-94c6-d9346a8eb608"
            />
            <Image
              width={150}
              height={150}
              className="object-contain md:grayscale md:hover:grayscale-0 transition duration-300"
              alt="award-7"
              src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2FW.png?alt=media&token=793948ee-6306-4498-a3c3-2214e4f58a92"
            />
            <Image
              width={150}
              height={150}
              className="object-contain md:grayscale md:hover:grayscale-0 transition duration-300"
              alt="icci-logo"
              src="/image/icci.png"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Roberto */}
      <section className="flex flex-col justify-start items-center gap-10 w-[90vw] mx-auto md:w-[60vw] mb-40">
        <h1 className="font-amandine text-3xl md:text-4xl font-bold text-center">
          Why Choose Roberto?
        </h1>
        <div className="flex flex-col justify-start gap-5 items-center md:flex-row md:justify-center md:gap-10">
          <div className="flex flex-[0.4] flex-col items-center justify-center">
            <Image
              width={150}
              height={150}
              src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2FRRRLOGO.png?alt=media&token=cef283ed-6b48-48bd-bf35-1f06249b93e4"
              alt="RRR Logo"
            />
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Froberto-logo-2.png?alt=media&token=0983bebe-a48b-4a69-9583-01bb56d4f325"
              alt="Roberto Jewelry Logo"
              width={70}
              height={30}
              priority
            />
          </div>
          <div className="flex flex-[0.6] text-left text-base font-extralight leading-6">
            When you choose Roberto Jewelry, you’re choosing more than a piece
            of jewelry you’re choosing a story, a connection, and a reflection
            of who you are. Each creation is designed with care, made to
            celebrate life’s special moments, and crafted to be as unique as the
            person who wears it.

            At Roberto, we don’t just make jewelry we make your jewelry.
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
