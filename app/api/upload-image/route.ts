import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dqzjwkkms",
  api_key: "277645133612919",
  api_secret: "Z0fT18rKqWFOv1WKYz4XfFIflVA",
});

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file = data.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mimeType = file.type;
  const dataUri = `data:${mimeType};base64,${base64}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "courses",
      resource_type: "auto",
    });
    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    return NextResponse.json({ error: "Error uploading to Cloudinary" }, { status: 500 });
  }
}
