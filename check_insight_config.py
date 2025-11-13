#!/usr/bin/env python3
"""
检查 Insight Engine 的实际配置值
用于诊断为什么使用了 Gemini API 而不是 GLM API
"""

import os
import sys
from pathlib import Path

# 添加项目路径
project_root = Path(__file__).parent / "BettaFish-main"
sys.path.insert(0, str(project_root))

try:
    from config import settings
    
    print("=" * 60)
    print("Insight Engine 配置检查")
    print("=" * 60)
    print()
    
    print("从主 config.py 读取的配置：")
    print(f"  INSIGHT_ENGINE_API_KEY: {settings.INSIGHT_ENGINE_API_KEY[:20] if settings.INSIGHT_ENGINE_API_KEY else 'None'}...")
    print(f"  INSIGHT_ENGINE_BASE_URL: {settings.INSIGHT_ENGINE_BASE_URL}")
    print(f"  INSIGHT_ENGINE_MODEL_NAME: {settings.INSIGHT_ENGINE_MODEL_NAME}")
    print()
    
    # 检查环境变量
    print("环境变量中的配置：")
    env_key = os.getenv("INSIGHT_ENGINE_API_KEY", "未设置")
    env_base_url = os.getenv("INSIGHT_ENGINE_BASE_URL", "未设置")
    env_model = os.getenv("INSIGHT_ENGINE_MODEL_NAME", "未设置")
    
    print(f"  INSIGHT_ENGINE_API_KEY: {env_key[:20] if env_key != '未设置' else '未设置'}...")
    print(f"  INSIGHT_ENGINE_BASE_URL: {env_base_url}")
    print(f"  INSIGHT_ENGINE_MODEL_NAME: {env_model}")
    print()
    
    # 检查 .env 文件
    env_file = project_root / ".env"
    if env_file.exists():
        print(f".env 文件内容（{env_file}）：")
        with open(env_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and 'INSIGHT_ENGINE' in line:
                    print(f"  {line}")
        print()
    
    # 推断 provider
    base_url = settings.INSIGHT_ENGINE_BASE_URL or ""
    model_name = settings.INSIGHT_ENGINE_MODEL_NAME or ""
    
    print("Provider 推断逻辑：")
    if "generativelanguage.googleapis.com" in base_url:
        inferred_provider = "gemini (根据 BASE_URL)"
    elif model_name.startswith("gemini"):
        inferred_provider = "gemini (根据 MODEL_NAME)"
    elif "api.z.ai" in base_url or model_name.startswith("glm"):
        inferred_provider = "openai-compatible (GLM)"
    else:
        inferred_provider = "openai-compatible (默认)"
    
    print(f"  推断的 Provider: {inferred_provider}")
    print()
    
    # 诊断结果
    print("=" * 60)
    print("诊断结果：")
    print("=" * 60)
    
    issues = []
    if "generativelanguage.googleapis.com" in base_url:
        issues.append("❌ BASE_URL 是 Gemini 的 URL，应该改为 GLM: https://api.z.ai/api/paas/v4/")
    if model_name.startswith("gemini"):
        issues.append(f"❌ MODEL_NAME 是 Gemini 模型 ({model_name})，应该改为 GLM: glm-4.6")
    
    if not issues:
        print("✅ 配置看起来正确，应该使用 GLM API")
        if "api.z.ai" in base_url and "glm" in model_name.lower():
            print("   如果仍然使用 Gemini，可能是代码缓存问题，需要重启服务")
    else:
        print("发现以下问题：")
        for issue in issues:
            print(f"  {issue}")
        print()
        print("修复方法：")
        print("  1. 编辑 .env 文件")
        print("  2. 确保以下配置：")
        print("     INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/")
        print("     INSIGHT_ENGINE_MODEL_NAME=glm-4.6")
        print("  3. 重启服务: sudo systemctl restart bettafish")
    
except Exception as e:
    print(f"检查配置时出错: {e}")
    import traceback
    traceback.print_exc()

