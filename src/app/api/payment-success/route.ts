import CartModel from "@/models/Cart";
import Order, { OrderPaymentStatus } from "@/models/Order";
import User from "@/models/User";
import { NextResponse } from "next/server";
import OrderService from "../order/order.service";
import MembershipModel, { MembershipTypes } from "@/models/Membership";

const MIN_PRICE_FOR_FREE_MEMBERSHIP = 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const transactionUid = searchParams.get("transaction_uid");
  const orderId = searchParams.get("orderId");

  if (!transactionUid || !orderId) {
    return NextResponse.json(
      { error: "Transaction UID or Order id is missing " },
      { status: 400 }
    );
  }

  const order = await Order.findOne({ _id: orderId });
  order.paymentStatus = OrderPaymentStatus.SUCCESS;

  await order.save();

  const user = await User.findByIdAndUpdate(
    { _id: order.customerId },
    { $inc: { numOfOrders: 1 } },
    { new: true }
  );

  await CartModel.findOneAndDelete({ userId: order.customerId });
  const orderService = OrderService.getInstance();
  await orderService.updateProductQuantities(order.items);

  const { numOfOrders, membership } = user;

  if (
    !membership &&
    numOfOrders === 1 &&
    order.total >= MIN_PRICE_FOR_FREE_MEMBERSHIP
  ) {
    try {
      const membershipPackage = await MembershipModel.findOne({});
      if (!membershipPackage._id.toString()) {
        return NextResponse.json(
          { message: "Membership Package not found!" },
          { status: 404 }
        );
      }
      const membershipData = {
        joinDate: new Date().toISOString(),
        membershipId: membershipPackage._id,
        memberKind: MembershipTypes.FIRST_ORDER,
      };

      user["membership"] = membershipData;
      await user.save();
    } catch (err: any) {
      throw new Error(err.message || err);
    }
  }

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
