import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid username/password" },
        { status: 400 }
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email not verified!", isVerified: false },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid username/password" },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json(
      { message: "User signed in successfully" },
      { status: 200 }
    );

    response.cookies.set("role", user.role);
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || error },
      { status: 500 }
    );
  }
};
