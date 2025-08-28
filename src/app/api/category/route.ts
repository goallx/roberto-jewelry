import { dbConnect } from "@/lib/dbConnect";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    await dbConnect();
    const categories = await Category.find({});
    return NextResponse.json({ categories }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || err }, { status: 500 });
  }
};
