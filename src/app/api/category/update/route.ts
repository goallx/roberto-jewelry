import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import CategoryModel from "@/models/Category";
import mongoose from "mongoose";
import { ICategory } from "@/stores/CategoryStore";
import { UploadedImagesResponse } from "../../uploads/images/manager";

export const PUT = async (req: Request) => {
  try {
    const role = req.headers.get("x-user-role");

    if (role !== "admin") {
      return NextResponse.json({ status: 401 });
    }

    const body = await req.json();

    if (!body._id) {
      return NextResponse.json(
        { message: "Category ID is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    if (!mongoose.connection.db) {
      throw new Error("Database connection not ready");
    }

    const updatedData: Partial<ICategory> & { imagesToDelete?: string[] } = {};
    if (body.name) updatedData.name = body.name;
    if (body.description) updatedData.description = body.description as string;
    if (body.images) updatedData.images = body.images;

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      body._id,
      {
        $set: { ...updatedData, images: undefined },
        $push: { images: { $each: updatedData.images || [] } },
      },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 }
      );
    }

    if (body.imagesToDelete.length > 0) {
      updatedCategory.images = updatedCategory.images.filter(
        (item: UploadedImagesResponse) =>
          !body.imagesToDelete.includes(item.fileName)
      );
    }

    await updatedCategory.save();

    return NextResponse.json(
      {
        message: "Category updated successfully.",
        updatedCategory,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "Internal server error" },
      { status: 500 }
    );
  }
};
