'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface Task {
  task_id: string;
  query: string;
  engines: string[];
  start_time: string;
  end_time?: string;
  status: 'running' | 'completed' | 'error';
  completed_engines?: string[];
}

interface TasksHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onViewLog: (taskId: string, appName: string, query: string) => void;
}

export const TasksHistoryDialog = ({ isOpen, onClose, onViewLog }: TasksHistoryDialogProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTasks();
    }
  }, [isOpen]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getTasksHistory(50);
      if (response.success && response.tasks) {
        setTasks(response.tasks);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error('加载历史任务失败');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return timeStr;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981'; // green
      case 'error':
        return '#ef4444'; // red
      case 'running':
        return '#3b82f6'; // blue
      default:
        return '#6b7280'; // gray
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'error':
        return '失败';
      case 'running':
        return '运行中';
      default:
        return '未知';
    }
  };

  const engineLabels: Record<string, string> = {
    insight: '舆情数据库',
    media: '媒体爬虫',
    query: '热搜分析',
    report: '报表分析',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b-2 flex items-center justify-between" style={{ borderColor: '#1574FF' }}>
          <h2 className="text-2xl font-bold" style={{ color: '#1574FF' }}>
            历史任务
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            style={{ width: '32px', height: '32px' }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#1574FF' }} />
              <p className="mt-4 text-gray-600">加载中...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无历史任务
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.task_id}
                  className="border-2 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                  style={{ borderColor: selectedTask?.task_id === task.task_id ? '#1574FF' : '#e5e7eb' }}
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold" style={{ color: '#1574FF' }}>
                          {task.query}
                        </h3>
                        <span
                          className="px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: getStatusColor(task.status) }}
                        >
                          {getStatusText(task.status)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>开始时间: {formatTime(task.start_time)}</p>
                        {task.end_time && <p>结束时间: {formatTime(task.end_time)}</p>}
                        <p>
                          引擎: {task.engines.map(e => engineLabels[e] || e).join(', ')}
                        </p>
                        {task.completed_engines && task.completed_engines.length > 0 && (
                          <p>
                            已完成引擎: {task.completed_engines.map(e => engineLabels[e] || e).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {task.engines.map((appName) => (
                        <button
                          key={appName}
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewLog(task.task_id, appName, task.query);
                          }}
                          className="px-3 py-1 text-xs border rounded transition-all"
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
                          查看 {engineLabels[appName] || appName} 日志
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 flex justify-end" style={{ borderColor: '#1574FF' }}>
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

