# 测试指南

## 重新加载插件

修改代码后，需要重新加载插件：

1. 打开 Chrome，访问 `chrome://extensions/`
2. 找到 "DeepSeek Chat Search" 插件
3. 点击刷新按钮 ↻
4. 访问 https://chat.deepseek.com/
5. 强制刷新页面（Ctrl+Shift+R 或 Cmd+Shift+R）

## 查看调试信息

打开浏览器控制台（F12）查看详细日志：

```
=== DeepSeek Chat Search 插件已启动 ===
[App] 开始初始化模块
[ChatDataExtractor] 初始化
[ChatDataExtractor] 开始提取聊天记录...
[ChatDataExtractor] 使用选择器 "aside a" 找到 X 个元素
[ChatDataExtractor] 最终提取到 X 条聊天记录
[ChatDataExtractor] 示例记录: ["聊天标题1", "聊天标题2", ...]
[UIManager] 初始化UI
[UIManager] 找到侧边栏: aside
[UIManager] 搜索按钮已创建，插入位置：侧边栏顶部
```

## 测试步骤

### 1. 检查搜索按钮位置

- [ ] 访问 DeepSeek 网站
- [ ] 查看左侧边栏
- [ ] "Search chats" 按钮应该在侧边栏的最顶部（不是在某条聊天记录下面）

### 2. 检查数据提取

打开控制台，查找以下日志：

```
[ChatDataExtractor] 最终提取到 X 条聊天记录
[ChatDataExtractor] 示例记录: [...]
```

如果显示 `提取到 0 条聊天记录`，执行以下操作：

1. 在控制台输入以下命令查看 DOM 结构：
```javascript
// 查看侧边栏
document.querySelector('aside')

// 查看所有链接
document.querySelectorAll('aside a')

// 手动触发提取
window.DeepSeekChatSearch.modules[0].extractChatData()
```

2. 截图并记录控制台输出
3. 查看 `aside a` 选择器是否能找到聊天记录链接

### 3. 测试搜索功能

- [ ] 点击 "Search chats" 按钮
- [ ] 搜索弹窗应该显示
- [ ] 不输入任何内容时，应该显示所有聊天记录
- [ ] 输入搜索关键词
- [ ] 应该能搜索到匹配的聊天记录
- [ ] 点击搜索结果应该能跳转到对应聊天

### 4. 问题排查

如果搜索不到记录：

**步骤 1: 检查聊天数据是否提取成功**

在控制台输入：
```javascript
window.DeepSeekChatSearch.modules[0].getChatData()
```

应该返回一个数组，包含所有聊天记录。如果返回空数组，说明数据提取有问题。

**步骤 2: 手动查看 DOM 结构**

在控制台输入：
```javascript
// 查看侧边栏的所有 a 标签
const links = document.querySelectorAll('aside a');
console.log('找到', links.length, '个链接');
links.forEach((link, i) => {
  console.log(i, link.textContent.trim(), link.href);
});
```

**步骤 3: 检查是否被过滤掉了**

某些聊天记录可能被 `isSystemButton()` 函数过滤掉了。检查该函数的逻辑。

**步骤 4: 提供反馈**

如果问题依然存在，请提供：
1. 控制台的完整日志输出
2. `document.querySelectorAll('aside a')` 的输出
3. 实际的聊天记录文本内容
4. 截图

## 常见问题

### 问题：看不到搜索按钮

**解决方法：**
1. 检查插件是否启用
2. 刷新页面
3. 查看控制台是否有错误

### 问题：搜索按钮位置不对

**解决方法：**
1. 查看控制台日志 `[UIManager] 找到侧边栏: XXX`
2. 确认找到的是正确的侧边栏容器
3. 如果不对，可能需要调整选择器

### 问题：搜索不到任何记录

**可能原因：**
1. 数据提取失败（查看 `[ChatDataExtractor]` 日志）
2. 搜索关键词不匹配
3. DOM 选择器需要调整

## 调试命令

在控制台中可用的调试命令：

```javascript
// 查看应用实例
window.DeepSeekChatSearch

// 查看提取的聊天数据
window.DeepSeekChatSearch.modules[0].getChatData()

// 手动触发数据提取
window.DeepSeekChatSearch.modules[0].extractChatData()

// 手动触发搜索
window.DeepSeekChatSearch.eventBus.emit('searchRequested', '测试')

// 查看事件总线
window.DeepSeekChatSearch.eventBus
```

## 反馈信息模板

如果需要报告问题，请提供以下信息：

```
### 问题描述
[描述遇到的问题]

### 控制台日志
[粘贴完整的控制台输出]

### DOM 结构信息
```javascript
// document.querySelectorAll('aside a') 的输出
[粘贴输出]
```

### 聊天数据
```javascript
// window.DeepSeekChatSearch.modules[0].getChatData() 的输出
[粘贴输出]
```

### 截图
[如果可能，提供截图]
```
