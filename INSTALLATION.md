# 安装指南

## 快速开始

### 步骤 1: 准备插件文件

确保你已经有完整的插件文件结构：

```
deepseek-search-cline/
├── manifest.json
├── src/
│   ├── core/
│   │   └── EventBus.js
│   ├── modules/
│   │   ├── ChatDataExtractor.js
│   │   ├── SearchEngine.js
│   │   └── UIManager.js
│   └── content/
│       ├── index.js
│       └── styles.css
└── icons/ (可选)
```

### 步骤 2: 在 Chrome 中加载插件

1. **打开 Chrome 扩展程序页面**
   - 在 Chrome 浏览器地址栏输入：`chrome://extensions/`
   - 或者通过菜单：`更多工具` → `扩展程序`

2. **开启开发者模式**
   - 在页面右上角，打开"开发者模式"开关

3. **加载未打包的扩展程序**
   - 点击"加载已解压的扩展程序"按钮
   - 选择本项目的根目录（`deepseek-search-cline` 文件夹）
   - 点击"选择"

4. **确认安装成功**
   - 你应该能在扩展列表中看到 "DeepSeek Chat Search"
   - 如果有错误提示，请检查文件结构是否正确

### 步骤 3: 使用插件

1. **访问 DeepSeek 网站**
   - 打开 https://chat.deepseek.com/

2. **查找搜索按钮**
   - 在左侧边栏的 "New Chat" 按钮下方
   - 应该能看到新增的 "Search chats" 按钮

3. **开始搜索**
   - 点击 "Search chats" 按钮
   - 在弹出的搜索框中输入关键词
   - 搜索结果会实时显示
   - 点击结果即可跳转到对应的聊天

## 故障排查

### 问题 1: 看不到搜索按钮

**可能原因和解决方法：**

1. **插件未正确加载**
   - 检查 `chrome://extensions/` 页面，确保插件已启用
   - 查看是否有错误提示

2. **页面未完全加载**
   - 刷新 DeepSeek 页面（F5）
   - 等待几秒钟让插件初始化

3. **DOM 结构不匹配**
   - 打开浏览器控制台（F12）
   - 查看是否有 `[UIManager]` 相关的日志
   - 如果看到 "未找到 New Chat 按钮"，可能需要调整选择器

### 问题 2: 搜索不到聊天记录

**可能原因和解决方法：**

1. **聊天数据未提取**
   - 打开控制台（F12）
   - 查看是否有 `[ChatDataExtractor]` 的日志
   - 确认提取到的聊天记录数量

2. **DOM 结构变化**
   - DeepSeek 网站可能更新了 DOM 结构
   - 需要更新 `ChatDataExtractor.js` 中的选择器

### 问题 3: 插件加载失败

**检查清单：**

- [ ] 确认所有文件都在正确的位置
- [ ] 检查 `manifest.json` 格式是否正确
- [ ] 确保所有 JavaScript 文件没有语法错误
- [ ] 查看控制台错误信息

## 调试技巧

### 查看插件日志

1. 打开 DeepSeek 网站
2. 按 F12 打开开发者工具
3. 切换到 "Console" 标签
4. 查看插件输出的日志：
   - `[App]` - 应用主程序日志
   - `[ChatDataExtractor]` - 数据提取日志
   - `[SearchEngine]` - 搜索引擎日志
   - `[UIManager]` - UI 管理日志

### 手动测试

在控制台中可以执行以下命令来测试插件：

```javascript
// 检查插件是否加载
window.DeepSeekChatSearch

// 查看提取的聊天数据
window.DeepSeekChatSearch.modules[0].getChatData()

// 手动触发搜索
window.DeepSeekChatSearch.eventBus.emit('searchRequested', 'test')
```

## 更新插件

如果你修改了插件代码：

1. 在 `chrome://extensions/` 页面
2. 找到 "DeepSeek Chat Search"
3. 点击刷新按钮 ↻
4. 刷新 DeepSeek 网页以查看更新

## 卸载插件

1. 访问 `chrome://extensions/`
2. 找到 "DeepSeek Chat Search"
3. 点击 "移除" 按钮
4. 确认删除

## 高级配置

### 自定义搜索逻辑

编辑 `src/modules/SearchEngine.js` 文件中的 `search()` 方法来自定义搜索行为。

### 调整 UI 样式

编辑 `src/content/styles.css` 文件来修改界面外观。

### 添加新功能

参考 README.md 中的"扩展新功能"章节，了解如何添加新模块。

## 需要帮助？

如果遇到问题：

1. 查看项目的 README.md 文件
2. 检查浏览器控制台的错误信息
3. 提交 Issue 到项目仓库

## 注意事项

- 此插件仅在 https://chat.deepseek.com/ 域名下工作
- 需要保持开发者模式开启（未打包插件）
- 如果 DeepSeek 更新网站结构，插件可能需要相应更新
