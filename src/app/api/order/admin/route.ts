import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/dbConnect";
import Order, { IOrderItem } from "@/models/Order";

export async function GET(req: Request) {
  const role = req.headers.get("x-user-role");
  console.log("role", role);
  if (role !== "admin") {
    return NextResponse.json({ authenticated: false }, { status: 403 });
  }

  try {
    await dbConnect();

    const userOrders = await Order.find({})
      .populate({
        path: "items.productId",
        model: "Product",
      })
      .populate({
        path: "customerId",
        model: "User",
      });

    const populatedOrders = userOrders.map((order) => ({
      ...order.toObject(),
      items: order.items.map((item: IOrderItem) => ({
        ...(item as any).toObject(),
        product: item.productId,
        productId: undefined,
      })),
    }));

    return NextResponse.json({ orders: populatedOrders }, { status: 200 });
  } catch (err: any) {
    console.error(err.message || err);
    return NextResponse.json(
      {
        message: err.message || err,
      },
      { status: 500 }
    );
  }
}
