import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import CategoryModel from "@/models/Category";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { message: "Product name is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    if (!mongoose.connection.db) {
      throw new Error("Database connection not ready");
    }

    const newCategory = new CategoryModel({
      name: body.name,
      description: body.description ?? "",
      images: body.images ?? [],
    });

    await newCategory.save();

    return NextResponse.json({
      message: "Category added successfully",
      newCategory,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      { message: "Failed to add category" },
      { status: 500 }
    );
  }
};
