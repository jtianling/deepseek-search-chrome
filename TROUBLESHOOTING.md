# 故障排查 - 插件未加载

## 问题诊断

根据调试输出：
- ❌ 侧边栏元素: null （页面没有 `<aside>` 标签）
- ❌ 插件实例: undefined （插件没有加载）
- ✅ 页面有100个链接

**这说明插件没有被注入到页面中！**

## 立即检查

### 步骤 1: 确认插件已启用

1. 打开 `chrome://extensions/`
2. 找到 "DeepSeek Chat Search"
3. 检查：
   - [ ] 插件是否在列表中？
   - [ ] 右下角的开关是否为蓝色（已启用）？
   - [ ] 是否有任何错误提示（红色文字）？

如果看到错误提示，请截图或复制错误信息。

### 步骤 2: 检查权限

1. 在插件卡片上点击 "详细信息"
2. 滚动到 "网站访问权限"
3. 确认是否包含 `chat.deepseek.com`
4. 如果没有，可能需要手动添加

### 步骤 3: 检查当前页面 URL

在 DeepSeek 页面的控制台中运行：

```javascript
console.log('当前页面 URL:', window.location.href);
console.log('域名:', window.location.hostname);
console.log('协议:', window.location.protocol);
```

告诉我输出结果。

### 步骤 4: 查看 Chrome 扩展错误

1. 在 `chrome://extensions/` 页面
2. 确保 "开发者模式" 已开启
3. 找到 "DeepSeek Chat Search"
4. 查看是否有 "错误" 按钮（红色）
5. 如果有，点击查看错误信息并发送给我

## 可能的原因

### 原因 1: URL 不匹配

manifest.json 中配置的是：
```json
"matches": ["https://chat.deepseek.com/*"]
```

如果你访问的 URL 不是这个格式（比如是 `www.deepseek.com` 或其他子域名），插件就不会加载。

### 原因 2: 插件加载顺序问题

内容脚本可能在页面加载前就执行了。

### 原因 3: 文件路径错误

检查所有文件是否在正确的位置。

## 快速修复尝试

### 修复 1: 重新安装插件

1. 在 `chrome://extensions/` 中移除插件
2. 点击 "加载已解压的扩展程序"
3. 选择项目文件夹
4. 刷新 DeepSeek 页面

### 修复 2: 检查控制台错误

在 DeepSeek 页面按 F12，查看 Console 标签是否有红色错误信息。特别注意：
- 是否有 "ERR_" 开头的错误
- 是否有 JavaScript 语法错误
- 是否有文件加载失败的提示

### 修复 3: 手动注入测试

在 DeepSeek 页面控制台运行以下代码测试是否有语法错误：

```javascript
// 测试 EventBus
window.EventBus = class EventBus {
  constructor() {
    this.events = {};
    console.log('EventBus 创建成功');
  }
}

// 测试创建实例
const testBus = new window.EventBus();
console.log('EventBus 实例:', testBus);
```

如果这段代码能正常运行，说明代码本身没问题，是加载配置的问题。

## 下一步

请完成上面的检查步骤，然后告诉我：

1. **插件状态**: 已启用 / 未启用 / 有错误
2. **当前 URL**: 完整的页面地址
3. **错误信息**: 是否有任何红色错误（如果有，请复制完整信息）
4. **手动注入测试**: 上面的 EventBus 测试代码是否能运行

有了这些信息，我就能准确定位问题并修复。
