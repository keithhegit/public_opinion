# 在 /api/start/report 之后添加诊断端点
@app.route('/api/report/debug', methods=['GET'])
def report_debug():
    """Report Engine 诊断端点"""
    if not REPORT_ENGINE_AVAILABLE:
        return jsonify({
            'success': False,
            'error': 'ReportEngine不可用',
            'reason': '导入失败'
        })
    
    try:
        from config import settings as main_settings
        from ReportEngine.flask_interface import report_agent
        
        debug_info = {
            'report_engine_available': REPORT_ENGINE_AVAILABLE,
            'report_agent_initialized': report_agent is not None,
            'config': {
                'REPORT_ENGINE_API_KEY_exists': bool(main_settings.REPORT_ENGINE_API_KEY),
                'REPORT_ENGINE_API_KEY_length': len(main_settings.REPORT_ENGINE_API_KEY) if main_settings.REPORT_ENGINE_API_KEY else 0,
                'REPORT_ENGINE_BASE_URL': main_settings.REPORT_ENGINE_BASE_URL,
                'REPORT_ENGINE_MODEL_NAME': main_settings.REPORT_ENGINE_MODEL_NAME,
            },
            'environment': {
                'REPORT_ENGINE_API_KEY_set': bool(os.environ.get('REPORT_ENGINE_API_KEY')),
                'REPORT_ENGINE_BASE_URL_set': bool(os.environ.get('REPORT_ENGINE_BASE_URL')),
                'REPORT_ENGINE_MODEL_NAME_set': bool(os.environ.get('REPORT_ENGINE_MODEL_NAME')),
            }
        }
        
        return jsonify({
            'success': True,
            'debug_info': debug_info
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        })
