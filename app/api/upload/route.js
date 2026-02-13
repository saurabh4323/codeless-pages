import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import Content from "@/modal/Upload";
import Template from "@/modal/Template";
import User from "@/modal/UserUser";
import mongoose from "mongoose";
import fetch from "node-fetch";

// Cloudinary config
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || "tempelate";
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "ddyhobnzf";

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse FormData
    const formData = await request.formData();
    const fields = {};

    // Extract fields from FormData
    for (const [key, value] of formData.entries()) {
      fields[key] = value;
    }

    // Log parsed data for debugging
    console.log("Parsed FormData fields:", fields);

    // Check for user token in headers
    const userToken = request.headers.get('x-user-token');
    
    // Extract required fields
    const templateId = fields.templateId;
    const backgroundColor = fields.backgroundColor || "#ffffff"; // Default to white if not provided
    const heading = fields.heading;
    const subheading = fields.subheading;
    // Use token from header if available, otherwise use from form data
    const userId = userToken || fields.userId;
    // const tenantToken = fields.tenantToken;

    const askUserDetails = fields.askUserDetails === "true"; // Convert string to boolean
    console.log("askUserDetails value:", fields.askUserDetails);
    console.log("askUserDetails converted:", askUserDetails);

    // Validate templateId
    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return NextResponse.json(
        { success: false, message: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing user ID" },
        { status: 400 }
      );
    }

    // Validate heading and subheading
    if (!heading || !subheading) {
      return NextResponse.json(
        { success: false, message: "Heading and Subheading are required" },
        { status: 400 }
      );
    }

    // Verify template exists and belongs to tenant (if admin token provided)
    const tenantToken = request.headers.get("x-admin-token") ; 
    const template = tenantToken
      ? await Template.findOne({ _id: templateId, tenantToken })
      : await Template.findById(templateId);
    if (!template) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    // Prepare content data
    const contentData = {
      templateId,
      tenantToken : fields.tenantToken || null,
      heading,
      backgroundColor,
      subheading,
      sections: {},
      createdBy: String(userId), // Ensure createdBy is treated as a string
      updatedBy: String(userId), // Ensure updatedBy is treated as a string
      askUserDetails, // Add the askUserDetails field
    };

    // Process each section
    for (const section of template.sections) {
      const sectionId = section.id;
      if (fields[sectionId]) {
        if (section.type === "image" && typeof fields[sectionId] === "object" && fields[sectionId].name) {
          // Upload to Cloudinary
          const uploadForm = new FormData();
          uploadForm.append("file", fields[sectionId]);
          uploadForm.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
          const cloudinaryRes = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: uploadForm }
          );
          const cloudinaryData = await cloudinaryRes.json();
          if (cloudinaryData.secure_url) {
            contentData.sections[sectionId] = {
              type: section.type,
              value: cloudinaryData.secure_url,
            };
          } else {
            return NextResponse.json(
              { success: false, message: "Cloudinary upload failed" },
              { status: 500 }
            );
          }
        } else {
          // Handle text/URL
          contentData.sections[sectionId] = {
            type: section.type,
            value: fields[sectionId],
          };
        }
      } else if (section.required) {
        return NextResponse.json(
          { success: false, message: `${section.title} is required` },
          { status: 400 }
        );
      }
    }

    // Create content in database
    console.log("Creating content with data:", contentData);
    const content = await Content.create(contentData);
    console.log("Created content:", content);

    return NextResponse.json({
      success: true,
      message: "Content created successfully",
      data: content,
    });
  } catch (error) {
    console.log("Error details:", error);
    console.error("Error creating content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create content",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Connect to database
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const id = searchParams.get("id");
    const tenantToken = request.headers?.get?.("x-admin-token");

    let contentQuery = {};
    
    if (id) {
      contentQuery._id = id;
    }
    
    // Filter by tenant if admin token provided
    if (tenantToken) {
      const templates = await Template.find({ tenantToken }).select("_id");
      const templateIds = templates.map(t => t._id);
      contentQuery.templateId = { $in: templateIds };
    }

    // Filter by user if userId provided
    if (userId) {
      contentQuery.createdBy = userId;
    }

    // Fetch content and populate templateId
    const contents = await Content.find(contentQuery)
      .populate({
        path: "templateId",
        match: { _id: { $exists: true } }, // Ensure only valid templates are populated
      })
      .lean();

    // Filter out content where templateId is null (i.e., template not found)
    const validContents = contents.filter(
      (content) => content.templateId !== null
    );

    // Populate creator email manually
    const userIds = [...new Set(validContents.map((c) => String(c.createdBy)).filter((id) => mongoose.Types.ObjectId.isValid(id)))];
    const users = await User.find({ _id: { $in: userIds } }).select("email");
    const userMap = {};
    users.forEach((u) => {
      userMap[u._id.toString()] = u.email;
    });

    const enrichedContents = validContents.map((content) => ({
      ...content,
      creatorEmail: userMap[String(content.createdBy)] || null,
    }));

    return NextResponse.json({
      success: true,
      message: enrichedContents.length > 0 ? "Content fetched successfully" : "No content found",
      content: enrichedContents,
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch content",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse FormData
    const formData = await request.formData();
    const fields = {};

    // Extract fields from FormData
    for (const [key, value] of formData.entries()) {
      fields[key] = value;
    }

    // Log parsed data for debugging
    console.log("Parsed FormData fields:", fields);

    // Extract required fields
    const contentId = fields.contentId;
    const templateId = fields.templateId;
    const heading = fields.heading;
    const subheading = fields.subheading;
    const userId = fields.userId;
    const askUserDetails = fields.askUserDetails === "true"; // Convert string to boolean

    // Validate contentId
    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing content ID" },
        { status: 400 }
      );
    }

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing user ID" },
        { status: 400 }
      );
    }

    // Validate heading and subheading
    if (!heading || !subheading) {
      return NextResponse.json(
        { success: false, message: "Heading and Subheading are required" },
        { status: 400 }
      );
    }

    // Validate templateId
    if (!templateId || !mongoose.Types.ObjectId.isValid(templateId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing template ID" },
        { status: 400 }
      );
    }

    // Verify template exists
    const template = await Template.findById(templateId).lean();
    if (!template) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    // Verify content exists
    const existingContent = await Content.findById(contentId).populate({
      path: "templateId",
      match: { _id: { $exists: true } }, // Ensure populated template is valid
    });
    if (!existingContent) {
      return NextResponse.json(
        { success: false, message: "Content not found" },
        { status: 404 }
      );
    }

    // Check if existing content's templateId is valid
    if (!existingContent.templateId) {
      return NextResponse.json(
        {
          success: false,
          message: "Existing content has an invalid template reference",
        },
        { status: 400 }
      );
    }

    // Prepare updated content data
    const contentData = {
      templateId,
      tenantToken: template.tenantToken || null,
      heading,
      subheading,
      sections: {},
      updatedBy: userId,
      updatedAt: Date.now(),
      askUserDetails, // Add the askUserDetails field
    };

    // Process each section and enforce required fields
    for (const section of template.sections) {
      const sectionId = section.id;
      const fieldValue = fields[sectionId];
      
      if (fieldValue) {
        if ((section.type === "image" || section.type === "video") && 
            typeof fieldValue === "object" && 
            fieldValue.name) {
          // Upload new file to Cloudinary
          const uploadForm = new FormData();
          uploadForm.append("file", fieldValue);
          uploadForm.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
          
          const resourceType = section.type === "video" ? "video" : "image";
          const cloudinaryRes = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
            { method: "POST", body: uploadForm }
          );
          
          const cloudinaryData = await cloudinaryRes.json();
          if (cloudinaryData.secure_url) {
            contentData.sections[sectionId] = {
              type: section.type,
              value: cloudinaryData.secure_url,
            };
          } else {
            console.error("Cloudinary update failed:", cloudinaryData);
            return NextResponse.json(
              { success: false, message: `Failed to upload ${section.type} to Cloudinary` },
              { status: 500 }
            );
          }
        } else {
          // Handle text, link, or existing URL string
          contentData.sections[sectionId] = {
            type: section.type,
            value: fieldValue,
          };
        }
      } else {
        // If no new value is provided, check if we have an existing value to keep
        if (existingContent.sections && existingContent.sections[sectionId]) {
          contentData.sections[sectionId] = existingContent.sections[sectionId];
        } else if (section.required) {
          return NextResponse.json(
            {
              success: false,
              message: `Section '${section.title}' is required`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Update content in database
    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      { $set: contentData },
      { new: true, runValidators: true }
    ).populate("templateId");

    // Verify updated content has valid templateId
    if (!updatedContent.templateId) {
      console.error("Updated content has null templateId:", updatedContent);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update content: Invalid template reference",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Content updated successfully",
      data: updatedContent,
    });
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update content",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const { contentId } = await request.json();

    // Validate contentId
    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing content ID" },
        { status: 400 }
      );
    }

    // Check if content exists
    const existingContent = await Content.findById(contentId);
    if (!existingContent) {
      return NextResponse.json(
        { success: false, message: "Content not found" },
        { status: 404 }
      );
    }

    // Delete the content
    await Content.findByIdAndDelete(contentId);

    return NextResponse.json({
      success: true,
      message: "Content deleted successfully",
      deletedId: contentId,
    });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete content",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
