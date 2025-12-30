import { NextRequest, NextResponse } from "next/server";

// Railway CDN URL for ROMs
const ROM_CDN_URL = "https://cdn-hankshits.up.railway.app/roms";

/**
 * Proxy ROM requests to Railway S3 bucket.
 * This avoids CORS issues by serving ROMs from same origin.
 * The CDN service doesn't pass CORS headers through, so we proxy instead.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const romPath = path.join("/");
  const bucketUrl = `${ROM_CDN_URL}/${romPath}`;

  try {
    const response = await fetch(bucketUrl);

    if (!response.ok) {
      return new NextResponse("ROM not found", { status: 404 });
    }

    // Stream the response body
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "application/octet-stream",
        // Cache for 1 year - ROMs don't change
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Failed to fetch ROM:", error);
    return new NextResponse("Failed to fetch ROM", { status: 500 });
  }
}
