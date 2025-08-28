import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (req: Request) => {
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
    return NextResponse.json({ authenticated: true, user: decoded });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      const response = NextResponse.redirect(new URL("/", req.url));
      response.headers.set(
        "Set-Cookie",
        "auth_token=; Path=/; HttpOnly; Secure; Max-Age=0"
      );
      return response;
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
};
