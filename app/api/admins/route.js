import { connectDB } from "@/config/Database";
import Admin from "@/modal/UserAdmin";
import AdminToken from "@/modal/AdminToken";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");
    
    let admins;
    if (all === "true") {
      // Fetch all admins
      admins = await Admin.find({}).lean();
      
      // Fetch all admin tokens to map tenantToken to tenantName
      const adminTokens = await AdminToken.find({}).lean();
      const tokenMap = {};
      adminTokens.forEach(token => {
        tokenMap[token.token] = token.tenantName;
      });
      
      // Enhance admins with tenantName
      const enhancedAdmins = admins.map(admin => ({
        ...admin,
        tenantName: tokenMap[admin.tenantToken] || admin.tenantToken || "Unknown"
      }));
      
      return NextResponse.json({ admins: enhancedAdmins }, { status: 200 });
      
    } else {
      // Fetch admins for specific tenant
      const tenantToken = request.headers.get("x-admin-token");
      if (!tenantToken) {
        return NextResponse.json({ message: "Missing admin token" }, { status: 401 });
      }
      
      admins = await Admin.find({ tenantToken }).lean();
      
      // Get tenant name
      const adminToken = await AdminToken.findOne({ token: tenantToken }).lean();
      const tenantName = adminToken?.tenantName || tenantToken;
      
      // Enhance admins with tenantName
      const enhancedAdmins = admins.map(admin => ({
        ...admin,
        tenantName
      }));
      
      return NextResponse.json({ admins: enhancedAdmins }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}