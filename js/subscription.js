// ============================================
// SUBSCRIPTION MANAGEMENT
// ============================================

const SubscriptionManager = {
    /**
     * Get current user's subscription
     */
    getSubscription() {
        const subscriptionJson = localStorage.getItem('musicstream_subscription');
        if (!subscriptionJson) return null;
        
        try {
            return JSON.parse(subscriptionJson);
        } catch (e) {
            console.error('Error parsing subscription:', e);
            return null;
        }
    },
    
    /**
     * Save subscription for current user
     */
    saveSubscription(subscriptionData) {
        localStorage.setItem('musicstream_subscription', JSON.stringify(subscriptionData));
    },
    
    /**
     * Check if user has active subscription
     */
    hasActiveSubscription() {
        const subscription = this.getSubscription();
        if (!subscription) return false;
        
        // Check if expired
        const expiryDate = new Date(subscription.expiryDate);
        const now = new Date();
        
        if (now > expiryDate) {
            // Auto update to expired
            subscription.status = 'expired';
            this.saveSubscription(subscription);
            return false;
        }
        
        return subscription.status === 'active';
    },
    
    /**
     * Get subscription plan name
     */
    getPlanName() {
        const subscription = this.getSubscription();
        if (!subscription || !this.hasActiveSubscription()) {
            return null;
        }
        return subscription.plan;
    },
    
    /**
     * Check if user can subscribe (no active subscription)
     */
    canSubscribe() {
        return !this.hasActiveSubscription();
    },
    
    /**
     * Get subscription status with expiry info
     */
    getSubscriptionStatus() {
        const subscription = this.getSubscription();
        if (!subscription) {
            return {
                hasSubscription: false,
                isActive: false,
                plan: null,
                expiryDate: null,
                daysRemaining: null
            };
        }
        
        const expiryDate = new Date(subscription.expiryDate);
        const now = new Date();
        const isExpired = now > expiryDate;
        const daysRemaining = isExpired ? 0 : Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        
        if (isExpired && subscription.status === 'active') {
            // Auto update to expired
            subscription.status = 'expired';
            this.saveSubscription(subscription);
        }
        
        return {
            hasSubscription: true,
            isActive: subscription.status === 'active' && !isExpired,
            plan: subscription.plan,
            expiryDate: subscription.expiryDate,
            daysRemaining: daysRemaining
        };
    },
    
    /**
     * Update top nav bar upgrade button
     */
    updateTopNavUpgradeButton() {
        // Check if user is logged in first
        const currentUser = window.authUtils ? window.authUtils.getCurrentUser() : null;
        if (!currentUser) {
            // User not logged in - ensure buttons show "Nâng cấp"
            setTimeout(() => {
                const topNavUpgrade = document.querySelector('.top-nav__upgrade-btn') || document.getElementById('topNavUpgradeBtn');
                if (topNavUpgrade) {
                    topNavUpgrade.textContent = 'Nâng cấp';
                    topNavUpgrade.classList.remove('top-nav__upgrade-btn--active');
                }
                
                const navbarUpgrade = document.querySelector('.navbar__upgrade-btn') || document.getElementById('navbarUpgradeBtn');
                if (navbarUpgrade) {
                    navbarUpgrade.textContent = 'Nâng cấp';
                    navbarUpgrade.classList.remove('navbar__upgrade-btn--active');
                }
            }, 100);
            return;
        }
        
        // Wait a bit for components to load
        setTimeout(() => {
            // Check for top nav in home page
            const topNavUpgrade = document.querySelector('.top-nav__upgrade-btn') || document.getElementById('topNavUpgradeBtn');
            if (topNavUpgrade) {
                const planName = this.getPlanName();
                if (planName) {
                    // Replace "Nâng cấp" with plan name
                    topNavUpgrade.textContent = planName;
                    // Adjust href based on current path
                    const currentPath = window.location.pathname;
                    if (currentPath.includes('pages/')) {
                        topNavUpgrade.href = 'premium.html';
                    } else {
                        topNavUpgrade.href = 'pages/premium.html';
                    }
                    topNavUpgrade.classList.add('top-nav__upgrade-btn--active');
                } else {
                    // Show "Nâng cấp" for non-premium users
                    topNavUpgrade.textContent = 'Nâng cấp';
                    const currentPath = window.location.pathname;
                    if (currentPath.includes('pages/')) {
                        topNavUpgrade.href = 'premium.html';
                    } else {
                        topNavUpgrade.href = 'pages/premium.html';
                    }
                    topNavUpgrade.classList.remove('top-nav__upgrade-btn--active');
                }
            }
            
            // Check for navbar in landing/premium pages
            const navbarUpgrade = document.querySelector('.navbar__upgrade-btn') || document.getElementById('navbarUpgradeBtn');
            if (navbarUpgrade) {
                const planName = this.getPlanName();
                if (planName) {
                    navbarUpgrade.textContent = planName;
                    // Adjust href based on current path
                    const currentPath = window.location.pathname;
                    if (currentPath.includes('pages/')) {
                        navbarUpgrade.href = 'premium.html';
                    } else {
                        navbarUpgrade.href = 'pages/premium.html';
                    }
                    navbarUpgrade.classList.add('navbar__upgrade-btn--active');
                } else {
                    navbarUpgrade.textContent = 'Nâng cấp';
                    const currentPath = window.location.pathname;
                    if (currentPath.includes('pages/')) {
                        navbarUpgrade.href = 'premium.html';
                    } else {
                        navbarUpgrade.href = 'pages/premium.html';
                    }
                    navbarUpgrade.classList.remove('navbar__upgrade-btn--active');
                }
            }
        }, 100);
    }
};

// Export for use in other files
window.SubscriptionManager = SubscriptionManager;

// Auto check subscription status on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check and update expired subscriptions
    SubscriptionManager.getSubscriptionStatus();
    
    // Update top nav button
    SubscriptionManager.updateTopNavUpgradeButton();
});

