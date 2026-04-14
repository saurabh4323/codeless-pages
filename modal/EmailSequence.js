import mongoose from "mongoose";

const emailStepSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  delay: {
    type: Number, // Delay in minutes from the previous email or submission
    default: 0,
  },
  order: {
    type: Number,
    required: true,
  }
});

const emailSequenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Template",
    required: true,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content",
    required: false, // Can be linked to a specific published content
  },
  tenantToken: {
    type: String,
    required: true,
    index: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  steps: [emailStepSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const EmailSequence = mongoose.models.EmailSequence || mongoose.model("EmailSequence", emailSequenceSchema);
export default EmailSequence;
