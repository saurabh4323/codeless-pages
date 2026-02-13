
import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import User from "@/modal/UserUser";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required" },
        { status: 400 }
      );
    }

    const users = await User.find({ tenantToken: token }).select("-password");

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}
