import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: "customer" | "admin";
  numOfOrders: number;
  birthday: Date;
  isEmailVerified: boolean;
  membership: {
    joinDate?: string;
    membershipId?: string;
    memberKind: "Paid" | "First Order";
  } | null;
  address: {
    city: string;
    zip: string;
    country: string;
  } | null;
  verificationCode?: string;
}

const userSchema = new Schema<User>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    numOfOrders: { type: Number, default: 0 },
    birthday: { type: Date, required: true },
    verificationCode: { type: String, required: false },
    isEmailVerified: { type: Boolean, default: false },
    membership: {
      type: {
        joinDate: { type: Date },
        membershipId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Memberships",
        },
        memberKind: { type: String },
      },
      default: null,
    },
    role: { type: String, required: true, default: "customer" },
    address: {
      city: { type: String, required: false },
      zip: { type: String, required: false },
      country: { type: String, required: false },
    },
  },
  { timestamps: true }
);

const UserModel =
  mongoose.models.User || mongoose.model<User>("User", userSchema);

export default UserModel;
