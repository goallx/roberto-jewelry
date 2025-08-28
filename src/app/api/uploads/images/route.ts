import { NextRequest, NextResponse } from "next/server";
import { imagesManager } from "./manager";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (!files.length) {
      return NextResponse.json(
        { message: "No files uploaded" },
        { status: 201 }
      );
    }

    const uploadPromises = files.map((file) =>
      imagesManager.uploadFile(file).then(({ imgUrl, fileName }) => ({
        imgUrl,
        fileName,
      }))
    );

    const uploadedImagesUrl = await Promise.all(uploadPromises);

    return NextResponse.json({
      message: "Files uploaded successfully",
      data: uploadedImagesUrl,
    });
  } catch (error: any) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { message: "Error uploading images", error: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: Request) => {
  try {
    const body = await req.json();

    if (!body.length) {
      return NextResponse.json(
        { message: "No images to delete!" },
        { status: 201 }
      );
    }

    const deletePromise = body.map((imgName: string) =>
      imagesManager.deleteFile(imgName)
    );

    await Promise.all(deletePromise);

    return NextResponse.json(
      { message: "Images Deleted successfuly" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting images", error);
    return NextResponse.json(
      { message: "Error deleting images", error: error.message },
      { status: 500 }
    );
  }
};
