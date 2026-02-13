"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function DynamicPopup({ templateId, onComplete }) {
  const [showPopup, setShowPopup] = useState(false);
  const [currentStep, setCurrentStep] = useState("userInfo"); // "userInfo" or "questions"
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    console.log("DynamicPopup useEffect triggered with templateId:", templateId);
    
    // Determine a stable key per content id if available, otherwise per template
    let contentIdFromPath = null;
    try {
      const segments = window.location.pathname.split("/").filter(Boolean);
      contentIdFromPath = segments[segments.length - 1] || null;
    } catch (_) {
      // ignore
    }

    const completionKey = contentIdFromPath
      ? `content_${contentIdFromPath}_completed`
      : `template_${templateId}_completed`;
    const alreadyCompleted = localStorage.getItem(completionKey);

    console.log("DynamicPopup completion check:", {
      contentIdFromPath,
      completionKey,
      alreadyCompleted,
      templateId
    });

    if (alreadyCompleted === "true") {
      console.log("Popup already completed, not showing");
      setLoading(false);
      setShowPopup(false);
      if (onComplete) onComplete();
      return;
    }

    // For anonymous users, still show the popup
    console.log("Showing popup for templateId:", templateId);
    setLoading(false);
    setShowPopup(true);
    loadQuestions();
  }, [templateId]);

  const loadQuestions = async () => {
    try {
      console.log("Loading questions for templateId:", templateId);
      
      // Determine content ID from URL path
      let contentId = null;
      try {
        const segments = window.location.pathname.split("/").filter(Boolean);
        contentId = segments[segments.length - 1] || null;
        console.log("Extracted contentId from URL:", contentId);
      } catch (err) {
        console.error("Error extracting contentId:", err);
      }
      
      // Build API URL with contentId if available
      const apiUrl = contentId 
        ? `/api/user/responses?templateId=${templateId}&contentId=${contentId}`
        : `/api/user/responses?templateId=${templateId}`;
      
      console.log("Calling API:", apiUrl);
      const response = await axios.get(apiUrl);
      console.log("API Response:", response.data);
      
      if (response.data.success) {
        console.log("Questions fetched successfully:", {
          questions: response.data.questions,
          count: response.data.questions?.length || 0
        });
        
        if (response.data.questions && response.data.questions.length > 0) {
          // Questions exist for this template
          // Extract the actual questions array from the response structure
          const questionData = response.data.questions[0]?.questions || [];
          console.log("Extracted question data:", questionData);
          
          setQuestions(questionData);
          setResponses(questionData.map(() => ({ selectedOption: "" })));
          console.log("Questions set in state just now");
        } else {
          // No questions for this template
          console.log("No questions found, hiding popup");
          setShowPopup(false);
          if (onComplete) onComplete();
        }
      } else {
        console.log("API returned success: false", response.data.message);
        setShowPopup(false);
        if (onComplete) onComplete();
      }
    } catch (error) {
      console.error("Error loading questions:", error.response?.data || error.message);
      setShowPopup(false);
      if (onComplete) onComplete();
    }
  };

  const checkUserResponse = async (userId) => {
    try {
      const response = await axios.get(`/api/user/responses?templateId=${templateId}&userId=${userId}`);
      
      if (response.data.success) {
        if (response.data.completed) {
          // User has already completed questions for this template
          setLoading(false);
          setShowPopup(false);
          if (onComplete) onComplete();
        } else if (response.data.hasQuestions) {
          // User hasn't completed but questions exist
          setQuestions(response.data.questions);
          setResponses(response.data.questions.map(() => ({ selectedOption: "" })));
          setLoading(false);
          setShowPopup(true);
        } else {
          // No questions for this template
          setLoading(false);
          setShowPopup(false);
          if (onComplete) onComplete();
        }
      }
    } catch (error) {
      console.error("Error checking user response:", error);
      setLoading(false);
      setShowPopup(false);
      if (onComplete) onComplete();
    }
  };

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    if (!userInfo.name || !userInfo.email || !userInfo.password) {
      setError("All fields are required");
      return;
    }
    setCurrentStep("questions");
    setError("");
  };

  const handleQuestionsSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all questions are answered
    const unansweredQuestions = responses.filter(response => !response.selectedOption);
    if (unansweredQuestions.length > 0) {
      setError("Please answer all questions");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Get content ID from URL path
      let contentId = null;
      try {
        const segments = window.location.pathname.split("/").filter(Boolean);
        contentId = segments[segments.length - 1] || null;
        console.log("Extracted contentId from URL:", contentId);
      } catch (err) {
        console.error("Error extracting contentId:", err);
      }
      
      // Get tenant token from content data
      let tenantToken = null;
      try {
        // Fetch all content and filter for our content ID
        const contentResponse = await axios.get("/api/upload");
        if (contentResponse.data && contentResponse.data.success) {
          const allContent = contentResponse.data.content;
          console.log("All content:", allContent.length, "items");
          console.log("Looking for content with ID:", contentId);
          
          const filteredContent = allContent.find(item => item._id === contentId);
          console.log("Filtered Content:", filteredContent);
          
          if (filteredContent && filteredContent.tenantToken) {
            tenantToken = filteredContent.tenantToken;
            console.log("Retrieved tenant token from content:", tenantToken);
          } else {
            console.error("Content found but no tenant token available:", filteredContent);
          }
        } else {
          console.error("Failed to get content data:", contentResponse.data);
        }
      } catch (err) {
        console.error("Error fetching content for tenant token:", err);
      }
      
      console.log("Sending response with tenant token:", tenantToken);
      
      // Make sure we have a valid tenant token
      if (!tenantToken) {
        console.error("No tenant token found for content ID:", contentId);
      }
      
      const response = await axios.post("/api/user/responses", {
        templateId,
        userInfo,
        responses,
        tenantToken: tenantToken, // Ensure correct property name for tenant token
      });

      if (response.data.success) {
        // Mark this content/template as completed locally
        const segments = window.location.pathname.split("/").filter(Boolean);
        const cid = segments[segments.length - 1];
        const key = cid ? `content_${cid}_completed` : `template_${templateId}_completed`;
        localStorage.setItem(key, "true");
        setShowPopup(false);
        if (onComplete) onComplete();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit responses");
    } finally {
      setSubmitting(false);
    }
  };

  const updateResponse = (questionIndex, selectedOption) => {
    const updatedResponses = [...responses];
    updatedResponses[questionIndex] = { selectedOption };
    setResponses(updatedResponses);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  console.log("DynamicPopup render check:", {
    showPopup,
    loading,
    templateId
  });

  if (!showPopup) {
    console.log("DynamicPopup not showing - showPopup is false");
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header with Gradient */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {currentStep === "userInfo" ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  )}
                </svg>
              </motion.div>
              <h2 className="text-3xl font-bold text-center mb-2">
                {currentStep === "userInfo" ? "Welcome!" : "Quick Questions"}
              </h2>
              <p className="text-white/90 text-center text-sm">
                {currentStep === "userInfo" 
                  ? "Let's get to know you better" 
                  : "Help us personalize your experience"
                }
              </p>
            </div>
            
            {/* Progress Indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <motion.div 
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: currentStep === "userInfo" ? "50%" : "100%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3"
                >
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Info Form */}
            {currentStep === "userInfo" && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleUserInfoSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-900 placeholder-slate-400"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-900 placeholder-slate-400"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={userInfo.password}
                    onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-900 placeholder-slate-400"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Continue
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </motion.form>
            )}

            {/* Questions Form */}
            {currentStep === "questions" && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleQuestionsSubmit}
                className="space-y-6"
              >
                {Array.isArray(questions) && questions.length > 0 ? questions.map((question, questionIndex) => (
                  <motion.div 
                    key={questionIndex} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: questionIndex * 0.1 }}
                    className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-100"
                  >
                    <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-start gap-2">
                      <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                        {questionIndex + 1}
                      </span>
                      <span className="flex-1">{question?.questionText || "Question"}</span>
                    </h3>
                    <div className="space-y-2 ml-9">
                      {Array.isArray(question?.options) ? question.options.map((option, optionIndex) => (
                        <label 
                          key={optionIndex} 
                          className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all ${
                            responses[questionIndex]?.selectedOption === option.text
                              ? 'bg-indigo-50 border-2 border-indigo-500 shadow-sm'
                              : 'bg-white border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${questionIndex}`}
                            value={option.text}
                            checked={responses[questionIndex]?.selectedOption === option.text}
                            onChange={() => updateResponse(questionIndex, option.text)}
                            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                            required
                          />
                          <span className="text-slate-900 font-medium flex-1">{option.text}</span>
                          {responses[questionIndex]?.selectedOption === option.text && (
                            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </label>
                      )) : <p className="text-slate-500 text-sm">No options available</p>}
                    </div>
                  </motion.div>
                )) : <p className="text-center text-slate-500 py-8">No questions available</p>}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep("userInfo")}
                    className="flex-1 py-4 px-6 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}