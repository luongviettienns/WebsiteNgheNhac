// ============================================
// PAYMENT PAGE JAVASCRIPT
// ============================================

const PaymentPage = {
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
                        features: plan.features || []
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
                        features: [
                            'Không quảng cáo',
                            'Chất lượng âm thanh cao (320kbps)',
                            'Tải xuống offline không giới hạn',
                            'Bỏ qua bài hát không giới hạn',
                            'Phát nhạc theo yêu cầu',
                            'Hỗ trợ 1 thiết bị'
                        ]
                    },
                    family: {
                        name: 'Premium Family',
                        originalPrice: 149000,
                        discountPrice: 74500,
                        discount: 50,
                        period: 'tháng',
                        features: [
                            'Tất cả tính năng Premium Individual',
                            'Hỗ trợ tối đa 6 tài khoản',
                            'Playlist gia đình',
                            'Kiểm soát nội dung trẻ em',
                            'Chia sẻ với gia đình',
                            'Tiết kiệm hơn 40%'
                        ]
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
                    features: [
                        'Không quảng cáo',
                        'Chất lượng âm thanh cao (320kbps)',
                        'Tải xuống offline không giới hạn',
                        'Bỏ qua bài hát không giới hạn',
                        'Phát nhạc theo yêu cầu',
                        'Hỗ trợ 1 thiết bị'
                    ]
                },
                family: {
                    name: 'Premium Family',
                    originalPrice: 149000,
                    discountPrice: 74500,
                    discount: 50,
                    period: 'tháng',
                    features: [
                        'Tất cả tính năng Premium Individual',
                        'Hỗ trợ tối đa 6 tài khoản',
                        'Playlist gia đình',
                        'Kiểm soát nội dung trẻ em',
                        'Chia sẻ với gia đình',
                        'Tiết kiệm hơn 40%'
                    ]
                }
            };
        }
    },
    
    init() {
        this.loadPlans();
        this.loadPlanFromURL();
        this.setupPaymentMethodToggle();
        this.setupForm();
        this.formatCardInputs();
        
        // Listen for plan updates
        window.addEventListener('plansUpdated', () => {
            this.loadPlans();
            this.loadPlanFromURL();
        });
    },
    
    /**
     * Load plan from URL parameter
     */
    loadPlanFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const planType = urlParams.get('plan');
        
        if (planType && this.plans[planType]) {
            this.updateOrderSummary(this.plans[planType]);
        } else {
            // Default to individual if no plan specified
            this.updateOrderSummary(this.plans.individual);
        }
    },
    
    /**
     * Update order summary with plan details
     */
    updateOrderSummary(plan) {
        const planNameEl = document.getElementById('planName');
        const planPeriodEl = document.getElementById('planPeriod');
        const originalPriceEl = document.getElementById('originalPrice');
        const discountAmountEl = document.getElementById('discountAmount');
        const totalPriceEl = document.getElementById('totalPrice');
        const planFeaturesEl = document.getElementById('planFeatures');
        
        if (planNameEl) planNameEl.textContent = plan.name;
        if (planPeriodEl) planPeriodEl.textContent = `Thanh toán hàng ${plan.period}`;
        if (originalPriceEl) originalPriceEl.textContent = this.formatPrice(plan.originalPrice);
        
        const discountAmount = plan.originalPrice - plan.discountPrice;
        if (discountAmountEl) {
            discountAmountEl.textContent = `-${this.formatPrice(discountAmount)} (${plan.discount}%)`;
        }
        
        if (totalPriceEl) totalPriceEl.textContent = this.formatPrice(plan.discountPrice);
        
        if (planFeaturesEl && plan.features) {
            planFeaturesEl.innerHTML = plan.features.map(feature => 
                `<li><i class="fas fa-check"></i> ${feature}</li>`
            ).join('');
        }
        
        // Store plan in sessionStorage for form submission
        sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
    },
    
    /**
     * Setup payment method toggle to show/hide relevant fields
     */
    setupPaymentMethodToggle() {
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        const cardGroup = document.getElementById('cardDetailsGroup');
        const walletGroup = document.getElementById('walletDetailsGroup');
        const smsGroup = document.getElementById('smsDetailsGroup');
        const qrGroup = document.getElementById('qrDetailsGroup');
        
        paymentMethods.forEach(method => {
            method.addEventListener('change', (e) => {
                const value = e.target.value;
                
                // Hide all groups
                if (cardGroup) cardGroup.style.display = 'none';
                if (walletGroup) walletGroup.style.display = 'none';
                if (smsGroup) smsGroup.style.display = 'none';
                if (qrGroup) qrGroup.style.display = 'none';
                
                // Show relevant group
                if (value === 'card' && cardGroup) {
                    cardGroup.style.display = 'block';
                } else if (value === 'wallet' && walletGroup) {
                    walletGroup.style.display = 'block';
                } else if (value === 'sms' && smsGroup) {
                    smsGroup.style.display = 'block';
                } else if (value === 'qr' && qrGroup) {
                    qrGroup.style.display = 'block';
                }
            });
        });
    },
    
    /**
     * Format card input fields
     */
    formatCardInputs() {
        const cardNumber = document.getElementById('cardNumber');
        const cardExpiry = document.getElementById('cardExpiry');
        const cardCVV = document.getElementById('cardCVV');
        
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s/g, '');
                value = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = value;
            });
        }
        
        if (cardExpiry) {
            cardExpiry.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }
        
        if (cardCVV) {
            cardCVV.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }
    },
    
    /**
     * Setup form submission
     */
    setupForm() {
        const form = document.getElementById('paymentForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePayment(form);
        });
    },
    
    /**
     * Handle payment form submission
     */
    handlePayment(form) {
        const formData = new FormData(form);
        const paymentMethod = formData.get('paymentMethod');
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        if (!paymentMethod) {
            this.showMessage('Vui lòng chọn phương thức thanh toán', 'error');
            return;
        }
        
        if (!agreeTerms) {
            this.showMessage('Vui lòng đồng ý với điều khoản dịch vụ', 'error');
            return;
        }
        
        // Check if user already has active subscription
        if (window.SubscriptionManager && !window.SubscriptionManager.canSubscribe()) {
            const status = window.SubscriptionManager.getSubscriptionStatus();
            if (status.hasSubscription && status.isActive) {
                this.showMessage(`Bạn đã có gói ${status.plan} đang hoạt động. Vui lòng đợi đến khi hết hạn để đăng ký gói mới.`, 'error');
                return;
            }
        }
        
        // Get selected plan
        const planData = sessionStorage.getItem('selectedPlan');
        if (!planData) {
            this.showMessage('Không tìm thấy thông tin gói đã chọn', 'error');
            return;
        }
        
        const plan = JSON.parse(planData);
        
        // Collect payment details based on method
        const paymentDetails = {
            method: paymentMethod,
            cardNumber: paymentMethod === 'card' ? document.getElementById('cardNumber').value : null,
            cardName: paymentMethod === 'card' ? document.getElementById('cardName').value : null,
            cardExpiry: paymentMethod === 'card' ? document.getElementById('cardExpiry').value : null,
            cardCVV: paymentMethod === 'card' ? document.getElementById('cardCVV').value : null,
            walletType: paymentMethod === 'wallet' ? document.getElementById('walletType').value : null,
            walletPhone: paymentMethod === 'wallet' ? document.getElementById('walletPhone').value : null,
            smsPhone: paymentMethod === 'sms' ? document.getElementById('smsPhone').value : null
        };
        
        // Validate payment details
        if (paymentMethod === 'card') {
            if (!paymentDetails.cardNumber || !paymentDetails.cardName || !paymentDetails.cardExpiry || !paymentDetails.cardCVV) {
                this.showMessage('Vui lòng điền đầy đủ thông tin thẻ', 'error');
                return;
            }
        } else if (paymentMethod === 'wallet') {
            if (!paymentDetails.walletType || !paymentDetails.walletPhone) {
                this.showMessage('Vui lòng chọn ví và nhập số điện thoại', 'error');
                return;
            }
        } else if (paymentMethod === 'sms') {
            if (!paymentDetails.smsPhone) {
                this.showMessage('Vui lòng nhập số điện thoại', 'error');
                return;
            }
        }
        
        // Disable submit button
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        }
        
        // Simulate payment processing
        setTimeout(() => {
            // Generate transaction ID
            const transactionId = 'TXN-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
            
            // Save payment to localStorage
            const paymentData = {
                id: transactionId,
                plan: plan.name,
                price: plan.discountPrice,
                originalPrice: plan.originalPrice,
                discount: plan.discount,
                period: plan.period || 'tháng',
                paymentMethod: paymentMethod,
                paymentDetails: paymentDetails,
                timestamp: new Date().toISOString(),
                status: 'completed'
            };
            
            try {
                const payments = JSON.parse(localStorage.getItem('musicstream_payments') || '[]');
                payments.push(paymentData);
                localStorage.setItem('musicstream_payments', JSON.stringify(payments));
                
                // Show success and redirect to success page
                this.showMessage('Thanh toán thành công! Đang chuyển hướng...', 'success');
                
                setTimeout(() => {
                    window.location.href = `payment-success.html?id=${transactionId}`;
                }, 1500);
            } catch (e) {
                console.error('Error saving payment:', e);
                this.showMessage('Có lỗi xảy ra khi xử lý thanh toán', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-lock"></i> Xác nhận thanh toán';
                }
            }
        }, 2000);
    },
    
    /**
     * Format price to VND
     */
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    },
    
    /**
     * Show message
     */
    showMessage(message, type = 'info') {
        const messageEl = document.getElementById('formMessage');
        if (!messageEl) return;
        
        messageEl.textContent = message;
        messageEl.className = `payment-form__message payment-form__message--${type}`;
        messageEl.style.display = 'block';
        
        // Scroll to message
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto hide after 5 seconds for error, keep success visible
        if (type === 'error') {
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    PaymentPage.init();
});

