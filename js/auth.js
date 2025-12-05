// ============================================
// AUTHENTICATION SYSTEM
// ============================================

// ============================================
// INITIALIZE DEFAULT ACCOUNT
// ============================================

function initializeDefaultAccount() {
    const accounts = JSON.parse(localStorage.getItem('musicstream_accounts') || '[]');
    
    // Check if admin account exists
    const adminExists = accounts.some(acc => acc.username === 'admin');
    
    if (!adminExists) {
        accounts.push({
            username: 'admin',
            password: 'admin123',
            email: 'admin@musicstream.com',
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('musicstream_accounts', JSON.stringify(accounts));
    }
}

// Initialize on load
initializeDefaultAccount();

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
        setTimeout(() => {
            errorEl.classList.remove('show');
        }, 5000);
    }
}

function hideError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.classList.remove('show');
    }
}

// ============================================
// LOGIN FUNCTIONALITY
// ============================================

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        hideError('errorMessage');
        
        // Validate
        if (!username || !password) {
            showError('errorMessage', 'Vui lòng điền đầy đủ thông tin');
            return;
        }
        
        // Get accounts from localStorage
        const accounts = JSON.parse(localStorage.getItem('musicstream_accounts') || '[]');
        
        // Find account
        const account = accounts.find(acc => acc.username === username && acc.password === password);
        
        if (account) {
            // Create session
            const session = {
                username: account.username,
                email: account.email,
                loginTime: new Date().toISOString()
            };
            
            if (remember) {
                // Store in localStorage (persistent)
                localStorage.setItem('musicstream_session', JSON.stringify(session));
            } else {
                // Store in sessionStorage (temporary)
                sessionStorage.setItem('musicstream_session', JSON.stringify(session));
            }
            
            // Dispatch event for other pages
            window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: session }));
            
            // Redirect to home
            window.location.href = 'home.html';
        } else {
            showError('errorMessage', 'Tên đăng nhập hoặc mật khẩu không đúng');
        }
    });
}

// ============================================
// REGISTER FUNCTIONALITY
// ============================================

const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        hideError('errorMessage');
        
        // Validate
        if (!username || !email || !password || !confirmPassword) {
            showError('errorMessage', 'Vui lòng điền đầy đủ thông tin');
            return;
        }
        
        if (username.length < 3) {
            showError('errorMessage', 'Tên đăng nhập phải có ít nhất 3 ký tự');
            return;
        }
        
        if (password.length < 6) {
            showError('errorMessage', 'Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('errorMessage', 'Mật khẩu xác nhận không khớp');
            return;
        }
        
        if (!terms) {
            showError('errorMessage', 'Vui lòng đồng ý với điều khoản sử dụng');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('errorMessage', 'Email không hợp lệ');
            return;
        }
        
        // Get accounts from localStorage
        const accounts = JSON.parse(localStorage.getItem('musicstream_accounts') || '[]');
        
        // Check if username exists
        if (accounts.some(acc => acc.username === username)) {
            showError('errorMessage', 'Tên đăng nhập đã tồn tại');
            return;
        }
        
        // Check if email exists
        if (accounts.some(acc => acc.email === email)) {
            showError('errorMessage', 'Email đã được sử dụng');
            return;
        }
        
        // Create new account
        const newAccount = {
            username: username,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };
        
        accounts.push(newAccount);
        localStorage.setItem('musicstream_accounts', JSON.stringify(accounts));
        
        // Auto login
        const session = {
            username: newAccount.username,
            email: newAccount.email,
            loginTime: new Date().toISOString()
        };
        
        sessionStorage.setItem('musicstream_session', JSON.stringify(session));
        
        // Show success message
        alert('Đăng ký thành công! Đang chuyển đến trang chủ...');
        
        // Redirect to home
        window.location.href = 'home.html';
    });
}

// ============================================
// PASSWORD TOGGLE
// ============================================

function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    
    if (toggle && input) {
        toggle.addEventListener('click', function() {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            const icon = toggle.querySelector('i');
            if (type === 'password') {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    }
}

// Setup password toggles
setupPasswordToggle('togglePassword', 'password');
setupPasswordToggle('toggleRegPassword', 'regPassword');
setupPasswordToggle('toggleRegConfirmPassword', 'regConfirmPassword');

// ============================================
// CHECK LOGIN STATUS
// ============================================

function getCurrentUser() {
    // Check sessionStorage first (temporary session)
    let session = sessionStorage.getItem('musicstream_session');
    
    // If not found, check localStorage (remember me)
    if (!session) {
        session = localStorage.getItem('musicstream_session');
    }
    
    if (session) {
        try {
            return JSON.parse(session);
        } catch (e) {
            return null;
        }
    }
    
    return null;
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function logout() {
    sessionStorage.removeItem('musicstream_session');
    localStorage.removeItem('musicstream_session');
    
    // Dispatch event for other pages
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
    
    window.location.href = 'login.html';
}

// ============================================
// EXPORT FUNCTIONS (for use in other files)
// ============================================

if (typeof window !== 'undefined') {
    window.authUtils = {
        getCurrentUser,
        isLoggedIn,
        logout
    };
}

// ============================================
// PARTICLES EFFECT (similar to landing page)
// ============================================

function createAuthParticles() {
    const particlesContainer = document.getElementById('authParticles');
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
window.addEventListener('load', createAuthParticles);

