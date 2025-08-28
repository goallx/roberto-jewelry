import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    const headers = new Headers();
    headers.set(
      "Set-Cookie",
      `auth_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`
    );

    return NextResponse.json(
      { message: "User logged out successfully" },
      { headers, status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
};
