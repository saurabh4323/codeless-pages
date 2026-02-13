// /api/organizations/[id]/reset-token/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import AdminToken from "@/modal/AdminToken";
import crypto from "crypto";

export async function POST(request, { params }) {
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

    // Generate a new token
    const newToken = crypto.randomBytes(32).toString("hex");

    // Update the token
    org.token = newToken;
    await org.save();

    return NextResponse.json({
      message: "Token reset successfully",
      newToken: newToken,
    }, { status: 200 });

  } catch (error) {
    console.error("Error resetting token:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}