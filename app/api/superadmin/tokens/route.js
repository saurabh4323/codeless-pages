import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import AdminToken from "@/modal/AdminToken";
import crypto from 'crypto';

// Generate a random token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// GET - List all tokens
export async function GET() {
  try {
    await connectDB();
    const tokens = await AdminToken.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}

// POST - Create new token
export async function POST(request) {
  try {
    await connectDB();
    const { tenantName, adminEmail, expiresAt } = await request.json();

    if (!tenantName || !adminEmail) {
      return NextResponse.json(
        { success: false, message: "Tenant name and admin email are required" },
        { status: 400 }
      );
    }

    const token = generateToken();
    
    const newToken = new AdminToken({
      token,
      tenantName,
      adminEmail,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    await newToken.save();

    return NextResponse.json({
      success: true,
      message: "Token created successfully",
      data: {
        token,
        tenantName,
        adminEmail,
        createdAt: newToken.createdAt
      }
    });
  } catch (error) {
    console.error("Error creating token:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create token" },
      { status: 500 }
    );
  }
}

// DELETE - Delete token
export async function DELETE(request) {
  try {
    await connectDB();
    const { tokenId } = await request.json();

    if (!tokenId) {
      return NextResponse.json(
        { success: false, message: "Token ID is required" },
        { status: 400 }
      );
    }

    const deletedToken = await AdminToken.findByIdAndDelete(tokenId);
    
    if (!deletedToken) {
      return NextResponse.json(
        { success: false, message: "Token not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Token deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting token:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete token" },
      { status: 500 }
    );
  }
} 