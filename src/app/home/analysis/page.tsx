"use client";
import React, { useState } from "react";
import { UploadModal } from "@/components/UploadModal";

export default function AnalysisPage() {
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'student' | 'exam' | 'score'>('student');

  const handleOpenUploadModal = (type: 'student' | 'exam' | 'score') => {
    setUploadType(type);
    setUploadModalOpen(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">学情分析</h1>
      <div className="flex space-x-4 mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => handleOpenUploadModal('student')}
        >
          上传学生
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => handleOpenUploadModal('exam')}
        >
          上传考试
        </button>
        <button
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          onClick={() => handleOpenUploadModal('score')}
        >
          上传分数
        </button>
      </div>
      
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        uploadType={uploadType}
      />
    </div>
  );
}