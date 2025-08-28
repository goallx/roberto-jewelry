import { dbConnect } from "@/lib/dbConnect";
import ProductModel from "@/models/Product";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("category");       // Already correct
  const material = searchParams.get("material");
  const query: any = {};

  if (categoryId) {
    query.category = categoryId;
  }
  if (material && material !== "all") {
    query.material = { $regex: material, $options: "i" };
  }

  console.log("API Query:", query); // Debug line

  try {
    await dbConnect();
    const products = await ProductModel.find(query).populate({
      path: "category",
      select: "name _id",
    });

    const result = products.map((product) => ({
      ...product.toObject(),
      categoryName: product.category.name,
      category: product.category._id,
    }));

    return NextResponse.json({ products: result }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/product error:", err);
    return NextResponse.json({ message: err.message || err }, { status: 500 });
  }
};
