/**
 * UIManager - UI管理模块，负责界面元素的创建和交互
 */
window.UIManager = class UIManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.searchButton = null;
    this.searchModal = null;
    this.searchInput = null;
    this.searchResults = null;
    this.retryCount = 0;
    this.maxRetries = 5; // 最多重试5次
    this.setupEventListeners();
  }

  /**
   * 初始化UI
   */
  init() {
    console.log('[UIManager] 初始化UI');
    this.createSearchButton();
    this.createSearchModal();
  }

  /**
   * 设置事件监听
   */
  setupEventListeners() {
    this.eventBus.on('searchResults', (results) => {
      this.displaySearchResults(results);
    });
    
    // 监听加载开始
    this.eventBus.on('loadingAllChatsStart', () => {
      this.showLoadingIndicator();
    });
    
    // 监听加载完成
    this.eventBus.on('loadingAllChatsEnd', () => {
      this.hideLoadingIndicator();
    });
  }

  /**
   * 创建搜索按钮
   */
  createSearchButton() {
    // 检查是否已经存在搜索按钮
    if (document.getElementById('deepseek-search-button')) {
      console.log('[UIManager] 搜索按钮已存在');
      return;
    }

    // 查找 New Chat 按钮
    const newChatButton = document.querySelector('._5a8ac7a');
    
    if (!newChatButton) {
      this.retryCount++;
      if (this.retryCount < this.maxRetries) {
        console.warn(`[UIManager] 未找到 New Chat 按钮，将重试 (${this.retryCount}/${this.maxRetries})`);
        setTimeout(() => this.createSearchButton(), 1000);
      } else {
        console.error('[UIManager] 已达到最大重试次数，无法找到 New Chat 按钮。');
      }
      return;
    }

    // 创建搜索按钮
    this.searchButton = this.createButton();
    
    // 获取父容器
    const parentContainer = newChatButton.parentElement;
    
    // 插入到 New Chat 按钮的后面
    if (newChatButton.nextSibling) {
      parentContainer.insertBefore(this.searchButton, newChatButton.nextSibling);
    } else {
      parentContainer.appendChild(this.searchButton);
    }

    console.log('[UIManager] 搜索按钮已创建，插入位置：New Chat 按钮下方');
  }

  /**
   * 查找侧边栏容器
   */
  findSidebar() {
    // DeepSeek 使用特定的 class 名称，直接查找 New Chat 按钮的父容器
    const newChatDiv = document.querySelector('._5a8ac7a');
    if (newChatDiv) {
      console.log('[UIManager] 找到 New Chat 按钮容器');
      return newChatDiv.parentElement;
    }

    // 备用方法：查找包含 "New chat" 文本的元素
    const allElements = document.querySelectorAll('div, a, button');
    for (const el of allElements) {
      const text = el.textContent?.trim().toLowerCase();
      if (text === 'new chat' || text.includes('新对话')) {
        console.log('[UIManager] 通过 New Chat 文本找到侧边栏');
        // 向上找到合适的容器（应该是包含多个子元素的容器）
        let parent = el.parentElement;
        let attempts = 0;
        while (parent && parent !== document.body && attempts < 5) {
          // 找到包含滚动区域的容器
          if (parent.children.length >= 2) {
            return parent;
          }
          parent = parent.parentElement;
          attempts++;
        }
        return el.parentElement;
      }
    }

    console.error('[UIManager] 无法找到侧边栏容器');
    return null;
  }

  /**
   * 创建按钮元素
   */
  createButton() {
    const button = document.createElement('a');
    button.id = 'deepseek-search-button';
    button.className = 'deepseek-search-btn';
    button.href = 'javascript:void(0)';
    
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <span>Search chats</span>
    `;

    button.addEventListener('click', (e) => {
      e.preventDefault();
      this.openSearchModal();
    });

    return button;
  }

  /**
   * 创建搜索弹窗
   */
  createSearchModal() {
    if (document.getElementById('deepseek-search-modal')) {
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'deepseek-search-modal';
    modal.className = 'deepseek-modal';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="deepseek-modal-overlay"></div>
      <div class="deepseek-modal-content">
        <div class="deepseek-modal-header">
          <h2>Search Chats</h2>
          <button class="deepseek-modal-close">&times;</button>
        </div>
        <div class="deepseek-modal-body">
          <div class="deepseek-search-input-container">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              type="text" 
              id="deepseek-search-input" 
              class="deepseek-search-input" 
              placeholder="搜索聊天记录..."
              autocomplete="off"
            />
          </div>
          <div class="deepseek-search-results" id="deepseek-search-results">
            <div class="deepseek-search-placeholder">
              输入关键词搜索您的聊天记录
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.searchModal = modal;
    this.searchInput = modal.querySelector('#deepseek-search-input');
    this.searchResults = modal.querySelector('#deepseek-search-results');

    // 绑定事件
    this.bindModalEvents();

    console.log('[UIManager] 搜索弹窗已创建');
  }

  /**
   * 绑定弹窗事件
   */
  bindModalEvents() {
    // 关闭按钮
    const closeBtn = this.searchModal.querySelector('.deepseek-modal-close');
    closeBtn.addEventListener('click', () => this.closeSearchModal());

    // 点击遮罩层关闭
    const overlay = this.searchModal.querySelector('.deepseek-modal-overlay');
    overlay.addEventListener('click', () => this.closeSearchModal());

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.searchModal.style.display === 'flex') {
        this.closeSearchModal();
      }
    });

    // 搜索输入
    let searchTimeout;
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.eventBus.emit('searchRequested', e.target.value);
      }, 300);
    });

    // 回车搜索
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.eventBus.emit('searchRequested', e.target.value);
      }
    });
  }

  /**
   * 打开搜索弹窗
   */
  openSearchModal() {
    if (!this.searchModal) {
      this.createSearchModal();
    }

    this.searchModal.style.display = 'flex';
    this.searchInput.focus();
    
    // 显示所有聊天记录
    this.eventBus.emit('searchRequested', '');

    console.log('[UIManager] 打开搜索弹窗');
  }

  /**
   * 关闭搜索弹窗
   */
  closeSearchModal() {
    this.searchModal.style.display = 'none';
    this.searchInput.value = '';
    console.log('[UIManager] 关闭搜索弹窗');
  }

  /**
   * 显示搜索结果
   */
  displaySearchResults(results) {
    if (!this.searchResults) return;

    if (results.length === 0) {
      this.searchResults.innerHTML = `
        <div class="deepseek-search-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <p>未找到匹配的聊天记录</p>
        </div>
      `;
      return;
    }

    const resultsHTML = results.map(chat => `
      <a href="${chat.link}" class="deepseek-search-result-item">
        <div class="deepseek-result-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div class="deepseek-result-content">
          <div class="deepseek-result-title">${this.escapeHtml(chat.title)}</div>
        </div>
      </a>
    `).join('');

    this.searchResults.innerHTML = resultsHTML;

    // 添加点击事件
    this.searchResults.querySelectorAll('.deepseek-search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        this.closeSearchModal();
      });
    });

    console.log(`[UIManager] 显示 ${results.length} 条搜索结果`);
  }

  /**
   * 显示加载提示
   */
  showLoadingIndicator() {
    if (!this.searchResults) return;
    
    this.searchResults.innerHTML = `
      <div class="deepseek-search-loading">
        <div class="deepseek-loading-spinner"></div>
        <p>正在加载所有聊天记录...</p>
        <p class="deepseek-loading-hint">首次搜索需要加载全部记录，请稍候</p>
      </div>
    `;
    
    console.log('[UIManager] 显示加载提示');
  }

  /**
   * 隐藏加载提示
   */
  hideLoadingIndicator() {
    console.log('[UIManager] 隐藏加载提示');
    
    // 加载完成后，触发搜索显示所有记录
    this.eventBus.emit('searchRequested', this.searchInput?.value || '');
  }

  /**
   * 转义 HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
