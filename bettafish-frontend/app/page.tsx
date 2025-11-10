'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { SearchSection } from '@/components/SearchSection';
import { MainContent } from '@/components/MainContent';
import { ConsoleSection } from '@/components/ConsoleSection';

type EngineStatus = 'stopped' | 'starting' | 'running';

interface Engine {
  status: EngineStatus;
  output: string;
}

export default function Home() {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [engines, setEngines] = useState<Record<string, Engine>>({
    insight: { status: 'stopped' as EngineStatus, output: '' },
    media: { status: 'stopped' as EngineStatus, output: '' },
    query: { status: 'stopped' as EngineStatus, output: '' },
    report: { status: 'stopped' as EngineStatus, output: '' },
  });
  const [activeApp, setActiveApp] = useState<string>('insight');
  const [forumLog, setForumLog] = useState<string>('');

  // 轮询系统状态
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await apiClient.getStatus();
        setSystemStatus(status);
        
        // 更新Engine状态
        if (status.backend?.engines) {
          setEngines((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(status.backend.engines).map(([key, value]: [string, any]) => [
                key,
                { 
                  status: (value.status || 'stopped') as EngineStatus, 
                  output: prev[key]?.output || '' 
                }
              ])
            )
          }));
        }
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000); // 每2秒轮询

    return () => clearInterval(interval);
  }, []);

  // 轮询Engine输出
  useEffect(() => {
    const fetchOutput = async (appName: string) => {
      try {
        const output = await apiClient.getEngineOutput(appName);
        if (output.data) {
          setEngines((prev) => ({
            ...prev,
            [appName]: { ...prev[appName as keyof typeof prev], output: output.data }
          }));
        }
      } catch (error) {
        console.error(`Failed to fetch output for ${appName}:`, error);
      }
    };

    const interval = setInterval(() => {
      Object.keys(engines).forEach((appName) => {
        if (engines[appName as keyof typeof engines].status === 'running') {
          fetchOutput(appName);
        }
      });
    }, 3000); // 每3秒轮询

    return () => clearInterval(interval);
  }, [engines]);

  // 轮询论坛日志
  useEffect(() => {
    const fetchForumLog = async () => {
      try {
        const log = await apiClient.getForumLog();
        if (log.data) {
          setForumLog(log.data);
        }
      } catch (error) {
        console.error('Failed to fetch forum log:', error);
      }
    };

    const interval = setInterval(fetchForumLog, 5000); // 每5秒轮询

    return () => clearInterval(interval);
  }, []);

  const handleStartEngine = async (appName: string) => {
    try {
      await apiClient.startEngine(appName);
      setEngines((prev) => ({
        ...prev,
        [appName]: { ...prev[appName as keyof typeof prev], status: 'starting' }
      }));
    } catch (error) {
      console.error(`Failed to start ${appName}:`, error);
    }
  };

  const handleStopEngine = async (appName: string) => {
    try {
      await apiClient.stopEngine(appName);
      setEngines((prev) => ({
        ...prev,
        [appName]: { ...prev[appName as keyof typeof prev], status: 'stopped' }
      }));
    } catch (error) {
      console.error(`Failed to stop ${appName}:`, error);
    }
  };

  return (
    <div className="flex flex-col h-screen border-2 border-black overflow-hidden">
      <SearchSection
        onSearch={async (query) => {
          try {
            const result = await apiClient.search(query);
            if (result.success) {
              console.log('Search successful:', result);
              // 搜索成功后会触发引擎处理，输出会通过轮询自动更新
            } else {
              console.error('Search failed:', result.error || result.message);
              alert(result.error || result.message || '搜索失败');
            }
          } catch (error) {
            console.error('Search failed:', error);
            alert('搜索失败，请检查控制台');
          }
        }}
      />
      
      <div className="flex flex-1 min-h-0">
        <MainContent
          activeApp={activeApp}
          engines={engines}
          onStartEngine={handleStartEngine}
          onStopEngine={handleStopEngine}
        />
        
        <ConsoleSection
          activeApp={activeApp}
          engines={engines}
          forumLog={forumLog}
          onAppChange={setActiveApp}
        />
      </div>
    </div>
  );
}
