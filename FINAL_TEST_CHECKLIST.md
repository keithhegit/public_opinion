# 最终测试清单

## ✅ 部署验证

- [x] 后端服务正常运行
- [x] Nginx 反向代理配置完成
- [x] 健康检查端点正常
- [x] Cloudflare Workers BACKEND_URL 已更新
- [x] 前端可以访问后端

---

## 🧪 功能测试清单

### 1. 前端连接测试
- [ ] 访问 `https://bettafish-frontend.pages.dev`
- [ ] 检查浏览器 Console（F12）无 CORS 错误
- [ ] 确认显示"连接成功"（不是"等待连接..."）

### 2. LLM 配置测试
- [ ] 前端界面显示 LLM 配置
- [ ] API Keys 可以从 .env 自动加载
- [ ] 可以手动输入/修改 API Keys
- [ ] 点击"保存"成功

### 3. 系统启动测试
- [ ] 点击"保存并启动系统"
- [ ] 所有 Engine 状态变为 "running"
- [ ] 没有错误提示

### 4. Insight Engine 测试
- [ ] 启动 Insight Engine
- [ ] 查看输出日志正常
- [ ] 没有数据库连接错误
- [ ] 可以完成分析任务

### 5. Media Engine 测试
- [ ] 启动 Media Engine
- [ ] 查看输出日志正常
- [ ] 没有数据库连接错误
- [ ] 可以完成分析任务

### 6. Query Engine 测试
- [ ] 启动 Query Engine
- [ ] 执行查询任务
- [ ] 可以生成报告
- [ ] 报告格式正确

### 7. Report Engine 测试
- [ ] 生成报告功能正常
- [ ] 报告内容完整
- [ ] 可以下载/查看报告

### 8. 错误处理测试
- [ ] 网络错误时显示友好提示
- [ ] API 超时处理正常
- [ ] Engine 卡住时有提示

---

## 🔍 监控检查

### 服务器资源
```bash
# CPU 使用率
top

# 内存使用
free -h

# 磁盘使用
df -h
```

### 服务状态
```bash
# 服务状态
sudo systemctl status bettafish

# 实时日志
sudo journalctl -u bettafish -f
```

### 网络连接
```bash
# 端口监听
sudo netstat -tlnp | grep 5000

# Nginx 状态
sudo systemctl status nginx
```

---

## 📊 性能基准

记录以下指标作为基准：

- **服务启动时间**: _____ 秒
- **Engine 启动时间**: _____ 秒
- **API 响应时间**: _____ 毫秒
- **内存使用**: _____ MB
- **CPU 使用率**: _____ %

---

## 🐛 已知问题记录

如果发现任何问题，记录在这里：

1. **问题描述**: 
   - **复现步骤**: 
   - **错误日志**: 
   - **解决方案**: 

---

## ✅ 测试完成确认

- [ ] 所有功能测试通过
- [ ] 性能指标正常
- [ ] 没有严重错误
- [ ] 用户体验良好

**测试完成日期**: __________
**测试人员**: __________

