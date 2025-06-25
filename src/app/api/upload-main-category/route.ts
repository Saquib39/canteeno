import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadedUrl: string = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "canteeno/mainCategories",
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ url: uploadedUrl });
  } catch (err) {
    console.error("❌ Upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
