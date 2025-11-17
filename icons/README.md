# 图标创建指南

由于 Chrome 插件需要图标文件，这里提供几种创建图标的方法。

## 方法一：使用在线工具生成

1. 访问 https://www.favicon-generator.org/
2. 上传一个搜索图标的图片（可以从 https://www.flaticon.com/ 下载）
3. 生成 16x16, 48x48, 128x128 三种尺寸
4. 下载并重命名为：
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`
5. 放入此目录

## 方法二：使用 SVG 转 PNG

创建一个简单的 SVG 文件，然后使用在线工具转换：

```svg
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="24" fill="#4A90E2"/>
  <circle cx="50" cy="50" r="24" fill="none" stroke="white" stroke-width="6"/>
  <line x1="68" y1="68" x2="88" y2="88" stroke="white" stroke-width="6" stroke-linecap="round"/>
</svg>
```

访问 https://cloudconvert.com/svg-to-png 转换为不同尺寸的 PNG。

## 方法三：临时跳过（开发阶段）

如果只是开发测试，可以暂时不添加图标：
- 插件依然可以正常工作
- 只是在扩展管理页面显示默认图标

## 完成后

将图标添加到此目录后，需要在 `manifest.json` 中添加：

```json
"icons": {
  "16": "icons/icon16.png",
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
}
```
