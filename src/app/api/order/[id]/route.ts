import { NextResponse } from "next/server";
import OrderService from "../order.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const orderId = (await params).id;
    const orderService = OrderService.getInstance();
    const order = await orderService.getOrderById(orderId);
    return NextResponse.json({ order }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || err }, { status: 500 });
  }
}
