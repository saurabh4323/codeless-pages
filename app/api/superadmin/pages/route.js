import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import Content from "@/modal/Upload";
import User from "@/modal/UserUser";
import AdminToken from "@/modal/AdminToken";

export async function GET(request) {
  try {
    await connectDB();

    // Fetch all content/pages with populated template and creator info
    const pages = await Content.find({})
      .populate("templateId", "name")
      .populate("createdBy")
      .lean();

    // Fetch all users and admin tokens to map relationships
    const users = await User.find({}).lean();
    const adminTokens = await AdminToken.find({}).lean();

    // Create maps for quick lookup
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user;
    });

    const tokenMap = {};
    adminTokens.forEach(token => {
      tokenMap[token.token] = token;
    });

    // Enhance pages with creator and organization info
    const enhancedPages = pages.map(page => {
      const creator = userMap[page.createdBy] || {};
      const orgInfo = tokenMap[page.tenantToken] || {};

      return {
        _id: page._id,
        heading: page.heading,
        subheading: page.subheading,
        backgroundColor: page.backgroundColor,
        templateName: page.templateId?.name || "Unknown Template",
        templateId: page.templateId?._id,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        tenantToken: page.tenantToken,
        organizationName: orgInfo.tenantName || page.tenantToken || "Unknown",
        organizationEmail: orgInfo.email || "N/A",
        creatorName: creator.fullName || "Unknown User",
        creatorEmail: creator.email || "N/A",
        creatorId: page.createdBy,
      };
    });

    return NextResponse.json({
      success: true,
      pages: enhancedPages,
      total: enhancedPages.length,
    });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch pages", error: error.message },
      { status: 500 }
    );
  }
}
