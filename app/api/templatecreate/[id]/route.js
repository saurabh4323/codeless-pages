import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import Template from "@/modal/Template";
import mongoose from "mongoose";

// GET handler - Get a specific template by ID
export async function GET(request, context) {
  try {
    const { id } = await context.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find template by ID and tenant/user
    const adminToken = request.headers.get("x-admin-token");
    const userToken = request.headers.get("x-user-token");
    
    // Use either admin token or user token as the tenantToken
    const tenantToken = adminToken || userToken;
    
    if (!tenantToken) {
      return NextResponse.json({ success: false, message: "Missing authentication token" }, { status: 401 });
    }
    
    let template;
    
    if (adminToken) {
      // Admin access - find by tenant token or legacy templates
      template = await Template.findOne({ 
        _id: id, 
        $or: [
          { tenantToken: tenantToken },
          { tenantToken: { $exists: false } },
          { tenantToken: null }
        ]
      });
    } else {
      // User access - find by tenant token (using user token) but only published templates
      template = await Template.findOne({ 
        _id: id,
        status: "published", // Only published templates for users
        $or: [
          { tenantToken: userToken },
          { tenantToken: { $exists: false } },
          { tenantToken: null }
        ]
      });
    }

    if (!template) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

 

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error(
      `Error fetching template with ID ${id}:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch template",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT handler - Update a specific template by ID
export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const updateData = await request.json();
    console.log("Update Data:", updateData);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // First fetch the existing template scoped by tenant/user
    const tenantToken = request.headers.get("x-admin-token");
    const userToken = request.headers.get("x-user-token");
    
    let existingTemplate;
    
    if (tenantToken) {
      // Admin access
      existingTemplate = await Template.findOne({ 
        _id: id, 
        $or: [
          { tenantToken: tenantToken },
          { tenantToken: { $exists: false } },
          { tenantToken: null }
        ]
      });
    } else if (userToken) {
      // User access - users can only update their own templates
      existingTemplate = await Template.findOne({ _id: id, userToken });
    } else {
      return NextResponse.json({ success: false, message: "Missing authentication token" }, { status: 401 });
    }

    if (!existingTemplate) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    // Hardcode updatedBy field - using the same hardcoded ID as in your main route
    const hardcodedUserId = "644f1a9e4c98e80016d1e8b5";
    updateData.updatedBy = hardcodedUserId;
    updateData.updatedAt = Date.now();

    // Ensure createdBy is preserved if not in update data
    if (!updateData.createdBy) {
      updateData.createdBy = hardcodedUserId;
    }

    // Update the template with new data and return the updated document
    const updatedTemplate = await Template.findOneAndUpdate(
      { 
        _id: id, 
        $or: [
          { tenantToken: tenantToken },
          { tenantToken: { $exists: false } },
          { tenantToken: null }
        ]
      },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("createdBy updatedBy", "name email");

    return NextResponse.json({
      success: true,
      message: "Template updated successfully",
      data: updatedTemplate,
    });
  } catch (error) {
    console.error(
      `Error updating template with ID ${id}:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update template",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a specific template by ID
export async function DELETE(request, context) {
  try {
    const { id } = await context.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Delete the template scoped by tenant/user
    const tenantToken = request.headers.get("x-admin-token");
    const userToken = request.headers.get("x-user-token");
    
    let deletedTemplate;
    
    if (tenantToken) {
      // Admin access
      deletedTemplate = await Template.findOneAndDelete({ 
        _id: id, 
        $or: [
          { tenantToken: tenantToken },
          { tenantToken: { $exists: false } },
          { tenantToken: null }
        ]
      });
    } else if (userToken) {
      // User access - users can only delete their own templates
      deletedTemplate = await Template.findOneAndDelete({ _id: id, userToken });
    } else {
      return NextResponse.json({ success: false, message: "Missing authentication token" }, { status: 401 });
    }

    if (!deletedTemplate) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
      data: deletedTemplate,
    });
  } catch (error) {
    console.error(
      `Error deleting template with ID ${id}:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete template",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
