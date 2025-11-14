'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { SearchSection } from '@/components/SearchSection';
import { MainContent } from '@/components/MainContent';
import { ConsoleSection } from '@/components/ConsoleSection';
import { LoadingProgress } from '@/components/LoadingProgress';

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
  const [autoStartAttempted, setAutoStartAttempted] = useState(false);
  const [allEnginesReady, setAllEnginesReady] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // 自动启动所有引擎（页面加载时）
  useEffect(() => {
    if (autoStartAttempted) return;
    
    const autoStartEngines = async () => {
      setAutoStartAttempted(true);
      const engineNames = ['insight', 'media', 'query', 'report'];
      
      // 并行启动所有引擎
      const startPromises = engineNames.map(async (appName) => {
        try {
          await apiClient.startEngine(appName);
          setEngines((prev) => ({
            ...prev,
            [appName]: { ...prev[appName as keyof typeof prev], status: 'starting' }
          }));
        } catch (error) {
          console.error(`Failed to auto-start ${appName}:`, error);
        }
      });
      
      await Promise.all(startPromises);
    };
    
    autoStartEngines();
  }, [autoStartAttempted]);

  // 检查所有引擎是否就绪
  useEffect(() => {
    const engineNames = ['insight', 'media', 'query', 'report'];
    const allRunning = engineNames.every(
      (name) => engines[name]?.status === 'running'
    );
    setAllEnginesReady(allRunning);
    
    // 如果所有引擎就绪且加载进度条还在显示，完成加载
    if (allRunning && showLoading && !loadingComplete) {
      // 触发进度条完成
      if (typeof window !== 'undefined' && (window as any).completeLoadingProgress) {
        (window as any).completeLoadingProgress();
      }
      setLoadingComplete(true);
      
      // 延迟隐藏加载界面并显示Toast
      setTimeout(() => {
        setShowLoading(false);
        toast.success('启动成功，请在输入框输入您要分析的舆情主题', {
          duration: 5000,
          style: {
            fontSize: '16px',
            padding: '20px',
          },
        });
      }, 500);
    }
  }, [engines, showLoading, loadingComplete]);

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

  // 轮询Engine输出（更频繁，用于流式输出）
  useEffect(() => {
    const fetchOutput = async (appName: string) => {
      try {
        const output = await apiClient.getEngineOutput(appName);
        if (output.data) {
          // output.data 可能是字符串或数组，统一处理为字符串
          const outputText = Array.isArray(output.data) 
            ? output.data.join('\n') 
            : String(output.data || '');
          
          setEngines((prev) => ({
            ...prev,
            [appName]: { ...prev[appName as keyof typeof prev], output: outputText }
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
    }, 1000); // 每1秒轮询，实现流式输出效果

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

  // 获取引擎启动状态文本
  const getEngineStatusText = (name: string) => {
    const status = engines[name]?.status;
    const labels: Record<string, string> = {
      insight: '舆情数据库',
      media: '媒体爬虫',
      query: '热搜分析',
      report: '报表分析',
    };
    const label = labels[name] || name;
    
    switch (status) {
      case 'running':
        return `✅ ${label} 已启动`;
      case 'starting':
        return `⏳ ${label} 启动中...`;
      default:
        return `❌ ${label} 未启动`;
    }
  };

  return (
    <>
      <LoadingProgress 
        isVisible={showLoading} 
        onComplete={() => {
          // 加载完成回调
        }}
      />
      
      <div className="flex flex-col h-screen border-2 border-black overflow-hidden">
        <SearchSection
        onSearch={async (query) => {
          if (!allEnginesReady) {
            alert('请等待所有引擎启动完成后再进行搜索');
            return;
          }
          
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
        allEnginesReady={allEnginesReady}
        engineStatuses={engines}
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
    </>
  );
}
