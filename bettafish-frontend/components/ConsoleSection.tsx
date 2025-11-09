'use client';

import { useEffect, useRef } from 'react';

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

  return (
    <div className="flex-[1.2] flex flex-col bg-white min-h-0 overflow-hidden">
      {/* 应用切换按钮 */}
      <div className="flex border-b-2 border-black">
        {apps.map((app) => {
          const engine = engines[app.name];
          const isActive = activeApp === app.name;
          const isLocked = app.name === 'report' && 
            (engines.insight.status !== 'running' || 
             engines.media.status !== 'running' || 
             engines.query.status !== 'running');

          return (
            <button
              key={app.name}
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
    </div>
  );
};

