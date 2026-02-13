import mongoose from "mongoose";

// Schema for MCQ options
const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { _id: false }
);

// Schema for questions
const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [optionSchema],
      required: true,
      validate: {
        validator: function(options) {
          // At least 2 options required
          if (options.length < 2) return false;
          
          // Exactly one correct option required
          const correctCount = options.filter(opt => opt.isCorrect).length;
          return correctCount === 1;
        },
        message: 'Each question must have at least 2 options with exactly one correct answer'
      }
    },
    required: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

// Schema for template questions with proper tenant isolation
const templateQuestionsSchema = new mongoose.Schema(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true,
      index: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: function(questions) {
          return questions.length > 0;
        },
        message: 'At least one question is required'
      }
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "User",
      required: false, // Optional for admin-created questions
    },
    tenantToken: {
      type: String,
      required: true, // REQUIRED for tenant isolation
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique template questions per tenant
templateQuestionsSchema.index({ templateId: 1, tenantToken: 1 }, { unique: true });

// Schema for user responses (separate concern)
const userResponseSchema = new mongoose.Schema(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userInfo: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    responses: [
      {
        questionText: String,
        selectedOption: String,
        isCorrect: Boolean,
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
   
    completed: {
      type: Boolean,
      default: false,
    },
    tenantToken:{
      type:String,
    }
   
  },
  {
    timestamps: true,
  }
);

// Index for user responses
userResponseSchema.index({ templateId: 1, userId: 1, tenantToken: 1 });

// Create models
const TemplateQuestions =
  mongoose.models.TemplateQuestions ||
  mongoose.model("TemplateQuestions", templateQuestionsSchema);

const UserResponse =
  mongoose.models.UserResponse ||
  mongoose.model("UserResponse", userResponseSchema);

export { TemplateQuestions, UserResponse };