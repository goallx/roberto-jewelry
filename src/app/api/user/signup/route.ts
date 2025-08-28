import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import SignupService from "./signup.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      birthday: { day, month, year },
    } = body;

    await dbConnect();
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const birthday = new Date(`${year}-${month}-${day}`);
    const newUser = new UserModel({
      email,
      password: hashedPassword,
      lastName,
      firstName,
      birthday,
      phoneNumber: phoneNumber ?? "",
      role: email === "roberto@gmail.com" ? "admin" : "customer",
      address: null,
    });
    await newUser.save();

    const fullName = `${firstName} ${lastName}`;
    const signupService = SignupService.getInstance();
    await signupService.sendVerificationEmail(email, fullName);

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || error },
      { status: 500 }
    );
  }
}
