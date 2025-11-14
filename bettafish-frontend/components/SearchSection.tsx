'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ReportDialog } from './ReportDialog';
import { TasksHistoryDialog } from './TasksHistoryDialog';
import { TaskLogViewer } from './TaskLogViewer';

interface Engine {
  status: 'stopped' | 'starting' | 'running';
  output: string;
}

interface SearchSectionProps {
  onSearch: (query: string) => void;
  onNewTask?: () => void;
  allEnginesReady?: boolean;
  engineStatuses?: Record<string, Engine>;
}

export const SearchSection = ({ onSearch, onNewTask, allEnginesReady = false, engineStatuses = {} }: SearchSectionProps) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLogViewer, setShowLogViewer] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{ taskId: string; appName: string; query: string } | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      await onSearch(query);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 获取引擎状态
  const getEngineStatus = (name: string) => {
    return engineStatuses[name]?.status || 'stopped';
  };

  // 引擎状态显示（只修改显示文本，不影响代码逻辑）
  const engineLabels: Record<string, string> = {
    insight: '舆情数据库',
    media: '媒体爬虫',
    query: '热搜分析',
    report: '报表分析',
  };

  const engineStatusList = ['insight', 'media', 'query', 'report'].map((name) => {
    const status = getEngineStatus(name);
    const label = engineLabels[name];
    let statusIcon = '❌';
    let statusText = '未启动';
    
    if (status === 'running') {
      statusIcon = '✅';
      statusText = '已启动';
    } else if (status === 'starting') {
      statusIcon = '⏳';
      statusText = '启动中...';
    }
    
    return { name, label, statusIcon, statusText, status };
  });

  return (
    <div className="border-b-2 p-5 bg-white relative" style={{ borderColor: '#1574FF' }}>
      {/* Logo 在左上角 */}
      <div className="absolute top-5 left-5">
        <Image
          src="https://pub-c98d5902eedf42f6a9765dfad981fd88.r2.dev/Icon/2023.10.24--ogcloudlogo-RGB-TM.png"
          alt="OgInight Logo"
          width={120}
          height={40}
          className="object-contain"
          unoptimized
        />
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-5 tracking-wide" style={{ color: '#1574FF' }}>
        OgInsigh-多智能体舆情分析工具
      </h1>
      
      {/* 引擎启动状态提示 */}
      <div className="max-w-[950px] mx-auto mb-3">
        <div className="flex flex-wrap gap-3 justify-center text-sm">
          {engineStatusList.map(({ name, label, statusIcon, statusText }) => {
            const status = getEngineStatus(name);
            let bgColor = '#f3f4f6';
            let borderColor = '#e5e7eb';
            let textColor = '#6b7280';
            
            if (status === 'running') {
              bgColor = '#e6f0ff';
              borderColor = '#1574FF';
              textColor = '#1574FF';
            } else if (status === 'starting') {
              bgColor = '#fef3c7';
              borderColor = '#f59e0b';
              textColor = '#d97706';
            }
            
            return (
            <div
              key={name}
              className="px-3 py-1 rounded border transition-all duration-200"
              style={{
                backgroundColor: bgColor,
                borderColor: borderColor,
                color: textColor,
              }}
            >
              <span className="mr-1">{statusIcon}</span>
              <span className="font-medium">{label}</span>
              <span className="ml-1">{statusText}</span>
            </div>
            );
          })}
        </div>
        
        {/* 所有引擎就绪提示 */}
        {allEnginesReady && (
          <div className="mt-3 text-center">
            <p className="font-semibold text-base" style={{ color: '#1574FF' }}>
              ✅ 所有引擎已就绪，现在可以开始搜索舆情了！
            </p>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
              请在下方输入框输入您要分析的舆情主题
            </p>
          </div>
        )}
      </div>
      
      <div className="flex items-stretch gap-3 max-w-[950px] mx-auto mb-2">
        {/* 历史任务和新任务按钮 */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowHistory(true)}
            className="px-4 py-2 border-2 rounded font-bold transition-all text-sm whitespace-nowrap"
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
            📋 历史任务
          </button>
          <button
            onClick={async () => {
              if (onNewTask) {
                await onNewTask();
              }
            }}
            className="px-4 py-2 border-2 rounded font-bold transition-all text-sm whitespace-nowrap"
            style={{
              borderColor: '#10b981',
              color: '#10b981',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d1fae5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            ✨ 新任务
          </button>
        </div>
        
        <div className="flex flex-1 border-2" style={{ borderColor: '#1574FF' }}>
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={allEnginesReady ? "请输入搜索查询..." : "等待引擎启动中..."}
            disabled={!allEnginesReady}
            className="flex-1 px-4 py-3 border-none outline-none text-base bg-white focus:outline-none focus:ring-2 transition-all"
            style={{ 
              '--tw-ring-color': '#1574FF',
            } as React.CSSProperties}
            onFocus={(e) => {
              e.target.style.outline = 'none';
              e.target.style.boxShadow = '0 0 0 2px #1574FF';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching || !query.trim() || !allEnginesReady}
            className="px-6 py-3 border-l-2 text-white font-bold disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
            style={{ 
              borderColor: '#1574FF',
              backgroundColor: isSearching || !query.trim() || !allEnginesReady ? '#9ca3af' : '#1574FF',
            }}
            onMouseEnter={(e) => {
              if (!isSearching && query.trim() && allEnginesReady) {
                e.currentTarget.style.backgroundColor = '#0d5acc';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSearching && query.trim() && allEnginesReady) {
                e.currentTarget.style.backgroundColor = '#1574FF';
              }
            }}
            title={!allEnginesReady ? '请等待所有引擎启动完成' : ''}
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                搜索中...
              </span>
            ) : (
              '搜索'
            )}
          </Button>
          <ReportDialog>
            <Button
              variant="outline"
              className="px-5 py-3 border-l-2 bg-white transition-all duration-200"
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
              生成报告
            </Button>
          </ReportDialog>
        </div>
      </div>

      {/* 历史任务对话框 */}
      <TasksHistoryDialog
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onViewLog={(taskId, appName, query) => {
          setSelectedTask({ taskId, appName, query });
          setShowLogViewer(true);
          setShowHistory(false);
        }}
      />

      {/* 任务日志查看器 */}
      {selectedTask && (
        <TaskLogViewer
          isOpen={showLogViewer}
          onClose={() => {
            setShowLogViewer(false);
            setSelectedTask(null);
          }}
          taskId={selectedTask.taskId}
          appName={selectedTask.appName}
          taskQuery={selectedTask.query}
        />
      )}
    </div>
  );
};

