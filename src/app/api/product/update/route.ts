import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import ProductModel from "@/models/Product";
import mongoose from "mongoose";
import { IProduct } from "@/stores/ProductStore";
import { UploadedImagesResponse } from "../../uploads/images/manager";
import CategoryModel from "@/models/Category";

export const PUT = async (req: Request) => {
  const cookies = req.headers.get("cookie");
  if (!cookies) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const token = cookies
    .split("; ")
    .find((row) => row.startsWith("auth_token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body._id) {
      return NextResponse.json(
        { message: "Product ID is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    if (!mongoose.connection.db) {
      throw new Error("Database connection not ready");
    }

    const updatedData: Partial<IProduct> & { imagesToDelete?: string[] } = {};

    if (body.price && !isNaN(Number(body.price)))
      updatedData.price = Number(body.price);
    if (body.size && !isNaN(Number(body.size)))
      updatedData.size = Number(body.size);
    if (body.material) updatedData.material = body.material as string;
    if (body.category) {
      const product = await ProductModel.findOne({ _id: body._id });
      const originalCat = product.category.toString();
      const newCat = body.category;
      const productStock = product.stock;
      if (originalCat !== newCat) {
        const oldCategoryDoc = await CategoryModel.findOne({
          _id: originalCat,
        });
        oldCategoryDoc.numOfProducts -= productStock;
        await oldCategoryDoc.save();
        
        const newCategoryDoc = await CategoryModel.findOne({
          _id: newCat,
        });
        newCategoryDoc.numOfProducts += productStock;
        await newCategoryDoc.save();
      }

      updatedData.category = body.category as string;
    }
    if (body.description) updatedData.description = body.description as string;
    if (body.name) updatedData.name = body.name;
    if (body.gender) updatedData.gender = body.gender;
    if (body.images.length) updatedData.images = body.images;

    if (body.stock && !isNaN(Number(body.stock))) {
      const categoryDoc = await CategoryModel.findOne({
        _id: body.category,
      });
      const productDoc = await ProductModel.findOne({ _id: body._id });
      if (!categoryDoc || !productDoc) {
        return NextResponse.json(
          { message: "Couldn't find productdoc or categorydoc" },
          { status: 403 }
        );
      }
      const productAmount = Number(body.stock) - Number(productDoc.stock);
      categoryDoc.numOfProducts += productAmount;
      updatedData.stock = Number(body.stock);

      await categoryDoc.save();
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      body._id,
      {
        $set: { ...updatedData, images: undefined },
        $push: { images: { $each: updatedData.images ?? [] } },
      },
      { new: true }
    ).populate({
      path: "category",
      select: "name _id",
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    if (body.imagesToDelete.length > 0) {
      updatedProduct.images = updatedProduct.images.filter(
        (item: UploadedImagesResponse) =>
          !body.imagesToDelete.includes(item.fileName)
      );
    }

    await updatedProduct.save();

    const updatedRes = {
      ...updatedProduct.toObject(),
      categoryName: updatedProduct.category.name,
      category: updatedProduct.category._id,
    };

    return NextResponse.json(
      { message: "Product updated successfully.", updatedProduct: updatedRes },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message || err }, { status: 500 });
  }
};
