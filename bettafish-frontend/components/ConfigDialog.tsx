'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConfigDialogProps {
  children: React.ReactNode;
}

export const ConfigDialog = ({ children }: ConfigDialogProps) => {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      loadConfig();
    }
  }, [open]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getConfig();
      setConfig(data);
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.updateConfig(config);
      setOpen(false);
    } catch (error) {
      console.error('Failed to save config:', error);
      alert('保存配置失败，请检查控制台');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const configSections = {
    database: [
      'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_CHARSET', 'DB_DIALECT'
    ],
    insight: [
      'INSIGHT_ENGINE_API_KEY', 'INSIGHT_ENGINE_BASE_URL', 'INSIGHT_ENGINE_MODEL_NAME'
    ],
    media: [
      'MEDIA_ENGINE_API_KEY', 'MEDIA_ENGINE_BASE_URL', 'MEDIA_ENGINE_MODEL_NAME'
    ],
    query: [
      'QUERY_ENGINE_API_KEY', 'QUERY_ENGINE_BASE_URL', 'QUERY_ENGINE_MODEL_NAME'
    ],
    report: [
      'REPORT_ENGINE_API_KEY', 'REPORT_ENGINE_BASE_URL', 'REPORT_ENGINE_MODEL_NAME'
    ],
    forum: [
      'FORUM_HOST_API_KEY', 'FORUM_HOST_BASE_URL', 'FORUM_HOST_MODEL_NAME'
    ],
    search: [
      'TAVILY_API_KEY', 'BOCHA_WEB_SEARCH_API_KEY', 'BOCHA_BASE_URL'
    ],
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>系统配置</DialogTitle>
          <DialogDescription>
            配置数据库连接、LLM API密钥等系统参数
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">加载配置中...</div>
        ) : (
          <Tabs defaultValue="database" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="database">数据库</TabsTrigger>
              <TabsTrigger value="insight">Insight</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="query">Query</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
              <TabsTrigger value="forum">Forum</TabsTrigger>
              <TabsTrigger value="search">搜索</TabsTrigger>
            </TabsList>

            {Object.entries(configSections).map(([section, keys]) => (
              <TabsContent key={section} value={section} className="space-y-4 mt-4">
                {keys.map((key) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium">{key}</label>
                    <Input
                      type={key.includes('PASSWORD') || key.includes('KEY') ? 'password' : 'text'}
                      value={config[key] || ''}
                      onChange={(e) => updateConfig(key, e.target.value)}
                      placeholder={`请输入 ${key}`}
                    />
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? '保存中...' : '保存配置'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

