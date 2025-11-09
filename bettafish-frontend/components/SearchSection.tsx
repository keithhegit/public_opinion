'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfigDialog } from './ConfigDialog';
import { ReportDialog } from './ReportDialog';

interface SearchSectionProps {
  onSearch: (query: string) => void;
}

export const SearchSection = ({ onSearch }: SearchSectionProps) => {
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

  return (
    <div className="border-b-2 border-black p-5 bg-white">
      <h1 className="text-2xl font-bold text-center mb-5 tracking-wide">
        微舆
      </h1>
      
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
            placeholder="请输入搜索查询..."
            className="flex-1 px-4 py-3 border-none outline-none text-base bg-white"
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="px-6 py-3 border-l-2 border-black bg-black text-white font-bold hover:bg-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed"
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

