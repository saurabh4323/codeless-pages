import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import EmailSequence from "@/modal/EmailSequence";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const tenantToken = request.headers.get("x-user-token") || request.headers.get("x-admin-token");
    const templateId = searchParams.get("templateId");
    const contentId = searchParams.get("contentId");

    if (!tenantToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let query = { tenantToken };
    if (templateId) query.templateId = templateId;
    if (contentId) query.contentId = contentId;

    const sequences = await EmailSequence.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, sequences });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, templateId, contentId, steps, tenantToken } = body;

    if (!tenantToken || !templateId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Update existing or create new
    const sequence = await EmailSequence.findOneAndUpdate(
      { templateId, tenantToken, contentId: contentId || null },
      { 
        title: title || "Welcome Sequence",
        steps: steps || [],
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, sequence });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
