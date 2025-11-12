# 从Railway迁移到云主机 - 部署总结

## ✅ 已完成的准备工作

### 1. 部署文档和脚本

- ✅ **MANUAL_DEPLOYMENT_GUIDE.md** - 完整的手动部署指南
- ✅ **deploy.sh** - 自动化部署脚本
- ✅ **update.sh** - 快速更新脚本
- ✅ **bettafish.service** - systemd服务文件
- ✅ **nginx-bettafish.conf** - Nginx反向代理配置

### 2. 环境变量配置

- ✅ 项目已支持从`.env`文件读取环境变量（通过pydantic-settings）
- ✅ `config.py`会自动从环境变量和`.env`文件加载配置
- ✅ `app.py`已支持通过环境变量设置HOST和PORT

---

## 🔄 主要变化

### Railway → 云主机

| 方面 | Railway | 云主机 |
|------|---------|--------|
| **部署方式** | 自动（Git推送） | 手动（脚本） |
| **进程管理** | Railway自动管理 | systemd服务 |
| **反向代理** | Railway自动 | Nginx手动配置 |
| **环境变量** | Web界面设置 | `.env`文件 |
| **日志** | Railway Dashboard | systemd journal + 文件日志 |
| **更新流程** | Git推送自动部署 | 运行`update.sh`脚本 |

---

## 📋 快速开始

### 首次部署

```bash
# 1. 在云主机上克隆代码
git clone <your-repo-url> Public_Opinion
cd Public_Opinion/BettaFish-main

# 2. 创建.env文件（从模板复制）
cp .env.example .env
nano .env  # 编辑并填写实际值

# 3. 运行部署脚本
sudo ./deploy.sh
```

### 更新部署

```bash
# 运行更新脚本
sudo ./update.sh
```

---

## 🔧 配置要点

### 1. 环境变量（.env文件）

必需配置：
- `HOST=0.0.0.0`
- `PORT=5000`
- LLM API Keys（4个引擎）
- 搜索API Keys（Bocha、Tavily）

可选配置：
- 数据库配置（如果不需要可以不设置）
- 其他可选API Keys

### 2. systemd服务

服务文件位置：`/etc/systemd/system/bettafish.service`

常用命令：
```bash
sudo systemctl start bettafish    # 启动
sudo systemctl stop bettafish     # 停止
sudo systemctl restart bettafish  # 重启
sudo systemctl status bettafish   # 状态
sudo journalctl -u bettafish -f   # 日志
```

### 3. Nginx配置

配置文件位置：`/etc/nginx/sites-available/bettafish`

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/bettafish /etc/nginx/sites-enabled/
sudo nginx -t  # 测试配置
sudo systemctl restart nginx
```

### 4. 防火墙

```bash
# Ubuntu/Debian
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 🎯 优势

### 迁移到云主机的优势

1. **更好的网络连接**
   - 可以选择地理位置更近的服务器
   - 减少Bocha API等外部服务的超时问题
   - 更低的延迟

2. **更多控制权**
   - 完全控制服务器环境
   - 可以自定义配置和优化
   - 更好的资源管理

3. **成本控制**
   - 可以选择性价比更高的云主机
   - 按需扩展资源

4. **灵活性**
   - 可以安装额外工具
   - 可以配置更复杂的网络架构
   - 可以集成其他服务

---

## ⚠️ 注意事项

### 1. 数据库配置

如果不需要数据库功能：
- 可以不设置`DB_HOST`等数据库环境变量
- Engine会自动跳过数据库查询
- 不会影响其他功能

### 2. 端口配置

- Flask应用监听`0.0.0.0:5000`
- Nginx监听`80`和`443`（HTTPS）
- 确保防火墙开放相应端口

### 3. 日志管理

- 应用日志：`~/Public_Opinion/BettaFish-main/logs/`
- systemd日志：`sudo journalctl -u bettafish`
- Nginx日志：`/var/log/nginx/bettafish-*.log`

### 4. 更新流程

每次更新代码后：
1. 运行`update.sh`脚本
2. 或手动执行：
   ```bash
   git pull
   pip install -r requirements.txt
   sudo systemctl restart bettafish
   ```

---

## 📚 相关文件

### 部署相关
- `MANUAL_DEPLOYMENT_GUIDE.md` - 详细部署指南
- `deploy.sh` - 首次部署脚本
- `update.sh` - 更新脚本

### 配置文件
- `bettafish.service` - systemd服务文件
- `nginx-bettafish.conf` - Nginx配置示例
- `.env.example` - 环境变量模板

### 代码文件
- `app.py` - Flask主应用（已支持环境变量）
- `config.py` - 配置管理（支持.env文件）

---

## ✅ 验证清单

部署完成后，验证：

- [ ] 服务正在运行: `sudo systemctl status bettafish`
- [ ] 健康检查: `curl http://localhost:5000/api/health`
- [ ] Nginx配置: `sudo nginx -t`
- [ ] 外部访问: `curl http://your-domain.com/api/health`
- [ ] 日志正常: `sudo journalctl -u bettafish -f`
- [ ] 环境变量: 检查`.env`文件
- [ ] 防火墙: 端口80和443开放

---

## 🆘 故障排查

### 问题1: 服务无法启动

```bash
# 查看详细日志
sudo journalctl -u bettafish -n 100

# 检查环境变量
sudo systemctl show bettafish | grep EnvironmentFile

# 检查端口占用
sudo netstat -tlnp | grep 5000
```

### 问题2: 502 Bad Gateway

```bash
# 检查Flask应用
curl http://127.0.0.1:5000/api/health

# 检查Nginx配置
sudo nginx -t

# 查看Nginx错误日志
sudo tail -f /var/log/nginx/bettafish-error.log
```

### 问题3: 依赖缺失

```bash
# 重新安装依赖
cd ~/Public_Opinion/BettaFish-main
source venv/bin/activate
pip install -r requirements.txt
```

---

**最后更新**: 2025-11-11
**状态**: ✅ 迁移方案完成，可以开始部署

