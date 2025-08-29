import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import ReviewCard, { IReview } from "./ReviewCard";

const ReviewsComponent = () => {
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);
  
  // Detect if current language is RTL
  useEffect(() => {
    setIsRTL(i18n.language === 'he');
  }, [i18n.language]);

  const reviews: IReview[] = [
    {
      reviewKey: "reviews.review1.text",
      nameKey: "reviews.review1.name",
      locationKey: "reviews.review1.location",
    },
    {
      reviewKey: "reviews.review2.text",
      nameKey: "reviews.review2.name",
      locationKey: "reviews.review2.location",
    },
    {
      reviewKey: "reviews.review3.text",
      nameKey: "reviews.review3.name",
      locationKey: "reviews.review3.location",
    },
  ];

  return (
    <div 
      className="pt-6 pb-3 px-6 text-center"
      style={{ backgroundColor: "#F5F3EFCC" }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <h2 className="font-amandine text-3xl font-semibold tracking-wide mb-2">
        {t('reviews.title', 'What Our Clients Say')}
      </h2>
      <p className="text-sm text-gray-600 mb-12">
        {t('reviews.subtitle', 'Hear from those who have experienced the Roberto difference.')}
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