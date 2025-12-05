// ============================================
// COMPONENT LOADER SYSTEM
// Hệ thống tải component tái sử dụng
// ============================================

const ComponentLoader = {
    // Cache để lưu component đã load
    cache: {},
    
    // Base path cho components
    basePath: '../components/',
    
    /**
     * Load một component HTML
     * @param {string} componentName - Tên component (không có .html)
     * @param {string} targetSelector - Selector của element để chèn component vào
     * @param {Function} callback - Callback sau khi load xong
     */
    async load(componentName, targetSelector, callback) {
        // Kiểm tra cache
        if (this.cache[componentName]) {
            this.insertComponent(targetSelector, this.cache[componentName], callback);
            return;
        }
        
        try {
            const response = await fetch(`${this.basePath}${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentName}`);
            }
            
            const html = await response.text();
            
            // Lưu vào cache
            this.cache[componentName] = html;
            
            // Chèn vào DOM
            this.insertComponent(targetSelector, html, callback);
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
        }
    },
    
    /**
     * Chèn component vào DOM
     */
    insertComponent(targetSelector, html, callback) {
        const target = document.querySelector(targetSelector);
        if (target) {
            target.innerHTML = html;
            
            // Chạy callback nếu có
            if (callback && typeof callback === 'function') {
                callback();
            }
            
            // Dispatch event để các script khác biết component đã load
            const event = new CustomEvent('componentLoaded', {
                detail: { target: targetSelector }
            });
            document.dispatchEvent(event);
        } else {
            console.warn(`Target selector not found: ${targetSelector}`);
        }
    },
    
    /**
     * Load nhiều components cùng lúc
     * @param {Array} components - Array of {name, target, callback}
     */
    async loadMultiple(components) {
        const promises = components.map(comp => 
            this.load(comp.name, comp.target, comp.callback)
        );
        await Promise.all(promises);
    },
    
    /**
     * Set active page trong sidebar
     * @param {string} pageName - Tên page (home, explore, favorites, playlists)
     */
    setActivePage(pageName) {
        // Remove active class từ tất cả items
        document.querySelectorAll('.sidebar__nav-item').forEach(item => {
            item.classList.remove('sidebar__nav-item--active');
        });
        
        // Add active class cho item tương ứng
        const activeItem = document.querySelector(`[data-page="${pageName}"]`);
        if (activeItem) {
            activeItem.classList.add('sidebar__nav-item--active');
        }
    },
    
    /**
     * Update home button link dựa trên current page
     */
    updateHomeButton() {
        const currentPath = window.location.pathname;
        const isInPages = currentPath.includes('/pages/');
        
        const homeBtn = document.querySelector('.top-nav__home-btn');
        if (homeBtn) {
            homeBtn.href = isInPages ? '../index.html' : 'index.html';
        }
    }
};

// Export để sử dụng global
window.ComponentLoader = ComponentLoader;

