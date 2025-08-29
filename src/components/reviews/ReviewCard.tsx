import { FC } from "react";
import { FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export interface IReview {
  reviewKey: string;
  nameKey: string;
  locationKey: string;
}

const ReviewCard: FC<{ review: IReview }> = ({ review }) => {
  const { t } = useTranslation();
  
  return (
    <div className="w-[360px] h-[200px] bg-[#f8f8f8] border border-gray-200 shadow-md p-8 text-left flex flex-col justify-between">
      {/* Star Icons */}
      <div className="text-orange-500 mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="inline-block text-sm mr-0.5" />
        ))}
      </div>

      {/* Review Text */}
      <p className="italic text-sm text-gray-800 leading-snug mb-2">
        "{t(review.reviewKey)}"
      </p>

      {/* Name and Location */}
      <div>
        <h3 className="font-bold text-sm text-gray-900">{t(review.nameKey)}</h3>
        <p className="text-xs text-gray-600">{t(review.locationKey)}</p>
      </div>
    </div>
  );
};

export default ReviewCard;