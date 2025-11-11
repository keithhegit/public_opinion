"""
Report Engine Flask接口
提供HTTP API用于报告生成
"""

import os
import json
import threading
import time
from datetime import datetime
from flask import Blueprint, request, jsonify, Response
from typing import Dict, Any
from loguru import logger
from .agent import ReportAgent, create_agent
from .utils.config import settings


# 创建Blueprint
report_bp = Blueprint('report_engine', __name__)

# 全局变量
report_agent = None
current_task = None
task_lock = threading.Lock()


def initialize_report_engine():
    """初始化Report Engine"""
    global report_agent
    try:
        # 从主配置文件读取配置（重新加载以确保读取最新的环境变量）
        from config import reload_settings
        main_settings = reload_settings()
        from .utils.config import Settings as ReportSettings
        
        logger.info("开始初始化 Report Engine...")
        logger.info("=" * 60)
        logger.info("环境变量诊断信息：")
        logger.info(f"  - REPORT_ENGINE_API_KEY 在 os.environ 中: {'REPORT_ENGINE_API_KEY' in os.environ}")
        env_key_raw = os.environ.get('REPORT_ENGINE_API_KEY')
        logger.info(f"  - os.environ.get('REPORT_ENGINE_API_KEY') 类型: {type(env_key_raw)}")
        logger.info(f"  - os.environ.get('REPORT_ENGINE_API_KEY') 是否为 None: {env_key_raw is None}")
        logger.info(f"  - os.environ.get('REPORT_ENGINE_API_KEY') 值长度: {len(env_key_raw) if env_key_raw else 0}")
        if env_key_raw:
            logger.info(f"  - os.environ.get('REPORT_ENGINE_API_KEY') 前10个字符: {env_key_raw[:10]}...")
        logger.info("主配置诊断信息：")
        logger.info(f"  - main_settings.REPORT_ENGINE_API_KEY 类型: {type(main_settings.REPORT_ENGINE_API_KEY)}")
        logger.info(f"  - main_settings.REPORT_ENGINE_API_KEY 是否为 None: {main_settings.REPORT_ENGINE_API_KEY is None}")
        logger.info(f"  - main_settings.REPORT_ENGINE_API_KEY 值长度: {len(main_settings.REPORT_ENGINE_API_KEY) if main_settings.REPORT_ENGINE_API_KEY else 0}")
        logger.info(f"  - main_settings.REPORT_ENGINE_BASE_URL: {main_settings.REPORT_ENGINE_BASE_URL}")
        logger.info(f"  - main_settings.REPORT_ENGINE_MODEL_NAME: {main_settings.REPORT_ENGINE_MODEL_NAME}")
        logger.info("=" * 60)
        
        # 创建 Report Engine 配置，优先从环境变量直接读取（绕过 Pydantic Settings）
        # 这样可以确保读取到 Railway 设置的环境变量
        # 尝试多种方式读取环境变量
        api_key = None
        
        # 方式1: 直接从 os.environ 读取
        api_key = os.environ.get('REPORT_ENGINE_API_KEY')
        if api_key:
            logger.info(f"✓ 从 os.environ 读取到 API_KEY，长度: {len(api_key)}")
        else:
            # 方式2: 尝试从主配置读取
            api_key = main_settings.REPORT_ENGINE_API_KEY
            if api_key:
                logger.info(f"✓ 从主配置读取到 API_KEY，长度: {len(api_key)}")
            else:
                logger.warning("✗ 无法从环境变量或主配置读取 API_KEY")
                # 方式3: 列出所有相关的环境变量用于调试
                all_env_keys = [k for k in os.environ.keys() if 'REPORT' in k.upper() or 'ENGINE' in k.upper()]
                logger.warning(f"相关环境变量键: {all_env_keys}")
        
        # BASE_URL 和 MODEL_NAME 优先从主配置读取，如果没有则使用默认值
        base_url = main_settings.REPORT_ENGINE_BASE_URL
        if not base_url or (isinstance(base_url, str) and base_url.strip() == ""):
            base_url = "https://generativelanguage.googleapis.com/v1beta/openai/"  # Gemini 官方 API 的 OpenAI 兼容端点
        
        model_name = main_settings.REPORT_ENGINE_MODEL_NAME
        if not model_name or (isinstance(model_name, str) and model_name.strip() == ""):
            model_name = "gemini-2.5-pro"
        
        logger.info(f"最终使用的配置 - API_KEY存在: {bool(api_key)}")
        logger.info(f"最终使用的配置 - BASE_URL: {base_url}")
        logger.info(f"最终使用的配置 - MODEL_NAME: {model_name}")
        
        report_config = ReportSettings(
            REPORT_ENGINE_API_KEY=api_key,
            REPORT_ENGINE_BASE_URL=base_url,
            REPORT_ENGINE_MODEL_NAME=model_name,
        )
        
        logger.info(f"Report Engine配置创建完成 - API_KEY存在: {bool(report_config.REPORT_ENGINE_API_KEY)}")
        logger.info(f"Report Engine配置 - BASE_URL: {report_config.REPORT_ENGINE_BASE_URL}")
        logger.info(f"Report Engine配置 - MODEL_NAME: {report_config.REPORT_ENGINE_MODEL_NAME}")
        
        # 检查必要的配置
        if not report_config.REPORT_ENGINE_API_KEY:
            error_msg = "Report Engine API Key 未配置，请在 config.py 或环境变量中设置 REPORT_ENGINE_API_KEY"
            logger.error(error_msg)
            logger.error(f"主配置中的 REPORT_ENGINE_API_KEY 值: {main_settings.REPORT_ENGINE_API_KEY}")
            logger.error(f"主配置类型: {type(main_settings.REPORT_ENGINE_API_KEY)}")
            logger.error(f"环境变量 REPORT_ENGINE_API_KEY: {os.environ.get('REPORT_ENGINE_API_KEY', '未设置')}")
            return False
        
        if not report_config.REPORT_ENGINE_MODEL_NAME:
            error_msg = "Report Engine Model Name 未配置，请在 config.py 或环境变量中设置 REPORT_ENGINE_MODEL_NAME"
            logger.error(error_msg)
            logger.error(f"主配置中的 REPORT_ENGINE_MODEL_NAME 值: {main_settings.REPORT_ENGINE_MODEL_NAME}")
            logger.error(f"主配置类型: {type(main_settings.REPORT_ENGINE_MODEL_NAME)}")
            logger.error(f"环境变量 REPORT_ENGINE_MODEL_NAME: {os.environ.get('REPORT_ENGINE_MODEL_NAME', '未设置')}")
            return False
        
        # 使用配置创建 agent
        logger.info("正在创建 ReportAgent 实例...")
        logger.info(f"配置详情 - API_KEY长度: {len(report_config.REPORT_ENGINE_API_KEY) if report_config.REPORT_ENGINE_API_KEY else 0}")
        logger.info(f"配置详情 - MODEL_NAME: {report_config.REPORT_ENGINE_MODEL_NAME}")
        logger.info(f"配置详情 - BASE_URL: {report_config.REPORT_ENGINE_BASE_URL}")
        
        try:
            report_agent = ReportAgent(config=report_config)
            logger.info("Report Engine初始化成功")
            logger.info(f"使用模型: {report_config.REPORT_ENGINE_MODEL_NAME}")
            logger.info(f"使用Base URL: {report_config.REPORT_ENGINE_BASE_URL}")
            # 验证 report_agent 确实被创建
            if report_agent is None:
                logger.error("ReportAgent 创建后为 None，这是不应该发生的")
                return False
            logger.info("ReportAgent 实例创建成功并验证通过")
            return True
        except ValueError as ve:
            logger.error(f"创建 ReportAgent 时发生 ValueError: {ve}")
            logger.exception("ValueError 详细堆栈:")
            raise
        except Exception as e:
            logger.error(f"创建 ReportAgent 时发生异常: {e}")
            logger.exception("异常详细堆栈:")
            raise
    except ValueError as e:
        error_msg = f"Report Engine配置错误: {str(e)}"
        logger.error(error_msg)
        logger.exception("详细错误信息:")
        return False
    except Exception as e:
        error_msg = f"Report Engine初始化失败: {str(e)}"
        logger.error(error_msg)
        logger.exception("详细错误堆栈:")
        return False


class ReportTask:
    """报告生成任务"""

    def __init__(self, query: str, task_id: str, custom_template: str = ""):
        self.task_id = task_id
        self.query = query
        self.custom_template = custom_template
        self.status = "pending"  # pending, running, completed, error
        self.progress = 0
        self.result = None
        self.error_message = ""
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.html_content = ""

    def update_status(self, status: str, progress: int = None, error_message: str = ""):
        """更新任务状态"""
        self.status = status
        if progress is not None:
            self.progress = progress
        if error_message:
            self.error_message = error_message
        self.updated_at = datetime.now()

    def to_dict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'task_id': self.task_id,
            'query': self.query,
            'status': self.status,
            'progress': self.progress,
            'error_message': self.error_message,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'has_result': bool(self.html_content)
        }


def check_engines_ready() -> Dict[str, Any]:
    """检查三个子引擎是否都有新文件"""
    directories = {
        'insight': 'insight_engine_streamlit_reports',
        'media': 'media_engine_streamlit_reports',
        'query': 'query_engine_streamlit_reports'
    }

    forum_log_path = 'logs/forum.log'

    if not report_agent:
        return {
            'ready': False,
            'error': 'Report Engine未初始化'
        }

    return report_agent.check_input_files(
        directories['insight'],
        directories['media'],
        directories['query'],
        forum_log_path
    )


def run_report_generation(task: ReportTask, query: str, custom_template: str = ""):
    """在后台线程中运行报告生成"""
    global current_task

    try:
        task.update_status("running", 10)

        # 检查输入文件
        check_result = check_engines_ready()
        if not check_result['ready']:
            task.update_status("error", 0, f"输入文件未准备就绪: {check_result.get('missing_files', [])}")
            return

        task.update_status("running", 30)

        # 加载输入文件
        content = report_agent.load_input_files(check_result['latest_files'])

        task.update_status("running", 50)

        # 生成报告
        html_report = report_agent.generate_report(
            query=query,
            reports=content['reports'],
            forum_logs=content['forum_logs'],
            custom_template=custom_template,
            save_report=True
        )

        task.update_status("running", 90)

        # 保存结果
        task.html_content = html_report
        task.update_status("completed", 100)

    except Exception as e:
        logger.exception(f"报告生成过程中发生错误: {str(e)}")
        task.update_status("error", 0, str(e))
        # 只在出错时清理任务
        with task_lock:
            if current_task and current_task.task_id == task.task_id:
                current_task = None


@report_bp.route('/status', methods=['GET'])
def get_status():
    """获取Report Engine状态"""
    try:
        engines_status = check_engines_ready()

        return jsonify({
            'success': True,
            'initialized': report_agent is not None,
            'engines_ready': engines_status['ready'],
            'files_found': engines_status.get('files_found', []),
            'missing_files': engines_status.get('missing_files', []),
            'current_task': current_task.to_dict() if current_task else None
        })
    except Exception as e:
        logger.exception(f"获取Report Engine状态失败: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@report_bp.route('/generate', methods=['POST'])
def generate_report():
    """开始生成报告"""
    global current_task

    try:
        # 检查是否有任务在运行
        with task_lock:
            if current_task and current_task.status == "running":
                return jsonify({
                    'success': False,
                    'error': '已有报告生成任务在运行中',
                    'current_task': current_task.to_dict()
                }), 400

            # 如果有已完成的任务，清理它
            if current_task and current_task.status in ["completed", "error"]:
                current_task = None

        # 获取请求参数
        data = request.get_json() or {}
        query = data.get('query', '智能舆情分析报告')
        custom_template = data.get('custom_template', '')

        # 清空日志文件
        clear_report_log()

        # 检查Report Engine是否初始化
        if not report_agent:
            return jsonify({
                'success': False,
                'error': 'Report Engine未初始化'
            }), 500

        # 检查输入文件是否准备就绪
        engines_status = check_engines_ready()
        if not engines_status['ready']:
            return jsonify({
                'success': False,
                'error': '输入文件未准备就绪',
                'missing_files': engines_status.get('missing_files', [])
            }), 400

        # 创建新任务
        task_id = f"report_{int(time.time())}"
        task = ReportTask(query, task_id, custom_template)

        with task_lock:
            current_task = task

        # 在后台线程中运行报告生成
        thread = threading.Thread(
            target=run_report_generation,
            args=(task, query, custom_template),
            daemon=True
        )
        thread.start()

        return jsonify({
            'success': True,
            'task_id': task_id,
            'message': '报告生成已启动',
            'task': task.to_dict()
        })

    except Exception as e:
        logger.exception(f"开始生成报告失败: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@report_bp.route('/progress/<task_id>', methods=['GET'])
def get_progress(task_id: str):
    """获取报告生成进度"""
    try:
        if not current_task or current_task.task_id != task_id:
            # 如果任务不存在，可能是已经完成并被清理了
            # 返回一个默认的完成状态而不是404
            return jsonify({
                'success': True,
                'task': {
                    'task_id': task_id,
                    'status': 'completed',
                    'progress': 100,
                    'error_message': '',
                    'has_result': True
                }
            })

        return jsonify({
            'success': True,
            'task': current_task.to_dict()
        })

    except Exception as e:
        logger.exception(f"获取报告生成进度失败: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@report_bp.route('/result/<task_id>', methods=['GET'])
def get_result(task_id: str):
    """获取报告生成结果"""
    try:
        if not current_task or current_task.task_id != task_id:
            return jsonify({
                'success': False,
                'error': '任务不存在'
            }), 404

        if current_task.status != "completed":
            return jsonify({
                'success': False,
                'error': '报告尚未完成',
                'task': current_task.to_dict()
            }), 400

        return Response(
            current_task.html_content,
            mimetype='text/html'
        )

    except Exception as e:
        logger.exception(f"获取报告生成结果失败: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@report_bp.route('/result/<task_id>/json', methods=['GET'])
def get_result_json(task_id: str):
    """获取报告生成结果（JSON格式）"""
    try:
        if not current_task or current_task.task_id != task_id:
            return jsonify({
                'success': False,
                'error': '任务不存在'
            }), 404

        if current_task.status != "completed":
            return jsonify({
                'success': False,
                'error': '报告尚未完成',
                'task': current_task.to_dict()
            }), 400

        return jsonify({
            'success': True,
            'task': current_task.to_dict(),
            'html_content': current_task.html_content
        })

    except Exception as e:
        logger.exception(f"获取报告生成结果失败: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@report_bp.route('/cancel/<task_id>', methods=['POST'])
def cancel_task(task_id: str):
    """取消报告生成任务"""
    global current_task

    try:
        with task_lock:
            if current_task and current_task.task_id == task_id:
                if current_task.status == "running":
                    current_task.update_status("cancelled", 0, "用户取消任务")
                current_task = None

                return jsonify({
                    'success': True,
                    'message': '任务已取消'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': '任务不存在或无法取消'
                }), 404

    except Exception as e:
        logger.exception(f"取消报告生成任务失败: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@report_bp.route('/templates', methods=['GET'])
def get_templates():
    """获取可用模板列表"""
    try:
        if not report_agent:
            return jsonify({
                'success': False,
                'error': 'Report Engine未初始化'
            }), 500

        template_dir = settings.TEMPLATE_DIR
        templates = []

        if os.path.exists(template_dir):
            for filename in os.listdir(template_dir):
                if filename.endswith('.md'):
                    template_path = os.path.join(template_dir, filename)
                    try:
                        with open(template_path, 'r', encoding='utf-8') as f:
                            content = f.read()

                        templates.append({
                            'name': filename.replace('.md', ''),
                            'filename': filename,
                            'description': content.split('\n')[0] if content else '无描述',
                            'size': len(content)
                        })
                    except Exception as e:
                        logger.exception(f"读取模板失败 {filename}: {str(e)}")

        return jsonify({
            'success': True,
            'templates': templates,
            'template_dir': template_dir
        })

    except Exception as e:
        logger.exception(f"获取可用模板列表失败: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# 错误处理
@report_bp.errorhandler(404)
def not_found(error):
    logger.exception(f"API端点不存在: {str(error)}")
    return jsonify({
        'success': False,
        'error': 'API端点不存在'
    }), 404


@report_bp.errorhandler(500)
def internal_error(error):
    logger.exception(f"服务器内部错误: {str(error)}")
    return jsonify({
        'success': False,
        'error': '服务器内部错误'
    }), 500


def clear_report_log():
    """清空report.log文件"""
    try:
        log_file = settings.LOG_FILE
        with open(log_file, 'w', encoding='utf-8') as f:
            f.write('')
        logger.info(f"已清空日志文件: {log_file}")
    except Exception as e:
        logger.exception(f"清空日志文件失败: {str(e)}")


@report_bp.route('/log', methods=['GET'])
def get_report_log():
    """获取report.log内容"""
    try:
        log_file = settings.LOG_FILE
        
        if not os.path.exists(log_file):
            return jsonify({
                'success': True,
                'log_lines': []
            })
        
        with open(log_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # 清理行尾的换行符
        log_lines = [line.rstrip('\n\r') for line in lines if line.strip()]
        
        return jsonify({
            'success': True,
            'log_lines': log_lines
        })
        
    except Exception as e:
        logger.exception(f"读取日志失败: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'读取日志失败: {str(e)}'
        }), 500


@report_bp.route('/log/clear', methods=['POST'])
def clear_log():
    """手动清空日志"""
    try:
        clear_report_log()
        return jsonify({
            'success': True,
            'message': '日志已清空'
        })
    except Exception as e:
        logger.exception(f"清空日志失败: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'清空日志失败: {str(e)}'
        }), 500
