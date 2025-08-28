import { UploadedImagesResponse } from "@/app/api/uploads/images/manager";
import mongoose, { Document, Schema } from "mongoose";

export interface Customise extends Document {
  material: string;
  category: string;
  email: string;
  priceRange: {
    min: number;
    max: number;
  };
  fullName: string;
  additional?: string;
  images: Array<UploadedImagesResponse>;
  customerId: mongoose.Types.ObjectId;
  opened: boolean;
  createdAt?: string;
}

const CustomiseSchema = new Schema<Customise>(
  {
    material: { type: String, required: true },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String, required: true },
    additional: { type: String, required: false },
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    images: [{ imgUrl: { type: String }, fileName: { type: String } }],
    opened: { type: Boolean, default: false },
    priceRange: { type: { min: { type: Number }, max: { type: Number } } },
  },
  {
    timestamps: true,
  }
);

const CustomiseModel =
  mongoose.models.customise ||
  mongoose.model<Customise>("customise", CustomiseSchema);

export default CustomiseModel;
