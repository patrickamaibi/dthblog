import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/sanity/lib/adminClient";

export const runtime = "nodejs";
export const maxDuration = 30; // large uploads can take longer than the 10s default

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB — safely under most plan limits with headroom

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Image is too large. Please use a photo under 8MB." },
      { status: 413 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const asset = await adminClient.assets.upload("image", buffer, {
    filename: file.name,
  });

  return NextResponse.json({
    assetId: asset._id,
    url: asset.url,
  });
}