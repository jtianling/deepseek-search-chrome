# DOM 结构检查 - 请运行此脚本

插件已加载但找不到侧边栏。请在 DeepSeek 页面的控制台运行以下脚本：

```javascript
console.log('========== DOM 结构分析 ==========');

// 1. 查看页面的主要容器
console.log('1. 查找可能的侧边栏容器:');
const possibleContainers = [
  'aside',
  'nav',
  '[role="navigation"]',
  '[class*="sidebar"]',
  '[class*="Sidebar"]', 
  '[class*="side"]',
  '[class*="Side"]',
  '[class*="left"]',
  '[class*="Left"]',
  '[class*="menu"]',
  '[class*="Menu"]'
];

possibleContainers.forEach(selector => {
  const elements = document.querySelectorAll(selector);
  if (elements.length > 0) {
    console.log(`   找到 ${elements.length} 个 "${selector}"`);
    elements.forEach((el, i) => {
      console.log(`     [${i}] 类名:`, el.className);
      console.log(`     [${i}] 子元素数:`, el.children.length);
    });
  }
});

// 2. 查看所有的链接并分组
console.log('\n2. 分析页面链接:');
const allLinks = document.querySelectorAll('a');
console.log('   总链接数:', allLinks.length);

// 按href分组
const linksByDomain = {};
allLinks.forEach(link => {
  try {
    const url = new URL(link.href);
    const key = url.pathname.split('/')[1] || 'root';
    if (!linksByDomain[key]) linksByDomain[key] = [];
    linksByDomain[key].push({
      text: link.textContent.trim().substring(0, 50),
      href: link.href,
      classes: link.className
    });
  } catch (e) {}
});

console.log('   链接分组:');
Object.keys(linksByDomain).forEach(key => {
  console.log(`   - ${key}: ${linksByDomain[key].length} 个`);
  if (linksByDomain[key].length > 0 && linksByDomain[key].length < 100) {
    linksByDomain[key].slice(0, 5).forEach((link, i) => {
      console.log(`     [${i}] "${link.text}" | ${link.href}`);
    });
  }
});

// 3. 查找包含聊天记录的容器
console.log('\n3. 查找聊天历史记录:');
const chatKeywords = ['chat', 'Chat', 'history', 'History', 'conversation', 'Conversation'];
chatKeywords.forEach(keyword => {
  const elements = document.querySelectorAll(`[class*="${keyword}"]`);
  if (elements.length > 0 && elements.length < 50) {
    console.log(`   包含"${keyword}"的元素: ${elements.length} 个`);
    elements.forEach((el, i) => {
      if (i < 3) {
        console.log(`     [${i}] 标签: ${el.tagName}, 类名: ${el.className.substring(0, 100)}`);
        console.log(`     [${i}] 文本预览: ${el.textContent.trim().substring(0, 100)}`);
      }
    });
  }
});

// 4. 查看 root 容器的结构
console.log('\n4. 主容器结构:');
const root = document.getElementById('root');
if (root) {
  console.log('   #root 存在');
  console.log('   直接子元素数:', root.children.length);
  Array.from(root.children).forEach((child, i) => {
    console.log(`   [${i}] 标签: ${child.tagName}, 类名: ${child.className.substring(0, 100)}`);
    console.log(`   [${i}] 子元素数: ${child.children.length}`);
  });
}

// 5. 尝试找到包含最多链接的容器
console.log('\n5. 查找可能包含聊天列表的容器:');
const allDivs = document.querySelectorAll('div');
const divsWithManyLinks = [];
allDivs.forEach(div => {
  const links = div.querySelectorAll('a');
  if (links.length > 5 && links.length < 100) {
    divsWithManyLinks.push({
      div: div,
      linkCount: links.length,
      className: div.className
    });
  }
});

divsWithManyLinks.sort((a, b) => b.linkCount - a.linkCount);
console.log('   包含较多链接的容器:');
divsWithManyLinks.slice(0, 5).forEach((item, i) => {
  console.log(`   [${i}] ${item.linkCount} 个链接, 类名: ${item.className.substring(0, 100)}`);
  const sampleLinks = item.div.querySelectorAll('a');
  Array.from(sampleLinks).slice(0, 3).forEach((link, j) => {
    console.log(`      链接${j}: "${link.textContent.trim().substring(0, 40)}"`);
  });
});

console.log('\n========== 分析结束 ==========');
console.log('请将以上所有输出复制给开发者');
```

## 如何使用

1. 确保你在 DeepSeek 页面（已登录）
2. 按 F12 打开控制台
3. 复制上面的整段代码
4. 粘贴到控制台中按 Enter
5. 将**所有输出**复制发送给我

这个脚本会帮我找到：
- DeepSeek 实际使用的侧边栏容器是什么
- 聊天记录链接在哪里
- 用的是什么 CSS 类名

有了这些信息，我就能准确地修复选择器！
