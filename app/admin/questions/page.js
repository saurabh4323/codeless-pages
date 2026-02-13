"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import apiClient from "@/utils/apiClient";

export default function AdminQuestionsPage() {
  const [templates, setTemplates] = useState([]);
  const [templateQuestions, setTemplateQuestions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
      required: true,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchTemplates();
    fetchTemplateQuestions();
  }, []);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        setError("Admin token not found. Please login again.");
        return;
      }

      const response = await fetch("/api/admin/templatecreate", {
        headers: {
          "x-admin-token": token,
        },
      });

      const data = await response.json();
      console.log("Templates Response:", data); 

      if (data?.success && data?.data) {
        setTemplates(data.data);
      } else {
        setError(data?.message || "Failed to load templates");
        setTemplates([]);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      setError("Failed to load templates");
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplateQuestions = async () => {
    try {
      const response = await apiClient.get("/api/admin/createques");
      if (response.data?.success) {
        setTemplateQuestions(response.data.data || []);
      } else {
        console.error("Failed to load template questions");
      }
    } catch (error) {
      console.error("Error fetching template questions:", error);
    }
  };

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    
    // Check if questions already exist for this template
    const existingQuestions = templateQuestions.find(
      tq => String(tq.templateId?._id || tq.templateId) === String(templateId)
    );
    
    if (existingQuestions) {
      setError("Questions already exist for this template. Please delete existing questions first to create new ones.");
    } else {
      setError("");
    }
    
    // Reset form
    setQuestions([
      {
        questionText: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        required: true,
      },
    ]);
    setSuccess("");
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        required: true,
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex][field] = value;

    // If setting isCorrect to true, unset all others
    if (field === "isCorrect" && value === true) {
      updatedQuestions[questionIndex].options.forEach((option, i) => {
        option.isCorrect = i === optionIndex;
      });
    }

    setQuestions(updatedQuestions);
  };

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      // Check question text
      if (!question.questionText.trim()) {
        setError(`Question ${i + 1}: Question text is required`);
        return false;
      }

      // Filter valid options
      const validOptions = question.options.filter((opt) => opt.text.trim());
      
      if (validOptions.length < 2) {
        setError(`Question ${i + 1}: At least 2 options with text are required`);
        return false;
      }

      // Check for exactly one correct option
      const correctOptions = validOptions.filter((opt) => opt.isCorrect);
      
      if (correctOptions.length === 0) {
        setError(`Question ${i + 1}: Please select one correct option`);
        return false;
      }
      
      if (correctOptions.length > 1) {
        setError(`Question ${i + 1}: Only one correct option is allowed`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedTemplate) {
      setError("Please select a template");
      return;
    }

    // Check if questions already exist
    const existingQuestions = templateQuestions.find(
      tq => String(tq.templateId?._id || tq.templateId) === String(selectedTemplate)
    );
    
    if (existingQuestions) {
      setError("Questions already exist for this template. Please delete existing questions first.");
      return;
    }

    if (!validateQuestions()) {
      return;
    }

    setSubmitting(true);

    try {
      // Filter out empty options
      const processedQuestions = questions.map((q) => ({
        questionText: q.questionText.trim(),
        options: q.options
          .filter((opt) => opt.text.trim())
          .map((opt) => ({
            text: opt.text.trim(),
            isCorrect: opt.isCorrect,
          })),
        required: q.required,
      }));

      const response = await apiClient.post("/api/admin/createques", {
        templateId: selectedTemplate,
        questions: processedQuestions,
        createdBy: "admin",
      });

      if (response.data?.success) {
        setSuccess("Questions created successfully!");
        
        // Refresh data
        await fetchTemplateQuestions();
        await fetchTemplates();

        // Reset form
        setSelectedTemplate("");
        setQuestions([
          {
            questionText: "",
            options: [
              { text: "", isCorrect: false },
              { text: "", isCorrect: false },
              { text: "", isCorrect: false },
              { text: "", isCorrect: false },
            ],
            required: true,
          },
        ]);
      } else {
        setError(response.data?.message || "Failed to create questions");
      }
    } catch (error) {
      console.error("Error creating questions:", error);
      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to create questions. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (templateId) => {
    if (!confirm("Are you sure you want to delete these questions? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await apiClient.delete("/api/admin/createques", {
        data: { templateId },
      });

      if (response.data?.success) {
        setSuccess("Questions deleted successfully!");
        await fetchTemplateQuestions();
      } else {
        setError(response.data?.message || "Failed to delete questions");
      }
    } catch (error) {
      console.error("Error deleting questions:", error);
      setError(error.response?.data?.message || "Failed to delete questions");
    }
  };

  const getTemplateName = (templateId) => {
    const idStr = typeof templateId === "object" && templateId?._id 
      ? templateId._id 
      : templateId;
    const template = templates.find((t) => String(t._id) === String(idStr));
    return template?.name || "Unknown Template";
  };

  const getTemplateQuestionsCount = (templateId) => {
    const idStr = typeof templateId === "object" && templateId?._id 
      ? templateId._id 
      : templateId;
    const tq = templateQuestions.find((t) => 
      String(t.templateId?._id || t.templateId) === String(idStr)
    );
    return tq?.questions?.length || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300 mx-auto"></div>
          <p className="mt-4 text-blue-200">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200 mb-4">
            Template Questions Management
          </h1>
          <p className="text-xl text-blue-200/80">
            Create and manage MCQ questions for templates
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 text-red-200 px-6 py-4 rounded-xl mb-6 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-500/10 backdrop-blur-sm border border-green-400/30 text-green-200 px-6 py-4 rounded-xl mb-6 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{success}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Questions Form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200 mb-8 flex items-center">
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create Questions
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-blue-200 mb-3">
                  Select Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-xl text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                  required
                >
                  <option value="" className="bg-blue-900 text-blue-100">
                    Choose a template
                  </option>
                  {templates.map((template) => {
                    const hasQuestions = getTemplateQuestionsCount(template._id) > 0;
                    return (
                      <option
                        key={template._id}
                        value={template._id}
                        className="bg-blue-900 text-blue-100"
                      >
                        {template.name} {hasQuestions ? "(Has Questions)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {questions.map((question, questionIndex) => (
                  <motion.div
                    key={questionIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                        Question {questionIndex + 1}
                      </h3>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(questionIndex)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20 px-3 py-1 rounded-lg transition-all duration-200"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-blue-200 mb-3">
                        Question Text *
                      </label>
                      <textarea
                        value={question.questionText}
                        onChange={(e) =>
                          updateQuestion(questionIndex, "questionText", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-xl text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 resize-none"
                        rows="3"
                        placeholder="Enter your question here..."
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-blue-200 mb-3">
                        Options (Select one correct answer) *
                      </label>
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200"
                        >
                          <input
                            type="radio"
                            name={`correct-${questionIndex}`}
                            checked={option.isCorrect}
                            onChange={() =>
                              updateOption(questionIndex, optionIndex, "isCorrect", true)
                            }
                            className="text-blue-400 focus:ring-blue-400 w-5 h-5 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) =>
                              updateOption(questionIndex, optionIndex, "text", e.target.value)
                            }
                            className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-lg text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                          {option.isCorrect && (
                            <div className="flex items-center text-green-400 text-sm font-medium">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Correct
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                type="button"
                onClick={addQuestion}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-xl text-blue-200 hover:from-blue-500/30 hover:to-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 transform hover:scale-105"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="font-semibold">Add Another Question</span>
                </div>
              </button>

              <button
                type="submit"
                disabled={submitting || !selectedTemplate}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="font-semibold">Creating...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="font-semibold">Create Questions</span>
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>

          {/* Existing Questions */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200 mb-8 flex items-center">
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Existing Questions
            </h2>

            {templateQuestions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-blue-200/60 text-lg">No questions created yet</p>
                <p className="text-blue-200/40 text-sm mt-2">
                  Create your first set of questions above
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                {templateQuestions.map((templateQ) => (
                  <div
                    key={templateQ._id}
                    className="bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-blue-200 text-lg">
                        {getTemplateName(templateQ.templateId)}
                      </h3>
                      <button
                        onClick={() => handleDelete(templateQ.templateId?._id || templateQ.templateId)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span className="text-sm font-medium">Delete</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-4 text-blue-200/80">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          {templateQ.questions?.length || 0} questions
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm">
                          {new Date(templateQ.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}