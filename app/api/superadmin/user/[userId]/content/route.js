
import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import Content from "@/modal/Upload";
import Template from "@/modal/Template";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const content = await Content.find({ createdBy: userId })
      .populate("templateId", "name")
      .select("-__v");

    return NextResponse.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch content", error: error.message },
      { status: 500 }
    );
  }
}
