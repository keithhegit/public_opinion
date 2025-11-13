#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试 Bocha AI Search API
"""

import requests
import json
from datetime import datetime
import urllib3

# 禁用 SSL 警告（仅用于测试）
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# API 配置
API_KEY = "f9342a2df703462fad4bd6362174b8c3"
BASE_URL = "https://api.bochaai.com/v1/ai-search"

# 测试查询
TEST_QUERY = "人工智能对未来教育的影响"

def test_bocha_api():
    """测试 Bocha AI Search API"""
    print("=" * 60)
    print("Bocha AI Search API 测试")
    print("=" * 60)
    print(f"API Endpoint: {BASE_URL}")
    print(f"API Key: {API_KEY[:10]}...{API_KEY[-4:]}")
    print(f"测试查询: {TEST_QUERY}")
    print("-" * 60)
    
    # 准备请求
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json',
        'Accept': '*/*'
    }
    
    payload = {
        "query": TEST_QUERY,
        "count": 5,
        "answer": True  # AI Search API 使用 answer 参数
    }
    
    print("\n请求参数:")
    print(json.dumps(payload, indent=2, ensure_ascii=False))
    print("\n发送请求...")
    
    try:
        import time
        start_time = time.time()
        
        # 先尝试使用 SSL 验证
        try:
            response = requests.post(
                BASE_URL,
                headers=headers,
                json=payload,
                timeout=60,
                verify=True
            )
        except requests.exceptions.SSLError:
            # 如果 SSL 验证失败，尝试禁用验证
            print("SSL 验证失败，尝试禁用 SSL 验证...")
            response = requests.post(
                BASE_URL,
                headers=headers,
                json=payload,
                timeout=60,
                verify=False  # 禁用 SSL 验证
            )
        
        elapsed = time.time() - start_time
        print(f"请求耗时: {elapsed:.2f} 秒")
        print(f"HTTP 状态码: {response.status_code}")
        
        # 检查 HTTP 状态
        if response.status_code != 200:
            print(f"\n[ERROR] HTTP 错误: {response.status_code}")
            print(f"响应内容: {response.text}")
            return False
        
        # 解析响应
        try:
            response_dict = response.json()
        except json.JSONDecodeError as e:
            print(f"\n[ERROR] JSON 解析失败: {e}")
            print(f"响应内容: {response.text[:500]}")
            return False
        
        print("\n响应结构:")
        try:
            print(json.dumps(response_dict, indent=2, ensure_ascii=False)[:1000] + "...")
        except:
            print(str(response_dict)[:1000] + "...")
        
        # 检查响应格式
        if response_dict.get("code") == 200:
            print("\n[SUCCESS] API 调用成功!")
            
            # 解析数据
            data = response_dict.get('data', {})
            
            # 检查 AI Search API 特有字段
            print("\n" + "=" * 60)
            print("响应内容分析:")
            print("=" * 60)
            
            # conversation_id
            conversation_id = data.get('conversation_id')
            if conversation_id:
                print(f"[OK] conversation_id: {conversation_id}")
            else:
                print("[WARN] conversation_id: 未找到")
            
            # answer (AI 生成的总结)
            answer = data.get('answer')
            if not answer:
                # 尝试从 messages 中获取
                messages = data.get('messages', [])
                for msg in messages:
                    if isinstance(msg, dict) and 'answer' in msg:
                        answer = msg['answer']
                        break
            
            if answer:
                print(f"[OK] answer (AI总结): {answer[:200]}...")
            else:
                print("[WARN] answer: 未找到")
            
            # follow_ups (追问建议)
            follow_ups = data.get('follow_ups')
            if not follow_ups:
                messages = data.get('messages', [])
                for msg in messages:
                    if isinstance(msg, dict) and 'follow_ups' in msg:
                        follow_ups = msg['follow_ups']
                        break
            
            if follow_ups:
                print(f"[OK] follow_ups: {follow_ups}")
            else:
                print("[WARN] follow_ups: 未找到")
            
            # webPages
            web_pages = data.get('webPages', {})
            if isinstance(web_pages, dict):
                web_results = web_pages.get('value', [])
            else:
                web_results = web_pages if isinstance(web_pages, list) else []
            
            print(f"[OK] webPages: {len(web_results)} 条结果")
            if web_results:
                print(f"   第一条: {web_results[0].get('name', 'N/A')[:50]}...")
            
            # images
            images = data.get('images', {})
            if isinstance(images, dict):
                image_results = images.get('value', [])
            else:
                image_results = images if isinstance(images, list) else []
            
            print(f"[OK] images: {len(image_results)} 条结果")
            
            # modal_cards
            modal_cards = data.get('modalCards', []) or data.get('modal_cards', [])
            print(f"[{'OK' if modal_cards else 'WARN'}] modal_cards: {len(modal_cards)} 条结果")
            
            # videos
            videos = data.get('videos', {})
            if isinstance(videos, dict):
                video_results = videos.get('value', [])
            else:
                video_results = videos if isinstance(videos, list) else []
            
            print(f"[{'OK' if video_results else 'WARN'}] videos: {len(video_results)} 条结果")
            
            print("\n" + "=" * 60)
            print("[SUCCESS] 测试通过！Bocha AI Search API 工作正常")
            print("=" * 60)
            
            return True
            
        else:
            print(f"\n[ERROR] API 返回错误:")
            print(f"code: {response_dict.get('code')}")
            print(f"msg: {response_dict.get('msg', '未知错误')}")
            return False
            
    except requests.exceptions.Timeout:
        print(f"\n[ERROR] 请求超时（超过60秒）")
        return False
    except requests.exceptions.SSLError as e:
        print(f"\n[ERROR] SSL 错误: {e}")
        print("这可能是网络环境问题，请检查：")
        print("1. 网络连接是否正常")
        print("2. 防火墙是否阻止了连接")
        print("3. 代理设置是否正确")
        return False
    except requests.exceptions.ConnectionError as e:
        print(f"\n[ERROR] 连接失败: {e}")
        return False
    except Exception as e:
        print(f"\n[ERROR] 发生错误: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_bocha_api()
    exit(0 if success else 1)

