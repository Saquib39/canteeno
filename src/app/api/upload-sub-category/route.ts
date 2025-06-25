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
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    const url: string = await new Promise((res, rej) => {
      cloudinary.uploader
        .upload_stream({ folder: "canteeno/subCategories" }, (e, r) =>
          e || !r ? rej(e) : res(r.secure_url)
        )
        .end(buffer);
    });

    return NextResponse.json({ url });
  } catch (e) {
    console.error("Cloudinary sub upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
