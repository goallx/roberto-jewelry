import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Cart, { ICartItem } from "@/models/Cart";
import { buildCartResponse } from "@/app/helpers";

export async function DELETE(req: Request) {
  const userId = req.headers.get("x-user-id");

  await dbConnect();

  const { productId } = await req.json();

  if (!productId) {
    return NextResponse.json(
      { message: "ProductId is required!" },
      { status: 400 }
    );
  }

  let userCart = await Cart.findOne({ userId });

  if (!userCart) {
    return NextResponse.json({ message: "Cart not found!" }, { status: 400 });
  } else {
    // means its the last item in the cart, then delete the card
    if (userCart.items.length === 1) {
      await Cart.findOneAndDelete({ userId });
      return NextResponse.json({ cart: undefined }, { status: 200 });
    }
    const existingItemIndex = userCart.items.findIndex(
      (item: ICartItem) => item.productId.toString() === productId
    );
    if (existingItemIndex < 0) {
      return NextResponse.json(
        { message: "Product not found!" },
        { status: 400 }
      );
    } else {
      userCart.items.splice(existingItemIndex, 1);
    }
    await userCart.save();
  }
  userCart = await userCart.populate({
    path: "items.productId",
    model: "Product",
  });

  const updatedCart = buildCartResponse(userCart);

  return NextResponse.json({ cart: updatedCart }, { status: 200 });
}
