# 修复 Git Pull 权限问题

## 问题描述

执行 `git pull` 时出现错误：
```
fatal: detected dubious ownership in repository at '/home/bettafish/Public_Opinion'
To add an exception for this directory, call:
    git config --global --add safe.directory /home/bettafish/Public_Opinion
```

## 原因

Git 检测到仓库的所有者与当前用户不匹配，出于安全考虑阻止操作。

## 解决方案

### 方法 1: 添加安全目录配置（推荐）

```bash
# 添加安全目录配置
git config --global --add safe.directory /home/bettafish/Public_Opinion

# 然后执行 git pull
cd /home/bettafish/Public_Opinion/BettaFish-main
git pull
```

### 方法 2: 修复目录所有权

```bash
# 将目录所有权改为当前用户
sudo chown -R bettafish:bettafish /home/bettafish/Public_Opinion

# 然后执行 git pull
cd /home/bettafish/Public_Opinion/BettaFish-main
git pull
```

## 完整操作步骤

```bash
# 1. 添加安全目录配置
git config --global --add safe.directory /home/bettafish/Public_Opinion

# 2. 进入项目目录
cd /home/bettafish/Public_Opinion/BettaFish-main

# 3. 拉取最新代码
git pull

# 4. 重启服务以应用更改
sudo systemctl restart bettafish

# 5. 检查服务状态
sudo systemctl status bettafish
```

## 注意事项

- 方法 1 更安全，只添加特定目录为安全目录
- 方法 2 会改变目录所有权，可能影响其他操作
- 如果使用 `sudo` 执行 git 命令，可能需要为 root 用户也添加配置

