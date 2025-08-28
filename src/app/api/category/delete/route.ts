import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/dbConnect";
import CategoryModel from "@/models/Category";

export async function DELETE(req: Request) {
  const role = req.headers.get("x-user-role");
  
  if (role !== "admin") {
    return NextResponse.json({ status: 401 });
  }

  const url = new URL(req.url || "");
  const catId = url.searchParams.get("id");

  if (!catId) {
    return NextResponse.json(
      { message: "Category ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const category = await CategoryModel.findOne({ _id: catId });
    if (!category) {
      return NextResponse.json(
        { message: `${catId} not found!` },
        { status: 404 }
      );
    }

    if (category.numOfProducts > 0) {
      return NextResponse.json(
        {
          message:
            "Cannot delete category because it is associated with active products",
        },
        { status: 409 }
      );
    }
    await CategoryModel.deleteOne({ _id: catId });
    return NextResponse.json({ status: 204 });
  } catch (err: any) {
    console.error(err.message || err);
    return NextResponse.json(
      {
        message: err.message || err,
      },
      { status: 500 }
    );
  }
}
