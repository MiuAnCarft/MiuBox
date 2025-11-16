/**
 * MiuBox 共享脚本文件
 * 包含通用的工具函数、事件处理、UI组件等
 */

console.log('加载共享脚本文件');

// 全局工具类
class MiuBoxUtils {
    constructor() {
        console.log('初始化 MiuBox 工具类');
    }
    
    /**
     * 格式化文件大小
     */
    formatFileSize(bytes) {
        console.log(`格式化文件大小: ${bytes} bytes`);
        
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * 格式化日期时间
     */
    formatDate(timestamp, format = 'full') {
        console.log(`格式化日期: ${timestamp}`);
        
        const date = new Date(timestamp);
        const formats = {
            'full': date.toLocaleString('zh-CN'),
            'date': date.toLocaleDateString('zh-CN'),
            'time': date.toLocaleTimeString('zh-CN'),
            'short': date.toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            })
        };
        
        return formats[format] || formats.full;
    }
    
    /**
     * 生成唯一ID
     */
    generateId(prefix = '') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return prefix + timestamp + random;
    }
    
    /**
     * 防抖函数
     */
    debounce(func, wait, immediate = false) {
        console.log(`创建防抖函数，延迟: ${wait}ms`);
        
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            
            if (callNow) func.apply(this, args);
        };
    }
    
    /**
     * 节流函数
     */
    throttle(func, limit) {
        console.log(`创建节流函数，限制: ${limit}ms`);
        
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * 深拷贝对象
     */
    deepClone(obj) {
        console.log('执行深拷贝');
        
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        
        return cloned;
    }
    
    /**
     * 验证JSON字符串
     */
    isValidJSON(str) {
        console.log('验证JSON字符串');
        
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * 安全解析JSON
     */
    safeJSONParse(str, defaultValue = null) {
        console.log('安全解析JSON');
        
        try {
            return JSON.parse(str);
        } catch (e) {
            console.warn('JSON解析失败:', e.message);
            return defaultValue;
        }
    }
    
    /**
     * 复制文本到剪贴板
     */
    copyToClipboard(text) {
        console.log('复制文本到剪贴板');
        
        return new Promise((resolve, reject) => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);
                
                if (successful) {
                    resolve(true);
                } else {
                    reject(new Error('复制失败'));
                }
            } catch (err) {
                document.body.removeChild(textarea);
                reject(err);
            }
        });
    }
    
    /**
     * 下载文件
     */
    downloadFile(content, filename, contentType = 'text/plain') {
        console.log(`下载文件: ${filename}`);
        
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
    
    /**
     * 显示通知
     */
    showNotification(message, type = 'info', duration = 3000) {
        console.log(`显示通知: ${message} (${type})`);
        
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-left: 4px solid ${this.getNotificationColor(type)};
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 12px 16px;
            min-width: 300px;
            max-width: 500px;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        // 添加动画样式
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .notification-icon { font-size: 18px; }
                .notification-message { flex: 1; font-size: 14px; }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    opacity: 0.5;
                }
                .notification-close:hover { opacity: 1; }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // 自动移除
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, duration);
        }
        
        return notification;
    }
    
    getNotificationIcon(type) {
        const icons = {
            'info': 'ℹ️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌'
        };
        return icons[type] || icons.info;
    }
    
    getNotificationColor(type) {
        const colors = {
            'info': '#3498db',
            'success': '#2ecc71',
            'warning': '#f39c12',
            'error': '#e74c3c'
        };
        return colors[type] || colors.info;
    }
    
    /**
     * 显示确认对话框
     */
    showConfirm(message, title = '确认') {
        console.log(`显示确认对话框: ${message}`);
        
        return new Promise((resolve) => {
            // 创建对话框元素
            const dialog = document.createElement('div');
            dialog.className = 'confirm-dialog';
            dialog.innerHTML = `
                <div class="dialog-overlay"></div>
                <div class="dialog-content">
                    <div class="dialog-header">
                        <h3>${title}</h3>
                    </div>
                    <div class="dialog-body">
                        <p>${message}</p>
                    </div>
                    <div class="dialog-footer">
                        <button class="dialog-btn cancel">取消</button>
                        <button class="dialog-btn confirm">确认</button>
                    </div>
                </div>
            `;
            
            // 添加样式
            dialog.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
            `;
            
            const overlay = dialog.querySelector('.dialog-overlay');
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
            `;
            
            const content = dialog.querySelector('.dialog-content');
            content.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 8px;
                padding: 20px;
                min-width: 300px;
                max-width: 500px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            `;
            
            // 绑定事件
            const cancelBtn = dialog.querySelector('.cancel');
            const confirmBtn = dialog.querySelector('.confirm');
            
            const cleanup = () => {
                dialog.remove();
            };
            
            cancelBtn.onclick = () => {
                cleanup();
                resolve(false);
            };
            
            confirmBtn.onclick = () => {
                cleanup();
                resolve(true);
            };
            
            overlay.onclick = () => {
                cleanup();
                resolve(false);
            };
            
            document.body.appendChild(dialog);
        });
    }
}

// 全局事件管理器
class EventManager {
    constructor() {
        this.events = {};
        console.log('初始化事件管理器');
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        console.log(`注册事件监听器: ${event}`);
    }
    
    off(event, callback) {
        if (!this.events[event]) return;
        
        const index = this.events[event].indexOf(callback);
        if (index > -1) {
            this.events[event].splice(index, 1);
            console.log(`移除事件监听器: ${event}`);
        }
    }
    
    emit(event, data) {
        if (!this.events[event]) return;
        
        console.log(`触发事件: ${event}`, data);
        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`事件处理错误 (${event}):`, error);
            }
        });
    }
    
    once(event, callback) {
        const onceCallback = (data) => {
            callback(data);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }
}

// 全局状态管理器
class StateManager {
    constructor() {
        this.state = {};
        this.subscribers = {};
        console.log('初始化状态管理器');
    }
    
    setState(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;
        console.log(`设置状态: ${key} =`, value);
        
        // 通知订阅者
        if (this.subscribers[key]) {
            this.subscribers[key].forEach(callback => {
                try {
                    callback(value, oldValue);
                } catch (error) {
                    console.error(`状态订阅回调错误 (${key}):`, error);
                }
            });
        }
    }
    
    getState(key) {
        return this.state[key];
    }
    
    subscribe(key, callback) {
        if (!this.subscribers[key]) {
            this.subscribers[key] = [];
        }
        this.subscribers[key].push(callback);
        console.log(`订阅状态变化: ${key}`);
        
        // 返回取消订阅函数
        return () => {
            const index = this.subscribers[key].indexOf(callback);
            if (index > -1) {
                this.subscribers[key].splice(index, 1);
            }
        };
    }
    
    // 批量更新状态
    batchUpdate(updates) {
        console.log('批量更新状态:', updates);
        Object.keys(updates).forEach(key => {
            this.setState(key, updates[key]);
        });
    }
}

// 创建全局实例
window.miuBoxUtils = new MiuBoxUtils();
window.eventManager = new EventManager();
window.stateManager = new StateManager();

// 页面加载完成后的初始化
function initializeApp() {
    console.log('MiuBox 应用初始化');
    
    // 添加全局错误处理
    window.addEventListener('error', (event) => {
        console.error('全局错误:', event.error);
        miuBoxUtils.showNotification(`发生错误: ${event.error.message}`, 'error');
    });
    
    // 添加未处理的Promise拒绝处理
    window.addEventListener('unhandledrejection', (event) => {
        console.error('未处理的Promise拒绝:', event.reason);
        miuBoxUtils.showNotification(`Promise拒绝: ${event.reason}`, 'error');
    });
    
    // 监听窗口大小变化
    window.addEventListener('resize', miuBoxUtils.throttle(() => {
        eventManager.emit('windowResize', {
            width: window.innerWidth,
            height: window.innerHeight
        });
    }, 250));
    
    console.log('MiuBox 应用初始化完成');
}

// DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// 导出模块（如果支持）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MiuBoxUtils,
        EventManager,
        StateManager
    };
}

console.log('共享脚本文件加载完成');