/**
 * EventBus - 事件总线，用于模块间通信，实现解耦
 */
window.EventBus = class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * 订阅事件
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  /**
   * 取消订阅事件
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  /**
   * 触发事件
   * @param {string} event - 事件名称
   * @param {*} data - 事件数据
   */
  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }

  /**
   * 只订阅一次
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  once(event, callback) {
    const onceCallback = (data) => {
      callback(data);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }
};
