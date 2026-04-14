import { NextResponse } from "next/server";
import { connectDB } from "@/config/Database";
import ScheduledEmail from "@/modal/ScheduledEmail";

export async function GET(request) {
  try {
    await connectDB();
    
    // Find all pending emails that are due and mark them as processing atomically
    const now = new Date();
    
    // We update status to 'processing' first to prevent other cron instances from picking them up
    const pendingEmails = await ScheduledEmail.find({
      status: "pending",
      scheduledAt: { $lte: now }
    }).limit(10);

    if (pendingEmails.length === 0) {
      return NextResponse.json({ success: true, message: "No pending emails to process" });
    }

    // Mark as processing immediately
    const emailIds = pendingEmails.map(e => e._id);
    await ScheduledEmail.updateMany(
      { _id: { $in: emailIds } },
      { $set: { status: "processing" } }
    );

    const emailEndpoint = new URL('/api/email', request.url).toString();
    const results = [];

    for (const email of pendingEmails) {
      try {
        console.log(`[EmailWorker] Processing email to ${email.to}: ${email.subject}`);
        const emailRes = await fetch(emailEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email.to,
            subject: email.subject,
            message: email.body,
            fromName: email.fromName
          })
        });

        const data = await emailRes.json();

        if (emailRes.ok) {
          console.log(`[EmailWorker] Email sent to ${email.to}`);
          email.status = "sent";
        } else {
          console.error(`[EmailWorker] Failed to send to ${email.to}:`, data.error);
          email.status = "failed";
          email.error = data.error || "Failed to send";
        }
      } catch (err) {
        console.error(`[EmailWorker] Exception sending to ${email.to}:`, err.message);
        email.status = "failed";
        email.error = err.message;
      }
      await email.save();
      results.push({ id: email._id, status: email.status });
    }

    return NextResponse.json({ success: true, processed: results.length, details: results });
  } catch (error) {
    console.error("Cron processing error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
