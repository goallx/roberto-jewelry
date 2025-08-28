import { getPlaiceholder } from "plaiceholder";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { imgUrl } = await req.json();
    if (!imgUrl) {
      return NextResponse.json(
        { message: "Image URL is required" },
        { status: 400 }
      );
    }
    const response = await fetch(imgUrl);
    console.log("response", response);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { base64 } = await getPlaiceholder(buffer, { size: 10 });

    return NextResponse.json({ blurDataURL: base64 }, { status: 200 });
  } catch (error) {
    console.error("Error generating blurDataURL:", error);
    return NextResponse.json(
      { message: "Failed to generate blurDataURL" },
      { status: 500 }
    );
  }
};
