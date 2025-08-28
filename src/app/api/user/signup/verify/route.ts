import { NextResponse } from "next/server";
import SignupService from "../signup.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { verificationCode, email } = body;

    if (!verificationCode) {
      return NextResponse.json(
        { message: "Verification code is messing!" },
        { status: 400 }
      );
    }

    const signupService = SignupService.getInstance();
    const isVerified = await signupService.verifyCode(email, verificationCode);
    if (isVerified) {
      return NextResponse.json({ message: "Email verified" }, { status: 200 });
    }
    return NextResponse.json(
      { message: "Wrong verification code!" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message || err }, { status: 500 });
  }
}
