import { NextResponse } from "next/server";
import OrderService from "../order.service";

export async function PUT(req: Request) {
  try {
    const { orderStatus, orderId } = await req.json();
    const orderService = OrderService.getInstance();
    const updated = await orderService.updateOrderStatus(orderId, orderStatus);
    if (updated) {
      return NextResponse.json(
        { message: "Updated Successfuly" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Faild to update!" },
        { status: 400 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message || err }, { status: 500 });
  }
}
