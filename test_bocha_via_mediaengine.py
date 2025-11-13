#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
通过 MediaEngine 测试 Bocha API
"""

import os
import sys
from pathlib import Path

# 添加项目路径
project_root = Path(__file__).resolve().parent / "BettaFish-main"
sys.path.insert(0, str(project_root))

# 设置环境变量
os.environ['BOCHA_API_KEY'] = 'f9342a2df703462fad4bd6362174b8c3'
os.environ['BOCHA_BASE_URL'] = 'https://api.bochaai.com/v1/ai-search'

print("=" * 60)
print("通过 MediaEngine 测试 Bocha AI Search API")
print("=" * 60)
print(f"API Key: {os.environ['BOCHA_API_KEY'][:10]}...{os.environ['BOCHA_API_KEY'][-4:]}")
print(f"API Endpoint: {os.environ['BOCHA_BASE_URL']}")
print("-" * 60)

try:
    from MediaEngine.tools.search import BochaMultimodalSearch
    
    print("\n初始化 BochaMultimodalSearch...")
    client = BochaMultimodalSearch()
    
    if not client.enabled:
        print("[ERROR] Bocha 客户端未启用，请检查 API Key")
        sys.exit(1)
    
    print("[OK] 客户端初始化成功")
    
    # 测试查询
    test_query = "人工智能对未来教育的影响"
    print(f"\n执行测试查询: {test_query}")
    print("-" * 60)
    
    response = client.comprehensive_search(test_query, max_results=5)
    
    print("\n响应结果:")
    print("=" * 60)
    print(f"查询: {response.query}")
    
    if response.conversation_id:
        print(f"[OK] conversation_id: {response.conversation_id}")
    else:
        print("[WARN] conversation_id: 未找到")
    
    if response.answer:
        print(f"\n[OK] AI 总结 (answer):")
        print(f"{response.answer[:300]}...")
    else:
        print("\n[WARN] answer: 未找到")
    
    if response.follow_ups:
        print(f"\n[OK] 追问建议 (follow_ups):")
        for i, follow_up in enumerate(response.follow_ups[:3], 1):
            print(f"  {i}. {follow_up}")
    else:
        print("\n[WARN] follow_ups: 未找到")
    
    print(f"\n[OK] 网页结果: {len(response.webpages)} 条")
    if response.webpages:
        print(f"  第一条: {response.webpages[0].name[:60]}...")
        print(f"  URL: {response.webpages[0].url}")
    
    print(f"\n[OK] 图片结果: {len(response.images)} 条")
    
    print(f"\n[{'OK' if response.modal_cards else 'WARN'}] 模态卡: {len(response.modal_cards)} 条")
    if response.modal_cards:
        for card in response.modal_cards[:2]:
            print(f"  类型: {card.card_type}")
    
    print("\n" + "=" * 60)
    print("[SUCCESS] 测试通过！Bocha AI Search API 工作正常")
    print("=" * 60)
    
except ImportError as e:
    print(f"[ERROR] 导入失败: {e}")
    print("请确保在 BettaFish-main 目录下运行")
    sys.exit(1)
except Exception as e:
    print(f"[ERROR] 测试失败: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

