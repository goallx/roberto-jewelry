import Order from "@/models/Order";
import { NextResponse } from "next/server";

const MEMBERSHIP_ORDER_ID = "membership";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const cookies = request.headers.get("cookie");
  if (!cookies) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const transactionUid = searchParams.get("transaction_uid");
  const orderId = searchParams.get("orderId");

  if (!transactionUid || !orderId) {
    return NextResponse.json(
      { error: "Transaction UID or Order id is missing " },
      { status: 400 }
    );
  }

  if (orderId.split("-")[0] === MEMBERSHIP_ORDER_ID) {
    return NextResponse.redirect(
      process.env.NEXT_PUBLIC_API_URL + `/membership?status=failed`
    );
  }

  const order = await Order.findOne({ _id: orderId });
  order.paymentStatus = "failed";
  await order.save();

  return NextResponse.redirect(
    process.env.NEXT_PUBLIC_API_URL +
      `/payment-failure?transaction_uid=${transactionUid}&order_id=${orderId}`
  );
}
