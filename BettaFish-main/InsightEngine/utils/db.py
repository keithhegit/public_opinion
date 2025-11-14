"""
通用数据库工具（异步）

此模块提供基于 SQLAlchemy 2.x 异步引擎的数据库访问封装，支持 MySQL 与 PostgreSQL。
数据模型定义位置：
- 无（本模块仅提供连接与查询工具，不定义数据模型）
"""

from __future__ import annotations
from urllib.parse import quote_plus
import asyncio
import os
from typing import Any, Dict, Iterable, List, Optional, Union
import socket

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy import text
from sqlalchemy.exc import OperationalError, DatabaseError
from InsightEngine.utils.config import settings
from loguru import logger

__all__ = [
    "get_async_engine",
    "fetch_all",
]


_engine: Optional[AsyncEngine] = None


def _build_database_url() -> str:
    dialect: str = (settings.DB_DIALECT or "mysql").lower()
    host: str = settings.DB_HOST or ""
    port: str = str(settings.DB_PORT or "")
    user: str = settings.DB_USER or ""
    password: str = settings.DB_PASSWORD or ""
    db_name: str = settings.DB_NAME or ""

    if os.getenv("DATABASE_URL"):
        return os.getenv("DATABASE_URL")  # 直接使用外部提供的完整URL

    password = quote_plus(password)

    if dialect in ("postgresql", "postgres"):
        # PostgreSQL 使用 asyncpg 驱动
        return f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{db_name}"

    # 默认 MySQL 使用 aiomysql 驱动
    return f"mysql+aiomysql://{user}:{password}@{host}:{port}/{db_name}"


def get_async_engine() -> Optional[AsyncEngine]:
    """
    获取异步数据库引擎。
    如果数据库配置无效（如your_db_host），返回None以避免连接错误。
    """
    global _engine
    
    # 检查数据库配置是否有效
    host = settings.DB_HOST or ""
    if not host or host == "your_db_host" or host.strip() == "":
        logger.warning("数据库配置无效: DB_HOST 未设置或为默认值 'your_db_host'，跳过数据库连接")
        return None
    
    if _engine is None:
        try:
            database_url: str = _build_database_url()
            _engine = create_async_engine(
                database_url,
                pool_pre_ping=True,
                pool_recycle=1800,
                connect_args={
                    "connect_timeout": 5,  # 5秒连接超时
                } if "mysql" in database_url else {}
            )
            logger.info(f"数据库引擎已创建: {host}:{settings.DB_PORT}")
        except Exception as e:
            logger.error(f"创建数据库引擎失败: {e}")
            return None
    
    return _engine


async def fetch_all(query: str, params: Optional[Union[Iterable[Any], Dict[str, Any]]] = None) -> List[Dict[str, Any]]:
    """
    执行只读查询并返回字典列表。
    如果数据库不可用，返回空列表并记录警告。
    """
    try:
        engine: Optional[AsyncEngine] = get_async_engine()
        if engine is None:
            logger.warning("数据库引擎不可用，跳过查询")
            return []
        
        # 使用超时机制，避免长时间卡住
        try:
            async with engine.connect() as conn:
                result = await asyncio.wait_for(
                    conn.execute(text(query), params or {}),
                    timeout=10.0  # 10秒查询超时
                )
                rows = result.mappings().all()
                # 将 RowMapping 转换为普通字典
                return [dict(row) for row in rows]
        except asyncio.TimeoutError:
            logger.error(f"数据库查询超时: {query[:100]}...")
            return []
        except (OperationalError, DatabaseError) as e:
            logger.error(f"数据库查询错误: {e}")
            return []
        except socket.gaierror as e:
            logger.error(f"数据库主机名解析失败: {e}，请检查DB_HOST配置")
            return []
        except Exception as e:
            logger.exception(f"数据库查询异常: {e}")
            return []
    except Exception as e:
        logger.exception(f"fetch_all执行失败: {e}")
        return []


