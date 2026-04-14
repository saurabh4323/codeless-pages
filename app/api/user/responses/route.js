import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import Content from "@/modal/Upload";
import { TemplateQuestions } from "@/modal/DynamicPopop";
import { UserResponse } from "@/modal/DynamicPopop";
import AdminToken from "@/modal/AdminToken";
import EmailSequence from "@/modal/EmailSequence";
import ScheduledEmail from "@/modal/ScheduledEmail";
import { Resend } from "resend";

export async function GET(request) {
  try {
    console.log("=== GET /api/user/responses ===");
    // Connect to the database
    await connectDB();
    console.log("Database connected successfully");
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get("contentId");
    const templateId = searchParams.get("templateId");
    const isAdmin = searchParams.get("admin") === "true";
    console.log("Query params:", { contentId, templateId, isAdmin });
    
    // Get tenant token from header for admin filtering
    const tenantToken = request.headers.get("x-admin-token");
    console.log("Tenant token from header:", tenantToken);
    
    // If contentId is provided, check if content exists and matches templateId
    if (contentId) {
      console.log("ContentId provided, fetching content...");
      const content = await Content.findById(contentId);
      console.log("Content found:", content ? "Yes" : "No");
      
      if (!content) {
        console.log("Content not found for ID:", contentId);
        return NextResponse.json({
          success: false,
          message: "Content not found",
        }, { status: 404 });
      }
      
      console.log("Content details:", {
        contentId: content._id.toString(),
        contentTemplateId: content.templateId.toString(),
        contentTenantToken: content.tenantToken,
        requestedTemplateId: templateId
      });
      
      // Check if content's templateId matches the provided templateId
      if (content.templateId.toString() !== templateId) {
        console.log("Template ID mismatch:", {
          contentTemplateId: content.templateId.toString(),
          requestedTemplateId: templateId
        });
        return NextResponse.json({
          success: false,
          message: "Content's templateId does not match the provided templateId",
        }, { status: 400 });
      }
      
      // Fetch template questions that match the templateId
      console.log("Fetching template questions for templateId:", templateId);
      const templateQuestions = await TemplateQuestions.find({ 
        'templateId': templateId 
      }).populate('templateId', 'name type');
      console.log("Template questions found:", templateQuestions.length);
      
      if (!templateQuestions || templateQuestions.length === 0) {
        console.log("No questions found for template:", templateId);
        return NextResponse.json({
          success: false,
          message: "No questions found for this template",
        }, { status: 404 });
      }
      
      // Check if content's tenantToken matches any of the templateQuestions' tenantToken
      console.log("Checking tenant token match between content and questions");
      console.log("Content tenant token:", content.tenantToken);
      console.log("Question tenant tokens:", templateQuestions.map(q => q.tenantToken));
      
      const matchingQuestions = templateQuestions.filter(
        question => question.tenantToken === content.tenantToken
      );
      console.log("Matching questions count:", matchingQuestions.length);
      
      if (matchingQuestions.length === 0) {
        console.log("No matching tenant tokens found");
        return NextResponse.json({
          success: false,
          message: "Content's tenant token does not match any template questions' tenant token",
        }, { status: 400 });
      }
      
      // Return only the matching questions
      console.log("Returning matching questions");
      return NextResponse.json({
        success: true,
        message: "Questions fetched successfully",
        questions: matchingQuestions,
        count: matchingQuestions.length
      });
    } else if (isAdmin) {
      // Admin is requesting user responses
      console.log("Admin request for user responses");
      
      // Build query based on available filters
      let query = {};
      
      if (templateId) {
        query.templateId = templateId;
      }
      
      // Filter by tenant token if provided in header
      if (tenantToken) {
        query.tenantToken = tenantToken;
        console.log("Filtering responses by tenant token:", tenantToken);
      }
      
      // Fetch user responses with filters
      const userResponses = await UserResponse.find(query)
        .populate('templateId')
        .sort({ createdAt: -1 });
      
      console.log("User responses found:", userResponses ? userResponses.length : 0);

      // Enhance responses with question text
      const enhancedResponses = await Promise.all(
        userResponses.map(async (response) => {
          try {
            const templateQuestions = await TemplateQuestions.findOne({ 
              templateId: response.templateId?._id || response.templateId 
            }).lean();

            if (templateQuestions && templateQuestions.questions) {
              const enhancedResponseArray = (response.responses || []).map((resp, index) => {
                const question = templateQuestions.questions[index];
                
                let selectedOptionText = resp.selectedOption;
                const shorthands = ['a', 'b', 'c', 'd', 'e', 'f'];
                const shorthandIndex = shorthands.indexOf(selectedOptionText?.toLowerCase());
                
                if (shorthandIndex !== -1 && question?.options && question.options[shorthandIndex]) {
                  selectedOptionText = question.options[shorthandIndex].text;
                }
                
                return {
                  ...resp,
                  questionText: resp.questionText || question?.questionText || `Question ${index + 1}`,
                  selectedOption: selectedOptionText
                };
              });

              return {
                ...response.toObject(),
                responses: enhancedResponseArray
              };
            }
            return response.toObject();
          } catch (err) {
            console.error("Error enhancing response:", err);
            return response.toObject();
          }
        })
      );
      
      return NextResponse.json({
        success: true,
        message: "User responses fetched successfully",
        data: enhancedResponses,
        count: enhancedResponses.length
      });
    } else {
      // If no contentId provided, fetch all questions (original behavior)
      console.log("No contentId provided, fetching all questions");
      const allQuestions = await TemplateQuestions.find()
        .populate('templateId', 'name type')
        .sort({ createdAt: -1 });
      console.log("All questions count:", allQuestions.length);

      return NextResponse.json({
        success: true,
        message: "Questions fetched successfully",
        questions: allQuestions,
        count: allQuestions.length
      });
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch questions",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log("=== POST /api/user/responses ===");
    // Connect to the database
    await connectDB();
    console.log("Database connected successfully");
    
    // Parse the request body
    const body = await request.json();
    console.log("Request body:", body);
    
    const { templateId, userInfo, responses, tenantToken } = body;
    
    console.log("Tenant token received:", tenantToken);
    
    // Check if content exists and matches templateId
    console.log("Fetching content...");
    // const content = await Content.findById(contentId);
    
    // Create a new user response
    const userResponse = new UserResponse({
      templateId,
      userInfo,
      responses,
      tenantToken, // Adding tenant token to the user response
    });

    // Save the user response
    console.log("Saving user response...");
    await userResponse.save();
    console.log("User response saved successfully");

    // Attempt to send an email notification to the tenant admin
    try {
      if (tenantToken) {
        const adminTokenDoc = await AdminToken.findOne({ token: tenantToken }).lean();
        const adminEmail = adminTokenDoc?.adminEmail;
        const tenantName = adminTokenDoc?.tenantName || "Tenant";

        if (adminEmail) {
          const emailEndpoint = new URL('/api/email', request.url).toString();
          const subject = `New response submitted - ${tenantName}`;
          const responderName = userInfo?.name || userInfo?.fullName || "Unknown";
          const responderEmail = userInfo?.email || "unknown@local";
          const responseCount = Array.isArray(responses) ? responses.length : 0;
          const previewLines = Array.isArray(responses)
            ? responses.slice(0, 5).map((r, i) => `<li>Q${i + 1}: ${r.selectedOption || r.answer || ''}</li>`).join('')
            : '';

          const message = `
            <div style="font-family: Arial, sans-serif; max-width: 640px; margin:0 auto;">
              <h2 style="color:#111">New Response Submitted</h2>
              <p><strong>Tenant:</strong> ${tenantName}</p>
              <p><strong>Responder:</strong> ${responderName} (${responderEmail})</p>
              <p><strong>Template ID:</strong> ${templateId}</p>
              <p><strong>Total Responses:</strong> ${responseCount}</p>
              ${responseCount > 0 ? `<p>Preview:</p><ul>${previewLines}</ul>` : ''}
              <p style="color:#555">You are receiving this because you are the admin contact for this tenant.</p>
            </div>
          `;

          const emailRes = await fetch(emailEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: adminEmail,
              subject,
              message,
              fromName: `${tenantName} Notifications`
            })
          });

          if (!emailRes.ok) {
            console.warn('Failed to send response notification email');
          }
        } else {
          console.warn('Admin email not found for tenant token, skipping notification');
        }
      }
    } catch (notifyErr) {
      console.error('Error while sending response notification:', notifyErr);
      // Do not fail the response submission due to email errors
    }

    // Send Custom Email Sequence to user
    try {
      const userEmail = userInfo?.email;
      if (userEmail) {
        // Find if there's a custom sequence for this content/template
        await connectDB();
        
        // Get contentId from URL if possible or just use templateId and tenantToken
        const sequence = await EmailSequence.findOne({ 
          templateId, 
          tenantToken,
          isEnabled: true 
        }).lean();

        if (sequence && sequence.steps && sequence.steps.length > 0) {
          const responderName = userInfo?.name || userInfo?.fullName || "there";
          const emailEndpoint = new URL('/api/email', request.url).toString();
          
          let cumulativeDelay = 0;

          for (let i = 0; i < sequence.steps.length; i++) {
            const step = sequence.steps[i];
            
            // Convert everything to minutes for cumulative calculation
            let stepMinutes = step.delay || 0;
            if (step.delayUnit === "hours") stepMinutes *= 60;
            if (step.delayUnit === "days") stepMinutes *= 1440; // 60 * 24
            
            cumulativeDelay += stepMinutes;
            
            // Template variables replacement
            const subject = step.subject.replace(/{{name}}/g, responderName);
            const body = step.body
              .replace(/{{name}}/g, responderName)
              .replace(/{{email}}/g, userEmail);

            if (cumulativeDelay === 0) {
              // Send immediate email
              await fetch(emailEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  to: userEmail,
                  subject: subject,
                  message: body,
                  fromName: sequence.title || "CodelessPages"
                })
              });
            } else {
              // Schedule for later
              const scheduledAt = new Date(Date.now() + cumulativeDelay * 60000);
              await ScheduledEmail.create({
                to: userEmail,
                subject: subject,
                body: body,
                fromName: sequence.title || "CodelessPages",
                scheduledAt: scheduledAt,
                tenantToken: tenantToken,
                status: "pending"
              });
            }
          }
        } else {
          // Fallback to default email if no sequence
          const adminTokenDoc = tenantToken
            ? await AdminToken.findOne({ token: tenantToken }).lean()
            : null;
          const tenantName = adminTokenDoc?.tenantName || "CodelessPages";

          const emailEndpoint = new URL('/api/email', request.url).toString();
          const subject = `Thanks for your submission - ${tenantName}`;
          const responderName = userInfo?.name || userInfo?.fullName || "there";

          const message = `
            <div style="font-family: Arial, sans-serif; max-width: 640px; margin:0 auto;">
              <h2 style="color:#111">Thank you, ${responderName}!</h2>
              <p>We received your submission for <strong>${tenantName}</strong>.</p>
              <p style="color:#555">If this wasn't you, you can ignore this email.</p>
            </div>
          `;

          await fetch(emailEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: userEmail,
              subject,
              message,
              fromName: `${tenantName} Team`
            })
          });
        }
      }
    } catch (userEmailErr) {
      console.error('Error while sending custom sequence/confirmation email:', userEmailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Response submitted successfully",
      responseId: userResponse._id,
    });
  } catch (error) {
    console.error("Error in POST /api/user/responses:", error);
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}

