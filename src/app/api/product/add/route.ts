import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import CategoryModel from "@/models/Category";
import ProductModel from "@/models/Product";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    if (
      !body.category ||
      !body.name ||
      !body.price ||
      body.quantity == null ||
      !body.gender
    ) {
      return NextResponse.json(
        { message: "Missing required fields in the request body" },
        { status: 400 }
      );
    }

    await dbConnect();

    if (!mongoose.connection.db) {
      throw new Error("Database connection not ready");
    }

    const categoryDoc = await CategoryModel.findOne({
      name: body.category,
    });

    if (!categoryDoc) {
      return NextResponse.json(
        { message: `Category "${body.category}" not found.` },
        { status: 404 }
      );
    }

    const newProduct = new ProductModel({
      ...body,
      category: categoryDoc._id,
      stock: body.quantity,
    });

    categoryDoc.numOfProducts += newProduct.stock;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await newProduct.save({ session });
      await categoryDoc.save({ session });

      await session.commitTransaction();

      session.endSession();

      return NextResponse.json({
        message: "Product added successfully",
        newProduct: {
          ...newProduct.toObject(),
          categoryName: body.category,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { message: "Failed to add product", error: error.message },
      { status: 500 }
    );
  }
};
