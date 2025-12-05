// ============================================
// CONTACT PAGE JAVASCRIPT
// ============================================

// ============================================
// CONTACT FORM HANDLING
// ============================================

const contactForm = document.getElementById('contactForm');
const contactError = document.getElementById('contactError');
const contactSuccess = document.getElementById('contactSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Hide previous messages
        hideMessage('contactError');
        hideMessage('contactSuccess');
        
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim(),
            agree: document.getElementById('agree').checked
        };
        
        // Validate
        if (!validateContactForm(formData)) {
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        
        // Simulate API call
        setTimeout(() => {
            // Store in localStorage (for demo purposes)
            const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
            submissions.push({
                ...formData,
                submittedAt: new Date().toISOString()
            });
            localStorage.setItem('contact_submissions', JSON.stringify(submissions));
            
            // Show success message
            showSuccess('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Scroll to success message
            contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1500);
    });
}

// ============================================
// FORM VALIDATION
// ============================================

function validateContactForm(data) {
    // Check required fields
    if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
        showError('Vui lòng điền đầy đủ các trường bắt buộc');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showError('Email không hợp lệ');
        return false;
    }
    
    // Validate phone (if provided)
    if (data.phone) {
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (!phoneRegex.test(data.phone)) {
            showError('Số điện thoại không hợp lệ');
            return false;
        }
    }
    
    // Check agreement
    if (!data.agree) {
        showError('Vui lòng đồng ý với chính sách bảo mật');
        return false;
    }
    
    // Check message length
    if (data.message.length < 10) {
        showError('Tin nhắn phải có ít nhất 10 ký tự');
        return false;
    }
    
    return true;
}

function showError(message) {
    if (contactError) {
        contactError.textContent = message;
        contactError.classList.add('show');
        setTimeout(() => {
            contactError.classList.remove('show');
        }, 5000);
    }
}

function showSuccess(message) {
    if (contactSuccess) {
        contactSuccess.textContent = message;
        contactSuccess.classList.add('show');
        setTimeout(() => {
            contactSuccess.classList.remove('show');
        }, 5000);
    }
}

function hideMessage(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('show');
    }
}

// ============================================
// PARTICLES EFFECT
// ============================================

function createContactParticles() {
    const particlesContainer = document.getElementById('contactParticles');
    if (!particlesContainer) return;

    const particleCount = 30;
    const colors = ['#6C5CE7', '#8B7FED', '#00D2D3', '#FF6B6B'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            opacity: ${Math.random() * 0.5 + 0.2};
            animation: floatParticle ${duration}s ${delay}s infinite ease-in-out;
            pointer-events: none;
        `;

        particlesContainer.appendChild(particle);
    }

    // Add CSS animation if not exists
    if (!document.getElementById('particleStyles')) {
        const style = document.createElement('style');
        style.id = 'particleStyles';
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0.2;
                }
                25% {
                    transform: translate(20px, -20px) scale(1.2);
                    opacity: 0.5;
                }
                50% {
                    transform: translate(-20px, 20px) scale(0.8);
                    opacity: 0.3;
                }
                75% {
                    transform: translate(20px, 20px) scale(1.1);
                    opacity: 0.4;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize particles when page loads
window.addEventListener('load', createContactParticles);

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// FORM INPUT ANIMATIONS
// ============================================

const formInputs = document.querySelectorAll('.contact-form__input');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

console.log('%c📧 MusicStream Contact', 'font-size: 20px; font-weight: bold; color: #6C5CE7;');
console.log('Trang liên hệ đã sẵn sàng!');

