import mongoose, { Schema, Document } from "mongoose";

export interface NewsLetterSubscription extends Document {
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<NewsLetterSubscription>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const NewsLetterSubscriptionModel =
  mongoose.models.NewsLetterSubscription ||
  mongoose.model<NewsLetterSubscription>(
    "NewsLetterSubscription",
    SubscriptionSchema
  );

export default NewsLetterSubscriptionModel;
