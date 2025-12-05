// ============================================
// PREMIUM PAGE JAVASCRIPT
// ============================================

const PremiumPage = {
    plans: {},
    
    /**
     * Load plans from localStorage
     */
    loadPlans() {
        try {
            const plansJson = localStorage.getItem('musicstream_premium_plans');
            const plansArray = plansJson ? JSON.parse(plansJson) : [];
            
            // Convert array to object with type as key, only active plans
            this.plans = {};
            plansArray.forEach(plan => {
                if (plan.isActive !== false) {
                    this.plans[plan.type] = {
                        name: plan.name,
                        originalPrice: plan.originalPrice,
                        discountPrice: plan.discountPrice,
                        discount: plan.discount || 0,
                        period: plan.period,
                        studentPrice: plan.studentPrice || null
                    };
                }
            });
            
            // If no plans in localStorage, use defaults
            if (Object.keys(this.plans).length === 0) {
                this.plans = {
                    individual: {
                        name: 'Premium Individual',
                        originalPrice: 99000,
                        discountPrice: 49000,
                        discount: 50,
                        period: 'tháng',
                        studentPrice: 29000
                    },
                    family: {
                        name: 'Premium Family',
                        originalPrice: 149000,
                        discountPrice: 74500,
                        discount: 50,
                        period: 'tháng',
                        studentPrice: null
                    }
                };
            }
        } catch (e) {
            console.error('Error loading plans:', e);
            // Fallback to defaults
            this.plans = {
                individual: {
                    name: 'Premium Individual',
                    originalPrice: 99000,
                    discountPrice: 49000,
                    discount: 50,
                    period: 'tháng',
                    studentPrice: 29000
                },
                family: {
                    name: 'Premium Family',
                    originalPrice: 149000,
                    discountPrice: 74500,
                    discount: 50,
                    period: 'tháng',
                    studentPrice: null
                }
            };
        }
    },
    
    init() {
        this.loadPlans();
        this.setupPlanButtons();
        
        // Listen for plan updates
        window.addEventListener('plansUpdated', () => {
            this.loadPlans();
        });
    },
    
    setupPlanButtons() {
        const planButtons = document.querySelectorAll('[data-plan]');
        planButtons.forEach(button => {
            // Check if button is already marked as current plan
            if (button.classList.contains('pricing-card__current-plan-btn')) {
                return; // Skip adding click handler
            }
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const planType = e.currentTarget.dataset.plan;
                // Redirect to payment page
                window.location.href = `payment.html?plan=${planType}`;
            });
        });
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    PremiumPage.init();
    
    // Check subscription status and update buttons
    if (window.SubscriptionManager) {
        const status = window.SubscriptionManager.getSubscriptionStatus();
        if (status.hasSubscription && status.isActive) {
            // Find the button for the current plan
            const planButtons = document.querySelectorAll('[data-plan]');
            planButtons.forEach(button => {
                const planType = button.getAttribute('data-plan');
                const planName = PremiumPage.plans[planType]?.name;
                
                // Check if this is the user's current plan
                if (planName && status.plan === planName) {
                    // Change button text to "Gói hiện tại của bạn"
                    button.textContent = 'Gói hiện tại của bạn';
                    button.style.pointerEvents = 'none';
                    button.style.opacity = '0.7';
                    button.style.cursor = 'default';
                    button.classList.add('pricing-card__current-plan-btn');
                    
                    // Remove click handler and prevent navigation
                    button.href = '#';
                    button.onclick = (e) => e.preventDefault();
                    
                    // Add badge to card
                    const card = button.closest('.pricing-card');
                    if (card) {
                        // Remove existing badge if any
                        const existingBadge = card.querySelector('.pricing-card__badge');
                        if (existingBadge && existingBadge.textContent !== 'Phổ biến nhất') {
                            existingBadge.remove();
                        }
                        
                        // Add current plan badge
                        const currentBadge = document.createElement('div');
                        currentBadge.className = 'pricing-card__badge pricing-card__badge--current';
                        currentBadge.innerHTML = '<i class="fas fa-check-circle"></i> Gói hiện tại';
                        card.insertBefore(currentBadge, card.firstChild);
                        
                        // Add highlight to card
                        card.classList.add('pricing-card--current');
                    }
                } else {
                    // Disable other plan buttons
                    button.style.pointerEvents = 'none';
                    button.style.opacity = '0.5';
                    button.style.cursor = 'not-allowed';
                    button.href = '#';
                    button.onclick = (e) => e.preventDefault();
                    
                    // Add tooltip or message
                    const card = button.closest('.pricing-card');
                    if (card) {
                        const existingMsg = card.querySelector('.subscription-warning');
                        if (!existingMsg) {
                            const warning = document.createElement('div');
                            warning.className = 'subscription-warning';
                            warning.innerHTML = `<i class="fas fa-info-circle"></i> Bạn đã có gói ${status.plan} đang hoạt động`;
                            card.appendChild(warning);
                        }
                    }
                }
            });
        }
    }
});

