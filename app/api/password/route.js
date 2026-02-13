import Password from "@/modal/passwordSchema";
import { connectDB } from "@/config/Database";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { password } = await req.json();

    // Fetch the stored admin password
    let storedPassword = await Password.findOne();

    if (!storedPassword) {
      // If no password exists, create it (Initial setup)
      storedPassword = await Password.create({ password });
      return NextResponse.json(
        { success: true, message: "Admin password set successfully" },
        { status: 201 }
      );
    }

    // Directly compare the provided password with the stored password
    if (password !== storedPassword.password) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Access granted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying password:", error);
    return NextResponse.json(
      { success: false, message: "Server error during password verification" },
      { status: 500 }
    );
  }
}
