import { NextResponse } from "next/server";
import SignupService from "../signup.service";
import UserModel from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;
    if (!email) {
      return NextResponse.json(
        { message: "Email is required!" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email }, "firstName lastName");
    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }
    const { firstName, lastName } = user;
    const fullName = `${firstName} ${lastName}`;
    const signupService = SignupService.getInstance();
    await signupService.sendVerificationEmail(email, fullName);
    return NextResponse.json(
      { message: "Verification code sent!" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message || err }, { status: 500 });
  }
}
