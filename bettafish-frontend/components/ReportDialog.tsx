'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ReportDialogProps {
  children: React.ReactNode;
  onReportGenerated?: (taskId: string) => void;
}

export const ReportDialog = ({ children, onReportGenerated }: ReportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [customTemplate, setCustomTemplate] = useState('');
  const [generating, setGenerating] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleGenerate = async () => {
    if (!query.trim()) {
      alert('请输入查询内容');
      return;
    }

    setGenerating(true);
    setStatus('正在生成报告...');
    
    try {
      // 检查引擎是否就绪
      const checkResult = await apiClient.checkEnginesReady();
      if (!checkResult.data?.ready) {
        alert('请先等待其他三个Engine完成工作');
        setGenerating(false);
        return;
      }

      // 生成报告
      const result = await apiClient.generateReport(query, customTemplate);
      if (result.task_id) {
        setTaskId(result.task_id);
        setStatus('报告生成任务已提交，任务ID: ' + result.task_id);
        
        if (onReportGenerated) {
          onReportGenerated(result.task_id);
        }
        
        // 可以在这里开始轮询状态
        // pollReportStatus(result.task_id);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      setStatus('生成报告失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setGenerating(false);
    }
  };

  const pollReportStatus = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const status = await apiClient.getReportStatus(id);
        setStatus(`状态: ${status.status}, 进度: ${status.progress}%`);
        
        if (status.status === 'completed' || status.status === 'error') {
          clearInterval(interval);
          if (status.status === 'completed') {
            setStatus('报告生成完成！');
          }
        }
      } catch (error) {
        console.error('Failed to poll status:', error);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>生成报告</DialogTitle>
          <DialogDescription>
            基于三个Engine的分析结果生成综合报告
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">查询内容 *</label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="请输入要分析的查询内容..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">自定义模板（可选）</label>
            <Textarea
              value={customTemplate}
              onChange={(e) => setCustomTemplate(e.target.value)}
              placeholder="上传或输入自定义报告模板..."
              rows={6}
            />
          </div>

          {status && (
            <div className="p-3 bg-gray-100 rounded text-sm">
              {status}
            </div>
          )}

          {taskId && (
            <div className="p-3 bg-blue-50 rounded text-sm">
              <p>任务ID: {taskId}</p>
              <p className="text-xs text-gray-600 mt-1">
                可以在控制台查看报告生成进度
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleGenerate} disabled={generating || !query.trim()}>
            {generating ? '生成中...' : '生成报告'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

