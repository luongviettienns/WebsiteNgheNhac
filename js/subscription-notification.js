// ============================================
// SUBSCRIPTION EXPIRY NOTIFICATION
// Hiển thị notification bell trên top nav bar khi gói còn dưới 14 ngày
// ============================================

const SubscriptionNotification = {
    WARNING_THRESHOLD: 14, // Số ngày cảnh báo
    
    /**
     * Kiểm tra và cập nhật notification bell
     */
    checkAndUpdate() {
        // Kiểm tra subscription status
        if (!window.SubscriptionManager) {
            this.hideNotification();
            return;
        }
        
        const status = window.SubscriptionManager.getSubscriptionStatus();
        
        // Chỉ hiển thị nếu có subscription active và còn dưới 14 ngày
        if (status.isActive && status.daysRemaining !== null && status.daysRemaining < this.WARNING_THRESHOLD && status.daysRemaining > 0) {
            this.showNotification(status);
        } else {
            this.hideNotification();
        }
    },
    
    /**
     * Hiển thị notification bell với badge
     */
    showNotification(status) {
        const notificationBtn = document.getElementById('notificationBtn');
        if (!notificationBtn) return;
        
        // Đảm bảo button luôn hiển thị
        notificationBtn.style.display = 'flex';
        
        // Cập nhật badge với số ngày còn lại
        let badge = notificationBtn.querySelector('.top-nav__notification-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'top-nav__notification-badge';
            notificationBtn.appendChild(badge);
        }
        
        const daysRemaining = status.daysRemaining;
        badge.textContent = daysRemaining > 9 ? '9+' : daysRemaining.toString();
        badge.style.display = 'flex';
        
        // Thêm class để highlight
        notificationBtn.classList.add('top-nav__notification-btn--warning');
    },
    
    /**
     * Ẩn notification badge (nhưng giữ button hiển thị)
     */
    hideNotification() {
        const notificationBtn = document.getElementById('notificationBtn');
        if (!notificationBtn) return;
        
        // Đảm bảo button luôn hiển thị
        notificationBtn.style.display = 'flex';
        
        const badge = notificationBtn.querySelector('.top-nav__notification-badge');
        if (badge) {
            badge.style.display = 'none';
        }
        
        notificationBtn.classList.remove('top-nav__notification-btn--warning');
    },
    
    /**
     * Setup dropdown notification khi click vào bell
     */
    setupDropdown() {
        const notificationBtn = document.getElementById('notificationBtn');
        if (!notificationBtn) return;
        
        // Xóa event listener cũ nếu có
        const newBtn = notificationBtn.cloneNode(true);
        notificationBtn.parentNode.replaceChild(newBtn, notificationBtn);
        
        newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(newBtn);
        });
        
        // Đóng dropdown khi click bên ngoài
        document.addEventListener('click', (e) => {
            if (!newBtn.contains(e.target)) {
                this.closeDropdown();
            }
        });
    },
    
    /**
     * Toggle dropdown notification
     */
    toggleDropdown(button) {
        // Kiểm tra subscription status
        if (!window.SubscriptionManager) return;
        
        const status = window.SubscriptionManager.getSubscriptionStatus();
        
        // Nếu không có notification thì không hiển thị dropdown
        if (!status.isActive || !status.daysRemaining || status.daysRemaining >= this.WARNING_THRESHOLD) {
            return;
        }
        
        // Đóng dropdown hiện tại nếu có
        const existingDropdown = document.querySelector('.top-nav__notification-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
            return;
        }
        
        // Tạo dropdown mới
        const dropdown = document.createElement('div');
        dropdown.className = 'top-nav__notification-dropdown';
        
        const daysRemaining = status.daysRemaining;
        const daysText = daysRemaining === 1 ? 'ngày' : 'ngày';
        const currentPath = window.location.pathname;
        const isInPagesFolder = currentPath.includes('pages/');
        const premiumHref = isInPagesFolder ? 'premium.html' : 'pages/premium.html';
        
        dropdown.innerHTML = `
            <div class="top-nav__notification-dropdown-header">
                <div class="top-nav__notification-dropdown-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="top-nav__notification-dropdown-title">
                    Gói Premium sắp hết hạn
                </div>
            </div>
            <div class="top-nav__notification-dropdown-body">
                <div class="top-nav__notification-dropdown-message">
                    Gói <strong>${status.plan}</strong> của bạn sẽ hết hạn trong:
                </div>
                <div class="top-nav__notification-dropdown-days">
                    <i class="fas fa-clock"></i>
                    <span>${daysRemaining} ${daysText}</span>
                </div>
            </div>
            <div class="top-nav__notification-dropdown-actions">
                <a href="${premiumHref}" class="top-nav__notification-dropdown-btn top-nav__notification-dropdown-btn--primary">
                    <i class="fas fa-sync-alt"></i>
                    Gia hạn ngay
                </a>
            </div>
        `;
        
        // Position dropdown
        const rect = button.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = (rect.bottom + 10) + 'px';
        dropdown.style.right = (window.innerWidth - rect.right) + 'px';
        dropdown.style.zIndex = '1000';
        
        document.body.appendChild(dropdown);
        
        // Animation
        setTimeout(() => {
            dropdown.classList.add('show');
        }, 10);
    },
    
    /**
     * Đóng dropdown
     */
    closeDropdown() {
        const dropdown = document.querySelector('.top-nav__notification-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            setTimeout(() => {
                if (dropdown.parentNode) {
                    dropdown.parentNode.removeChild(dropdown);
                }
            }, 200);
        }
    }
};

// Export for use in other files
window.SubscriptionNotification = SubscriptionNotification;

// Tự động kiểm tra khi trang load
document.addEventListener('DOMContentLoaded', () => {
    // Đợi một chút để đảm bảo components đã load
    setTimeout(() => {
        // Đảm bảo notification button luôn hiển thị
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.style.display = 'flex';
        }
        
        SubscriptionNotification.checkAndUpdate();
        SubscriptionNotification.setupDropdown();
    }, 1000);
});

// Lắng nghe sự kiện subscription updated để cập nhật lại
window.addEventListener('subscriptionUpdated', () => {
    setTimeout(() => {
        SubscriptionNotification.checkAndUpdate();
    }, 500);
});

