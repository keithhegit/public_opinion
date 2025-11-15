'use client';

import { useEffect, useRef } from 'react';
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
    { name: 'insight', label: '舆情数据库' },
    { name: 'media', label: '媒体爬虫' },
    { name: 'query', label: '热搜分析' },
    { name: 'report', label: '报表分析' },
  ];

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

  return (
    <div className="flex-[1.2] flex flex-col bg-white min-h-0 overflow-hidden">
      {/* 应用切换按钮和导出按钮 */}
      <div className="flex border-b-2" style={{ borderColor: '#1574FF' }}>
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
                className={`flex-1 p-4 border-r-2 font-bold transition-all ${
                  isLocked
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white'
                }`}
                style={{
                  borderColor: '#1574FF',
                  backgroundColor: isActive ? '#1574FF' : (isLocked ? '#f3f4f6' : '#ffffff'),
                  color: isActive ? '#ffffff' : (isLocked ? '#9ca3af' : '#1574FF'),
                }}
                onMouseEnter={(e) => {
                  if (!isActive && !isLocked) {
                    e.currentTarget.style.backgroundColor = '#e6f0ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive && !isLocked) {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }
                }}
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
              <button
                onClick={() => handleExportLog(app.name)}
                className="px-2 py-1 text-xs border-r-2 bg-gray-50 transition-all duration-200"
                style={{ 
                  borderColor: '#1574FF',
                  color: '#1574FF',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e6f0ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                title={`导出 ${app.label} 日志`}
              >
                导出日志
              </button>
            </div>
          );
        })}
      </div>

      {/* 控制台输出 */}
      <div
        ref={consoleRef}
        className="flex-1 p-4 font-mono text-sm overflow-y-auto"
        style={{ 
          backgroundColor: '#1a1a1a',
          color: '#10b981',
          fontFamily: 'monospace',
        }}
      >
        <pre className="whitespace-pre-wrap break-words">
          {currentOutput || '等待输出...'}
        </pre>
      </div>
    </div>
  );
};
