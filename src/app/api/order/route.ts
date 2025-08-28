import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import Order, { IOrderItem } from "@/models/Order";
import OrderService from "./order.service";

import payplusService, {
  ITransactionBody,
} from "../transaction/transaction2.service";

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");
  try {
    await dbConnect();

    const userOrders = await Order.find({ customerId: userId }).populate({
      path: "items.productId",
      model: "Product",
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

export async function POST(req: Request) {
  try {
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
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error: any) {
      if (error instanceof jwt.TokenExpiredError) {
        const response = NextResponse.redirect(new URL("/", req.url));
        response.cookies.set("auth_token", "", {
          path: "/",
          expires: new Date(0),
        });
        return response;
      }
    }

    const { id: userId } = decoded as { id: string };

    await dbConnect();

    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const {
      city,
      country,
      zip,
      street,
      cvv,
      expYear,
      expMonth,
      cardNumber,
      cardHolderName,
      firstName,
      lastName,
    } = await req.json();

    const { items } = userCart;
    const orderService = OrderService.getInstance();
    const { totalPriceForOrder, orderItems, errors } =
      await orderService.prepareOrder(items);

    if (errors.length) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const newOrder = new Order({
      customerId: userId,
      total: totalPriceForOrder,
      orderStatus: "pending",
      paymentMethod: "card",
      paymentStatus: "pending",
      items: orderItems,
      billingAddress: {
        street,
        city,
        zip,
        country,
      },
    });

    await newOrder.save();

    const populatedOrder = await Order.findOne({
      _id: newOrder._id,
    }).populate({
      path: "customerId",
      model: "User",
      select: "firstName lastName email phoneNumber membership",
    });

    let amount = populatedOrder.total;

    if (populatedOrder.customerId.membership)
      amount = populatedOrder.total * 0.9;

    const paymentBody: ITransactionBody = {
      orderId: populatedOrder._id.toString(),
      amount,
      customerName: `${firstName ?? ""} ${lastName ?? ""}`,
      creditName: "Visa",
      email: populatedOrder.customerId.email,
      phone: populatedOrder.customerId.phoneNumber,
      address: street,
      city,
      creditNumber: cardNumber,
      creditMonth: expMonth,
      creditYear: expYear,
      creditCvv: cvv,
    };

    let transactionId = "";

    try {
      const res = await payplusService.chargeTransactionJ4(paymentBody);

      if (res.results.status === "success") {
        transactionId = res.data.transaction.uid;
      } else {
        return NextResponse.json(
          { message: res.results.description },
          { status: 400 }
        );
      }
    } catch (err: any) {
      return NextResponse.json(
        {
          errors: [
            "Unable to generate the payment page, please try again later!",
          ],
          err: err.message || err,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { order: newOrder, transactionId },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        message: err.message || err,
      },
      { status: 500 }
    );
  }
}
