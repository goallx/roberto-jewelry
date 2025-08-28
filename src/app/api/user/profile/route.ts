import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";
import jwt from "jsonwebtoken";

export const GET = async (req: Request) => {
  try {
    const id = req.headers.get("x-user-id");

    await dbConnect();

    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json(
        { authenticated: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { authenticated: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
};

export async function PUT(req: Request) {
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    const { id: userId } = decoded as { id: string };

    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      birthday,
      address,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(password && { password }),
        ...(phoneNumber && { phoneNumber }),
        ...(birthday && {
          birthday: {
            ...(birthday.day && { day: birthday.day }),
            ...(birthday.month && { month: birthday.month }),
            ...(birthday.year && { year: birthday.year }),
          },
        }),
        ...(address && {
          address: {
            ...(address.city && { city: address.city }),
            ...(address.zip && { zip: address.zip }),
            ...(address.country && { country: address.country }),
          },
        }),
      },
      { new: true }
    ).select(["-_id", "-updatedAt", "-createdAt"]);

    console.log("@@", updatedUser);

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
