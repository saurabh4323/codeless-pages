// /api/organizations/[id]/toggle-status/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import AdminToken from "@/modal/AdminToken";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const isSuperadmin = request.headers.get("x-superadmin") === "true";
    if (!isSuperadmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Find the organization
    const org = await AdminToken.findById(id);
    if (!org) {
      return NextResponse.json({ message: "Organization not found" }, { status: 404 });
    }

    // Toggle the active status
    org.isActive = !org.isActive;
    await org.save();

    return NextResponse.json({
      message: `Account ${org.isActive ? "activated" : "paused"} successfully`,
      isActive: org.isActive,
    }, { status: 200 });

  } catch (error) {
    console.error("Error toggling status:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}