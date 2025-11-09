import { connectDB } from "@/config/Database";
import User from "@/modal/UserUser";
import AdminToken from "@/modal/AdminToken";
import Content from "@/modal/Upload";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");
    
    let users;
    if (all === "true") {
      // Fetch all users
      users = await User.find({}).lean();
      
      // Fetch all admin tokens to map tenantToken to tenantName
      const adminTokens = await AdminToken.find({}).lean();
      const tokenMap = {};
      adminTokens.forEach(token => {
        tokenMap[token.token] = token.tenantName;
      });
      
      // Fetch all content to count pages created by each user
      const allContent = await Content.find({}).lean();
      const pageCountMap = {};
      allContent.forEach(content => {
        const userId = content.createdBy?.toString();
        if (userId) {
          pageCountMap[userId] = (pageCountMap[userId] || 0) + 1;
        }
      });
      
      // Enhance users with tenantName and pagesCreated
      const enhancedUsers = users.map(user => ({
        ...user,
        tenantName: tokenMap[user.tenantToken] || user.tenantToken || "Unknown",
        pagesCreated: pageCountMap[user._id.toString()] || 0
      }));
      
      // Get unique organizations for filtering
      const organizations = [...new Set(enhancedUsers.map(u => u.tenantName))].sort();
      
      // Get top users by pages created (for chart)
      const topUsers = [...enhancedUsers]
        .sort((a, b) => b.pagesCreated - a.pagesCreated)
        .slice(0, 10);
      
      return NextResponse.json({ 
        users: enhancedUsers,
        organizations,
        topUsers,
        stats: {
          totalUsers: enhancedUsers.length,
          totalPages: allContent.length,
          avgPagesPerUser: enhancedUsers.length > 0 
            ? (allContent.length / enhancedUsers.length).toFixed(2) 
            : 0
        }
      }, { status: 200 });
      
    } else {
      // Fetch users for specific tenant
      const tenantToken = request.headers.get("x-admin-token");
      if (!tenantToken) {
        return NextResponse.json({ message: "Missing admin token" }, { status: 401 });
      }
      
      users = await User.find({ tenantToken }).lean();
      
      // Get tenant name
      const adminToken = await AdminToken.findOne({ token: tenantToken }).lean();
      const tenantName = adminToken?.tenantName || tenantToken;
      
      // Count pages for these users
      const userIds = users.map(u => u._id);
      const contents = await Content.find({ createdBy: { $in: userIds } }).lean();
      
      const pageCountMap = {};
      contents.forEach(content => {
        const userId = content.createdBy?.toString();
        if (userId) {
          pageCountMap[userId] = (pageCountMap[userId] || 0) + 1;
        }
      });
      
      const enhancedUsers = users.map(user => ({
        ...user,
        tenantName,
        pagesCreated: pageCountMap[user._id.toString()] || 0
      }));
      
      return NextResponse.json({ 
        users: enhancedUsers,
        stats: {
          totalUsers: enhancedUsers.length,
          totalPages: contents.length,
          avgPagesPerUser: enhancedUsers.length > 0 
            ? (contents.length / enhancedUsers.length).toFixed(2) 
            : 0
        }
      }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}