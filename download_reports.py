#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
下载报告文件脚本
从服务器下载所有引擎生成的报告文件到本地 Run_Result 目录
"""

import os
import sys
import json
import requests
from pathlib import Path
from typing import Dict, List

# 配置
API_BASE_URL = os.getenv('API_BASE_URL', 'http://localhost:8080')
OUTPUT_DIR = Path('Run_Result')

def create_output_dir():
    """创建输出目录"""
    OUTPUT_DIR.mkdir(exist_ok=True)
    print(f"✅ 输出目录已创建: {OUTPUT_DIR.absolute()}")

def list_reports() -> Dict[str, List[Dict]]:
    """从服务器获取报告列表"""
    try:
        response = requests.get(f'{API_BASE_URL}/api/reports/list', timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data.get('success'):
            return data.get('reports', {})
        else:
            print(f"❌ 获取报告列表失败: {data.get('error', '未知错误')}")
            return {}
    except requests.exceptions.RequestException as e:
        print(f"❌ 请求失败: {e}")
        return {}

def download_file(filepath: str, engine: str) -> bool:
    """下载单个文件"""
    try:
        # 创建引擎子目录
        engine_dir = OUTPUT_DIR / engine
        engine_dir.mkdir(exist_ok=True)
        
        # 下载文件
        response = requests.get(
            f'{API_BASE_URL}/api/reports/download/{filepath}',
            timeout=30,
            stream=True
        )
        response.raise_for_status()
        
        # 保存文件
        filename = Path(filepath).name
        local_path = engine_dir / filename
        
        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        file_size = local_path.stat().st_size
        print(f"  ✅ 已下载: {filename} ({file_size:,} bytes)")
        return True
    except requests.exceptions.RequestException as e:
        print(f"  ❌ 下载失败 {Path(filepath).name}: {e}")
        return False
    except Exception as e:
        print(f"  ❌ 保存失败 {Path(filepath).name}: {e}")
        return False

def main():
    """主函数"""
    print("=" * 60)
    print("报告文件下载工具")
    print("=" * 60)
    print(f"API 地址: {API_BASE_URL}")
    print(f"输出目录: {OUTPUT_DIR.absolute()}")
    print()
    
    # 创建输出目录
    create_output_dir()
    
    # 获取报告列表
    print("📋 正在获取报告列表...")
    reports = list_reports()
    
    if not reports:
        print("❌ 未找到任何报告文件")
        return
    
    # 统计信息
    total_files = sum(len(files) for files in reports.values())
    print(f"📊 找到 {total_files} 个报告文件")
    print()
    
    # 下载文件
    downloaded = 0
    failed = 0
    
    for engine, files in reports.items():
        if not files:
            print(f"⏭️  {engine}: 无文件")
            continue
        
        print(f"📥 正在下载 {engine} 引擎的报告 ({len(files)} 个文件)...")
        
        for file_info in files:
            filepath = file_info['path']
            if download_file(filepath, engine):
                downloaded += 1
            else:
                failed += 1
        
        print()
    
    # 总结
    print("=" * 60)
    print("下载完成")
    print("=" * 60)
    print(f"✅ 成功: {downloaded} 个文件")
    if failed > 0:
        print(f"❌ 失败: {failed} 个文件")
    print(f"📁 输出目录: {OUTPUT_DIR.absolute()}")
    print()

if __name__ == '__main__':
    # 如果提供了命令行参数，使用第一个参数作为 API URL
    if len(sys.argv) > 1:
        API_BASE_URL = sys.argv[1]
    
    main()

