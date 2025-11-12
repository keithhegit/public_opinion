# 🎉 部署完成！

## ✅ 已完成

1. ✅ **后端部署到 HK Ubuntu 主机** (14.136.93.109)
   - Flask 服务正常运行
   - Nginx 反向代理配置完成
   - Systemd 服务管理配置完成
   - 环境变量（API Keys）配置完成

2. ✅ **代码修复**
   - Python 3.12 兼容性修复（SocketIO threading 模式）
   - CORS 配置完成
   - 健康检查端点添加

3. ✅ **Cloudflare Workers 配置**
   - BACKEND_URL 已更新为 `http://14.136.93.109`

---

## 🧪 下一步：完整功能测试

### 1. 前端连接测试

在浏览器中访问前端：`https://bettafish-frontend.pages.dev`

**检查项：**
- [ ] 页面正常加载
- [ ] 没有 CORS 错误（F12 Console）
- [ ] 可以连接到后端（显示"连接成功"而不是"等待连接..."）

---

### 2. 系统启动测试

在前端界面：

1. **配置 LLM API Keys**
   - 如果 `.env` 文件已配置，应该自动加载
   - 或者在前端界面手动输入

2. **点击"保存并启动系统"**
   - 应该看到所有 Engine 状态变为 "running"
   - 检查日志输出是否正常

---

### 3. Engine 功能测试

#### Insight Engine 测试
- [ ] 启动 Insight Engine
- [ ] 查看输出日志
- [ ] 确认没有数据库连接错误

#### Media Engine 测试
- [ ] 启动 Media Engine
- [ ] 查看输出日志
- [ ] 确认没有数据库连接错误

#### Query Engine 测试
- [ ] 启动 Query Engine
- [ ] 执行一个查询任务
- [ ] 确认能生成报告

#### Report Engine 测试
- [ ] 生成报告
- [ ] 确认报告格式正确

---

### 4. API 端点测试

在浏览器或使用 curl 测试：

```bash
# 健康检查
curl http://14.136.93.109/api/health

# 系统状态
curl http://14.136.93.109/api/status

# 根路径
curl http://14.136.93.109/
```

---

### 5. 日志监控

在服务器上监控日志：

```bash
# 实时查看服务日志
sudo journalctl -u bettafish -f

# 查看 Nginx 访问日志
sudo tail -f /var/log/nginx/bettafish-access.log

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/bettafish-error.log
```

---

## 🔧 常用管理命令

### 服务管理

```bash
# 启动服务
sudo systemctl start bettafish

# 停止服务
sudo systemctl stop bettafish

# 重启服务
sudo systemctl restart bettafish

# 查看状态
sudo systemctl status bettafish

# 查看日志
sudo journalctl -u bettafish -f
```

### 代码更新

```bash
# 停止服务
sudo systemctl stop bettafish

# 拉取最新代码
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && git pull"

# 安装新依赖（如果有）
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && source venv/bin/activate && pip install -r requirements.txt"

# 重启服务
sudo systemctl start bettafish
```

### 查看应用日志

```bash
# Flask 应用日志（通过 systemd）
sudo journalctl -u bettafish -n 100 --no-pager

# Engine 日志文件
sudo -u bettafish tail -f /home/bettafish/Public_Opinion/BettaFish-main/logs/insight.log
sudo -u bettafish tail -f /home/bettafish/Public_Opinion/BettaFish-main/logs/media.log
sudo -u bettafish tail -f /home/bettafish/Public_Opinion/BettaFish-main/logs/query.log
```

---

## 🐛 故障排查

### 服务无法启动

```bash
# 查看详细错误
sudo journalctl -u bettafish -n 50 --no-pager

# 检查端口占用
sudo netstat -tlnp | grep 5000

# 检查文件权限
sudo ls -la /home/bettafish/Public_Opinion/BettaFish-main/
```

### API 返回 404

- 检查路由是否正确
- 检查 Nginx 配置是否正确代理
- 检查服务是否正常运行

### CORS 错误

- 检查 `app.py` 中的 CORS 配置
- 检查 Cloudflare Workers 的 CORS 配置
- 检查前端域名是否在允许列表中

### Engine 卡住

- 检查数据库配置（如果使用）
- 查看 Engine 日志文件
- 检查 API Keys 是否正确

---

## 📝 部署信息总结

- **服务器**: 14.136.93.109 (HK Ubuntu)
- **应用用户**: bettafish
- **应用目录**: `/home/bettafish/Public_Opinion/BettaFish-main`
- **服务端口**: 5000 (内部), 80 (外部通过 Nginx)
- **服务管理**: systemd (`bettafish.service`)
- **反向代理**: Nginx
- **Python 版本**: 3.12
- **虚拟环境**: `/home/bettafish/Public_Opinion/BettaFish-main/venv`

---

## 🎯 下一步建议

1. **完整功能测试** - 测试所有 Engine 功能
2. **性能监控** - 监控服务器资源使用情况
3. **安全加固** - 考虑配置 HTTPS（Let's Encrypt）
4. **备份策略** - 配置定期备份
5. **监控告警** - 设置服务监控和告警

---

**部署完成！开始测试吧！** 🚀
