import { connectDB } from "@/config/Database";
import User from "@/modal/UserUser";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    // Connect to the database
    await connectDB();

    // Get the user ID from the dynamic route parameter
    const { id } = await params;

    // Validate ID
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Find user by ID
    const user = await User.findById(id).select("fullName email");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return user data
    return NextResponse.json(
      {
        message: "Profile retrieved successfully",
        user: {
          fullName: user.fullName,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile fetch error:", {
      message: error.message,
      stack: error.stack,
      params,
    });
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID format" }, { status: 400 });
    }

    const body = await request.json();
    const { fullName } = body || {};
    if (typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json({ message: "fullName must be at least 2 characters" }, { status: 400 });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: { fullName: fullName.trim() } },
      { new: true, runValidators: true, select: "fullName email" }
    );

    if (!updated) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: { fullName: updated.fullName, email: updated.email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", { message: error.message, stack: error.stack, params });
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}