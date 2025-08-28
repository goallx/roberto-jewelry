import mongoose, { Document } from "mongoose";

export interface ICartItem {
  productId: string;
  quantity: number;
}

export interface Cart extends Document {
  userId: string;
  items: Array<ICartItem>;
}

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],
});

const CartModel =
  mongoose.models.Cart || mongoose.model<Cart>("Cart", cartSchema);

export default CartModel;
