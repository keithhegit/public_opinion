# 项目文档索引

> **最后更新**: 2025-11-13
> 
> 本文档整理了项目根目录下的所有 Markdown 文档，按类别分类，方便查找和使用。

---

## 📚 核心文档（必读）

### 项目概览
- **[README.md](./README.md)** ⭐ **主文档**
  - 项目介绍和状态
  - 部署架构概览
  - 快速开始指南

- **[DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)** ⭐ **部署状态文档**
  - 当前部署架构详情
  - 前端、API、后端、数据库状态
  - 部署流程和配置管理
  - 故障排查指南

### 项目分析
- **[PROJECT_ANALYSIS_REPORT.md](./PROJECT_ANALYSIS_REPORT.md)** ⭐
  - 基于原库代码的深度分析
  - 架构和技术栈详解
  - 各 Engine 模块分析

- **[BETTAFISH_ORIGINAL_LIBRARY_ANALYSIS.md](./BETTAFISH_ORIGINAL_LIBRARY_ANALYSIS.md)**
  - 原库代码结构分析
  - 技术栈和依赖分析

### 迁移方案
- **[UPDATED_MIGRATION_PLAN.md](./UPDATED_MIGRATION_PLAN.md)** ⭐
  - 基于实际架构的迁移方案
  - 混合架构设计
  - 模块迁移计划

- **[DETAILED_IMPLEMENTATION_PLAN.md](./DETAILED_IMPLEMENTATION_PLAN.md)**
  - 10周详细实施计划
  - 分阶段任务清单

- **[CLOUDFLARE_WORKERS_MIGRATION_ASSESSMENT.md](./CLOUDFLARE_WORKERS_MIGRATION_ASSESSMENT.md)**
  - Cloudflare Workers 迁移评估

---

## 🔧 部署相关文档

### Cloudflare 部署
- **[CLOUDFLARE_DEPLOYMENT_GUIDE.md](./CLOUDFLARE_DEPLOYMENT_GUIDE.md)**
  - Cloudflare 完整部署指南

- **[CLOUDFLARE_PAGES_CONFIG.md](./CLOUDFLARE_PAGES_CONFIG.md)**
  - Pages 配置说明

- **[CLOUDFLARE_SSL_SETUP.md](./CLOUDFLARE_SSL_SETUP.md)**
  - SSL/TLS 配置指南

- **[CLOUDFLARE_SSL_FLEXIBLE_GUIDE.md](./CLOUDFLARE_SSL_FLEXIBLE_GUIDE.md)**
  - SSL Flexible 模式配置

### Workers API 部署
- **[STEP4_DEPLOY_WORKERS.md](./STEP4_DEPLOY_WORKERS.md)**
  - Workers 部署步骤

- **[DEPLOYMENT_COMPLETE_WORKERS.md](./DEPLOYMENT_COMPLETE_WORKERS.md)**
  - Workers 部署完成确认

- **[FINAL_STEPS_UPDATE_WORKERS.md](./FINAL_STEPS_UPDATE_WORKERS.md)**
  - Workers 最终配置步骤

- **[WORKERS_BACKEND_CONNECTION_FIX.md](./WORKERS_BACKEND_CONNECTION_FIX.md)**
  - Workers 后端连接修复

- **[DIAGNOSE_WORKERS_CONNECTION.md](./DIAGNOSE_WORKERS_CONNECTION.md)**
  - Workers 连接诊断

- **[FIX_CLOUDFLARE_1003_ERROR.md](./FIX_CLOUDFLARE_1003_ERROR.md)**
  - Cloudflare 1003 错误修复

### 后端服务器部署
- **[HK_UBUNTU_DEPLOYMENT.md](./HK_UBUNTU_DEPLOYMENT.md)**
  - 香港 Ubuntu 服务器部署指南

- **[DEPLOY_HK_INSTRUCTIONS.md](./DEPLOY_HK_INSTRUCTIONS.md)**
  - HK 服务器部署说明

- **[MANUAL_DEPLOYMENT_GUIDE.md](./MANUAL_DEPLOYMENT_GUIDE.md)**
  - 手动部署指南

### 部署步骤记录
- **[DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)**
  - 部署步骤记录

- **[STEP1_LOGIN.md](./STEP1_LOGIN.md)** - Cloudflare 登录
- **[STEP2_CREATE_RESOURCES.md](./STEP2_CREATE_RESOURCES.md)** - 创建资源
- **[STEP3_UPDATE_CONFIG.md](./STEP3_UPDATE_CONFIG.md)** - 更新配置
- **[STEP4_DEPLOY_SUCCESS.md](./STEP4_DEPLOY_SUCCESS.md)** - 部署成功
- **[STEP5_DEPLOY_FRONTEND.md](./STEP5_DEPLOY_FRONTEND.md)** - 部署前端
- **[STEP6_PRODUCTION_DEPLOY.md](./STEP6_PRODUCTION_DEPLOY.md)** - 生产部署

---

## 🐛 问题修复文档

### 关键修复
- **[FIXES_SUMMARY.md](./FIXES_SUMMARY.md)** ⭐
  - 所有修复的汇总
  - Insight Engine 缩进错误修复
  - Report Engine 启动逻辑修复
  - KV 缓存移除

- **[FIX_SYNTAX_ERROR.md](./FIX_SYNTAX_ERROR.md)**
  - 语法错误修复

- **[FIX_502_ERROR.md](./FIX_502_ERROR.md)**
  - 502 错误修复

- **[FIX_SERVICE_CRASH.md](./FIX_SERVICE_CRASH.md)**
  - 服务崩溃修复

- **[FIX_ENGINE_ERRORS.md](./FIX_ENGINE_ERRORS.md)**
  - Engine 错误修复

### 连接和配置问题
- **[FIX_500_ERROR.md](./FIX_500_ERROR.md)**
  - 500 错误修复

- **[BACKEND_CONNECTION_ERROR.md](./BACKEND_CONNECTION_ERROR.md)**
  - 后端连接错误

- **[BACKEND_CONNECTION_TEST.md](./BACKEND_CONNECTION_TEST.md)**
  - 后端连接测试

- **[BACKEND_SETUP_GUIDE.md](./BACKEND_SETUP_GUIDE.md)**
  - 后端设置指南

- **[CORS_FIX_COMPLETE.md](./CORS_FIX_COMPLETE.md)**
  - CORS 修复完成

- **[CORS_FIX_SUMMARY.md](./CORS_FIX_SUMMARY.md)**
  - CORS 修复汇总

- **[FIX_CORS_ERROR.md](./FIX_CORS_ERROR.md)**
  - CORS 错误修复

### 其他修复
- **[FIX_APT_LOCK.md](./FIX_APT_LOCK.md)** - APT 锁问题
- **[FIX_PILLOW_BUILD.md](./FIX_PILLOW_BUILD.md)** - Pillow 构建问题
- **[FIX_DEPLOY_SCRIPT.md](./FIX_DEPLOY_SCRIPT.md)** - 部署脚本修复
- **[FIX_SUBMODULE_ISSUE.md](./FIX_SUBMODULE_ISSUE.md)** - 子模块问题
- **[FIX_NODEJS_COMPAT.md](./FIX_NODEJS_COMPAT.md)** - Node.js 兼容性
- **[QUICK_FIX_NODEJS.md](./QUICK_FIX_NODEJS.md)** - Node.js 快速修复

---

## 🔌 API 和配置文档

### Bocha API
- **[BOCHA_API_SUCCESS.md](./BOCHA_API_SUCCESS.md)** ⭐
  - Bocha API 成功配置

- **[BOCHA_API_ENDPOINT_FIX.md](./BOCHA_API_ENDPOINT_FIX.md)**
  - Bocha API 端点修复

- **[BOCHA_API_CONFIG_SUCCESS.md](./BOCHA_API_CONFIG_SUCCESS.md)**
  - Bocha API 配置成功

- **[BOCHA_API_TEST_RESULT.md](./BOCHA_API_TEST_RESULT.md)**
  - Bocha API 测试结果

- **[DIAGNOSE_BOCHA_API.md](./DIAGNOSE_BOCHA_API.md)**
  - Bocha API 诊断

- **[BOCHA_NETWORK_ISSUE_ANALYSIS.md](./BOCHA_NETWORK_ISSUE_ANALYSIS.md)**
  - Bocha 网络问题分析

- **[BOCHA_401_ERROR_AND_COMPONENT_OPTIMIZATION.md](./BOCHA_401_ERROR_AND_COMPONENT_OPTIMIZATION.md)**
  - Bocha 401 错误和组件优化

- **[BOCHA_SEARCH_ALTERNATIVES.md](./BOCHA_SEARCH_ALTERNATIVES.md)**
  - Bocha 搜索替代方案

### API Keys 配置
- **[API_KEY_CONFIGURATION.md](./API_KEY_CONFIGURATION.md)**
  - API Key 配置指南

- **[API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md)**
  - API Keys 指南

### 环境变量
- **[ENV_UPDATE_GUIDE.md](./ENV_UPDATE_GUIDE.md)**
  - 环境变量更新指南

- **[QUICK_ENV_SETUP.md](./QUICK_ENV_SETUP.md)**
  - 快速环境变量设置

- **[ENV_VARS_SETUP.md](./ENV_VARS_SETUP.md)**
  - 环境变量设置

- **[ENV_VARS_DEPLOYMENT_GUIDE.md](./ENV_VARS_DEPLOYMENT_GUIDE.md)**
  - 环境变量部署指南

- **[ENV_VARS_IMPLEMENTATION.md](./ENV_VARS_IMPLEMENTATION.md)**
  - 环境变量实现

- **[ENV_VARS_COMPLETE.md](./ENV_VARS_COMPLETE.md)**
  - 环境变量完成

- **[ENV_VARS_CHECK.md](./ENV_VARS_CHECK.md)**
  - 环境变量检查

- **[UPDATE_ENV_FILE.md](./UPDATE_ENV_FILE.md)**
  - 更新环境变量文件

- **[UPDATE_ENV_COMMANDS.md](./UPDATE_ENV_COMMANDS.md)**
  - 更新环境变量命令

- **[FIND_ENV_FILE.md](./FIND_ENV_FILE.md)**
  - 查找环境变量文件

- **[FIND_ENV_PATH.md](./FIND_ENV_PATH.md)**
  - 查找环境变量路径

---

## 🗄️ 数据库相关

### D1 数据库
- **[D1_DATABASE_STATUS.md](./D1_DATABASE_STATUS.md)**
  - D1 数据库状态

- **[D1_DEPLOYMENT_EXPLANATION.md](./D1_DEPLOYMENT_EXPLANATION.md)**
  - D1 部署说明

- **[DATABASE_OPTIONAL_EXPLANATION.md](./DATABASE_OPTIONAL_EXPLANATION.md)**
  - 数据库可选说明

### MindSpider
- **[MINDSPIDER_API_GUIDE.md](./MINDSPIDER_API_GUIDE.md)**
  - MindSpider API 指南

---

## 🔍 诊断和日志

### 日志分析
- **[LOG_ANALYSIS.md](./LOG_ANALYSIS.md)**
  - 日志分析

- **[ENGINE_LOGS_DIAGNOSIS.md](./ENGINE_LOGS_DIAGNOSIS.md)**
  - Engine 日志诊断

- **[ENGINE_LOGS_DIAGNOSIS_2025-11-13.md](./ENGINE_LOGS_DIAGNOSIS_2025-11-13.md)**
  - 2025-11-13 Engine 日志诊断

### 问题诊断
- **[CORS_AND_ENGINE_STUCK_ANALYSIS.md](./CORS_AND_ENGINE_STUCK_ANALYSIS.md)**
  - CORS 和 Engine 卡住分析

- **[CORS_AND_ENGINE_FIX_SUMMARY.md](./CORS_AND_ENGINE_FIX_SUMMARY.md)**
  - CORS 和 Engine 修复汇总

- **[ENGINE_API_AUDIT.md](./ENGINE_API_AUDIT.md)**
  - Engine API 审计

---

## 🧪 测试文档

### 测试指南
- **[TESTING_AND_DEPLOYMENT.md](./TESTING_AND_DEPLOYMENT.md)**
  - 测试和部署

- **[LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md)**
  - 本地测试指南

- **[LOCAL_TESTING_COMPLETE.md](./LOCAL_TESTING_COMPLETE.md)**
  - 本地测试完成

- **[TEST_BACKEND_API.md](./TEST_BACKEND_API.md)**
  - 后端 API 测试

- **[TEST_AFTER_CORS_FIX.md](./TEST_AFTER_CORS_FIX.md)**
  - CORS 修复后测试

- **[TEST_STEPS_AFTER_ENV_UPDATE.md](./TEST_STEPS_AFTER_ENV_UPDATE.md)**
  - 环境变量更新后测试步骤

### 测试命令
- **[CURL_TEST_COMMANDS.md](./CURL_TEST_COMMANDS.md)**
  - CURL 测试命令

- **[CURL_TEST_SIMPLE.md](./CURL_TEST_SIMPLE.md)**
  - 简单 CURL 测试

---

## 🚀 快速开始

- **[QUICK_START.md](./QUICK_START.md)**
  - 快速开始指南

- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)**
  - 快速部署

- **[QUICK_ENV_SETUP.md](./QUICK_ENV_SETUP.md)**
  - 快速环境变量设置

- **[HOW_TO_RUN.md](./HOW_TO_RUN.md)**
  - 如何运行

- **[START_TESTING.md](./START_TESTING.md)**
  - 开始测试

- **[START_TESTING_NOW.md](./START_TESTING_NOW.md)**
  - 立即开始测试

- **[START_LOCAL_TEST.md](./START_LOCAL_TEST.md)**
  - 开始本地测试

- **[TEST_NOW.md](./TEST_NOW.md)**
  - 立即测试

---

## 📝 其他重要文档

### KV 缓存
- **[KV_USAGE_ASSESSMENT.md](./KV_USAGE_ASSESSMENT.md)**
  - KV 使用情况评估

- **[REMOVE_KV_CACHE.md](./REMOVE_KV_CACHE.md)**
  - 移除 KV 缓存指南

### Forum Engine
- **[FORUM_ENGINE_FRONTEND_FIX.md](./FORUM_ENGINE_FRONTEND_FIX.md)**
  - Forum Engine 前端修复

### Report Engine
- **[REPORT_ENGINE_DEBUG.md](./REPORT_ENGINE_DEBUG.md)**
  - Report Engine 调试

### 迁移相关
- **[GEMINI_SDK_MIGRATION.md](./GEMINI_SDK_MIGRATION.md)**
  - Gemini SDK 迁移

- **[GLM_MIGRATION_GUIDE.md](./GLM_MIGRATION_GUIDE.md)**
  - GLM 迁移指南

### 替代方案
- **[TAVILY_API_GUIDE.md](./TAVILY_API_GUIDE.md)**
  - Tavily API 指南

- **[KEYWORD_OPTIMIZER_ALTERNATIVES.md](./KEYWORD_OPTIMIZER_ALTERNATIVES.md)**
  - 关键词优化器替代方案

- **[CLOUDFLARE_PYTHON_ALTERNATIVES.md](./CLOUDFLARE_PYTHON_ALTERNATIVES.md)**
  - Cloudflare Python 替代方案

---

## 📦 已归档文档（历史记录）

### Railway 部署（已弃用）
以下文档记录了 Railway 部署过程，现已迁移到 HK 服务器：
- `RAILWAY_*.md` (多个文件)
- 保留作为历史记录

### 状态记录
- `CURRENT_STATUS.md` - 当前状态（可能已过时）
- `DEVELOPMENT_STATUS.md` - 开发状态
- `PARALLEL_DEVELOPMENT_STATUS.md` - 并行开发状态
- `IMPLEMENTATION_PROGRESS.md` - 实施进度
- `PROJECT_SUMMARY.md` - 项目摘要
- `MIGRATION_SUMMARY.md` - 迁移摘要
- `IMPLEMENTATION_SUMMARY.md` - 实施摘要
- `DEPLOYMENT_SUMMARY.md` - 部署摘要
- `TESTING_DEPLOYMENT_SUMMARY.md` - 测试部署摘要
- `DEPLOYMENT_MIGRATION_SUMMARY.md` - 部署迁移摘要

### 部署完成记录
- `DEPLOYMENT_COMPLETE.md`
- `DEPLOYMENT_COMPLETE_FINAL.md`
- `DEPLOYMENT_COMPLETE_WORKERS.md`
- `SERVICE_FIXED_VERIFICATION.md`

### 其他工具文档
- `NANO_EDIT_COMMANDS.md` - Nano 编辑命令
- `ACCESS_INFO.md` - 访问信息
- `RESOURCES_CREATED.md` - 已创建的资源
- `CONFIG_UI_IMPROVEMENTS.md` - 配置 UI 改进
- `RUNNING_DIRECTORY.md` - 运行目录
- `运行目录说明.md` - 运行目录说明（中文）

---

## 🎯 快速查找指南

### 我需要...

**了解项目整体情况**
→ 阅读 [README.md](./README.md) 和 [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)

**部署项目**
→ 查看 [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md) 的部署流程部分

**修复问题**
→ 查看 [FIXES_SUMMARY.md](./FIXES_SUMMARY.md) 和相关修复文档

**配置 API Keys**
→ 查看 [API_KEY_CONFIGURATION.md](./API_KEY_CONFIGURATION.md) 和 [QUICK_ENV_SETUP.md](./QUICK_ENV_SETUP.md)

**诊断错误**
→ 查看对应的诊断文档（如 `DIAGNOSE_*.md`, `FIX_*.md`）

**了解架构**
→ 查看 [PROJECT_ANALYSIS_REPORT.md](./PROJECT_ANALYSIS_REPORT.md) 和 [UPDATED_MIGRATION_PLAN.md](./UPDATED_MIGRATION_PLAN.md)

---

## 📌 重要链接

- **API Worker 生产环境**: `https://bettafish-api-prod.keithhe2021.workers.dev`
- **API Worker 开发环境**: `https://bettafish-api-dev.keithhe2021.workers.dev`
- **后端服务器**: `https://api.keithhe.com`
- **Cloudflare Dashboard**: https://dash.cloudflare.com

---

**提示**: 如果文档过多，建议：
1. 优先阅读标记为 ⭐ 的核心文档
2. 使用本文档索引快速定位需要的文档
3. 过时的文档可以归档到 `archive/` 目录

