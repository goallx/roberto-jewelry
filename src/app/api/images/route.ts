import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/dbConnect";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const imageName = searchParams.get("imageName");

    if (!imageName) {
      return NextResponse.json(
        { message: "Image name is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    if (!mongoose.connection.db) {
      throw new Error("Database connection not ready");
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    const filesCursor = bucket.find({ filename: imageName });
    const files = await filesCursor.toArray();

    if (files.length === 0) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    const file = files[0];

    const downloadStream = bucket.openDownloadStreamByName(file.filename);

    const readableStream = new ReadableStream({
      start(controller) {
        downloadStream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });
        downloadStream.on("end", () => {
          controller.close();
        });
        downloadStream.on("error", (err) => {
          console.error("Stream Error:", err);
          controller.error(err);
        });
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error retrieving image:", error);
    return NextResponse.json(
      { message: "Failed to retrieve image" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const imageName = searchParams.get("imageName");

    if (!imageName) {
      return NextResponse.json(
        { message: "Image name is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    if (!mongoose.connection.db) {
      throw new Error("Database connection not ready");
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    const filesCursor = bucket.find({ filename: imageName });
    const files = await filesCursor.toArray();

    if (files.length === 0) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    const file = files[0];

    await bucket.delete(file._id);

    return NextResponse.json(
      {
        message: `File '${imageName}' deleted successfully`,
        deleteImageName: file.filename ?? "",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { message: "Failed to delete image" },
      { status: 500 }
    );
  }
};
