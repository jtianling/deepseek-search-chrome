/**
 * SearchEngine - 搜索引擎模块
 */
window.SearchEngine = class SearchEngine {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.chatData = [];
    this.setupEventListeners();
  }

  /**
   * 设置事件监听
   */
  setupEventListeners() {
    this.eventBus.on('chatDataUpdated', (data) => {
      this.chatData = data;
      console.log(`[SearchEngine] 聊天数据已更新，共 ${data.length} 条`);
    });

    this.eventBus.on('searchRequested', (query) => {
      this.search(query);
    });
  }

  /**
   * 搜索聊天记录
   * @param {string} query - 搜索关键词
   */
  search(query) {
    if (!query || query.trim() === '') {
      this.eventBus.emit('searchResults', this.chatData);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const results = this.chatData.filter(chat => {
      return chat.title.toLowerCase().includes(searchTerm);
    });

    console.log(`[SearchEngine] 搜索 "${query}"，找到 ${results.length} 条结果`);
    this.eventBus.emit('searchResults', results);
  }

  /**
   * 高级搜索（支持多个关键词）
   * @param {string} query - 搜索关键词
   */
  advancedSearch(query) {
    if (!query || query.trim() === '') {
      this.eventBus.emit('searchResults', this.chatData);
      return;
    }

    // 分割多个关键词
    const keywords = query.toLowerCase().trim().split(/\s+/);
    
    const results = this.chatData.filter(chat => {
      const chatTitle = chat.title.toLowerCase();
      // 所有关键词都要匹配
      return keywords.every(keyword => chatTitle.includes(keyword));
    });

    console.log(`[SearchEngine] 高级搜索 "${query}"，找到 ${results.length} 条结果`);
    this.eventBus.emit('searchResults', results);
  }
};
