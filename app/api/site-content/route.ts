import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SiteContent, { SITE_CONTENT_DEFAULTS } from "@/models/SiteContent";
import { requireAdmin, errorResponse } from "@/lib/api-helpers";

// GET /api/site-content?section=hero
// Public — returns data for the given section. Seeds defaults on first access.
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (!section) {
      // Return all sections if no specific section requested
      const all = await SiteContent.find({}).lean();
      const result: Record<string, unknown> = {};
      for (const [key, defaultData] of Object.entries(SITE_CONTENT_DEFAULTS)) {
        const found = all.find((doc) => doc.section === key);
        result[key] = found ? found.data : defaultData;
      }
      return NextResponse.json({ success: true, data: result });
    }

    let doc = await SiteContent.findOne({ section }).lean();

    // Seed default if not yet in DB
    if (!doc) {
      const defaultData = SITE_CONTENT_DEFAULTS[section];
      if (!defaultData) {
        return NextResponse.json(
          { success: false, error: "Unknown section" },
          { status: 404 }
        );
      }
      const created = await SiteContent.create({ section, data: defaultData });
      return NextResponse.json({ success: true, data: created.data });
    }

    return NextResponse.json({ success: true, data: doc.data });
  } catch (err) {
    console.error("[GET /api/site-content]", err);
    return errorResponse("Failed to load content", 500);
  }
}

// PUT /api/site-content?section=hero
// Admin-only — upserts data for the given section.
export async function PUT(request: NextRequest) {
  const { errorResponse: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (!section) {
      return NextResponse.json(
        { success: false, error: "section query param is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Body must be a JSON object" },
        { status: 400 }
      );
    }

    const doc = await SiteContent.findOneAndUpdate(
      { section },
      { $set: { data: body, updatedBy: "admin" } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: doc.data });
  } catch (err) {
    console.error("[PUT /api/site-content]", err);
    return errorResponse("Failed to save content", 500);
  }
}
