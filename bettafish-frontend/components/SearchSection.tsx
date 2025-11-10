'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfigDialog } from './ConfigDialog';
import { ReportDialog } from './ReportDialog';

interface Engine {
  status: 'stopped' | 'starting' | 'running';
  output: string;
}

interface SearchSectionProps {
  onSearch: (query: string) => void;
  allEnginesReady?: boolean;
  engineStatuses?: Record<string, Engine>;
}

export const SearchSection = ({ onSearch, allEnginesReady = false, engineStatuses = {} }: SearchSectionProps) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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

  // 引擎状态显示
  const engineLabels: Record<string, string> = {
    insight: 'Insight Engine',
    media: 'Media Engine',
    query: 'Query Engine',
    report: 'Report Engine',
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
    <div className="border-b-2 border-black p-5 bg-white">
      <h1 className="text-2xl font-bold text-center mb-5 tracking-wide">
        微舆
      </h1>
      
      {/* 引擎启动状态提示 */}
      <div className="max-w-[950px] mx-auto mb-3">
        <div className="flex flex-wrap gap-3 justify-center text-sm">
          {engineStatusList.map(({ name, label, statusIcon, statusText }) => (
            <div
              key={name}
              className={`px-3 py-1 rounded border ${
                getEngineStatus(name) === 'running'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : getEngineStatus(name) === 'starting'
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              <span className="mr-1">{statusIcon}</span>
              <span className="font-medium">{label}</span>
              <span className="ml-1">{statusText}</span>
            </div>
          ))}
        </div>
        
        {/* 所有引擎就绪提示 */}
        {allEnginesReady && (
          <div className="mt-3 text-center">
            <p className="text-green-600 font-semibold text-base">
              ✅ 所有引擎已就绪，现在可以开始搜索舆情了！
            </p>
            <p className="text-gray-500 text-sm mt-1">
              请在下方输入框输入您要分析的舆情主题
            </p>
          </div>
        )}
      </div>
      
      <div className="flex items-stretch gap-3 max-w-[950px] mx-auto mb-2">
        <ConfigDialog>
          <Button
            variant="outline"
            className="border-2 border-black min-w-[120px]"
          >
            配置
          </Button>
        </ConfigDialog>
        
        <div className="flex flex-1 border-2 border-black">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={allEnginesReady ? "请输入搜索查询..." : "等待引擎启动中..."}
            disabled={!allEnginesReady}
            className="flex-1 px-4 py-3 border-none outline-none text-base bg-white"
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching || !query.trim() || !allEnginesReady}
            className="px-6 py-3 border-l-2 border-black bg-black text-white font-bold hover:bg-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed"
            title={!allEnginesReady ? '请等待所有引擎启动完成' : ''}
          >
            {isSearching ? '搜索中...' : '搜索'}
          </Button>
          <ReportDialog>
            <Button
              variant="outline"
              className="px-5 py-3 border-l-2 border-black bg-white hover:bg-gray-100"
            >
              生成报告
            </Button>
          </ReportDialog>
        </div>
      </div>
    </div>
  );
};

