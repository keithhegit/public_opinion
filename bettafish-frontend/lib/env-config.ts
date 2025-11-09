/**
 * 环境变量配置
 * 从环境变量读取LLM API Keys
 */

export const envConfig = {
  // API URL
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787',
  
  // LLM API Keys (从环境变量读取)
  insightEngineApiKey: process.env.NEXT_PUBLIC_INSIGHT_ENGINE_API_KEY || '',
  mediaEngineApiKey: process.env.NEXT_PUBLIC_MEDIA_ENGINE_API_KEY || '',
  queryEngineApiKey: process.env.NEXT_PUBLIC_QUERY_ENGINE_API_KEY || '',
  reportEngineApiKey: process.env.NEXT_PUBLIC_REPORT_ENGINE_API_KEY || '',
  
  // 检查是否已配置
  hasInsightKey: !!process.env.NEXT_PUBLIC_INSIGHT_ENGINE_API_KEY,
  hasMediaKey: !!process.env.NEXT_PUBLIC_MEDIA_ENGINE_API_KEY,
  hasQueryKey: !!process.env.NEXT_PUBLIC_QUERY_ENGINE_API_KEY,
  hasReportKey: !!process.env.NEXT_PUBLIC_REPORT_ENGINE_API_KEY,
  
  // 检查所有Key是否已配置
  allKeysConfigured: () => {
    return !!(
      process.env.NEXT_PUBLIC_INSIGHT_ENGINE_API_KEY &&
      process.env.NEXT_PUBLIC_MEDIA_ENGINE_API_KEY &&
      process.env.NEXT_PUBLIC_QUERY_ENGINE_API_KEY &&
      process.env.NEXT_PUBLIC_REPORT_ENGINE_API_KEY
    );
  },
};

