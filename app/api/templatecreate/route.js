import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import Template from "@/modal/Template";

// GET handler - Get all templates or filter by query params
// GET handler - Get all templates or filter by query params
export async function GET(request) {
  try {
    // Connect to database
    await connectDB();

    // Get search parameters from URL
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const createdBy = searchParams.get("createdBy");

    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (createdBy) filter.createdBy = createdBy;

    // Find templates based on filters and tenant/user
    const adminToken = request.headers.get("x-admin-token");
    const userToken = request.headers.get("x-user-token");
    
    // Use either admin token or user token as the tenantToken
    // For user tokens, we accept them in any format (no validation required)
    const tenantToken = adminToken || userToken;
    
    // Skip token validation for now to allow any user to access templates
    // This makes the API more flexible for different authentication methods
    // if (!tenantToken) {
    //   return NextResponse.json({ success: false, message: "Missing authentication token" }, { status: 401 });
    // }
    
    let templates;
    
    if (adminToken) {
      // Admin access - find by tenant token
      templates = await Template.find({
        ...filter,
        $or: [
          { tenantToken: adminToken },
          { tenantToken: { $exists: false } },
          { tenantToken: null }
        ]
      }).sort({ createdAt: 1 });
    } else {
      // User access - find published templates only
      templates = await Template.find({
        ...filter,
        status: "published", // Only show published templates to users
        $or: [
          { tenantToken: userToken },
          { tenantToken: { $exists: false } },
          { tenantToken: null }
        ]
      }).sort({ createdAt: 1 });
    }

    return NextResponse.json({
      success: true,
      data: templates,
      count: templates.length,
    });
  } catch (error) {
    console.log("Error details:", error);
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch templates",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST handler - Create a new template
export async function POST(request) {
  try {
    // Parse request body
    const templateData = await request.json();
    console.log("Template Data:", templateData);

    const adminToken = request.headers.get("x-admin-token");
    const userToken = request.headers.get("x-user-token");
    
    // Use either admin token or user token as the tenantToken
    // For user tokens, we accept them in any format (no validation required)
    const tenantToken = adminToken || userToken;
    
    // Skip token validation for now to allow any user to access templates
    // This makes the API more flexible for different authentication methods
    // if (!tenantToken) {
    //   return NextResponse.json({ success: false, message: "Missing authentication token" }, { status: 401 });
    // }

    // Validate required fields
    if (!templateData.name || !templateData.description) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and description are required fields",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Create new template with tenant token (from either admin or user)
    const template = new Template({
      ...templateData,
      status: templateData.status || "draft",
      type: templateData.type || "basic",
      sections: templateData.sections || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      tenantToken: tenantToken
    });

    await template.save();

    return NextResponse.json(
      {
        success: true,
        message: "Template created successfully",
        data: template,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating template:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          error: Object.values(error.errors).map((err) => err.message),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create template",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT handler - Update an existing template (redirect to specific route)
export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Method not allowed. Use PUT /api/templates/[id] to update a specific template",
    },
    { status: 405 }
  );
}

// DELETE handler - Delete multiple templates
export async function DELETE(request) {
  try {
    // Parse request body to get array of template IDs to delete
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request - IDs array is required and cannot be empty",
        },
        { status: 400 }
      );
    }

    // Validate that all IDs are valid MongoDB ObjectIds
    const { ObjectId } = require("mongodb");
    const invalidIds = ids.filter((id) => !ObjectId.isValid(id));

    if (invalidIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid template IDs: ${invalidIds.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Delete the templates
    const result = await Template.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No templates found with the provided IDs",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} template(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting templates:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete templates",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
