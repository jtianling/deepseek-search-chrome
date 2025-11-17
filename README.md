# DeepSeek Chat Search

[English](./README_EN.md) | 中文

一个为 DeepSeek 网站添加聊天记录搜索功能的 Chrome 插件。

## 功能特性

- ✨ 在 DeepSeek 侧边栏添加 "Search chats" 按钮
- 🔍 快速搜索聊天历史记录
- 🎨 参考 ChatGPT 的设计风格，界面美观
- 🏗️ 模块化架构，便于扩展新功能
- 🔌 各模块解耦，通过事件总线通信

## 项目架构

```
deepseek-search-cline/
├── manifest.json           # Chrome 插件配置文件
├── src/
│   ├── core/
│   │   └── EventBus.js    # 事件总线，实现模块间解耦通信
│   ├── modules/
│   │   ├── ChatDataExtractor.js  # 聊天数据提取模块
│   │   ├── SearchEngine.js       # 搜索引擎模块
│   │   └── UIManager.js          # UI管理模块
│   └── content/
│       ├── index.js       # 主入口文件
│       └── styles.css     # 样式文件
└── icons/                 # 插件图标
```

## 架构设计

### 核心组件

1. **EventBus (事件总线)**
   - 负责模块间的通信
   - 实现发布-订阅模式
   - 确保模块间解耦

2. **ChatDataExtractor (数据提取模块)**
   - 从 DOM 中提取聊天历史记录
   - 监听聊天列表变化
   - 发出数据更新事件

3. **SearchEngine (搜索引擎模块)**
   - 接收搜索请求
   - 执行搜索逻辑
   - 返回搜索结果

4. **UIManager (UI管理模块)**
   - 创建搜索按钮
   - 管理搜索弹窗
   - 显示搜索结果

### 事件流程

```
用户点击搜索按钮
    ↓
UIManager 打开弹窗
    ↓
用户输入搜索关键词
    ↓
UIManager 发出 'searchRequested' 事件
    ↓
SearchEngine 接收事件并执行搜索
    ↓
SearchEngine 发出 'searchResults' 事件
    ↓
UIManager 接收结果并显示
```

## 安装方法

### 方法一：开发者模式安装（推荐）

1. 克隆或下载此项目
2. 打开 Chrome 浏览器，进入 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本项目的根目录
6. 访问 https://chat.deepseek.com/ 即可使用

### 方法二：打包安装

1. 在项目根目录运行打包命令（如有）
2. 生成 `.crx` 文件
3. 拖拽到 Chrome 扩展程序页面安装

## 使用方法

1. 访问 DeepSeek 网站 (https://chat.deepseek.com/)
2. 在左侧边栏的 "New Chat" 按钮下方，你会看到新增的 "Search chats" 按钮
3. 点击 "Search chats" 按钮打开搜索弹窗
4. 在搜索框中输入关键词
5. 搜索结果会实时显示，点击结果即可跳转到对应的聊天

## 图标说明

由于 PNG 图标需要图像编辑软件创建，你可以：

1. **使用在线工具生成图标**：
   - 访问 https://www.favicon-generator.org/
   - 上传一个搜索图标的图片
   - 生成 16x16, 48x48, 128x128 三种尺寸
   - 下载并重命名为 icon16.png, icon48.png, icon128.png
   - 放入 `icons/` 目录

2. **暂时跳过图标**：
   - 删除 manifest.json 中的 icons 配置
   - 插件仍可正常使用，只是在扩展列表中没有图标

## 扩展新功能

得益于模块化架构，添加新功能非常简单：

```javascript
// 1. 创建新模块
class NewFeatureModule {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // 监听需要的事件
    this.eventBus.on('someEvent', (data) => {
      // 处理逻辑
    });
  }

  init() {
    // 初始化逻辑
    console.log('New feature initialized');
  }
}

// 2. 在 src/content/index.js 中注册
const newFeature = new NewFeatureModule(this.eventBus);
this.modules.push(newFeature);
newFeature.init();
```

## 开发说明

- 使用 ES6 模块语法
- 采用事件驱动架构
- 所有模块通过 EventBus 通信
- 遵循单一职责原则

## 技术栈

- 原生 JavaScript (ES6+)
- Chrome Extension Manifest V3
- CSS3

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0 (2025-11-14)
- ✨ 初始版本发布
- 🔍 支持基本的聊天记录搜索
- 🎨 参考 ChatGPT 的 UI 设计
- 🏗️ 实现模块化架构

## 常见问题

**Q: 为什么搜索不到某些聊天记录？**
A: 插件是从 DOM 中提取聊天记录的，如果页面还未加载完全，可能暂时搜索不到。刷新页面后应该就可以了。

**Q: 如何自定义搜索逻辑？**
A: 编辑 `src/modules/SearchEngine.js` 文件中的 `search()` 方法即可。

**Q: 如何更改 UI 样式？**
A: 编辑 `src/content/styles.css` 文件中的样式即可。

## 联系方式

如有问题或建议，欢迎提交 Issue。
