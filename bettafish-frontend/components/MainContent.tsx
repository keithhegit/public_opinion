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
    <div className="flex-[1.8] border-r-2 border-black bg-white relative">
      <div className="p-4 border-b-2 border-black bg-white font-bold text-center">
        {activeApp === 'insight' && 'Insight Engine'}
        {activeApp === 'media' && 'Media Engine'}
        {activeApp === 'query' && 'Query Engine'}
        {activeApp === 'report' && 'Report Engine'}
      </div>
      
      <div className="h-[calc(100%-60px)] relative overflow-hidden">
        {currentEngine?.status === 'running' ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 mb-4">
                Engine 正在运行
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Streamlit 应用运行在后端服务器上
              </p>
              <p className="text-xs text-gray-400">
                请通过后端 API 访问 Streamlit 应用
              </p>
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
                className="px-6 py-2 bg-black text-white font-bold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {currentEngine?.status === 'starting' ? '启动中...' : '启动Engine'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

