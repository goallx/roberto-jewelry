import { dbConnect } from "@/lib/dbConnect";
import Cart, { ICartItem } from "@/models/Cart";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Product from "@/models/Product";
import { buildCartResponse } from "@/app/helpers";

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");

  await dbConnect();

  const cart = await Cart.find({ userId })
    .populate({
      path: "items.productId",
      model: "Product",
    })
    .exec();

  if (!cart.length) {
    return NextResponse.json({ cart: {} }, { status: 200 });
  } else {
    const updatedItems = cart[0]?.items.map((item: any) => {
      let cartItem = {
        ...item.toObject(),
        product: item.productId,
      };
      delete cartItem["productId"];
      return cartItem;
    });
    return NextResponse.json(
      { cart: { ...cart[0].toObject(), items: updatedItems } },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
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
  const product = await Product.findOne({ _id: productId });

  if (!userCart) {
    userCart = await Cart.create({
      userId,
      items: [{ productId, quantity: 1 }],
    });
  } else {
    const existingItemIndex = userCart.items.findIndex(
      (item: ICartItem) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      if (userCart.items[existingItemIndex].quantity >= product.stock) {
        return NextResponse.json(
          {
            message: `Product ${product.name} is out of stock!`,
          },
          { status: 409 }
        );
      }
      userCart.items[existingItemIndex].quantity += 1;
    } else {
      userCart.items.push({ productId, quantity: 1 });
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

export async function DELETE(req: Request) {
  const cookies = req.headers.get("cookie");
  if (!cookies) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const token = cookies
    .split("; ")
    .find((row) => row.startsWith("auth_token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

  const { id: userId } = decoded as { id: string };

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
    const existingItemIndex = userCart.items.findIndex(
      (item: ICartItem) => item.productId.toString() === productId
    );
    if (existingItemIndex < 0) {
      return NextResponse.json(
        { message: "Product not found!" },
        { status: 400 }
      );
    } else {
      if (userCart.items[existingItemIndex].quantity > 1)
        userCart.items[existingItemIndex].quantity -= 1;
      else {
        userCart.items.splice(existingItemIndex, 1);
        if (!userCart.items.length) {
          await Cart.findByIdAndDelete(userCart._id);
          return NextResponse.json(
            { message: "Cart deleted!", cart: undefined },
            { status: 200 }
          );
        }
      }
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
