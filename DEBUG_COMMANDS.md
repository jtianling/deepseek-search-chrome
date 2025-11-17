# 调试命令 - 请在 DeepSeek 页面的控制台中运行

## 重要提示
请在**登录后**的 DeepSeek 页面打开浏览器控制台（按 F12），然后**复制粘贴**以下整段代码并运行：

```javascript
console.log('========== DeepSeek Chat Search 调试信息 ==========');

// 1. 查看侧边栏结构
const aside = document.querySelector('aside');
console.log('1. 侧边栏元素:', aside);
if (aside) {
  console.log('   - 侧边栏类名:', aside.className);
  console.log('   - 侧边栏子元素数量:', aside.children.length);
}

// 2. 查看所有链接
const allLinks = document.querySelectorAll('a');
console.log('2. 页面所有链接数量:', allLinks.length);

// 3. 查看侧边栏的链接
const sidebarLinks = document.querySelectorAll('aside a');
console.log('3. 侧边栏链接数量:', sidebarLinks.length);
console.log('   前10个侧边栏链接:');
sidebarLinks.forEach((link, i) => {
  if (i < 10) {
    console.log(`   [${i}] 文本: "${link.textContent.trim()}" | href: ${link.href}`);
  }
});

// 4. 尝试其他选择器
const navLinks = document.querySelectorAll('nav a');
console.log('4. nav a 选择器找到:', navLinks.length, '个链接');

// 5. 查看是否有聊天历史容器
const chatContainers = document.querySelectorAll('[class*="chat"], [class*="Chat"], [class*="history"], [class*="History"]');
console.log('5. 包含 chat/history 类名的元素:', chatContainers.length);
if (chatContainers.length > 0) {
  console.log('   示例元素类名:', chatContainers[0].className);
}

// 6. 查看插件是否加载
console.log('6. 插件实例:', window.DeepSeekChatSearch);

// 7. 查看插件日志（在控制台中应该能看到）
console.log('7. 请查看上面的控制台日志，找到以下标记:');
console.log('   - [ChatDataExtractor] 开始提取聊天记录...');
console.log('   - [ChatDataExtractor] 最终提取到 X 条聊天记录');

// 8. 查看提取的聊天数据
if (window.DeepSeekChatSearch && window.DeepSeekChatSearch.modules[0]) {
  const chatData = window.DeepSeekChatSearch.modules[0].getChatData();
  console.log('8. 插件提取到的聊天数据:');
  console.log('   - 数量:', chatData.length);
  if (chatData.length > 0) {
    console.log('   - 前3条:', chatData.slice(0, 3).map(c => c.title));
  } else {
    console.log('   ⚠️ 警告: 没有提取到任何聊天记录！');
  }
} else {
  console.log('8. ⚠️ 错误: 插件未正确加载！');
}

// 9. 查看搜索按钮
const searchBtn = document.getElementById('deepseek-search-button');
console.log('9. 搜索按钮:', searchBtn);
if (searchBtn) {
  console.log('   - 按钮位置: 在其父元素的第', Array.from(searchBtn.parentElement.children).indexOf(searchBtn) + 1, '个位置');
}

console.log('========== 调试信息结束 ==========');
console.log('请将上面所有输出复制粘贴给开发者');
```

## 如何使用

1. 在 Chrome 中访问 https://chat.deepseek.com/ 并登录
2. 按 F12 打开开发者工具
3. 切换到 "Console" (控制台) 标签
4. 复制上面整段代码
5. 粘贴到控制台中
6. 按 Enter 运行
7. 将**所有输出**复制下来发送给我

## 期望的输出示例

```
========== DeepSeek Chat Search 调试信息 ==========
1. 侧边栏元素: <aside class="...">...</aside>
   - 侧边栏类名: sidebar-xxx
   - 侧边栏子元素数量: 20
2. 页面所有链接数量: 45
3. 侧边栏链接数量: 18
   前10个侧边栏链接:
   [0] 文本: "如何使用Python" | href: https://chat.deepseek.com/chat/xxx
   [1] 文本: "JavaScript教程" | href: https://chat.deepseek.com/chat/yyy
   ...
```

## 注意事项

- 请确保已经登录 DeepSeek
- 请确保插件已经在 chrome://extensions/ 中启用
- 请确保已经刷新过页面
- 如果看到任何红色错误信息，也请一并复制
