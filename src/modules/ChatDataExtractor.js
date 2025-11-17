/**
 * ChatDataExtractor - 提取 DeepSeek 聊天数据的模块
 */
window.ChatDataExtractor = class ChatDataExtractor {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.chatData = [];
    this.allChatsLoaded = false; // 标记是否已加载所有聊天记录
    this.isLoading = false; // 防止重复加载
  }

  /**
   * 初始化模块
   */
  init() {
    console.log('[ChatDataExtractor] 初始化');
    this.extractChatData();
    this.observeChatChanges();
    
    // 监听搜索请求，在搜索前加载所有记录
    this.eventBus.on('searchRequested', async (keyword) => {
      // 如果是第一次搜索，先加载所有记录
      if (!this.allChatsLoaded) {
        console.log('[ChatDataExtractor] 检测到搜索请求，开始加载所有聊天记录...');
        await this.loadAllChats();
      }
    });
  }

  /**
   * 提取聊天数据
   */
  extractChatData() {
    // 尝试从 DOM 中提取聊天历史记录
    const chatList = this.getChatListFromDOM();
    
    if (chatList.length > 0) {
      this.chatData = chatList;
      console.log(`[ChatDataExtractor] 提取到 ${chatList.length} 条聊天记录`);
    }

    // 触发数据更新事件
    this.eventBus.emit('chatDataUpdated', this.chatData);
  }

  /**
   * 从 DOM 中获取聊天列表
   */
  getChatListFromDOM() {
    const chatList = [];
    const seenTitles = new Set();
    
    console.log('[ChatDataExtractor] 开始提取聊天记录...');
    
    // DeepSeek 的聊天记录链接使用 ._546d736 类名
    const chatLinks = document.querySelectorAll('a._546d736');
    
    console.log(`[ChatDataExtractor] 找到 ${chatLinks.length} 个聊天记录链接`);
    
    chatLinks.forEach((link, index) => {
      // 查找聊天标题 (在 .c08e6e93 类中)
      const titleDiv = link.querySelector('.c08e6e93');
      const title = titleDiv ? titleDiv.textContent.trim() : link.textContent.trim();
      
      // 过滤条件
      if (!title || title.length === 0) return;
      if (this.isSystemButton(title)) return;
      if (seenTitles.has(title)) return;
      
      // 获取链接
      const href = link.href || '';
      
      // 只添加有效的聊天记录
      if (href && href.includes('/chat/')) {
        chatList.push({
          id: this.generateId(title, chatList.length),
          title: title,
          link: href,
          element: link,
          timestamp: Date.now()
        });
        seenTitles.add(title);
      }
    });

    console.log(`[ChatDataExtractor] 最终提取到 ${chatList.length} 条聊天记录`);
    
    // 打印前几条记录用于调试
    if (chatList.length > 0) {
      console.log('[ChatDataExtractor] 示例记录:', chatList.slice(0, 3).map(c => c.title));
    } else {
      console.warn('[ChatDataExtractor] 未找到任何聊天记录，可能需要调整选择器');
    }

    return chatList;
  }

  /**
   * 判断是否是系统按钮
   */
  isSystemButton(text) {
    const systemButtons = ['New Chat', 'Settings', 'Search chats', 'Profile', 'Logout'];
    return systemButtons.some(btn => text.includes(btn));
  }

  /**
   * 生成唯一ID
   */
  generateId(title, index) {
    // 使用简单的哈希方法，避免 btoa 不支持中文的问题
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      const char = title.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `chat_${Math.abs(hash)}_${index}`;
  }

  /**
   * 监听聊天列表变化
   */
  observeChatChanges() {
    // 查找聊天列表的滚动容器
    const scrollArea = document.querySelector('.ds-scroll-area, ._3586175');
    
    if (!scrollArea) {
      // 备用方案：查找包含聊天链接的父容器
      const firstChatLink = document.querySelector('a._546d736');
      if (firstChatLink) {
        let parent = firstChatLink.parentElement;
        let attempts = 0;
        while (parent && parent !== document.body && attempts < 10) {
          if (parent.children.length > 5) {
            const observer = new MutationObserver(() => {
              console.log('[ChatDataExtractor] 检测到聊天列表变化');
              this.extractChatData();
            });

            observer.observe(parent, {
              childList: true,
              subtree: true
            });

            console.log('[ChatDataExtractor] 开始监听聊天列表变化 (通过父容器)');
            return;
          }
          parent = parent.parentElement;
          attempts++;
        }
      }
      
      console.warn('[ChatDataExtractor] 未找到聊天列表容器，无法监听变化');
      return;
    }

    const observer = new MutationObserver(() => {
      console.log('[ChatDataExtractor] 检测到聊天列表变化');
      this.extractChatData();
    });

    observer.observe(scrollArea, {
      childList: true,
      subtree: true
    });

    console.log('[ChatDataExtractor] 开始监听聊天列表变化');
  }

  /**
   * 加载所有聊天记录（通过自动滚动）
   */
  async loadAllChats() {
    if (this.isLoading) {
      console.log('[ChatDataExtractor] 正在加载中，跳过重复请求');
      return;
    }

    this.isLoading = true;
    
    // 触发加载开始事件
    this.eventBus.emit('loadingAllChatsStart');
    
    console.log('[ChatDataExtractor] 开始自动加载所有聊天记录...');

    // 查找滚动容器 - 优先使用内层的聊天列表容器
    const scrollContainer = document.querySelector('._6d215eb.ds-scroll-area') || 
                           document.querySelector('.ds-scroll-area._3586175');
    
    if (!scrollContainer) {
      console.warn('[ChatDataExtractor] 未找到滚动容器');
      this.isLoading = false;
      this.eventBus.emit('loadingAllChatsEnd');
      return;
    }
    
    console.log('[ChatDataExtractor] 找到滚动容器:', scrollContainer.className);

    let previousScrollHeight = 0;
    let sameHeightTimes = 0;
    let maxAttempts = 100; // 最多尝试100次（应对大量记录）
    let attempts = 0;

    while (attempts < maxAttempts) {
      // 获取当前状态
      const currentScrollHeight = scrollContainer.scrollHeight;
      const currentCount = document.querySelectorAll('a._546d736').length;
      
      console.log(`[ChatDataExtractor] 加载进度: ${currentCount} 条记录 | scrollHeight: ${currentScrollHeight} (尝试 ${attempts + 1}/${maxAttempts})`);

      // 检查 scrollHeight 是否还在变化
      if (currentScrollHeight === previousScrollHeight) {
        sameHeightTimes++;
        
        // 如果连续5次 scrollHeight 都没变化，认为已经加载完毕
        if (sameHeightTimes >= 5) {
          console.log(`[ChatDataExtractor] ✅ 加载完成！共 ${currentCount} 条聊天记录`);
          break;
        }
      } else {
        sameHeightTimes = 0;
        previousScrollHeight = currentScrollHeight;
      }

      // 滚动到底部（使用测试中验证有效的方法）
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      
      // 手动触发滚动事件（确保懒加载被触发）
      scrollContainer.dispatchEvent(new Event('scroll', { bubbles: true }));

      // 等待新内容加载
      await this.sleep(600);

      attempts++;
    }

    if (attempts >= maxAttempts) {
      console.warn('[ChatDataExtractor] 达到最大尝试次数，停止加载');
    }

    // 标记为已加载
    this.allChatsLoaded = true;
    this.isLoading = false;

    // 重新提取数据
    this.extractChatData();
    
    // 滚动回到顶部
    console.log('[ChatDataExtractor] 滚动回顶部...');
    scrollContainer.scrollTop = 0;
    
    // 触发加载完成事件
    this.eventBus.emit('loadingAllChatsEnd');

    console.log('[ChatDataExtractor] 所有聊天记录加载完成');
  }

  /**
   * 延迟函数
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取聊天数据
   */
  getChatData() {
    return this.chatData;
  }
};
