"""
Gemini 原生 SDK 客户端（替代 OpenAI SDK）
使用 google-generativeai 库直接调用 Gemini API
"""

import os
import sys
from typing import Any, Dict, Optional, Generator
from loguru import logger

try:
    import google.generativeai as genai
except ImportError:
    logger.error("google-generativeai 未安装，请运行: pip install google-generativeai")
    raise

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_dir))
utils_dir = os.path.join(project_root, "utils")
if utils_dir not in sys.path:
    sys.path.append(utils_dir)

try:
    from retry_helper import with_retry, LLM_RETRY_CONFIG
except ImportError:
    def with_retry(config=None):
        def decorator(func):
            return func
        return decorator

    LLM_RETRY_CONFIG = None


class GeminiLLMClient:
    """使用 Gemini 原生 SDK 的 LLM 客户端"""

    def __init__(self, api_key: str, model_name: str, base_url: Optional[str] = None):
        if not api_key:
            raise ValueError("Report Engine LLM API key is required.")
        if not model_name:
            raise ValueError("Report Engine model name is required.")

        self.api_key = api_key
        self.model_name = model_name
        self.provider = "gemini"
        
        # 配置 Gemini API
        genai.configure(api_key=api_key)
        
        # 初始化模型
        try:
            self.model = genai.GenerativeModel(model_name)
            logger.info(f"Gemini 模型初始化成功: {model_name}")
        except Exception as e:
            logger.error(f"Gemini 模型初始化失败: {e}")
            raise

        timeout_fallback = os.getenv("LLM_REQUEST_TIMEOUT") or os.getenv("REPORT_ENGINE_REQUEST_TIMEOUT") or "3000"
        try:
            self.timeout = float(timeout_fallback)
        except ValueError:
            self.timeout = 3000.0

    @with_retry(LLM_RETRY_CONFIG)
    def invoke(self, system_prompt: str, user_prompt: str, **kwargs) -> str:
        """
        调用 Gemini API 生成内容
        
        Args:
            system_prompt: 系统提示词
            user_prompt: 用户提示词
            **kwargs: 额外参数（temperature, top_p等）
            
        Returns:
            生成的文本内容
        """
        # Gemini API 使用不同的消息格式
        # 将 system prompt 和 user prompt 合并
        full_prompt = f"{system_prompt}\n\n{user_prompt}" if system_prompt else user_prompt
        
        # 准备生成配置
        generation_config = {}
        if "temperature" in kwargs and kwargs["temperature"] is not None:
            generation_config["temperature"] = kwargs["temperature"]
        if "top_p" in kwargs and kwargs["top_p"] is not None:
            generation_config["top_p"] = kwargs["top_p"]
        if "max_tokens" in kwargs and kwargs["max_tokens"] is not None:
            generation_config["max_output_tokens"] = kwargs["max_tokens"]
        
        try:
            response = self.model.generate_content(
                full_prompt,
                generation_config=generation_config if generation_config else None,
            )
            
            if response and response.text:
                return self.validate_response(response.text)
            else:
                logger.warning("Gemini API 返回空响应")
                return ""
        except Exception as e:
            logger.error(f"Gemini API 调用失败: {e}")
            raise

    @with_retry(LLM_RETRY_CONFIG)
    def stream_invoke(self, system_prompt: str, user_prompt: str, **kwargs) -> Generator[str, None, None]:
        """
        流式调用 Gemini API
        
        Args:
            system_prompt: 系统提示词
            user_prompt: 用户提示词
            **kwargs: 额外参数
            
        Yields:
            响应文本块（str）
        """
        full_prompt = f"{system_prompt}\n\n{user_prompt}" if system_prompt else user_prompt
        
        generation_config = {}
        if "temperature" in kwargs and kwargs["temperature"] is not None:
            generation_config["temperature"] = kwargs["temperature"]
        if "top_p" in kwargs and kwargs["top_p"] is not None:
            generation_config["top_p"] = kwargs["top_p"]
        if "max_tokens" in kwargs and kwargs["max_tokens"] is not None:
            generation_config["max_output_tokens"] = kwargs["max_tokens"]
        
        try:
            response = self.model.generate_content(
                full_prompt,
                generation_config=generation_config if generation_config else None,
                stream=True,
            )
            
            for chunk in response:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            logger.error(f"Gemini 流式请求失败: {str(e)}")
            raise
    
    def stream_invoke_to_string(self, system_prompt: str, user_prompt: str, **kwargs) -> str:
        """
        流式调用并拼接为完整字符串
        
        Args:
            system_prompt: 系统提示词
            user_prompt: 用户提示词
            **kwargs: 额外参数
            
        Returns:
            完整的响应字符串
        """
        byte_chunks = []
        for chunk in self.stream_invoke(system_prompt, user_prompt, **kwargs):
            byte_chunks.append(chunk.encode('utf-8'))
        
        if byte_chunks:
            return b''.join(byte_chunks).decode('utf-8', errors='replace')
        return ""

    @staticmethod
    def validate_response(response: Optional[str]) -> str:
        if response is None:
            return ""
        return response.strip()

    def get_model_info(self) -> Dict[str, Any]:
        return {
            "provider": self.provider,
            "model": self.model_name,
            "api_base": "gemini-native",
        }

