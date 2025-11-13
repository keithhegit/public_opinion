# 使用 nano 编辑 .env 文件

## 🚀 直接命令

```bash
cd BettaFish-main && nano .env
```

或者如果已经在项目根目录：

```bash
nano BettaFish-main/.env
```

---

## 📝 编辑步骤

1. **打开文件后**，找到 `BOCHA_WEB_SEARCH_API_KEY` 这一行
2. **如果存在**，直接修改后面的值：
   ```
   BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd
   ```
3. **如果不存在**，在文件末尾添加：
   ```
   BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd
   ```

## ⌨️ nano 快捷键

- `Ctrl+O` - 保存文件（会提示确认文件名，直接按 Enter）
- `Ctrl+X` - 退出编辑器
- `Ctrl+W` - 搜索文本
- `Ctrl+\` - 查找并替换

## ✅ 保存后验证

```bash
grep "BOCHA_WEB_SEARCH_API_KEY" BettaFish-main/.env
```

