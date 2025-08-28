import ProductModel from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bestSellingItems = await ProductModel.find()
      .populate({
        path: "category",
        select: "name _id",
      })
      .sort({ soldUnits: -1 })
      .limit(4)
      .select("name price images soldUnits category _id");

    const result = bestSellingItems.map((product) => ({
      ...product.toObject(),
      categoryName: product.category.name,
      category: product.category._id,
    }));

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      {
        message: err.message || err,
      },
      { status: 500 }
    );
  }
}
