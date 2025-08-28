import { NextResponse } from "next/server";
import payPlus from "../transaction/transaction2.service";

export async function GET(req: Request) {
  try {
    const errors = await payPlus.getErrorCodes();
    return NextResponse.json({ errors }, { status: 200 });
  } catch (error: any) {
    console.error("Error creating payment page:", error);
    return NextResponse.json({ message: error.message || error });
  }
}
