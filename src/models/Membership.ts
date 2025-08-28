import mongoose, { Schema, Document } from "mongoose";

export interface Membership extends Document {
  name: string;
  packagePrice: number;
  discount: number;
}

export enum MembershipTypes {
  PAID = "Paid",
  FIRST_ORDER = "First Order",
}

const membershipSchema = new Schema<Membership>(
  {
    name: {
      type: String,
      required: true,
    },
    packagePrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const MembershipModel =
  mongoose.models.Membership ||
  mongoose.model<Membership>("Membership", membershipSchema);

export default MembershipModel;
