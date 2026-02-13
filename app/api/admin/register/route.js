import { connectDB } from "@/config/Database";
import Admin from "@/modal/UserAdmin";
import AdminToken from "@/modal/AdminToken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, password, adminToken, phone } = await request.json();

    // Connect to the database
    await connectDB();

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { message: "Name, email, password, and phone are required" },
        { status: 400 }
      );
    }

    // Validate admin token
    if (!adminToken) {
      return NextResponse.json(
        { message: "Admin token is required" },
        { status: 400 }
      );
    }

    // Find and validate the admin token
    const tokenData = await AdminToken.findOne({ 
      token: adminToken,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!tokenData) {
      return NextResponse.json(
        { message: "Invalid or expired admin token" },
        { status: 403 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    // Create new admin user with tenant token
    const admin = new Admin({
      name,
      phone,
      email,
      password, // Store the password as-is (no hashing)
      tenantToken: tokenData.token, // Store the tenant token
      validated: true, // Auto-validate since token is valid
    });

    await admin.save();

    return NextResponse.json(
      { 
        adminid: admin._id, 
        message: "Admin registered successfully",
        tenantToken: tokenData.token
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering admin:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const tenantToken = request.headers.get("x-admin-token");
    if (!tenantToken) {
      return NextResponse.json({ message: "Missing admin token" }, { status: 401 });
    }
    // Find the admin for this tenant token
    const admin = await Admin.findOne({ tenantToken });
    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 401 });
    }
    return NextResponse.json({ admin }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { email, validated } = await request.json();

    // Connect to the database
    await connectDB();

    // Get tenant token from headers if available
    const tenantToken = request.headers.get("x-admin-token");
    
    // Build query with tenant filtering
    const query = { email };
    if (tenantToken) {
      query.tenantToken = tenantToken;
    }

    // Find admin by email and update the `validated` field
    const admin = await Admin.findOneAndUpdate(
      query,
      { validated },
      { new: true }
    );

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Admin updated successfully", admin },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Get tenant token from headers if available
    const tenantToken = request.headers.get("x-admin-token");
    
    // Build query with tenant filtering
    const query = { email };
    if (tenantToken) {
      query.tenantToken = tenantToken;
    }

    const admin = await Admin.findOneAndDelete(query);

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Admin deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting admin:", error);
    if (error.name === "MongoError") {
      return NextResponse.json({ message: "Database error" }, { status: 500 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
