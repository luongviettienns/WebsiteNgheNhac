// ============================================
// LANDING PAGE AUTHENTICATION
// Đồng bộ navbar với home page khi đăng nhập
// ============================================

// Check login status for landing page navbar
function checkLandingLoginStatus() {
    // Check if user is logged in
    const currentUser = window.authUtils ? window.authUtils.getCurrentUser() : null;
    const navbarActions = document.getElementById('navbarAuthActions');
    
    if (!navbarActions) return;
    
    // Clear auth actions container
    navbarActions.innerHTML = '';
    
    if (currentUser) {
        // User is logged in - create/show user menu
        const userMenu = document.createElement('div');
        userMenu.className = 'navbar__user';
        
        // Create avatar
        const avatar = document.createElement('div');
        avatar.className = 'navbar__user-avatar';
        const firstLetter = currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U';
        avatar.textContent = firstLetter;
        
        // Create username
        const userName = document.createElement('span');
        userName.className = 'navbar__user-name';
        userName.textContent = currentUser.username || 'User';
        
        // Create dropdown icon
        const dropdownIcon = document.createElement('i');
        dropdownIcon.className = 'fas fa-chevron-down';
        
        // Append elements
        userMenu.appendChild(avatar);
        userMenu.appendChild(userName);
        userMenu.appendChild(dropdownIcon);
        
        // Insert into navbar actions
        navbarActions.appendChild(userMenu);
        
        // Get current path to adjust hrefs
        const currentPath = window.location.pathname;
        const isInPagesFolder = currentPath.includes('pages/');
        
        // Add upgrade/premium button
        const upgradeBtn = document.createElement('a');
        upgradeBtn.href = isInPagesFolder ? 'premium.html' : 'pages/premium.html';
        upgradeBtn.className = 'btn btn--primary navbar__upgrade-btn';
        upgradeBtn.id = 'navbarUpgradeBtn';
        upgradeBtn.textContent = 'Nâng cấp';
        navbarActions.insertBefore(upgradeBtn, userMenu);
        
        // Update upgrade button with subscription plan if available
        if (window.SubscriptionManager) {
            setTimeout(() => {
                window.SubscriptionManager.updateTopNavUpgradeButton();
            }, 100);
        }
        
        // Add link to home page
        const homeLink = document.createElement('a');
        homeLink.href = isInPagesFolder ? 'home.html' : 'pages/home.html';
        homeLink.className = 'btn btn--outline';
        homeLink.innerHTML = '<i class="fas fa-home"></i> Trang chủ';
        navbarActions.insertBefore(homeLink, userMenu);
        
        // Setup logout functionality
        setupLandingLogout(userMenu);
    } else {
        // Get current path to adjust hrefs
        const currentPath = window.location.pathname;
        const isInPagesFolder = currentPath.includes('pages/');
        
        // User is not logged in - show login buttons
        const loginBtn = document.createElement('a');
        loginBtn.href = isInPagesFolder ? 'login.html' : 'pages/login.html';
        loginBtn.className = 'btn btn--outline';
        loginBtn.textContent = 'Đăng nhập';
        
        const tryBtn = document.createElement('a');
        tryBtn.href = isInPagesFolder ? 'home.html' : 'pages/home.html';
        tryBtn.className = 'btn btn--primary';
        tryBtn.textContent = 'Trải nghiệm ngay';
        
        navbarActions.appendChild(loginBtn);
        navbarActions.appendChild(tryBtn);
        
        // Add upgrade button for non-logged in users too
        const upgradeBtn = document.createElement('a');
        upgradeBtn.href = isInPagesFolder ? 'premium.html' : 'pages/premium.html';
        upgradeBtn.className = 'btn btn--primary navbar__upgrade-btn';
        upgradeBtn.id = 'navbarUpgradeBtn';
        upgradeBtn.textContent = 'Nâng cấp';
        navbarActions.insertBefore(upgradeBtn, loginBtn);
        
        // Don't update upgrade button for non-logged in users
        // updateTopNavUpgradeButton() will handle it and ensure "Nâng cấp" is shown
    }
}

// Setup logout functionality for landing page
let landingLogoutSetupDone = false;

function setupLandingLogout(userMenu) {
    // Only setup once to avoid multiple event listeners
    if (landingLogoutSetupDone) return;
    landingLogoutSetupDone = true;
    
    // Use event delegation to handle clicks on user menu
    document.addEventListener('click', function(e) {
        const clickedUserMenu = e.target.closest('.navbar__user');
        if (!clickedUserMenu || clickedUserMenu !== userMenu) return;
        
        // Check if dropdown already exists
        const existingDropdown = document.querySelector('.navbar__user-dropdown');
        if (existingDropdown) {
            // If clicking on user menu again, close dropdown
            existingDropdown.remove();
            return;
        }
        
        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'navbar__user-dropdown';
        
        // Check if user is admin
        const currentUser = window.authUtils ? window.authUtils.getCurrentUser() : null;
        const isAdmin = currentUser && currentUser.username === 'admin';
        
        // Get current path to adjust hrefs
        const currentPath = window.location.pathname;
        const isInPagesFolder = currentPath.includes('pages/');
        const adminHref = isInPagesFolder ? 'admin.html' : 'pages/admin.html';
        const homeHref = isInPagesFolder ? 'home.html' : 'pages/home.html';
        
        let dropdownHTML = '';
        
        // Add admin panel link if user is admin
        if (isAdmin) {
            const accounts = JSON.parse(localStorage.getItem('musicstream_accounts') || '[]');
            const adminAccount = accounts.find(acc => acc.username === 'admin' && acc.password === 'admin123');
            
            if (adminAccount) {
                dropdownHTML += `
                    <a href="${adminHref}" class="navbar__user-dropdown-item" id="adminPanelBtn">
                        <i class="fas fa-cog"></i>
                        Trang quản trị
                    </a>
                `;
            }
        }
        
        dropdownHTML += `
            <a href="${homeHref}" class="navbar__user-dropdown-item">
                <i class="fas fa-home"></i>
                Trang chủ
            </a>
            <a href="#" class="navbar__user-dropdown-item" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i>
                Đăng xuất
            </a>
        `;
        
        dropdown.innerHTML = dropdownHTML;
        
        // Position dropdown
        const rect = userMenu.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = (rect.bottom + 10) + 'px';
        dropdown.style.right = (window.innerWidth - rect.right) + 'px';
        dropdown.style.zIndex = '1000';
        
        document.body.appendChild(dropdown);
        
        // Logout handler
        const logoutBtn = dropdown.querySelector('#logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (window.authUtils) {
                    window.authUtils.logout();
                } else {
                    // Fallback logout
                    sessionStorage.removeItem('musicstream_session');
                    localStorage.removeItem('musicstream_session');
                    const currentPath = window.location.pathname;
                    const isInPagesFolder = currentPath.includes('pages/');
                    window.location.href = isInPagesFolder ? 'login.html' : 'pages/login.html';
                }
                dropdown.remove();
            });
        }
        
        // Close dropdown when clicking outside
        setTimeout(() => {
            const closeDropdown = function(e) {
                if (!dropdown.contains(e.target) && !userMenu.contains(e.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            };
            document.addEventListener('click', closeDropdown);
        }, 100);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkLandingLoginStatus();
    
    // Re-check when storage changes (login/logout from other tabs)
    window.addEventListener('storage', () => {
        checkLandingLoginStatus();
    });
    
    // Also listen for custom events
    window.addEventListener('userLoggedIn', () => {
        checkLandingLoginStatus();
    });
    
    window.addEventListener('userLoggedOut', () => {
        checkLandingLoginStatus();
    });
});

// Export function
window.checkLandingLoginStatus = checkLandingLoginStatus;

