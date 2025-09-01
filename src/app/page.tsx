import Hero from "@/components/hero/Hero";
import { Awards } from "@/components/awards/Awards";
import Link from "next/link";
import Image from 'next/image'
import CreativeVision from "@/components/creative-vision/CreativeVision";
import RingsCollection from "@/components/rings-collection/RingsCollection";
import ReviewsComponent from "@/components/reviews/reviews.component";


export default async function HomePage() {
  return (
    <>
      <Hero />
      <Awards />
      <section className="py-12 px-6" style={{ backgroundColor: "#F5F3EFCC" }}>
        <div className="flex justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
          {[
            {
              href: "/collections?category=necklace",
              src: "/image/necklace-homepage-card.png",
              alt: "Necklace",
            },
            {
              href: "/collections?category=rings",
              src: "/image/rings-homepage-card.png",
              alt: "Rings",
            },
            {
              href: "/collections?category=earrings",
              src: "/image/earrings-homepage-card.png",
              alt: "Earrings",
            },
          ].map(({ href, src, alt }) => (
            <Link
              prefetch
              key={alt}
              href={href}
              className="relative block w-1/3 aspect-[3/4] overflow-hidden group transition-all duration-300 hover:-translate-y-2"
            >
              <Image
                src={src}
                alt={alt} 
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </Link>
          ))}
        </div>
      </section>
      <CreativeVision />
      <RingsCollection />
      <ReviewsComponent />
    </>
  )
}
