"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function UploadList() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const response = await axios.get("/api/upload");
        console.log("API Response:", response.data);
        setUploads(response.data.contents || []);
      } catch (error) {
        console.error("Error fetching uploads:", error);
        setUploads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (uploads.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No uploads found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {uploads.map((upload) => {
        // For each upload, loop through its content and create a separate card for each content type
        return upload.content.map((item, idx) => (
          <div
            key={`${upload._id}-${idx}`}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
          >
            <div className="p-4 flex-1">{renderContent(upload.type, item)}</div>
            <div className="p-4 border-t flex flex-col gap-2">
              <div className="text-gray-800 font-semibold text-lg truncate">
                {upload.metadata?.title || "No Title"}
              </div>
              <div className="flex flex-wrap gap-2">
                {upload.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ));
      })}
    </div>
  );
}

function renderContent(type, content) {
  switch (type) {
    case "image":
      return (
        <div className="relative w-full h-48 rounded-md overflow-hidden">
          <Image
            src={content}
            alt="Uploaded Image"
            fill
            className="object-cover"
          />
        </div>
      );
    case "video":
      return (
        <video controls src={content} className="rounded-md w-full h-48" />
      );
    case "link":
      return (
        <a
          href={content}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-words text-sm"
        >
          {content}
        </a>
      );
    case "text":
      return <p className="text-gray-700 text-base break-words">{content}</p>;
    default:
      return <p className="text-red-500">Unsupported content type</p>;
  }
}
