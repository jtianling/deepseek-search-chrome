/**
 * DeepSeek Chat Search - 主入口文件
 * 
 * 架构说明：
 * 1. EventBus - 事件总线，用于模块间通信，保证解耦
 * 2. ChatDataExtractor - 提取聊天数据
 * 3. SearchEngine - 搜索引擎
 * 4. UIManager - UI管理
 * 
 * 各模块通过事件总线通信，互不依赖，便于扩展新功能
 */

(function() {
  'use strict';

  class DeepSeekChatSearch {
    constructor() {
      this.eventBus = new window.EventBus();
      this.modules = [];
    }

    /**
     * 初始化应用
     */
    init() {
      console.log('=== DeepSeek Chat Search 插件已启动 ===');
      
      // 等待页面完全加载
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initModules());
      } else {
        this.initModules();
      }
    }

    /**
     * 初始化各个模块
     */
    initModules() {
      // 延迟初始化，确保页面元素加载完成
      setTimeout(() => {
        console.log('[App] 开始初始化模块');

        // 初始化数据提取模块
        const chatDataExtractor = new window.ChatDataExtractor(this.eventBus);
        this.modules.push(chatDataExtractor);

        // 初始化搜索引擎模块
        const searchEngine = new window.SearchEngine(this.eventBus);
        this.modules.push(searchEngine);

        // 初始化UI管理模块
        const uiManager = new window.UIManager(this.eventBus);
        this.modules.push(uiManager);

        // 启动各模块
        chatDataExtractor.init();
        uiManager.init();

        console.log('[App] 所有模块初始化完成');

        // 发布初始化完成事件（供将来的模块使用）
        this.eventBus.emit('appInitialized', {
          timestamp: Date.now(),
          modules: this.modules.length
        });
      }, 1000);
    }

    /**
     * 注册新模块（用于扩展功能）
     * @param {Object} module - 模块实例
     */
    registerModule(module) {
      if (typeof module.init === 'function') {
        this.modules.push(module);
        module.init();
        console.log('[App] 新模块已注册');
      } else {
        console.error('[App] 模块必须实现 init() 方法');
      }
    }

    /**
     * 销毁应用
     */
    destroy() {
      console.log('[App] 销毁应用');
      this.modules.forEach(module => {
        if (typeof module.destroy === 'function') {
          module.destroy();
        }
      });
      this.modules = [];
    }
  }

  // 启动应用
  const app = new DeepSeekChatSearch();
  app.init();

  // 将应用实例暴露到全局，方便调试和扩展
  window.DeepSeekChatSearch = app;

})();
