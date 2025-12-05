// ============================================
// LAYOUT INITIALIZER
// Khởi tạo layout cho các trang
// ============================================

const Layout = {
    /**
     * Khởi tạo layout đầy đủ (top-nav, sidebar, player-bar)
     * @param {Object} options - Options cho layout
     * @param {string} options.activePage - Page active trong sidebar (home, explore, etc.)
     * @param {boolean} options.showTopNav - Hiển thị top nav (default: true)
     * @param {boolean} options.showSidebar - Hiển thị sidebar (default: true)
     * @param {boolean} options.showPlayer - Hiển thị player bar (default: true)
     */
    async init(options = {}) {
        const {
            activePage = 'home',
            showTopNav = true,
            showSidebar = true,
            showPlayer = true
        } = options;
        
        // Tạo container nếu chưa có
        this.createContainers();
        
        // Load components
        const components = [];
        
        if (showTopNav) {
            components.push({
                name: 'top-nav',
                target: '#topNavContainer',
                callback: () => {
                    ComponentLoader.updateHomeButton();
                    if (window.checkLoginStatus) {
                        window.checkLoginStatus();
                    }
                    // Update subscription status after top nav loads
                    if (window.SubscriptionManager) {
                        setTimeout(() => {
                            window.SubscriptionManager.updateTopNavUpgradeButton();
                        }, 200);
                    }
                }
            });
        }
        
        if (showSidebar) {
            components.push({
                name: 'sidebar',
                target: '#sidebarContainer',
                callback: () => {
                    ComponentLoader.setActivePage(activePage);
                    // Setup mobile sidebar toggle after sidebar is loaded
                    if (window.setupMobileSidebar && typeof window.setupMobileSidebar === 'function') {
                        // Use setTimeout to ensure DOM is ready
                        setTimeout(() => {
                            window.setupMobileSidebar();
                        }, 100);
                    }
                }
            });
        }
        
        if (showPlayer) {
            components.push({
                name: 'player-bar',
                target: '#playerBarContainer',
                callback: () => {
                    // Player sẽ được init bởi home.js
                    // Use requestAnimationFrame for immediate execution
                    requestAnimationFrame(() => {
                        if (window.initPlayerControls && typeof window.initPlayerControls === 'function') {
                            window.initPlayerControls();
                        }
                        
                        // Restore player state if available - immediate, no delay
                        if (window.restorePlayerState && typeof window.restorePlayerState === 'function') {
                            window.restorePlayerState();
                        }
                    });
                }
            });
        }
        
        // Load tất cả components
        await ComponentLoader.loadMultiple(components);
        
        // Update layout structure
        this.updateLayoutStructure();
    },
    
    /**
     * Tạo containers cho components
     */
    createContainers() {
        const body = document.body;
        
        // Top Nav Container
        if (!document.getElementById('topNavContainer')) {
            const topNavContainer = document.createElement('div');
            topNavContainer.id = 'topNavContainer';
            body.insertBefore(topNavContainer, body.firstChild);
        }
        
        // Sidebar Container (trong home-layout)
        if (!document.getElementById('sidebarContainer')) {
            let homeLayout = document.querySelector('.home-layout');
            if (!homeLayout) {
                homeLayout = document.createElement('div');
                homeLayout.className = 'home-layout';
                const topNav = document.getElementById('topNavContainer');
                if (topNav && topNav.nextSibling) {
                    body.insertBefore(homeLayout, topNav.nextSibling);
                } else {
                    body.appendChild(homeLayout);
                }
            }
            
            const sidebarContainer = document.createElement('div');
            sidebarContainer.id = 'sidebarContainer';
            homeLayout.insertBefore(sidebarContainer, homeLayout.firstChild);
        }
        
        // Player Bar Container
        if (!document.getElementById('playerBarContainer')) {
            const playerBarContainer = document.createElement('div');
            playerBarContainer.id = 'playerBarContainer';
            body.appendChild(playerBarContainer);
        }
    },
    
    /**
     * Update layout structure sau khi load components
     */
    updateLayoutStructure() {
        // Đảm bảo main-content có đúng structure
        const homeLayout = document.querySelector('.home-layout');
        if (homeLayout) {
            let mainContent = homeLayout.querySelector('.main-content');
            if (!mainContent) {
                mainContent = document.createElement('main');
                mainContent.className = 'main-content';
                
                // Di chuyển nội dung hiện tại vào main-content
                const sidebar = homeLayout.querySelector('.sidebar');
                if (sidebar && sidebar.nextSibling) {
                    homeLayout.insertBefore(mainContent, sidebar.nextSibling);
                } else {
                    homeLayout.appendChild(mainContent);
                }
            }
        }
    }
};

// Export để sử dụng global
window.Layout = Layout;

