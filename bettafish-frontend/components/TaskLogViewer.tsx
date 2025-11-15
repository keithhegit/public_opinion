'use client';

import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface TaskLogViewerProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  appName: string;
  taskQuery: string;
}

const engineLabels: Record<string, string> = {
  insight: '舆情数据库',
  media: '媒体爬虫',
  query: '热搜分析',
  report: '报表分析',
};

export const TaskLogViewer = ({ isOpen, onClose, taskId, appName, taskQuery }: TaskLogViewerProps) => {
  const [logContent, setLogContent] = useState('');
  const [loading, setLoading] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && taskId && appName) {
      loadLog();
    }
  }, [isOpen, taskId, appName]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logContent]);

  const loadLog = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getTaskLog(taskId, appName);
      if (response.success && response.data) {
        setLogContent(response.data);
      } else {
        toast.error('加载日志失败');
      }
    } catch (error) {
      console.error('Failed to load log:', error);
      toast.error('加载日志失败');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${taskId}_${appName}_log_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('日志已导出');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b-2 flex items-center justify-between" style={{ borderColor: '#1574FF' }}>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#1574FF' }}>
              {engineLabels[appName] || appName} - 任务日志
            </h2>
            <p className="text-sm text-gray-600 mt-1">任务: {taskQuery}</p>
            <p className="text-xs text-gray-500 mt-1">任务ID: {taskId}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 border-2 rounded font-bold transition-all text-sm"
              style={{
                borderColor: '#1574FF',
                color: '#1574FF',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e6f0ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              导出日志
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              style={{ width: '32px', height: '32px' }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          ref={logRef}
          className="flex-1 overflow-y-auto p-6 font-mono text-sm"
          style={{
            backgroundColor: '#1a1a1a',
            color: '#10b981',
            fontFamily: 'monospace',
          }}
        >
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#1574FF' }} />
              <p className="mt-4 text-gray-400">加载中...</p>
            </div>
          ) : logContent ? (
            <pre className="whitespace-pre-wrap break-words">{logContent}</pre>
          ) : (
            <div className="text-center py-8 text-gray-400">暂无日志内容</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 flex justify-end" style={{ borderColor: '#1574FF' }}>
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 rounded font-bold transition-all"
            style={{
              borderColor: '#1574FF',
              color: '#1574FF',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e6f0ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

