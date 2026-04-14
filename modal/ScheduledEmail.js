import mongoose from "mongoose";

const scheduledEmailSchema = new mongoose.Schema({
  to: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  fromName: {
    type: String,
  },
  scheduledAt: {
    type: Date,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "sent", "failed"],
    default: "pending",
  },
  error: {
    type: String,
  },
  tenantToken: {
    type: String,
  },
  metadata: {
    type: Map,
    of: String
  }
}, { timestamps: true });

const ScheduledEmail = mongoose.models.ScheduledEmail || mongoose.model("ScheduledEmail", scheduledEmailSchema);
export default ScheduledEmail;
