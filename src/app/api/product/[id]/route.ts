import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/models/Product";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(
      { message: "Product ID is missing" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const product = await ProductModel.findById(id).populate({
      path: "category",
      select: "name _id",
    });

    const productRes = {
      ...product.toObject(),
      categoryName: product.category.name,
      category: product.category._id,
    };
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ product: productRes }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || err }, { status: 500 });
  }
}
