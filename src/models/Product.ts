import { UploadedImagesResponse } from "@/app/api/uploads/images/manager";
import mongoose, { Document } from "mongoose";

export interface Product extends Document {
  name: string;
  category: string;
  material: string;
  price: number;
  stock: number;
  images: UploadedImagesResponse[];
  gender: string;
  size: number;
  description: string;
  soldUnits: number;
}

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  size: { type: Number, required: true },
  material: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  stock: { type: Number, default: 0 },
  images: [{ imgUrl: { type: String }, fileName: { type: String } }],
  gender: { type: String },
  createdAt: { type: Date, default: Date.now },
  soldUnits: { type: Number, default: 0 },
});

const ProductModel =
  mongoose.models.Product || mongoose.model<Product>("Product", productSchema);

export default ProductModel;
