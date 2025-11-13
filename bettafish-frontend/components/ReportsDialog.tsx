'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface Report {
  name: string;
  path: string;
  size: number;
  modified: number;
  type: string;
}

interface ReportsDialogProps {
  engineType: 'media' | 'query' | 'insight';
  isOpen: boolean;
  onClose: () => void;
}

export const ReportsDialog = ({ engineType, isOpen, onClose }: ReportsDialogProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const engineNames = {
    media: 'Media Engine',
    query: 'Query Engine',
    insight: 'Insight Engine',
  };

  useEffect(() => {
    if (isOpen) {
      loadReports();
    }
  }, [isOpen, engineType]);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.listReports();
      if (response.success && response.reports && response.reports[engineType]) {
        setReports(response.reports[engineType]);
      } else {
        setReports([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载报告列表失败');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (report: Report) => {
    const downloadUrl = apiClient.downloadReport(report.path);
    window.open(downloadUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border-4 border-black w-[90%] max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b-4 border-black bg-black text-white flex justify-between items-center">
          <h2 className="text-lg font-bold">{engineNames[engineType]} 报告下载</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8">正在加载报告列表...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">暂无可用报告</div>
          ) : (
            <div className="space-y-3">
              {reports.map((report, index) => {
                const fileSize = (report.size / 1024).toFixed(2); // KB
                const modifiedDate = new Date(report.modified * 1000).toLocaleString('zh-CN');
                
                return (
                  <div
                    key={index}
                    className="border-2 border-black p-3 bg-white"
                  >
                    <div className="font-bold mb-1">{report.name}</div>
                    <div className="text-xs text-gray-600 mb-2">
                      大小: {fileSize} KB | 修改时间: {modifiedDate}
                    </div>
                    <button
                      onClick={() => handleDownload(report)}
                      className="px-4 py-1 border-2 border-black bg-white hover:bg-black hover:text-white font-bold text-sm transition-colors"
                    >
                      下载
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

