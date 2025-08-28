import NewsLetterSubscriptionModel from "@/models/Newsletter";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import jwt from "jsonwebtoken";
import UserModel from "@/models/User";

export async function GET(req: Request) {
  const role = req.headers.get("x-user-role");

  if (role !== "admin") {
    return NextResponse.json({ status: 401 });
  }

  try {
    const subscribers = await NewsLetterSubscriptionModel.find();
    const subsWithType = await Promise.all(
      subscribers.map(async (sub) => {
        const isMember = await UserModel.findOne({ email: sub.email });
        return {
          ...sub.toObject(),
          hasProfile: !!isMember,
        };
      })
    );
    return NextResponse.json({ subscribers: subsWithType }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;
  if (!email) {
    return NextResponse.json(
      { message: "Email is required!" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const doesExist = await NewsLetterSubscriptionModel.findOne({ email });
    if (doesExist && doesExist.isActive) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 201 }
      );
    }
    if (doesExist && !doesExist.isActive) {
      await NewsLetterSubscriptionModel.findOneAndUpdate(
        { email },
        { $set: { isActive: true } }
      );
      return NextResponse.json({ message: "" }, { status: 202 });
    }

    const newSubscriber = new NewsLetterSubscriptionModel({ email });
    await newSubscriber.save();

    return NextResponse.json(
      { message: "Subscribed successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message || err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { email } = body;
  if (!email) {
    return NextResponse.json(
      { message: "Email is required!" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const doesExist = await NewsLetterSubscriptionModel.findOne({ email });

    if (!doesExist) {
      return NextResponse.json(
        { message: "Email not found!" },
        { status: 400 }
      );
    }

    await NewsLetterSubscriptionModel.findOneAndUpdate(
      { email },
      { $set: { isActive: false } },
      { new: true }
    );

    return NextResponse.json(
      { message: "Subscribed successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message || err }, { status: 500 });
  }
}
