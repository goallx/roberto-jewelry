import { FC } from "react";
import { FaStar } from "react-icons/fa";

export interface IReview {
  review: string;
  name: string;
  location: string;
}

const ReviewCard: FC<{ review: IReview }> = ({ review }) => {
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
        "{review.review}"
      </p>

      {/* Name and Location */}
      <div>
        <h3 className="font-bold text-sm text-gray-900">{review.name}</h3>
        <p className="text-xs text-gray-600">{review.location}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
