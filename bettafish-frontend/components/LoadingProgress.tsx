'use client';

import { useEffect, useState, useCallback } from 'react';

interface LoadingProgressProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export const LoadingProgress = ({ isVisible, onComplete }: LoadingProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      return;
    }

    // 模拟进度条（假的进度，但会平滑增长）
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          // 保持在95%，等待真实引擎启动完成
          return prev;
        }
        // 前80%快速，后15%慢速
        const increment = prev < 80 ? 2 : 0.5;
        return Math.min(prev + increment, 95);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible]);

  // 当引擎真正启动完成时，进度条到100%
  useEffect(() => {
    if (isVisible && progress >= 95) {
      // 等待外部调用 onComplete 来触发100%
    }
  }, [isVisible, progress]);

  const handleComplete = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      onComplete?.();
    }, 500);
  }, [onComplete]);

  // 暴露方法给父组件
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).completeLoadingProgress = handleComplete;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).completeLoadingProgress;
      }
    };
  }, [handleComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fade-in">
      <div className="w-full max-w-md px-8">
        <h2 className="text-3xl font-bold text-center mb-8 tracking-wide">OgInight</h2>
        
        <div className="mb-6">
          <div className="w-full bg-gray-100 border-2 border-black h-10 relative overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* 进度条动画效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-sm font-bold text-black">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-700 text-base font-medium mb-2">
            正在启动引擎...
          </p>
          <div className="flex justify-center gap-1">
            <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

