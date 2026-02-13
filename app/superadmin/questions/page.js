"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Save,
  Trash,
  Database
} from "lucide-react";

export default function SuperadminQuestions() {
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

  const fetchTemplates = async () => {
    try {
      const response = await axios.get("/api/admin/templatecreate");
      if (response.data.success) {
        setTemplates(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplateQuestions = async () => {
    try {
      const response = await axios.get("/api/admin/createques");
      if (response.data.success) {
        setTemplateQuestions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching template questions:", error);
    }
  };

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
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
    setError("");
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
    
    // If setting isCorrect to true, unset others
    if (field === "isCorrect" && value === true) {
      updatedQuestions[questionIndex].options.forEach((option, i) => {
        if (i !== optionIndex) {
          option.isCorrect = false;
        }
      });
    }
    
    setQuestions(updatedQuestions);
  };

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.questionText.trim()) {
        setError(`Question ${i + 1} text is required`);
        return false;
      }
      
      const validOptions = question.options.filter(opt => opt.text.trim());
      if (validOptions.length < 2) {
        setError(`Question ${i + 1} must have at least 2 options`);
        return false;
      }
      
      const correctOptions = validOptions.filter(opt => opt.isCorrect);
      if (correctOptions.length !== 1) {
        setError(`Question ${i + 1} must have exactly one correct option`);
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

    if (!validateQuestions()) {
      return;
    }

    setSubmitting(true);

    try {
      // Filter out empty options
      const processedQuestions = questions.map(q => ({
        ...q,
        options: q.options.filter(opt => opt.text.trim()),
      }));

      const response = await axios.post("/api/admin/questions", {
        templateId: selectedTemplate,
        questions: processedQuestions,
        createdBy: "superadmin", // Mark as created by superadmin
      });

      if (response.data.success) {
        setSuccess("Questions created successfully!");
        fetchTemplateQuestions();
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
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create questions");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (templateId) => {
    if (!confirm("Are you sure you want to delete these questions?")) {
      return;
    }

    try {
      await axios.delete("/api/admin/questions", { data: { templateId } });
      setSuccess("Questions deleted successfully!");
      fetchTemplateQuestions();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete questions");
    }
  };

  const getTemplateName = (templateId) => {
    const idStr = typeof templateId === 'object' && templateId !== null && templateId._id ? templateId._id : templateId;
    const template = templates.find(t => String(t._id) === String(idStr));
    return template ? template.name : "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <HelpCircle className="w-8 h-8" />
          Template Questions Editor
        </h1>
        <p className="text-gray-400">Create and manage MCQ assessments for templates</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-xl mb-6 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-500/10 border border-green-500/20 text-green-200 px-6 py-4 rounded-xl mb-6 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Questions Form */}
        <div className="bg-[#1e1b4b]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" />
            Create New Assessment
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Select Template
              </label>
              <div className="relative">
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Choose a template...</option>
                  {templates.map((template) => (
                    <option key={template._id} value={template._id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-3.5 w-4 h-4 text-gray-500 transform rotate-90 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-6">
              {questions.map((question, questionIndex) => (
                <motion.div
                  key={questionIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#0f1023]/50 border border-white/5 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-blue-300 uppercase tracking-wider">
                      Question {questionIndex + 1}
                    </h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="mb-6">
                    <textarea
                      value={question.questionText}
                      onChange={(e) => updateQuestion(questionIndex, "questionText", e.target.value)}
                      className="w-full px-4 py-3 bg-[#1e1b4b] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                      rows="2"
                      placeholder="Enter question text..."
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Options (Select the correct answer)
                    </label>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`correct-${questionIndex}`}
                          checked={option.isCorrect}
                          onChange={() => updateOption(questionIndex, optionIndex, "isCorrect", true)}
                          className="w-4 h-4 text-blue-500 focus:ring-blue-500 bg-[#1e1b4b] border-white/10"
                        />
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(questionIndex, optionIndex, "text", e.target.value)}
                          className={`flex-1 px-4 py-2 bg-[#1e1b4b] border rounded-lg text-sm text-white focus:outline-none focus:ring-1 transition-all ${
                             option.isCorrect 
                               ? "border-green-500/50 ring-green-500/20" 
                               : "border-white/10 focus:border-blue-500 focus:ring-blue-500"
                          }`}
                          placeholder={`Option ${optionIndex + 1}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={addQuestion}
                className="flex-1 py-3 px-4 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
              
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Assessment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Questions List */}
        <div className="bg-[#1e1b4b]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 h-fit sticky top-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            Existing Assessments
          </h2>
          
          {templateQuestions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-gray-400 font-medium">No assessments found</p>
              <p className="text-gray-600 text-sm mt-1">Create one to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {templateQuestions.map((templateQ) => (
                <div key={templateQ._id} className="bg-[#0f1023]/50 border border-white/5 rounded-xl p-4 hover:border-blue-500/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white text-sm">
                      {getTemplateName(templateQ.templateId)}
                    </h3>
                    <button
                      onClick={() => handleDelete(templateQ.templateId)}
                      className="text-gray-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete Assessment"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{templateQ.questions.length} questions</span>
                    </div>
                    <span>•</span>
                    <span>{new Date(templateQ.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}