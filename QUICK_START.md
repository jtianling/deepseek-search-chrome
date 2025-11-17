# 快速开始 - 完整操作步骤

## 第一步：加载插件到 Chrome

1. **打开 Chrome 扩展管理页面**
   - 在地址栏输入：`chrome://extensions/`
   - 或者点击菜单 → 更多工具 → 扩展程序

2. **开启开发者模式**
   - 在页面右上角，确保 "开发者模式" 开关是开启的（蓝色）

3. **加载插件**
   - 点击左上角的 "加载已解压的扩展程序" 按钮
   - 选择项目文件夹 `deepseek-search-cline`（就是包含 manifest.json 的那个文件夹）
   - 点击 "选择文件夹" 或 "打开"

4. **确认插件已加载**
   - 在扩展列表中应该能看到 "DeepSeek Chat Search"
   - 确保右下角的开关是蓝色（已启用状态）
   - 如果看到任何红色错误，请截图并告诉我

## 第二步：访问 DeepSeek 网站

1. **打开新标签页**
   - 在 Chrome 中打开新标签页

2. **访问 DeepSeek**
   - 地址栏输入：`https://chat.deepseek.com/`
   - 确保 URL 是 `chat.deepseek.com` 开头（不是 www.deepseek.com）

3. **登录账户**
   - 如果未登录，先登录到你的 DeepSeek 账户

4. **强制刷新页面**
   - Windows: 按 `Ctrl + Shift + R`
   - Mac: 按 `Cmd + Shift + R`
   - 或者点击地址栏左边的刷新按钮

## 第三步：验证插件是否加载

1. **打开开发者工具**
   - 按 `F12` 或右键点击页面 → 检查

2. **切换到 Console 标签**
   - 在开发者工具中点击 "Console" 标签

3. **查看插件日志**
   - 应该能看到类似这样的日志：
   ```
   === DeepSeek Chat Search 插件已启动 ===
   [App] 开始初始化模块
   [ChatDataExtractor] 初始化
   [ChatDataExtractor] 开始提取聊天记录...
   [UIManager] 初始化UI
   ```

4. **如果没有看到这些日志**
   - 插件可能没有加载成功
   - 请继续下一步

## 第四步：运行调试脚本

**只有完成了前三步后，才运行这个脚本！**

在 Console 标签中，复制粘贴以下代码并按 Enter：

```javascript
console.log('========== DeepSeek Chat Search 调试信息 ==========');

// 1. 检查插件是否加载
if (window.DeepSeekChatSearch) {
  console.log('✅ 插件已加载');
  console.log('   - 模块数量:', window.DeepSeekChatSearch.modules.length);
  
  // 2. 检查聊天数据
  const chatData = window.DeepSeekChatSearch.modules[0].getChatData();
  console.log('   - 提取到的聊天记录数量:', chatData.length);
  
  if (chatData.length > 0) {
    console.log('✅ 聊天记录提取成功');
    console.log('   - 前3条:', chatData.slice(0, 3).map(c => c.title));
  } else {
    console.log('⚠️ 没有提取到聊天记录，开始诊断...');
    
    // 诊断 DOM 结构
    const aside = document.querySelector('aside');
    console.log('   - aside 元素:', aside);
    
    const links = document.querySelectorAll('a');
    console.log('   - 页面总链接数:', links.length);
    
    // 打印前10个链接
    console.log('   - 页面前10个链接:');
    for (let i = 0; i < Math.min(10, links.length); i++) {
      console.log(`     [${i}] ${links[i].textContent.trim().substring(0, 50)} | ${links[i].href}`);
    }
  }
  
  // 3. 检查搜索按钮
  const searchBtn = document.getElementById('deepseek-search-button');
  if (searchBtn) {
    console.log('✅ 搜索按钮已创建');
  } else {
    console.log('⚠️ 搜索按钮未创建');
  }
  
} else {
  console.log('❌ 插件未加载！');
  console.log('');
  console.log('请检查：');
  console.log('1. 插件是否在 chrome://extensions/ 中启用？');
  console.log('2. 当前 URL 是否为 https://chat.deepseek.com/ 开头？');
  console.log('   当前 URL:', window.location.href);
  console.log('3. 是否刷新了页面？（Ctrl+Shift+R 或 Cmd+Shift+R）');
}

console.log('========== 调试信息结束 ==========');
```

## 第五步：查看结果

### 如果看到 "✅ 插件已加载"
- 插件工作正常！
- 检查页面左侧是否有 "Search chats" 按钮
- 点击按钮测试搜索功能

### 如果看到 "❌ 插件未加载"
- 按照提示检查插件状态和 URL
- 确保完成了第一步和第二步
- 将控制台的输出复制给我

### 如果看到 "⚠️ 没有提取到聊天记录"
- 插件已加载，但无法提取聊天数据
- 将控制台中显示的链接信息复制给我
- 我会根据实际的 DOM 结构调整选择器

## 常见问题

**Q: 在扩展页面看不到"加载已解压的扩展程序"按钮**
A: 需要先开启右上角的"开发者模式"开关

**Q: 加载插件时提示错误**
A: 请截图错误信息，并确认 manifest.json 文件存在且格式正确

**Q: URL 不是 chat.deepseek.com**
A: 请直接访问 https://chat.deepseek.com/，不要访问其他子域名

**Q: 刷新后还是没有日志**
A: 尝试：
1. 在 chrome://extensions/ 中点击插件的刷新按钮 ↻
2. 完全关闭并重新打开 DeepSeek 标签页
3. 检查是否有浏览器控制台错误（红色文字）

## 需要帮助？

如果遇到问题，请提供：
1. 控制台的完整输出
2. chrome://extensions/ 页面的截图
3. 当前访问的 URL
4. 任何错误信息
