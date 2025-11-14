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

  // 页面加载时清除旧日志（只在首次加载时执行）
  useEffect(() => {
    // 清除所有引擎的旧输出
    setEngines({
      insight: { status: 'stopped' as EngineStatus, output: '' },
      media: { status: 'stopped' as EngineStatus, output: '' },
      query: { status: 'stopped' as EngineStatus, output: '' },
      report: { status: 'stopped' as EngineStatus, output: '' },
    });
    setForumLog('');
  }, []); // 只在组件挂载时执行一次

  // 轮询系统状态
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await apiClient.getStatus();
        setSystemStatus(status);
        
        // 更新Engine状态（但不清除output，因为output由专门的轮询维护）
        if (status.backend?.engines) {
          setEngines((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(status.backend.engines).map(([key, value]: [string, any]) => [
                key,
                { 
                  status: (value.status || 'stopped') as EngineStatus, 
                  // 如果引擎状态变为stopped，清除其输出
                  output: (value.status === 'stopped' || value.status === 'starting') 
                    ? '' 
                    : (prev[key]?.output || '')
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
    // 用于跟踪每个引擎上次获取的日志内容hash，检测新任务开始
    const lastOutputHash: Record<string, string> = {};
    
    const fetchOutput = async (appName: string) => {
      try {
        const output = await apiClient.getEngineOutput(appName);
        if (output.data) {
          // output.data 可能是字符串或数组，统一处理为字符串
          const outputText = Array.isArray(output.data) 
            ? output.data.join('\n') 
            : String(output.data || '');
          
          // 检测是否包含新任务标记（后端会在新任务开始时写入）
          const hasNewTaskMarker = outputText.includes('========== 新任务开始:') || 
                                   outputText.includes('========== 开始执行搜索:');
          
          // 计算当前输出的hash（取前1000个字符作为标识）
          const currentHash = outputText.substring(0, 1000);
          const lastHash = lastOutputHash[appName] || '';
          
          setEngines((prev) => {
            const prevOutput = prev[appName]?.output || '';
            
            // 如果检测到新任务标记，或者输出内容完全不同（说明是新任务），清空旧日志
            if (hasNewTaskMarker || (currentHash !== lastHash && prevOutput && !outputText.includes(prevOutput.substring(0, 100)))) {
              lastOutputHash[appName] = currentHash;
              return {
                ...prev,
                [appName]: { ...prev[appName as keyof typeof prev], output: outputText }
              };
            }
            
            // 如果输出内容相同，不更新
            if (currentHash === lastHash) {
              return prev;
            }
            
            // 否则追加新内容（增量更新）
            // 检查是否是新内容（通过比较行数）
            const prevLines = prevOutput.split('\n');
            const currentLines = outputText.split('\n');
            
            if (currentLines.length > prevLines.length) {
              // 有新行，追加
              const newLines = currentLines.slice(prevLines.length);
              lastOutputHash[appName] = currentHash;
              return {
                ...prev,
                [appName]: { 
                  ...prev[appName as keyof typeof prev], 
                  output: prevOutput + (prevOutput ? '\n' : '') + newLines.join('\n')
                }
              };
            } else {
              // 行数没有增加，可能是内容被替换，使用新内容
              lastOutputHash[appName] = currentHash;
              return {
                ...prev,
                [appName]: { ...prev[appName as keyof typeof prev], output: outputText }
              };
            }
          });
        } else {
          // 如果没有数据，清空输出
          setEngines((prev) => ({
            ...prev,
            [appName]: { ...prev[appName as keyof typeof prev], output: '' }
          }));
          lastOutputHash[appName] = '';
        }
      } catch (error) {
        console.error(`Failed to fetch output for ${appName}:`, error);
      }
    };

    const interval = setInterval(() => {
      Object.keys(engines).forEach((appName) => {
        const engine = engines[appName as keyof typeof engines];
        // 只在running状态时获取输出，stopped时清空
        if (engine.status === 'running') {
          fetchOutput(appName);
        } else if (engine.status === 'stopped' && engine.output) {
          // 引擎停止时清空输出
          setEngines((prev) => ({
            ...prev,
            [appName]: { ...prev[appName as keyof typeof prev], output: '' }
          }));
          lastOutputHash[appName] = '';
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
      
      <div className="flex flex-col h-screen border-2 overflow-hidden" style={{ borderColor: '#1574FF' }}>
        <SearchSection
        onNewTask={async () => {
          // 清空当前任务状态
          try {
            await apiClient.clearCurrentTasks();
            // 清空前端状态
            setEngines({
              insight: { status: 'stopped' as EngineStatus, output: '' },
              media: { status: 'stopped' as EngineStatus, output: '' },
              query: { status: 'stopped' as EngineStatus, output: '' },
              report: { status: 'stopped' as EngineStatus, output: '' },
            });
            setForumLog('');
            toast.success('已清空当前任务，可以开始新任务了');
          } catch (error) {
            console.error('Failed to clear tasks:', error);
            toast.error('清空任务失败');
          }
        }}
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
