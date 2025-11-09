import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import { UserResponse, TemplateQuestions } from "@/modal/DynamicPopop";
import Template from "@/modal/Template";
import Content from "@/modal/Upload";
import AdminToken from "@/modal/AdminToken";

// GET - Fetch all responses (superadmin or tenant)
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");
    const templateId = searchParams.get("templateId");
    const contentId = searchParams.get("contentId");
    const tenantFilter = searchParams.get("tenant");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    
    let responses;
    let query = {};
    
    if (all === "true") {
      // Only superadmin can view all
      const superadmin = request.headers.get("x-superadmin") === "true";
      if (!superadmin) {
        return NextResponse.json({ 
          success: false,
          message: "Forbidden" 
        }, { status: 403 });
      }
      
      // Build query filters
      if (templateId) query.templateId = templateId;
      if (tenantFilter) query.tenantToken = tenantFilter;
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }
      
      // Fetch all responses with filters
      responses = await UserResponse.find(query)
        .sort({ createdAt: -1 })
        .lean();
      
      // Try to populate if possible
      try {
        responses = await UserResponse.find(query)
          .populate('templateId', 'name description')
          .populate('userId', 'fullName email')
          .sort({ createdAt: -1 })
          .lean();
      } catch (populateError) {
        console.log("Populate failed, using unpopulated data:", populateError.message);
      }
        
    } else {
      // Regular admin: filter by tenant templates
      const tenantToken = request.headers.get("x-admin-token");
      if (!tenantToken) {
        return NextResponse.json({ 
          success: false,
          message: "Missing admin token" 
        }, { status: 401 });
      }

      const templateFilter = { tenantToken };
      if (templateId) templateFilter._id = templateId;
      
      const templates = await Template.find(templateFilter).select('_id').lean();
      const templateIds = templates.map(t => t._id);

      query.templateId = { $in: templateIds };
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      // Fetch responses
      responses = await UserResponse.find(query)
        .sort({ createdAt: -1 })
        .lean();
      
      // Try to populate if possible
      try {
        responses = await UserResponse.find(query)
          .populate('templateId', 'name description')
          .populate('userId', 'fullName email')
          .sort({ createdAt: -1 })
          .lean();
      } catch (populateError) {
        console.log("Populate failed, using unpopulated data:", populateError.message);
      }
    }
    
    // Fetch all contents to map templateId to content
    const allContents = await Content.find({}).lean();
    const templateToContentMap = {};
    allContents.forEach(content => {
      if (content.templateId) {
        templateToContentMap[content.templateId.toString()] = content;
      }
    });
    
    // Fetch all admin tokens for tenant names
    const adminTokens = await AdminToken.find({}).lean();
    const tokenMap = {};
    adminTokens.forEach(token => {
      tokenMap[token.token] = token.tenantName;
    });
    
    // Now fetch question texts from TemplateQuestions and merge them
    const enhancedResponses = await Promise.all(
      responses.map(async (response) => {
        try {
          // Get the template questions
          const templateQuestions = await TemplateQuestions.findOne({ 
            templateId: response.templateId._id || response.templateId 
          }).lean();
          
          // Get content info
          const contentInfo = templateToContentMap[(response.templateId._id || response.templateId).toString()];
          
          // Get tenant name
          const tenantName = tokenMap[response.tenantToken] || response.tenantToken || "Unknown";
          
          if (templateQuestions && templateQuestions.questions) {
            // Map the responses with question texts
            const enhancedResponseArray = response.responses?.map((resp, index) => {
              const question = templateQuestions.questions[index];
              
              // If questionText already exists in response, use it
              if (resp.questionText) {
                return {
                  ...resp,
                  isCorrect: resp.isCorrect !== undefined 
                    ? resp.isCorrect 
                    : question?.options?.find(opt => opt.text === resp.selectedOption)?.isCorrect || false
                };
              }
              
              // Otherwise, get it from template questions
              return {
                ...resp,
                questionText: question?.questionText || "Question not found",
                isCorrect: question?.options?.find(opt => opt.text === resp.selectedOption)?.isCorrect || false
              };
            }) || [];
            
            // Calculate score
            const correctCount = enhancedResponseArray.filter(r => r.isCorrect).length;
            const totalQuestions = enhancedResponseArray.length;
            const scorePercentage = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(1) : 0;
            
            return {
              ...response,
              responses: enhancedResponseArray,
              contentInfo: contentInfo ? {
                _id: contentInfo._id,
                heading: contentInfo.heading,
                subheading: contentInfo.subheading
              } : null,
              tenantName,
              stats: {
                correctCount,
                totalQuestions,
                scorePercentage
              }
            };
          }
          
          return {
            ...response,
            contentInfo: contentInfo ? {
              _id: contentInfo._id,
              heading: contentInfo.heading,
              subheading: contentInfo.subheading
            } : null,
            tenantName,
            stats: {
              correctCount: 0,
              totalQuestions: response.responses?.length || 0,
              scorePercentage: 0
            }
          };
        } catch (err) {
          console.error("Error enhancing response:", err);
          return response;
        }
      })
    );
    
    // Filter by contentId if provided
    let filteredResponses = enhancedResponses;
    if (contentId) {
      filteredResponses = enhancedResponses.filter(r => 
        r.contentInfo && r.contentInfo._id.toString() === contentId
      );
    }
    
    // Get unique tenants for filter
    const uniqueTenants = [...new Set(filteredResponses.map(r => r.tenantName))].filter(Boolean).sort();
    
    // Get unique contents for filter
    const uniqueContents = [];
    const contentIds = new Set();
    filteredResponses.forEach(r => {
      if (r.contentInfo && !contentIds.has(r.contentInfo._id.toString())) {
        contentIds.add(r.contentInfo._id.toString());
        uniqueContents.push(r.contentInfo);
      }
    });
    
    // Calculate statistics
    const stats = {
      totalResponses: filteredResponses.length,
      totalUsers: new Set(filteredResponses.map(r => r.userInfo?.email || r.userId)).size,
      averageScore: filteredResponses.length > 0 
        ? (filteredResponses.reduce((sum, r) => sum + parseFloat(r.stats?.scorePercentage || 0), 0) / filteredResponses.length).toFixed(1)
        : 0,
      completionRate: filteredResponses.length > 0
        ? ((filteredResponses.filter(r => r.completed).length / filteredResponses.length) * 100).toFixed(1)
        : 0
    };
    
    // Chart data - responses per day (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push(date);
    }
    
    const chartData = last7Days.map(date => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = filteredResponses.filter(r => {
        const responseDate = new Date(r.createdAt);
        return responseDate >= date && responseDate < nextDate;
      }).length;
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count
      };
    });
    
    console.log(`Found ${filteredResponses?.length || 0} responses`);
    
    return NextResponse.json({ 
      success: true,
      responses: filteredResponses || [],
      count: filteredResponses?.length || 0,
      filters: {
        tenants: uniqueTenants,
        contents: uniqueContents
      },
      stats,
      chartData
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching responses:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch responses",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      responses: [],
      stats: {
        totalResponses: 0,
        totalUsers: 0,
        averageScore: 0,
        completionRate: 0
      },
      chartData: []
    }, { status: 500 });
  }
}
