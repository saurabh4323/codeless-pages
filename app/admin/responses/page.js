"use client";
import { useState, useEffect } from "react";

import apiClient from "@/utils/apiClient";

export default function AdminResponsesPage() {
  const [responses, setResponses] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTemplates();
    fetchResponses();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await apiClient.get("/api/admin/templatecreate");
      if (response.data.success) {
        setTemplates(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const fetchResponses = async () => {
    try {
      setLoading(true);
      const url = selectedTemplate 
        ? `/api/user/responses?admin=true&templateId=${selectedTemplate}`
        : "/api/user/responses?admin=true";
      
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('adminToken');
      
      // Set headers with admin token for tenant filtering
      const headers = adminToken ? { 'x-admin-token': adminToken } : {};
      
      const response = await apiClient.get(url, { headers });
      if (response.data.success) {
        // Initialize responses as an empty array if data is undefined
        setResponses(response.data.data || []);
        console.log("Responses loaded:", response.data.data ? response.data.data.length : 0);
      } else {
        // Set empty array if request was not successful
        setResponses([]);
        console.log("No responses returned from API");
      }
    } catch (error) {
      console.error("Error fetching responses:", error);
      setError("Failed to fetch responses");
      // Set empty array on error
      setResponses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (templates.length > 0) {
      fetchResponses();
    }
  }, [selectedTemplate, templates]);

  const getTemplateName = (templateId) => {
    const template = templates.find(t => t._id === templateId);
    return template ? template.name : "";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateScore = (responses) => {
    if (!responses || responses.length === 0) return 0;
    const correctAnswers = responses.filter(r => r.isCorrect).length;
    return Math.round((correctAnswers / responses.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300 mx-auto"></div>
          <p className="mt-4 text-blue-200">Loading responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200 mb-4">
            User Responses
          </h1>
          <p className="text-xl text-blue-200/80">View user responses to template questions</p>
        </div>

        {error && (
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 text-red-200 px-6 py-4 rounded-xl mb-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-semibold text-blue-200 mb-3">
              Filter by Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-xl text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
            >
              <option value="" className="bg-blue-900 text-blue-100">All Templates</option>
              {templates.map((template) => (
                <option key={template._id} value={template._id} className="bg-blue-900 text-blue-100">
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Responses Table */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {responses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-blue-200/60 text-lg">No responses found</p>
              <p className="text-blue-200/40 text-sm mt-2">No user has submitted responses for this template yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-200/30">
                <thead className="bg-blue-900/60">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">User Info</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Responses</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white/5 divide-y divide-blue-200/10">
                  {responses.map((response) => (
                    <tr key={response._id} className="hover:bg-blue-900/10 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-bold text-blue-100">
                            {response.userInfo?.name || "Anonymous"}
                          </div>
                          <div className="text-sm text-blue-200/80">
                            {response.userInfo?.email || "No email"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-3">
                          {response.responses && response.responses.length > 0 ? (
                            response.responses.map((r, idx) => (
                              <div key={idx} className="bg-blue-900/30 border border-blue-400/20 rounded-xl p-3">
                                <div className="text-sm text-blue-200 font-semibold mb-1">
                                  {r.questionText}
                                </div>
                                <div className="text-sm text-blue-100">
                                  <span className="font-medium">Answer:</span> {r.selectedOption}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-blue-200/60 italic">No responses</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200/80">
                        {formatDate(response.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}