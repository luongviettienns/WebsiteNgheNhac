// ============================================
// PAYMENT SUCCESS PAGE JAVASCRIPT
// ============================================

const PaymentSuccess = {
    init() {
        this.loadPaymentData();
    },
    
    /**
     * Load payment data from URL or localStorage
     */
    loadPaymentData() {
        // Try to get from URL parameter first
        const urlParams = new URLSearchParams(window.location.search);
        const paymentId = urlParams.get('id');
        
        let paymentData = null;
        
        if (paymentId) {
            // Get specific payment by ID
            const payments = JSON.parse(localStorage.getItem('musicstream_payments') || '[]');
            paymentData = payments.find(p => p.id === paymentId);
        } else {
            // Get the most recent payment
            const payments = JSON.parse(localStorage.getItem('musicstream_payments') || '[]');
            if (payments.length > 0) {
                paymentData = payments[payments.length - 1];
            }
        }
        
        if (paymentData) {
            this.displayPaymentData(paymentData);
        } else {
            // If no payment data found, redirect to premium page
            setTimeout(() => {
                window.location.href = 'premium.html';
            }, 2000);
        }
    },
    
    /**
     * Display payment data on the page
     */
    displayPaymentData(paymentData) {
        // Plan Information
        const planNameEl = document.getElementById('planName');
        const planPeriodEl = document.getElementById('planPeriod');
        const planPriceEl = document.getElementById('planPrice');
        
        if (planNameEl) planNameEl.textContent = paymentData.plan || 'Premium Individual';
        if (planPeriodEl) planPeriodEl.textContent = paymentData.period ? `Hàng ${paymentData.period}` : 'Hàng tháng';
        if (planPriceEl) planPriceEl.textContent = this.formatPrice(paymentData.price || paymentData.discountPrice || 49000);
        
        // Payment Information
        const paymentMethodEl = document.getElementById('paymentMethod');
        const transactionIdEl = document.getElementById('transactionId');
        const paymentDateEl = document.getElementById('paymentDate');
        
        if (paymentMethodEl) {
            paymentMethodEl.textContent = this.getPaymentMethodName(paymentData.paymentMethod || 'card');
        }
        
        if (transactionIdEl) {
            transactionIdEl.textContent = paymentData.id || this.generateTransactionId();
        }
        
        if (paymentDateEl) {
            const paymentDate = paymentData.timestamp ? new Date(paymentData.timestamp) : new Date();
            paymentDateEl.textContent = this.formatDate(paymentDate);
        }
        
        // Subscription Information
        const startDateEl = document.getElementById('startDate');
        const expiryDateEl = document.getElementById('expiryDate');
        
        const startDate = paymentData.timestamp ? new Date(paymentData.timestamp) : new Date();
        const expiryDate = new Date(startDate);
        expiryDate.setMonth(expiryDate.getMonth() + 1); // Add 1 month
        
        if (startDateEl) {
            startDateEl.textContent = this.formatDate(startDate);
        }
        
        if (expiryDateEl) {
            expiryDateEl.textContent = this.formatDate(expiryDate);
        }
        
        // Save expiry date to localStorage for future reference
        // This replaces any existing subscription (one subscription per user)
        const subscriptionData = {
            plan: paymentData.plan,
            startDate: startDate.toISOString(),
            expiryDate: expiryDate.toISOString(),
            status: 'active'
        };
        
        localStorage.setItem('musicstream_subscription', JSON.stringify(subscriptionData));
        
        // Update top nav bar if available
        if (window.SubscriptionManager) {
            window.SubscriptionManager.updateTopNavUpgradeButton();
        }
        
        // Dispatch event for other pages to update
        window.dispatchEvent(new CustomEvent('subscriptionUpdated', { detail: subscriptionData }));
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
     * Format date to Vietnamese format
     */
    formatDate(date) {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    },
    
    /**
     * Get payment method name in Vietnamese
     */
    getPaymentMethodName(method) {
        const methods = {
            'card': 'Thẻ tín dụng/Ghi nợ',
            'wallet': 'Ví điện tử',
            'qr': 'QR Code',
            'sms': 'Thanh toán qua SMS'
        };
        return methods[method] || method;
    },
    
    /**
     * Generate a transaction ID
     */
    generateTransactionId() {
        return 'TXN-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    PaymentSuccess.init();
});

