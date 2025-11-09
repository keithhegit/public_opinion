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

interface ConfigField {
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'password';
  description?: string;
}

export const ConfigDialog = ({ children }: ConfigDialogProps) => {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [quickMode, setQuickMode] = useState(true); // 快速配置模式

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

  // 配置字段定义 - 带标签和说明
  const configSections: Record<string, ConfigField[]> = {
    quick: [
      { 
        key: 'INSIGHT_ENGINE_API_KEY', 
        label: 'Insight Engine API Key', 
        required: true,
        description: '用于洞察分析的LLM API密钥（推荐Kimi）'
      },
      { 
        key: 'MEDIA_ENGINE_API_KEY', 
        label: 'Media Engine API Key', 
        required: true,
        description: '用于媒体内容理解的LLM API密钥（推荐Gemini）'
      },
      { 
        key: 'QUERY_ENGINE_API_KEY', 
        label: 'Query Engine API Key', 
        required: true,
        description: '用于搜索和信息汇总的LLM API密钥（推荐DeepSeek）'
      },
      { 
        key: 'REPORT_ENGINE_API_KEY', 
        label: 'Report Engine API Key', 
        required: true,
        description: '用于报告生成的LLM API密钥（推荐Gemini）'
      },
    ],
    database: [
      { key: 'DB_DIALECT', label: '数据库类型', placeholder: 'mysql 或 postgresql' },
      { key: 'DB_HOST', label: '数据库主机', placeholder: 'localhost 或 IP地址' },
      { key: 'DB_PORT', label: '端口', placeholder: '3306 (MySQL) 或 5432 (PostgreSQL)' },
      { key: 'DB_USER', label: '用户名', placeholder: '数据库用户名' },
      { key: 'DB_PASSWORD', label: '密码', type: 'password', placeholder: '数据库密码' },
      { key: 'DB_NAME', label: '数据库名称', placeholder: '数据库名称' },
      { key: 'DB_CHARSET', label: '字符集', placeholder: 'utf8mb4 (推荐)' },
    ],
    insight: [
      { key: 'INSIGHT_ENGINE_API_KEY', label: 'API Key', required: true, description: 'Kimi API密钥' },
      { key: 'INSIGHT_ENGINE_BASE_URL', label: 'Base URL', placeholder: 'https://api.moonshot.cn/v1' },
      { key: 'INSIGHT_ENGINE_MODEL_NAME', label: '模型名称', placeholder: 'kimi-k2-0711-preview' },
    ],
    media: [
      { key: 'MEDIA_ENGINE_API_KEY', label: 'API Key', required: true, description: 'Gemini API密钥' },
      { key: 'MEDIA_ENGINE_BASE_URL', label: 'Base URL', placeholder: 'https://aihubmix.com/v1' },
      { key: 'MEDIA_ENGINE_MODEL_NAME', label: '模型名称', placeholder: 'gemini-2.5-pro' },
    ],
    query: [
      { key: 'QUERY_ENGINE_API_KEY', label: 'API Key', required: true, description: 'DeepSeek API密钥' },
      { key: 'QUERY_ENGINE_BASE_URL', label: 'Base URL', placeholder: 'https://api.deepseek.com' },
      { key: 'QUERY_ENGINE_MODEL_NAME', label: '模型名称', placeholder: 'deepseek-reasoner' },
    ],
    report: [
      { key: 'REPORT_ENGINE_API_KEY', label: 'API Key', required: true, description: 'Gemini API密钥' },
      { key: 'REPORT_ENGINE_BASE_URL', label: 'Base URL', placeholder: 'https://aihubmix.com/v1' },
      { key: 'REPORT_ENGINE_MODEL_NAME', label: '模型名称', placeholder: 'gemini-2.5-pro' },
    ],
    forum: [
      { key: 'FORUM_HOST_API_KEY', label: 'API Key', description: 'Qwen3 API密钥（硅基流动）' },
      { key: 'FORUM_HOST_BASE_URL', label: 'Base URL', placeholder: 'https://api.siliconflow.cn/v1' },
      { key: 'FORUM_HOST_MODEL_NAME', label: '模型名称', placeholder: 'Qwen/Qwen3-235B-A22B-Instruct-2507' },
    ],
    search: [
      { key: 'TAVILY_API_KEY', label: 'Tavily API Key', description: 'Tavily搜索API密钥（可选）' },
      { key: 'BOCHA_WEB_SEARCH_API_KEY', label: 'Bocha API Key', description: 'Bocha搜索API密钥（可选）' },
      { key: 'BOCHA_BASE_URL', label: 'Bocha Base URL', placeholder: 'https://api.bochaai.com/v1/ai-search' },
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
            {quickMode ? '快速配置：只需填写最关键的LLM API密钥即可开始测试' : '完整配置：配置所有系统参数'}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">加载配置中...</div>
        ) : (
          <>
            {/* 模式切换 */}
            <div className="flex justify-end mb-4">
              <Button
                variant={quickMode ? "default" : "outline"}
                size="sm"
                onClick={() => setQuickMode(true)}
                className="mr-2"
              >
                快速配置
              </Button>
              <Button
                variant={!quickMode ? "default" : "outline"}
                size="sm"
                onClick={() => setQuickMode(false)}
              >
                完整配置
              </Button>
            </div>

            {quickMode ? (
              // 快速配置模式 - 只显示关键的API Key
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                    💡 <strong>快速开始</strong>：只需填写以下4个API密钥即可开始测试。其他配置使用默认值。
                  </p>
                </div>
                {configSections.quick.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                    </div>
                    {field.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{field.description}</p>
                    )}
                    <Input
                      type="password"
                      value={config[field.key] || ''}
                      onChange={(e) => updateConfig(field.key, e.target.value)}
                      placeholder={`请输入 ${field.label}`}
                      className="font-mono text-sm"
                    />
                  </div>
                ))}
                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ 提示：如需配置数据库或其他参数，请切换到&ldquo;完整配置&rdquo;模式。
                  </p>
                </div>
              </div>
            ) : (
              // 完整配置模式 - 显示所有配置项
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

                {Object.entries(configSections).filter(([key]) => key !== 'quick').map(([section, fields]) => (
                  <TabsContent key={section} value={section} className="space-y-4 mt-4">
                    {fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                        </div>
                        {field.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{field.description}</p>
                        )}
                        <Input
                          type={field.type || (field.key.includes('PASSWORD') || field.key.includes('KEY') ? 'password' : 'text')}
                          value={config[field.key] || ''}
                          onChange={(e) => updateConfig(field.key, e.target.value)}
                          placeholder={field.placeholder || `请输入 ${field.label}`}
                          className={field.key.includes('KEY') ? 'font-mono text-sm' : ''}
                        />
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </>
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

