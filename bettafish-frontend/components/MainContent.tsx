'use client';

interface Engine {
  status: 'stopped' | 'starting' | 'running';
  output: string;
}

interface MainContentProps {
  activeApp: string;
  engines: Record<string, Engine>;
  onStartEngine: (appName: string) => void;
  onStopEngine: (appName: string) => void;
}

export const MainContent = ({
  activeApp,
  engines,
  onStartEngine,
  onStopEngine,
}: MainContentProps) => {
  const currentEngine = engines[activeApp];

  return (
    <div className="flex-[1.8] border-r-2 bg-white relative" style={{ borderColor: '#1574FF' }}>
      <div className="p-4 border-b-2 bg-white font-bold text-center" style={{ borderColor: '#1574FF', color: '#1574FF' }}>
        {activeApp === 'insight' && '舆情数据库'}
        {activeApp === 'media' && '媒体爬虫'}
        {activeApp === 'query' && '热搜分析'}
        {activeApp === 'report' && '报表分析'}
      </div>
      
      <div className="h-[calc(100%-60px)] relative overflow-hidden">
        {currentEngine?.status === 'running' ? (
          <div className="h-full p-4 overflow-y-auto">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                ✅ Engine 正在运行
              </p>
              <p className="text-xs text-gray-500">
                引擎输出请查看右侧控制台面板
              </p>
            </div>
            {currentEngine.output ? (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
                <p className="text-xs text-gray-500 mb-2">最新输出：</p>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
                  {currentEngine.output.split('\n').slice(-10).join('\n')}
                </pre>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
                <p className="text-xs text-gray-500">
                  等待引擎输出... 请在搜索框输入查询以触发引擎工作
                </p>
              </div>
            )}
            <div className="mt-4">
              <button
                onClick={() => onStopEngine(activeApp)}
                className="px-4 py-2 text-white text-sm font-bold rounded transition-all duration-200 active:scale-95"
                style={{ backgroundColor: '#ef4444' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                }}
              >
                停止 Engine
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 mb-4">
                {currentEngine?.status === 'starting'
                  ? 'Engine正在启动...'
                  : 'Engine未运行'}
              </p>
              <button
                onClick={() => onStartEngine(activeApp)}
                disabled={currentEngine?.status === 'starting'}
                className="px-6 py-2 text-white font-bold disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
                style={{ 
                  backgroundColor: currentEngine?.status === 'starting' ? '#9ca3af' : '#1574FF',
                }}
                onMouseEnter={(e) => {
                  if (currentEngine?.status !== 'starting') {
                    e.currentTarget.style.backgroundColor = '#0d5acc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentEngine?.status !== 'starting') {
                    e.currentTarget.style.backgroundColor = '#1574FF';
                  }
                }}
              >
                {currentEngine?.status === 'starting' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    启动中...
                  </span>
                ) : (
                  '启动Engine'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

