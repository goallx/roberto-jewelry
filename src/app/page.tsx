import Hero from "@/components/hero/Hero";
import { Awards } from "@/components/awards/Awards";
import CreativeVision from "@/components/creative-vision/CreativeVision";
import RingsCollection from "@/components/rings-collection/RingsCollection";
import ReviewsComponent from "@/components/reviews/reviews.component";
import JewelryShowcase from "@/components/jewelry-showcase/JewelryShowcase";

export default async function HomePage() {
  return (
    <>
      <Hero />
      <Awards />
      <JewelryShowcase />
      <CreativeVision />
      <RingsCollection />
      <ReviewsComponent />
    </>
  );
}