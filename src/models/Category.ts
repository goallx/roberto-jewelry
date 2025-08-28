import { UploadedImagesResponse } from "@/app/api/uploads/images/manager";
import mongoose, { Document } from "mongoose";

export interface Category extends Document {
  name: string;
  description: string;
  createdAt: Date;
  images: UploadedImagesResponse[];
  numOfProducts: number;
}

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  numOfProducts: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  images: [{ imgUrl: { type: String }, fileName: { type: String } }],
});

const CategoryModel =
  mongoose.models.Category ||
  mongoose.model<Category>("Category", categorySchema);

export default CategoryModel;
