import ReviewCard, { IReview } from "./ReviewCard";

const reviews: IReview[] = [
  {
    review:
      "The most beautiful engagement ring I’ve ever seen. The craftsmanship is absolutely extraordinary.",
    name: "Sarah Johnson",
    location: "Beverly Hills, CA",
  },
  {
    review:
      "Roberto created a custom necklace for my wife's anniversary. The attention to detail was incredible.",
    name: "Michael Chen",
    location: "Manhattan, NY",
  },
  {
    review:
      "Outstanding service and quality. My custom earrings exceeded all expectations.",
    name: "Emily Rodriguez",
    location: "Miami, FL",
  },
];

const ReviewsComponent = () => {
  return (
    <div 
      className="pt-6 pb-3 px-6 text-center"
      style={{ backgroundColor: "#F5F3EFCC" }}
    >
      <h2 className="font-amandine text-3xl font-semibold tracking-wide mb-2">
        What Our Clients Say
      </h2>
      <p className="text-sm text-gray-600 mb-12">
        Hear from those who have experienced the Roberto difference.
      </p>

      {/* Review cards section */}
      <div className="flex flex-wrap justify-center gap-6">
        {reviews.map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewsComponent;