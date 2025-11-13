'use client';

import { useEffect, useRef, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface Engine {
  status: 'stopped' | 'starting' | 'running';
  output: string;
}

interface ConsoleSectionProps {
  activeApp: string;
  engines: Record<string, Engine>;
  forumLog: string;
  onAppChange: (appName: string) => void;
}

export const ConsoleSection = ({
  activeApp,
  engines,
  forumLog,
  onAppChange,
}: ConsoleSectionProps) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [engines, forumLog]);

  const apps = [
    { name: 'insight', label: 'Insight' },
    { name: 'media', label: 'Media' },
    { name: 'query', label: 'Query' },
    { name: 'report', label: 'Report' },
    { name: 'forum', label: 'Forum' },
  ];

  const [showForumLogModal, setShowForumLogModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500';
      case 'starting':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  const currentOutput = activeApp === 'forum' 
    ? forumLog 
    : engines[activeApp]?.output || '';

  // 导出日志功能
  const handleExportLog = async (appName: string) => {
    try {
      if (appName === 'forum') {
        // Forum Engine 使用专门的下载端点
        const downloadUrl = apiClient.downloadForumLog();
        window.open(downloadUrl, '_blank');
        return;
      }
      
      const output = await apiClient.getEngineOutput(appName);
      const logContent = output.data || '';
      
      // 创建 Blob 并下载
      const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${appName}_engine_log_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Failed to export log for ${appName}:`, error);
      alert(`导出日志失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // Forum Engine 日志查看
  const handleViewForumLog = () => {
    setShowForumLogModal(true);
  };

  return (
    <div className="flex-[1.2] flex flex-col bg-white min-h-0 overflow-hidden">
      {/* 应用切换按钮和导出按钮 */}
      <div className="flex border-b-2 border-black">
        {apps.map((app) => {
          const engine = engines[app.name];
          const isActive = activeApp === app.name;
          const isLocked = app.name === 'report' && 
            (engines.insight.status !== 'running' || 
             engines.media.status !== 'running' || 
             engines.query.status !== 'running');

          return (
            <div key={app.name} className="flex-1 flex flex-col">
              <button
                onClick={() => !isLocked && onAppChange(app.name)}
                disabled={isLocked}
                className={`flex-1 p-4 border-r-2 border-black font-bold transition-all ${
                  isActive
                    ? 'bg-black text-white'
                    : isLocked
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                <div className="relative">
                  {app.label}
                  {engine && (
                    <span
                      className={`absolute top-1 right-1 w-2 h-2 rounded-full ${getStatusColor(
                        engine.status
                      )}`}
                    />
                  )}
                </div>
              </button>
              <div className="flex">
                <button
                  onClick={() => handleExportLog(app.name)}
                  className="px-2 py-1 text-xs border-r-2 border-black bg-gray-50 hover:bg-gray-100 text-gray-700"
                  title={`导出 ${app.label} 日志`}
                >
                  导出日志
                </button>
                {app.name === 'forum' && (
                  <button
                    onClick={handleViewForumLog}
                    className="px-2 py-1 text-xs border-r-2 border-black bg-gray-50 hover:bg-gray-100 text-gray-700"
                    title="查看 Forum 日志"
                  >
                    查看日志
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 控制台输出 */}
      <div
        ref={consoleRef}
        className="flex-1 p-4 bg-black text-green-400 font-mono text-sm overflow-y-auto"
        style={{ fontFamily: 'monospace' }}
      >
        <pre className="whitespace-pre-wrap break-words">
          {currentOutput || '等待输出...'}
        </pre>
      </div>

      {/* Forum Log Modal */}
      {showForumLogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black w-[90%] max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b-4 border-black bg-black text-white flex justify-between items-center">
              <h2 className="text-lg font-bold">Forum Engine 日志查看</h2>
              <button
                onClick={() => setShowForumLogModal(false)}
                className="text-white hover:text-gray-300 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 bg-black text-green-400 font-mono text-sm">
              <pre className="whitespace-pre-wrap break-words">
                {forumLog || '正在加载日志...'}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

