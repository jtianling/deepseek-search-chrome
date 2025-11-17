# 发布到 Chrome Web Store 指南

## 📋 发布前准备

### 1. 创建图标文件

在 `icons/` 文件夹中创建以下尺寸的图标：
- **icon16.png** - 16x16 像素（工具栏图标）
- **icon48.png** - 48x48 像素（扩展管理页面）
- **icon128.png** - 128x128 像素（Chrome Web Store）

**建议**：
- 使用简洁的放大镜或搜索图标
- 确保在深色和浅色背景下都清晰可见
- 可以使用在线工具如 [Figma](https://www.figma.com/) 或 [Canva](https://www.canva.com/) 创建

### 2. 准备宣传素材

#### 截图（必需）
- 尺寸：1280x800 或 640x400 像素
- 数量：至少 1 张，建议 3-5 张
- 内容：展示插件的主要功能
  1. 搜索按钮位置截图
  2. 搜索弹窗界面截图
  3. 搜索结果展示截图

#### 宣传图（可选但推荐）
- 小图块：440x280 像素
- 大图块：920x680 像素
- 侯爵图：1400x560 像素

### 3. 完善描述文案

#### 简短描述（最多 132 字符）
```
为 DeepSeek Chat 添加聊天记录搜索功能，快速查找历史对话。
```

#### 详细描述
```
DeepSeek Chat Search - 聊天记录搜索工具

为 DeepSeek Chat (https://chat.deepseek.com/) 添加强大的搜索功能，让您轻松管理和查找聊天历史。

✨ 主要功能：
• 🔍 快速搜索：在搜索框输入关键词，即时查找相关对话
• 📋 完整索引：自动提取所有聊天记录，支持实时更新
• 🎨 美观界面：参考 ChatGPT 设计，与 DeepSeek 风格完美融合
• ⚡ 高性能：采用模块化架构，快速响应，不影响页面性能

🎯 使用方法：
1. 访问 https://chat.deepseek.com/
2. 点击左侧边栏的 "Search chats" 按钮
3. 在弹窗中输入搜索关键词
4. 点击搜索结果即可跳转到对应对话

📝 隐私承诺：
• 所有数据仅在本地处理，不上传到任何服务器
• 开源项目，代码完全透明
• 不收集任何用户信息

💡 技术特点：
• 模块化设计，易于扩展
• 事件驱动架构，高效解耦
• 智能 DOM 监听，自动同步最新对话

🔗 项目主页：https://github.com/[your-username]/deepseek-search-cline
📧 反馈建议：[your-email]@example.com

如果觉得有用，请给个 ⭐ Star！
```

## 📦 打包插件

### 方法 1：手动打包

1. **清理项目**
```bash
# 删除不需要的文件
rm -rf .git
rm -rf node_modules
rm -f .gitignore
rm -f PUBLISH_GUIDE.md
```

2. **检查文件结构**
确保项目只包含必需文件：
```
deepseek-search-cline/
├── manifest.json
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── src/
│   ├── content/
│   │   ├── index.js
│   │   └── styles.css
│   ├── core/
│   │   └── EventBus.js
│   └── modules/
│       ├── ChatDataExtractor.js
│       ├── SearchEngine.js
│       └── UIManager.js
├── README.md
├── INSTALLATION.md
└── (其他文档可选)
```

3. **创建 ZIP 压缩包**
```bash
# 在项目根目录执行
zip -r deepseek-search-cline.zip . -x "*.git*" -x "*node_modules*" -x "*.DS_Store"
```

### 方法 2：使用 Chrome 打包工具

1. 访问 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"打包扩展程序"
4. 选择扩展程序根目录
5. 点击"打包扩展程序"（会生成 .crx 和 .pem 文件）

**注意**：Chrome Web Store 需要 .zip 文件，不是 .crx

## 🚀 发布流程

### 第一步：注册开发者账号

1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. 使用 Google 账号登录
3. 支付一次性注册费用（5 美元）
4. 填写开发者信息

### 第二步：上传扩展程序

1. 点击 **"新增项目"**
2. 上传准备好的 ZIP 文件
3. 等待系统检查（通常几秒钟）

### 第三步：填写商店信息

#### 1. 商店列表（必填）
- **扩展程序名称**：DeepSeek Chat Search
- **简短描述**：（见上文）
- **详细描述**：（见上文）
- **类别**：生产工具 / 搜索工具
- **语言**：简体中文 / English

#### 2. 图形资源（必填）
- 上传图标（已在 manifest.json 中定义）
- 上传截图（至少 1 张）
- 上传宣传图块（可选）

#### 3. 隐私（必填）
- **单一用途**：为 DeepSeek Chat 添加搜索功能
- **权限说明**：
  - `storage`：保存用户搜索偏好
  - `activeTab`：在 DeepSeek 页面注入搜索功能
  - `host_permissions`：仅在 chat.deepseek.com 生效
- **隐私政策**：（如果收集数据需要提供，否则可声明不收集）

#### 4. 分发（必填）
- **可见性**：公开 / 不公开 / 私密
- **区域**：选择所有区域或特定区域
- **价格**：免费

### 第四步：提交审核

1. 检查所有必填项
2. 点击 **"提交以供审核"**
3. 等待 Google 审核（通常 1-3 个工作日）

## ⏳ 审核期间

### 审核时长
- **初次提交**：1-3 个工作日
- **更新版本**：几小时到 1 天

### 审核标准
Google 会检查：
- ✅ 扩展程序功能与描述一致
- ✅ 不包含恶意代码
- ✅ 权限使用合理
- ✅ 隐私政策合规
- ✅ 不侵犯版权或商标

### 常见拒绝原因
- ❌ 权限过度申请
- ❌ 缺少隐私政策
- ❌ 描述不清晰或误导
- ❌ 截图质量差
- ❌ 包含广告或追踪代码

## ✅ 发布成功后

### 1. 分享链接
发布成功后，你会获得一个 Chrome Web Store 链接：
```
https://chrome.google.com/webstore/detail/[extension-id]
```

### 2. 更新 README.md
在项目 README 中添加安装链接：
```markdown
## 安装

### 从 Chrome Web Store 安装（推荐）
点击这里安装：[DeepSeek Chat Search](https://chrome.google.com/webstore/detail/xxx)
```

### 3. 推广渠道
- GitHub README
- 技术社区（V2EX、掘金等）
- 社交媒体
- DeepSeek 用户群

## 🔄 更新插件

### 1. 修改代码
- 更新版本号（manifest.json 中的 `version`）
- 编写更新日志

### 2. 重新打包
```bash
zip -r deepseek-search-cline-v1.1.0.zip . -x "*.git*"
```

### 3. 上传新版本
- 在 Developer Dashboard 中点击扩展程序
- 点击"上传新版本"
- 上传新的 ZIP 文件
- 填写更新说明
- 提交审核

## 📊 监控数据

发布后可以在 Developer Dashboard 查看：
- 📈 安装量
- ⭐ 用户评分
- 💬 用户评论
- 📉 卸载率

## ⚠️ 注意事项

### 1. 版本号管理
遵循语义化版本（Semantic Versioning）：
- **主版本号**：重大更新，不兼容旧版本
- **次版本号**：新增功能，向后兼容
- **修订号**：bug 修复

示例：1.0.0 → 1.1.0 → 1.1.1

### 2. 权限最小化
只申请必需的权限，避免：
- `<all_urls>`
- `tabs`
- `webRequest`
等敏感权限

### 3. 代码混淆
不建议混淆代码，Google 可能要求提供源代码

### 4. 品牌合规
- 不要在名称中使用"DeepSeek"商标
- 描述中说明"第三方扩展"
- 不要冒充官方

### 5. 开源优势
将代码开源到 GitHub：
- ✅ 增加可信度
- ✅ 便于社区贡献
- ✅ 通过审核更容易

## 🎯 发布检查清单

- [ ] 创建所有尺寸的图标
- [ ] 准备 3-5 张高质量截图
- [ ] 编写清晰的描述文案
- [ ] 更新 manifest.json 版本号
- [ ] 测试插件在不同场景下的表现
- [ ] 创建 ZIP 压缩包
- [ ] 注册 Chrome Developer 账号
- [ ] 支付 5 美元注册费
- [ ] 上传扩展程序
- [ ] 填写商店信息
- [ ] 提交隐私政策（如需要）
- [ ] 提交审核
- [ ] 等待审核结果
- [ ] 发布成功后推广

## 📚 相关资源

- [Chrome Web Store Developer Documentation](https://developer.chrome.com/docs/webstore/)
- [Extension Publishing Guide](https://developer.chrome.com/docs/webstore/publish/)
- [Program Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Best Practices](https://developer.chrome.com/docs/extensions/mv3/intro/best-practices/)

## 💡 建议

### 短期
1. 先在本地和小范围测试
2. 收集早期用户反馈
3. 修复 bug 和优化体验

### 长期
1. 考虑添加更多功能：
   - 按日期筛选
   - 标签分类
   - 导出聊天记录
   - 快捷键支持
2. 支持更多语言
3. 建立用户社区

祝发布顺利！🚀
