/**
 * 情感分析服务
 * 可以使用外部 API 或轻量级模型
 */

import { callOpenAI } from './openai';

export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  details?: string;
}

export async function analyzeSentiment(text: string, env: Env): Promise<SentimentResult> {
  // 方法1: 使用 OpenAI API 进行情感分析
  const prompt = `请分析以下文本的情感倾向，返回JSON格式：{"sentiment": "positive/negative/neutral", "confidence": 0.0-1.0, "details": "分析说明"}\n\n文本：${text}`;

  try {
    const response = await callOpenAI(prompt, env);
    const result = JSON.parse(response) as SentimentResult;
    return result;
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    
    // 方法2: 简单的关键词匹配（fallback）
    return simpleSentimentAnalysis(text);
  }
}

// 简单的关键词匹配情感分析（备用方案）
function simpleSentimentAnalysis(text: string): SentimentResult {
  const positiveWords = ['好', '棒', '优秀', '满意', '喜欢', '推荐', '赞', '不错'];
  const negativeWords = ['差', '糟糕', '失望', '不满', '讨厌', '不推荐', '差评', '不行'];

  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach((word) => {
    if (lowerText.includes(word)) positiveCount++;
  });

  negativeWords.forEach((word) => {
    if (lowerText.includes(word)) negativeCount++;
  });

  if (positiveCount > negativeCount) {
    return {
      sentiment: 'positive',
      confidence: Math.min(0.7, 0.5 + positiveCount * 0.1),
    };
  } else if (negativeCount > positiveCount) {
    return {
      sentiment: 'negative',
      confidence: Math.min(0.7, 0.5 + negativeCount * 0.1),
    };
  } else {
    return {
      sentiment: 'neutral',
      confidence: 0.5,
    };
  }
}

