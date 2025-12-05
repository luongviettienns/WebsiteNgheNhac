// ============================================
// HOME PAGE JAVASCRIPT
// ============================================

// ============================================
// MOBILE SIDEBAR TOGGLE
// ============================================

function setupMobileSidebar() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarContainer = document.getElementById('sidebarContainer');
    
    // Check if already set up
    if (hamburgerBtn && hamburgerBtn.dataset.sidebarSetup === 'true') {
        return;
    }
    
    if (!hamburgerBtn) {
        console.log('Hamburger button not found');
        return;
    }
    
    if (!sidebar) {
        console.log('Sidebar not found, will retry...');
        // Retry after a short delay
        setTimeout(() => {
            setupMobileSidebar();
        }, 200);
        return;
    }
    
    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.sidebar__overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar__overlay';
        document.body.appendChild(overlay);
    }
    
    // Mark as set up
    hamburgerBtn.dataset.sidebarSetup = 'true';
    
    function toggleSidebar() {
        if (sidebar) {
            const isActive = sidebar.classList.contains('sidebar--active');
            console.log('Toggling sidebar, current state:', isActive);
            
            sidebar.classList.toggle('sidebar--active');
            overlay.classList.toggle('sidebar__overlay--active');
            hamburgerBtn.classList.toggle('top-nav__hamburger--active');
            
            console.log('Sidebar new state:', sidebar.classList.contains('sidebar--active'));
        }
    }
    
    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove('sidebar--active');
            overlay.classList.remove('sidebar__overlay--active');
            hamburgerBtn.classList.remove('top-nav__hamburger--active');
        }
    }
    
    // Mark as set up
    hamburgerBtn.dataset.sidebarSetup = 'true';
    
    // Hamburger button click
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('Hamburger clicked, sidebar:', sidebar);
        toggleSidebar();
    });
    
    // Overlay click to close
    overlay.addEventListener('click', closeSidebar);
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('sidebar--active')) {
            if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                closeSidebar();
            }
        }
    });
    
    // Close sidebar on window resize if desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
}

// ============================================
// CHECK LOGIN STATUS
// ============================================

function checkLoginStatus() {
    // Check if user is logged in
    const currentUser = window.authUtils ? window.authUtils.getCurrentUser() : null;
    const topNavRight = document.querySelector('.top-nav__right');
    const authActions = document.querySelector('.top-nav__auth-actions');
    
    if (!topNavRight || !authActions) return;
    
    // Clear auth actions container
    authActions.innerHTML = '';
    
    if (currentUser) {
        // User is logged in - create/show user menu
        let userMenu = topNavRight.querySelector('.top-nav__user');
        
        if (!userMenu) {
            // Create user menu if it doesn't exist
            userMenu = document.createElement('div');
            userMenu.className = 'top-nav__user';
            
            // Create avatar
            const avatar = document.createElement('div');
            avatar.className = 'top-nav__user-avatar';
            // Get first letter of username for avatar
            const firstLetter = currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U';
            avatar.textContent = firstLetter;
            
            // Create username
            const userName = document.createElement('span');
            userName.className = 'top-nav__user-name';
            userName.textContent = currentUser.username || 'User';
            
            // Create dropdown icon
            const dropdownIcon = document.createElement('i');
            dropdownIcon.className = 'fas fa-chevron-down';
            
            // Append elements
            userMenu.appendChild(avatar);
            userMenu.appendChild(userName);
            userMenu.appendChild(dropdownIcon);
            
            // Insert into auth actions
            authActions.appendChild(userMenu);
            
            // Setup logout functionality for the new user menu
            if (window.setupLogout) {
                // setupLogout uses event delegation, so it will work automatically
            }
        } else {
            // Update existing user menu
            const userNameEl = userMenu.querySelector('.top-nav__user-name');
            if (userNameEl) {
                userNameEl.textContent = currentUser.username || 'User';
            }
            
            const avatarEl = userMenu.querySelector('.top-nav__user-avatar');
            if (avatarEl) {
                const firstLetter = currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U';
                avatarEl.textContent = firstLetter;
            }
            
            userMenu.style.display = 'flex';
        }
        
        // Hide login button if exists
        const loginBtn = topNavRight.querySelector('.top-nav__login-btn');
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
    } else {
        // User is not logged in - show login button
        const userMenu = topNavRight.querySelector('.top-nav__user');
        if (userMenu) {
            userMenu.style.display = 'none';
        }
        
        // Show login button
        let loginBtn = authActions.querySelector('.top-nav__login-btn');
        if (!loginBtn) {
            loginBtn = document.createElement('a');
            loginBtn.href = 'login.html';
            loginBtn.className = 'btn btn--primary top-nav__login-btn';
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Đăng nhập';
        }
        authActions.appendChild(loginBtn);
        loginBtn.style.display = 'flex';
    }
}

// Flag to ensure setupLogout is only called once
let logoutSetupDone = false;

// Add logout functionality to user menu
function setupLogout() {
    // Only setup once to avoid multiple event listeners
    if (logoutSetupDone) return;
    logoutSetupDone = true;
    
    // Use event delegation to handle clicks on user menu
    // This works even if user menu is created dynamically
    document.addEventListener('click', function(e) {
        const userMenu = e.target.closest('.top-nav__user');
        if (!userMenu) return;
        
        // Check if dropdown already exists
        const existingDropdown = document.querySelector('.top-nav__user-dropdown');
        if (existingDropdown) {
            // If clicking on user menu again, close dropdown
            existingDropdown.remove();
            return;
        }
        
        // Check if user is admin
        const currentUser = window.authUtils ? window.authUtils.getCurrentUser() : null;
        const isAdmin = currentUser && currentUser.username === 'admin';
        
        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'top-nav__user-dropdown';
        
        let dropdownHTML = '';
        
        // Add admin panel link if user is admin
        // Check both username and password to ensure it's the correct admin account
        if (isAdmin) {
            // Verify it's the correct admin account (username: admin, password: admin123)
            const accounts = JSON.parse(localStorage.getItem('musicstream_accounts') || '[]');
            const adminAccount = accounts.find(acc => acc.username === 'admin' && acc.password === 'admin123');
            
            if (adminAccount) {
                // Determine correct path based on current location
                const currentPath = window.location.pathname;
                const isInPages = currentPath.includes('/pages/');
                const adminPath = isInPages ? 'admin.html' : 'pages/admin.html';
                
                dropdownHTML += `
                    <a href="${adminPath}" class="top-nav__user-dropdown-item" id="adminPanelBtn">
                        <i class="fas fa-cog"></i>
                        Trang quản trị
                    </a>
                `;
            }
        }
        
        dropdownHTML += `
            <a href="#" class="top-nav__user-dropdown-item" id="logoutBtn">
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
                    window.location.href = 'login.html';
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

// ============================================
// SAMPLE DATA
// ============================================

// ============================================
// REAL MUSIC DATA
// ============================================

// Make songsData available globally
window.songsData = window.songsData || [];
const songsData = window.songsData.length > 0 ? window.songsData : [
    {
        id: 1,
        name: "Dù cho tận thế (vẫn yêu em)",
        title: "Dù cho tận thế (vẫn yêu em)",
        artist: "ERIK",
        album: "ERIK - 'Dù cho tận thế (vẫn yêu em)' | Official MV | Valentine 2025",
        audio: "../assets/audio/DuChoTanThe.mp3",
        image: "../assets/images/DuChoTanThe_avatar.png",
        artistImage: "../assets/images/Erik.jpg",
        duration: 240
    },
    {
        id: 2,
        name: "Kho Báu",
        title: "Kho Báu",
        artist: "Trọng Hiếu x Rhymastic",
        album: "(S)TRONG Trọng Hiếu x Rhymastic - Kho Báu | Lyrics Video",
        audio: "../assets/audio/KhoBau.mp3",
        image: "../assets/images/KhoBau_avatar.png",
        artistImage: "../assets/images/TrongHieu_avatar.jpg",
        duration: 210
    },
    {
        id: 3,
        name: "Người Đầu Tiên",
        title: "Người Đầu Tiên",
        artist: "Juky San feat. Buitruonglinh",
        album: "Người Đầu Tiên - Juky San feat. Buitruonglinh",
        audio: "../assets/audio/NguoiDauTien.mp3",
        image: "../assets/images/NguoiDauTien_avatar.png",
        artistImage: "../assets/images/Jukysan.jpg",
        duration: 195
    },
    {
        id: 4,
        name: "THIÊU THÂN",
        title: "THIÊU THÂN",
        artist: "KHOI VU, B Ray, Thái Ngân, Bùi Duy Ngọc, Ryn Lee",
        album: "THIÊU THÂN - KHOI VU, B Ray, Thái Ngân, Bùi Duy Ngọc, Ryn Lee | Anh Trai 'Say Hi' 2025",
        audio: "../assets/audio/ThieuThan.mp3",
        image: "../assets/images/ThieuThan_avatar.png",
        artistImage: "../assets/images/Bray_avatar.jpg",
        duration: 225
    },
    {
        id: 5,
        name: "Chúng Ta Của Hiện Tại",
        title: "Chúng Ta Của Hiện Tại",
        artist: "ERIK",
        album: "Chúng Ta Của Hiện Tại - ERIK",
        audio: "../assets/audio/ChungTaCuaHienTai.mp3",
        image: "../assets/images/ChungTaCuaHienTai_avatar.jpg",
        artistImage: "../assets/images/Erik.jpg",
        duration: 250
    },
    {
        id: 6,
        name: "Yêu 5",
        title: "Yêu 5",
        artist: "Rhymastic",
        album: "Yêu 5 - Rhymastic",
        audio: "../assets/audio/Yeu5-Rhymastic.mp3",
        image: "../assets/images/Yeu5_avatar.jpg",
        artistImage: "../assets/images/Rhymastic_avatar.jpg",
        duration: 220
    },
    {
        id: 7,
        name: "Ngáo Ngơ",
        title: "Ngáo Ngơ",
        artist: "Hiếu Thứ Hai, Atus, JSOL, Erik, Cung Orange",
        album: "Ngáo Ngơ - Hiếu Thứ Hai, Atus, JSOL, Erik, Cung Orange | Anh Trai 'Say Hi' Performance",
        audio: "../assets/audio/ytmp3free.cc_ngao-ngo-hieuthuhai-atus-jsol-erik-cung-orange-bung-no-visual-anh-trai-say-hi-performance-youtubemp3free.org.mp3",
        image: "../assets/images/HieuThuHai_avatar.jpg",
        artistImage: "../assets/images/HieuThuHai_avatar.jpg",
        duration: 0 // Sẽ được tự động phát hiện từ file audio
    }
];

const playlistsData = {
    madeForYou: [
        { id: 1, title: 'Daily Mix 1', description: 'Nghệ sĩ yêu thích của bạn', image: songsData[0].image, songs: songsData },
        { id: 2, title: 'Discover Weekly', description: 'Playlist cá nhân hóa mỗi tuần', image: songsData[1].image, songs: [songsData[1], songsData[2]] },
        { id: 3, title: 'Release Radar', description: 'Bài hát mới từ nghệ sĩ bạn theo dõi', image: songsData[2].image, songs: [songsData[2], songsData[3]] },
        { id: 4, title: 'Chill Mix', description: 'Nhạc chill để thư giãn', image: songsData[3].image, songs: [songsData[0], songsData[2]] },
        { id: 5, title: 'Workout Mix', description: 'Nhạc năng động cho tập luyện', image: songsData[1].image, songs: [songsData[1], songsData[3]] },
        { id: 6, title: 'Focus Music', description: 'Nhạc tập trung làm việc', image: songsData[0].image, songs: [songsData[0], songsData[2]] }
    ],
    recentlyPlayed: [
        { id: 7, title: 'Top Hits 2024', description: 'Những bài hát hot nhất năm', image: songsData[0].image, songs: songsData },
        { id: 8, title: 'Pop Mix', description: 'Nhạc Pop hay nhất', image: songsData[1].image, songs: [songsData[0], songsData[1]] },
        { id: 9, title: 'Hip Hop Vibes', description: 'Hip Hop đỉnh cao', image: songsData[3].image, songs: [songsData[2], songsData[3]] },
        { id: 10, title: 'Electronic Dance', description: 'EDM không ngừng', image: songsData[2].image, songs: [songsData[1], songsData[3]] },
        { id: 11, title: 'Acoustic Sessions', description: 'Acoustic nhẹ nhàng', image: songsData[0].image, songs: [songsData[0], songsData[2]] },
        { id: 12, title: 'Rock Classics', description: 'Rock bất hủ', image: songsData[1].image, songs: [songsData[1], songsData[3]] }
    ],
    topCharts: [
        { id: 13, title: 'Top 50 Global', description: 'Bảng xếp hạng toàn cầu', image: songsData[0].image, songs: songsData },
        { id: 14, title: 'Top 50 Vietnam', description: 'Bảng xếp hạng Việt Nam', image: songsData[1].image, songs: songsData },
        { id: 15, title: 'Viral Hits', description: 'Bài hát đang viral', image: songsData[2].image, songs: [songsData[0], songsData[2]] },
        { id: 16, title: 'New Releases', description: 'Phát hành mới nhất', image: songsData[3].image, songs: [songsData[1], songsData[3]] }
    ],
    artists: [
        { id: 1, name: 'ERIK', image: '../assets/images/Erik.jpg', songs: [songsData[0], songsData[4], songsData[6]] },
        { id: 2, name: 'Trọng Hiếu', image: '../assets/images/TrongHieu_avatar.jpg', songs: [songsData[1]] },
        { id: 3, name: 'Juky San', image: '../assets/images/Jukysan.jpg', songs: [songsData[2]] },
        { id: 4, name: 'B Ray', image: '../assets/images/Bray_avatar.jpg', songs: [songsData[3]] },
        { id: 5, name: 'Rhymastic', image: '../assets/images/Rhymastic_avatar.jpg', songs: [songsData[1], songsData[5]] },
        { id: 6, name: 'Buitruonglinh', image: '../assets/images/BuiTruongLinh_avatar.jpg', songs: [songsData[2]] },
        { id: 7, name: 'Hiếu Thứ Hai', image: '../assets/images/HieuThuHai_avatar.jpg', songs: [songsData[6]] }
    ]
};

// Update window.songsData with the full songsData array
if (window.songsData.length === 0) {
    window.songsData = songsData;
} else {
    // Merge new songs if they don't exist
    songsData.forEach(song => {
        if (!window.songsData.find(s => s.id === song.id)) {
            window.songsData.push(song);
        }
    });
}

// Merge admin songs from localStorage
if (typeof Storage !== 'undefined') {
    try {
        const adminSongs = JSON.parse(localStorage.getItem('musicstream_admin_songs') || '[]');
        if (adminSongs.length > 0) {
            const existingIds = new Set(window.songsData.map(s => s.id));
            adminSongs.forEach(song => {
                if (!existingIds.has(song.id)) {
                    window.songsData.push(song);
                }
            });
        }
    } catch (e) {
        console.error('Error merging admin songs:', e);
    }
}

// Listen for admin song changes
window.addEventListener('adminSongAdded', (e) => {
    const newSong = e.detail;
    if (window.songsData && !window.songsData.find(s => s.id === newSong.id)) {
        window.songsData.push(newSong);
    }
});

window.addEventListener('adminSongDeleted', (e) => {
    const songId = e.detail.id;
    if (window.songsData) {
        const index = window.songsData.findIndex(s => s.id === songId);
        if (index > -1) {
            window.songsData.splice(index, 1);
        }
    }
});

// Listen for album changes from admin page
window.addEventListener('albumAdded', () => {
    const albums = getAlbums();
    if (albums.length > 0) {
        renderAlbums('featuredAlbums', albums.slice(0, 6));
    }
});

window.addEventListener('albumUpdated', () => {
    const albums = getAlbums();
    if (albums.length > 0) {
        renderAlbums('featuredAlbums', albums.slice(0, 6));
    }
});

window.addEventListener('albumDeleted', () => {
    const albums = getAlbums();
    if (albums.length > 0) {
        renderAlbums('featuredAlbums', albums.slice(0, 6));
    } else {
        const container = document.getElementById('featuredAlbums');
        if (container) {
            container.innerHTML = '<p style="color: var(--color-text-secondary); padding: 2rem; text-align: center;">Chưa có album nào</p>';
        }
    }
});

// ============================================
// SONG CARD GENERATOR
// ============================================

function createSongCard(song) {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.dataset.songId = song.id;
    
    card.innerHTML = `
        <div class="song-card__image" style="background-image: url('${song.image}'); background-size: cover; background-position: center;">
            <button class="song-card__play-btn">
                <i class="fas fa-play"></i>
            </button>
        </div>
        <div class="song-card__info">
            <div class="song-card__title">${song.title}</div>
            <div class="song-card__artist">${song.artist}</div>
        </div>
    `;
    
    // Play button click
    const playBtn = card.querySelector('.song-card__play-btn');
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSong(song);
    });
    
    // Card click
    card.addEventListener('click', () => {
        playSong(song);
    });
    
    return card;
}

// ============================================
// PLAYLIST CARD GENERATOR
// ============================================

function createPlaylistCard(playlist) {
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.dataset.playlistId = playlist.id;
    
    // Use real image if available, otherwise use gradient
    const imageStyle = playlist.image 
        ? `background-image: url('${playlist.image}'); background-size: cover; background-position: center;`
        : `background: ${playlist.gradient || 'var(--gradient-primary)'};`;
    
    card.innerHTML = `
        <div class="playlist-card__image" style="${imageStyle}">
            ${!playlist.image ? '<i class="fas fa-music"></i>' : ''}
            <button class="playlist-card__play-btn">
                <i class="fas fa-play"></i>
            </button>
        </div>
        <div class="playlist-card__title">${playlist.title}</div>
        <div class="playlist-card__description">${playlist.description}</div>
    `;
    
    // Play button click
    const playBtn = card.querySelector('.playlist-card__play-btn');
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (playlist.songs && playlist.songs.length > 0) {
            playSong(playlist.songs[0]);
        } else {
            playPlaylist(playlist);
        }
    });
    
    // Card click
    card.addEventListener('click', () => {
        // Navigate to playlist page (can be implemented later)
        console.log('Navigate to playlist:', playlist.id);
    });
    
    return card;
}

// ============================================
// ARTIST CARD GENERATOR
// ============================================

function createArtistCard(artist) {
    const card = document.createElement('div');
    card.className = 'artist-card';
    card.dataset.artistId = artist.id;
    
    // Use real image if available, otherwise use gradient
    const imageStyle = artist.image 
        ? `background-image: url('${artist.image}'); background-size: cover; background-position: center;`
        : `background: ${artist.gradient || 'var(--gradient-primary)'};`;
    
    card.innerHTML = `
        <div class="artist-card__image" style="${imageStyle}">
            ${!artist.image ? '<i class="fas fa-user"></i>' : ''}
        </div>
        <div class="artist-card__name">${artist.name}</div>
    `;
    
    card.addEventListener('click', () => {
        // Navigate to artist page
        window.location.href = `artist.html?id=${artist.id}`;
    });
    
    return card;
}

// ============================================
// RENDER SONGS
// ============================================

function renderSongs(containerId, songs) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    songs.forEach(song => {
        const card = createSongCard(song);
        container.appendChild(card);
    });
}

// ============================================
// RENDER PLAYLISTS
// ============================================

function renderPlaylists(containerId, playlists) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    playlists.forEach(playlist => {
        const card = createPlaylistCard(playlist);
        container.appendChild(card);
    });
}

// ============================================
// RENDER ARTISTS
// ============================================

function renderArtists(containerId, artists) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    artists.forEach(artist => {
        const card = createArtistCard(artist);
        container.appendChild(card);
    });
}

// ============================================
// ALBUM DATA
// ============================================

// Initialize default albums if none exist
function initializeDefaultAlbums() {
    try {
        const existingAlbums = getAlbums();
        
        // Album name mapping for updates
        const albumNameMap = {
            "Dù cho tận thế": "ERIK - Dù cho tận thế",
            "Kho Báu": "Trọng Hiếu x Rhymastic - Kho Báu",
            "Người Đầu Tiên": "Juky San - Người Đầu Tiên",
            "THIÊU THÂN": "Anh Trai 'Say Hi' 2025 - THIÊU THÂN",
            "Ngáo Ngơ": "Anh Trai 'Say Hi' 2025 - Ngáo Ngơ",
            "Yêu 5": "Rhymastic - Yêu 5"
        };
        
        // Check if albums need to be updated (old format)
        let needsUpdate = false;
        if (existingAlbums.length > 0) {
            existingAlbums.forEach(album => {
                if (albumNameMap[album.name]) {
                    album.name = albumNameMap[album.name];
                    needsUpdate = true;
                }
            });
            
            if (needsUpdate) {
                // Save updated albums
                localStorage.setItem('musicstream_albums', JSON.stringify(existingAlbums));
                return; // Albums updated, no need to create new ones
            }
        }
        
        if (existingAlbums.length > 0) {
            return; // Already have albums with correct names
        }
        
        // Create default albums based on existing songs
        const defaultAlbums = [
            {
                id: 1,
                name: "ERIK - Dù cho tận thế",
                artist: "ERIK",
                image: "../assets/images/DuChoTanThe_avatar.png",
                year: 2025,
                description: "Album single mới nhất của ERIK",
                songs: [
                    { id: 1, name: "Dù cho tận thế (vẫn yêu em)" },
                    { id: 5, name: "Chúng Ta Của Hiện Tại" }
                ]
            },
            {
                id: 2,
                name: "Trọng Hiếu x Rhymastic - Kho Báu",
                artist: "Trọng Hiếu x Rhymastic",
                image: "../assets/images/KhoBau_avatar.png",
                year: 2024,
                description: "Collaboration đặc biệt giữa Trọng Hiếu và Rhymastic",
                songs: [
                    { id: 2, name: "Kho Báu" },
                    { id: 6, name: "Yêu 5" }
                ]
            },
            {
                id: 3,
                name: "Juky San - Người Đầu Tiên",
                artist: "Juky San feat. Buitruonglinh",
                image: "../assets/images/NguoiDauTien_avatar.png",
                year: 2024,
                description: "Single đầy cảm xúc từ Juky San",
                songs: [
                    { id: 3, name: "Người Đầu Tiên" }
                ]
            },
            {
                id: 4,
                name: "Anh Trai 'Say Hi' 2025 - THIÊU THÂN",
                artist: "KHOI VU, B Ray, Thái Ngân, Bùi Duy Ngọc, Ryn Lee",
                image: "../assets/images/ThieuThan_avatar.png",
                year: 2025,
                description: "Bản hit từ Anh Trai 'Say Hi' 2025",
                songs: [
                    { id: 4, name: "THIÊU THÂN" }
                ]
            },
            {
                id: 5,
                name: "Anh Trai 'Say Hi' 2025 - Ngáo Ngơ",
                artist: "Hiếu Thứ Hai, Atus, JSOL, Erik, Cung Orange",
                image: "../assets/images/HieuThuHai_avatar.jpg",
                year: 2025,
                description: "Performance đặc biệt từ Anh Trai 'Say Hi'",
                songs: [
                    { id: 7, name: "Ngáo Ngơ" }
                ]
            },
            {
                id: 6,
                name: "Rhymastic - Yêu 5",
                artist: "Rhymastic",
                image: "../assets/images/Yeu5_avatar.jpg",
                year: 2024,
                description: "Single mới từ Rhymastic",
                songs: [
                    { id: 6, name: "Yêu 5" }
                ]
            }
        ];
        
        // Save to localStorage
        localStorage.setItem('musicstream_albums', JSON.stringify(defaultAlbums));
    } catch (e) {
        console.error('Error initializing default albums:', e);
    }
}

// ============================================
// ALBUM CARD GENERATOR
// ============================================

function createAlbumCard(album) {
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.dataset.albumId = album.id;
    
    // Use album image if available, otherwise use gradient
    const imageStyle = album.image 
        ? `background-image: url('${album.image}'); background-size: cover; background-position: center;`
        : `background: var(--gradient-primary);`;
    
    card.innerHTML = `
        <div class="playlist-card__image" style="${imageStyle}">
            ${!album.image ? '<i class="fas fa-compact-disc"></i>' : ''}
            <button class="playlist-card__play-btn">
                <i class="fas fa-play"></i>
            </button>
        </div>
        <div class="playlist-card__title">${album.name}</div>
        <div class="playlist-card__description">${album.artist || 'Nghệ sĩ'}</div>
    `;
    
    // Play button click - play first song in album
    const playBtn = card.querySelector('.playlist-card__play-btn');
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (album.songs && album.songs.length > 0) {
            // Find the first song from songsData
            const firstSong = window.songsData.find(s => s.id === album.songs[0].id) || album.songs[0];
            if (firstSong) {
                playSong(firstSong);
            }
        }
    });
    
    // Card click - show album sidebar
    card.addEventListener('click', (e) => {
        // Don't trigger if clicking on play button
        if (!e.target.closest('.playlist-card__play-btn')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Opening album sidebar for:', album.name);
            showAlbumSidebar(album);
        }
    });
    
    return card;
}

// ============================================
// RENDER ALBUMS
// ============================================

function getAlbums() {
    try {
        const albums = localStorage.getItem('musicstream_albums');
        return albums ? JSON.parse(albums) : [];
    } catch (e) {
        console.error('Error loading albums:', e);
        return [];
    }
}

function renderAlbums(containerId, albums) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (albums.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-secondary); padding: 2rem; text-align: center;">Chưa có album nào</p>';
        return;
    }
    
    albums.forEach(album => {
        const card = createAlbumCard(album);
        container.appendChild(card);
    });
}

// ============================================
// ALBUM SIDEBAR
// ============================================

function showAlbumSidebar(album) {
    console.log('showAlbumSidebar called with album:', album);
    
    const sidebar = document.getElementById('albumSidebar');
    const overlay = document.getElementById('albumSidebarOverlay');
    const titleEl = document.getElementById('albumSidebarTitle');
    const artistEl = document.getElementById('albumSidebarArtist');
    const imageEl = document.getElementById('albumSidebarImage');
    const yearEl = document.getElementById('albumSidebarYear');
    const descriptionEl = document.getElementById('albumSidebarDescription');
    const songsListEl = document.getElementById('albumSidebarSongsList');
    
    if (!sidebar) {
        console.error('Album sidebar not found in DOM');
        return;
    }
    
    console.log('Sidebar found, showing...');
    
    // Update sidebar content
    if (titleEl) titleEl.textContent = album.name;
    if (artistEl) artistEl.textContent = album.artist || 'Nghệ sĩ';
    if (yearEl) yearEl.textContent = album.year ? `Năm phát hành: ${album.year}` : '';
    if (descriptionEl) descriptionEl.textContent = album.description || '';
    
    // Update image
    if (imageEl) {
        if (album.image) {
            imageEl.style.backgroundImage = `url('${album.image}')`;
            imageEl.style.backgroundSize = 'cover';
            imageEl.style.backgroundPosition = 'center';
            imageEl.innerHTML = '';
        } else {
            imageEl.style.background = 'var(--gradient-primary)';
            imageEl.innerHTML = '<i class="fas fa-compact-disc"></i>';
        }
    }
    
    // Render songs list
    if (songsListEl && album.songs) {
        songsListEl.innerHTML = '';
        
        if (album.songs.length === 0) {
            songsListEl.innerHTML = '<p style="color: var(--color-text-secondary); padding: 1rem; text-align: center;">Chưa có bài hát nào</p>';
        } else {
            album.songs.forEach((songRef, index) => {
                // Find full song data from songsData
                const song = window.songsData.find(s => s.id === songRef.id);
                if (!song) return;
                
                const songItem = document.createElement('div');
                songItem.className = 'album-sidebar__song-item';
                songItem.dataset.songId = song.id;
                
                const isPlaying = window.playerState && 
                                  window.playerState.currentTrack && 
                                  window.playerState.currentTrack.id === song.id &&
                                  window.playerState.isPlaying;
                
                if (isPlaying) {
                    songItem.classList.add('album-sidebar__song-item--playing');
                }
                
                const duration = formatTime(song.duration || 0);
                const imageUrl = song.image || '../assets/images/DuChoTanThe_avatar.png';
                
                songItem.innerHTML = `
                    <div class="album-sidebar__song-number">${index + 1}</div>
                    <div class="album-sidebar__song-image" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;"></div>
                    <div class="album-sidebar__song-info">
                        <div class="album-sidebar__song-title">${song.title || song.name}</div>
                        <div class="album-sidebar__song-artist">${song.artist}</div>
                    </div>
                    <div class="album-sidebar__song-duration">${duration}</div>
                    <button class="album-sidebar__song-play-btn">
                        <i class="fas fa-play"></i>
                    </button>
                `;
                
                // Play button click
                const playBtn = songItem.querySelector('.album-sidebar__song-play-btn');
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    playSong(song);
                    updateAlbumSidebarPlayingState();
                });
                
                // Song item click
                songItem.addEventListener('click', (e) => {
                    if (!e.target.closest('.album-sidebar__song-play-btn')) {
                        playSong(song);
                        updateAlbumSidebarPlayingState();
                    }
                });
                
                songsListEl.appendChild(songItem);
            });
        }
    }
    
    // Show sidebar - force display
    sidebar.classList.add('album-sidebar--active');
    sidebar.classList.remove('album-sidebar--minimized'); // Ensure not minimized
    sidebar.style.display = 'flex'; // Force display
    if (overlay) {
        overlay.classList.add('album-sidebar__overlay--active');
    }
    
    console.log('Sidebar should be visible now');
    
    // Setup event listeners if not already set
    setupAlbumSidebarListeners();
}

function hideAlbumSidebar() {
    const sidebar = document.getElementById('albumSidebar');
    const overlay = document.getElementById('albumSidebarOverlay');
    
    if (sidebar) sidebar.classList.remove('album-sidebar--active');
    if (overlay) overlay.classList.remove('album-sidebar__overlay--active');
}

function toggleAlbumSidebarMinimize() {
    const sidebar = document.getElementById('albumSidebar');
    if (sidebar) {
        sidebar.classList.toggle('album-sidebar--minimized');
    }
}

function updateAlbumSidebarPlayingState() {
    const songItems = document.querySelectorAll('.album-sidebar__song-item');
    songItems.forEach(item => {
        item.classList.remove('album-sidebar__song-item--playing');
    });
    
    if (window.playerState && window.playerState.currentTrack) {
        const currentItem = document.querySelector(`.album-sidebar__song-item[data-song-id="${window.playerState.currentTrack.id}"]`);
        if (currentItem && window.playerState.isPlaying) {
            currentItem.classList.add('album-sidebar__song-item--playing');
        }
    }
}

function setupAlbumSidebarListeners() {
    // Only setup once
    if (window.albumSidebarListenersSetup) return;
    window.albumSidebarListenersSetup = true;
    
    const closeBtn = document.getElementById('albumSidebarClose');
    const minimizeBtn = document.getElementById('albumSidebarMinimize');
    const overlay = document.getElementById('albumSidebarOverlay');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideAlbumSidebar);
    }
    
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', toggleAlbumSidebarMinimize);
    }
    
    if (overlay) {
        overlay.addEventListener('click', hideAlbumSidebar);
    }
    
    // Update playing state periodically
    setInterval(() => {
        updateAlbumSidebarPlayingState();
    }, 1000);
}

// ============================================
// PLAYER STATE
// ============================================

const playerState = {
    isPlaying: false,
    currentTrack: null,
    lastPlayedTrack: null, // Track vừa phát trước đó (để tránh lặp lại)
    currentTime: 0,
    duration: 0,
    volume: 50,
    isShuffled: false,
    isRepeated: false
};

// Export playerState for use in other files
window.playerState = playerState;

// Export player state functions for use in other files
window.savePlayerState = savePlayerState;
window.restorePlayerState = restorePlayerState;
window.initPlayerControls = initPlayerControls;

// Preload audio immediately when page loads if there's a saved state
(function preloadAudioIfNeeded() {
    try {
        const savedState = localStorage.getItem('musicstream_player_state');
        if (savedState) {
            const state = JSON.parse(savedState);
            if (state.currentTrack && state.currentTrack.audio && state.isPlaying) {
                // Dừng tất cả audio trước khi preload
                if (window.AudioManager) {
                    window.AudioManager.stopAllAudio();
                }
                
                // Preload audio immediately, don't wait for anything
                const preloadAudio = new Audio(state.currentTrack.audio);
                preloadAudio.preload = 'auto';
                
                // Đăng ký với AudioManager
                if (window.AudioManager) {
                    window.AudioManager.registerAudio(preloadAudio);
                }
                
                // Store reference for later use
                window._preloadedAudio = preloadAudio;
                window._preloadedAudioSrc = state.currentTrack.audio;
                window._preloadedRestoreTime = state.currentTime || 0;
            }
        }
    } catch (e) {
        console.error('Error preloading audio:', e);
    }
})();

// ============================================
// PLAYER STATE PERSISTENCE
// ============================================

// Save player state to localStorage
function savePlayerState() {
    try {
        const stateToSave = {
            isPlaying: playerState.isPlaying,
            currentTrack: playerState.currentTrack,
            lastPlayedTrack: playerState.lastPlayedTrack,
            currentTime: playerState.currentTime,
            duration: playerState.duration,
            volume: playerState.volume,
            isShuffled: playerState.isShuffled,
            isRepeated: playerState.isRepeated
        };
        localStorage.setItem('musicstream_player_state', JSON.stringify(stateToSave));
    } catch (e) {
        console.error('Error saving player state:', e);
    }
}

// Restore player state from localStorage
function restorePlayerState() {
    try {
        const savedState = localStorage.getItem('musicstream_player_state');
        if (!savedState) return false;
        
        const state = JSON.parse(savedState);
        
        // Restore basic state
        if (state.volume !== undefined) {
            playerState.volume = state.volume;
        }
        if (state.isShuffled !== undefined) {
            playerState.isShuffled = state.isShuffled;
        }
        if (state.isRepeated !== undefined) {
            playerState.isRepeated = state.isRepeated;
        }
        
        // Restore current track if exists
        if (state.currentTrack && state.currentTrack.audio) {
            playerState.currentTrack = state.currentTrack;
            playerState.lastPlayedTrack = state.lastPlayedTrack || null;
            playerState.duration = state.duration || state.currentTrack.duration || 0;
            playerState.currentTime = state.currentTime || 0;
            playerState.isPlaying = state.isPlaying || false;
            
            // Restore UI
            playerElements = getPlayerElements();
            updateTrackInfo();
            updateLikeButton();
            
            // Restore volume slider
            if (playerElements.volumeSlider) {
                playerElements.volumeSlider.value = playerState.volume;
            }
            updateVolumeIcon();
            
            // Restore shuffle/repeat buttons
            if (playerElements.shuffleBtn) {
                playerElements.shuffleBtn.classList.toggle('active', playerState.isShuffled);
            }
            if (playerElements.repeatBtn) {
                playerElements.repeatBtn.classList.toggle('active', playerState.isRepeated);
            }
            
            // Restore play button state
            if (playerElements.playBtn) {
                const icon = playerElements.playBtn.querySelector('i');
                if (playerState.isPlaying) {
                    icon.classList.remove('fa-play');
                    icon.classList.add('fa-pause');
                } else {
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                }
            }
            
            // Restore audio playback - use preloaded audio if available
            if (state.currentTrack.audio) {
                const restoreTime = state.currentTime > 0 ? state.currentTime : null;
                
                // Use requestAnimationFrame for immediate execution without delay
                requestAnimationFrame(() => {
                    // Check if we have preloaded audio
                    if (window._preloadedAudio && 
                        window._preloadedAudioSrc === state.currentTrack.audio) {
                        // QUAN TRỌNG: Lưu reference đến preloaded audio trước khi stopAllAudio
                        const preloadedAudio = window._preloadedAudio;
                        
                        // Dừng tất cả audio đang phát trước (nhưng không xóa preloaded audio)
                        AudioManager.stopAllAudio();
                        
                        // Kiểm tra lại để đảm bảo
                        AudioManager.enforceSingleAudio();
                        
                        // Use preloaded audio - much faster!
                        audioElement = preloadedAudio;
                        if (audioElement) {
                            // Đăng ký với AudioManager
                            AudioManager.registerAudio(audioElement);
                            audioElement.volume = playerState.volume / 100;
                            
                            // Set currentTime immediately if ready (readyState >= 3 means HAVE_FUTURE_DATA)
                            if (restoreTime !== null && restoreTime > 0) {
                                if (audioElement.readyState >= 3) {
                                    audioElement.currentTime = restoreTime;
                                    playerState.currentTime = restoreTime;
                                    updateProgress();
                                }
                            }
                            
                            // Setup event listeners (will handle play if needed)
                            setupAudioEventListeners(audioElement, restoreTime);
                            
                            // Cleanup preload reference after using it
                            window._preloadedAudio = null;
                            window._preloadedAudioSrc = null;
                            window._preloadedRestoreTime = null;
                        }
                    } else {
                        // Fallback: load normally (if preload didn't work or not ready yet)
                        playAudio(state.currentTrack.audio, restoreTime);
                    }
                });
            }
            
            return true;
        }
        
        return false;
    } catch (e) {
        console.error('Error restoring player state:', e);
        return false;
    }
}

// ============================================
// PLAYER CONTROLS
// ============================================

// Get player elements - wait for components to load
function getPlayerElements() {
    return {
        playBtn: document.getElementById('playBtn'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        shuffleBtn: document.getElementById('shuffleBtn'),
        repeatBtn: document.getElementById('repeatBtn'),
        volumeBtn: document.getElementById('volumeBtn'),
        volumeSlider: document.getElementById('volumeSlider'),
        progressFill: document.getElementById('progressFill'),
        progressBar: document.querySelector('.player-bar__progress-bar'),
        currentTimeEl: document.getElementById('currentTime'),
        totalTimeEl: document.getElementById('totalTime'),
        likeBtn: document.querySelector('.player-bar__like-btn'),
        trackNameEl: document.querySelector('.player-bar__track-name'),
        trackArtistEl: document.querySelector('.player-bar__track-artist'),
        albumArtEl: document.querySelector('.player-bar__album-art')
    };
}

let playerElements = {};
let playerControlsInitialized = false;

// Initialize player controls
function initPlayerControls() {
    // Prevent multiple initializations
    if (playerControlsInitialized) {
        // Just update player elements if already initialized
        playerElements = getPlayerElements();
        return;
    }
    
    playerElements = getPlayerElements();
    playerControlsInitialized = true;
    
    // Play/Pause
    if (playerElements.playBtn) {
        playerElements.playBtn.addEventListener('click', togglePlay);
    }
    
    // Previous/Next
    if (playerElements.prevBtn) {
        playerElements.prevBtn.addEventListener('click', playPrevious);
    }
    
    if (playerElements.nextBtn) {
        playerElements.nextBtn.addEventListener('click', playNext);
    }
    
    // Shuffle
    if (playerElements.shuffleBtn) {
        playerElements.shuffleBtn.addEventListener('click', toggleShuffle);
    }
    
    // Repeat
    if (playerElements.repeatBtn) {
        playerElements.repeatBtn.addEventListener('click', toggleRepeat);
    }
    
    // Volume
    if (playerElements.volumeSlider) {
        playerElements.volumeSlider.addEventListener('input', handleVolumeChange);
    }
    
    if (playerElements.volumeBtn) {
        playerElements.volumeBtn.addEventListener('click', toggleMute);
    }
    
    // Progress bar
    if (playerElements.progressBar) {
        playerElements.progressBar.addEventListener('click', handleProgressClick);
    }
    
    // Like button
    if (playerElements.likeBtn) {
        playerElements.likeBtn.addEventListener('click', toggleLike);
    }
}

function togglePlay() {
    if (!playerElements.playBtn) return;
    
    playerState.isPlaying = !playerState.isPlaying;
    const icon = playerElements.playBtn.querySelector('i');
    
    if (playerState.isPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        
        // Control audio if available
        if (audioElement) {
            audioElement.play().catch(err => {
                console.log('Audio play error:', err);
                playerState.isPlaying = false;
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            });
        } else {
            simulatePlayback();
        }
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        
        // Pause audio if available
        if (audioElement) {
            audioElement.pause();
        }
        
        // Stop simulation
        if (playbackInterval) {
            clearInterval(playbackInterval);
            playbackInterval = null;
        }
    }
}

function playPrevious() {
    if (!window.songsData || window.songsData.length === 0) return;
    
    const currentIndex = window.songsData.findIndex(song => 
        song.id === playerState.currentTrack?.id
    );
    
    let prevIndex;
    if (playerState.isShuffled) {
        prevIndex = Math.floor(Math.random() * window.songsData.length);
    } else {
        prevIndex = currentIndex > 0 ? currentIndex - 1 : window.songsData.length - 1;
    }
    
    if (window.songsData[prevIndex]) {
        playSong(window.songsData[prevIndex]);
    }
}

function playNext() {
    if (!window.songsData || window.songsData.length === 0) return;
    
    // Next luôn random, không phụ thuộc vào isShuffled
    // Loại trừ bài hiện tại và bài vừa phát
    const availableSongs = window.songsData.filter(song => {
        // Loại trừ bài đang phát
        if (playerState.currentTrack && song.id === playerState.currentTrack.id) {
            return false;
        }
        // Loại trừ bài vừa phát
        if (playerState.lastPlayedTrack && song.id === playerState.lastPlayedTrack.id) {
            return false;
        }
        return true;
    });
    
    // Nếu không còn bài nào (chỉ có 1-2 bài), thì chọn random từ tất cả (trừ bài hiện tại)
    let songsToChooseFrom;
    if (availableSongs.length > 0) {
        songsToChooseFrom = availableSongs;
    } else {
        // Fallback: chỉ loại trừ bài hiện tại
        songsToChooseFrom = window.songsData.filter(song => 
            !playerState.currentTrack || song.id !== playerState.currentTrack.id
        );
        // Nếu vẫn không có (chỉ có 1 bài), thì dùng tất cả
        if (songsToChooseFrom.length === 0) {
            songsToChooseFrom = window.songsData;
        }
    }
    
    // Random một bài
    const randomIndex = Math.floor(Math.random() * songsToChooseFrom.length);
    const nextSong = songsToChooseFrom[randomIndex];
    
    if (nextSong) {
        // playSong sẽ tự động lưu currentTrack thành lastPlayedTrack
        playSong(nextSong);
    }
}

function toggleShuffle() {
    if (!playerElements.shuffleBtn) return;
    
    playerState.isShuffled = !playerState.isShuffled;
    playerElements.shuffleBtn.classList.toggle('active', playerState.isShuffled);
    
    // Save state
    savePlayerState();
}

function toggleRepeat() {
    if (!playerElements.repeatBtn) return;
    
    playerState.isRepeated = !playerState.isRepeated;
    playerElements.repeatBtn.classList.toggle('active', playerState.isRepeated);
    
    // Save state
    savePlayerState();
}

function handleVolumeChange(e) {
    playerState.volume = parseInt(e.target.value);
    updateVolumeIcon();
    
    // Update audio volume
    if (audioElement) {
        audioElement.volume = playerState.volume / 100;
    }
    
    // Save to localStorage
    try {
        localStorage.setItem('musicstream_volume', playerState.volume.toString());
    } catch (e) {
        console.error('Error saving volume:', e);
    }
    
    // Save full player state
    savePlayerState();
}

function toggleMute() {
    if (!playerElements.volumeSlider || !playerElements.volumeBtn) return;
    
    if (playerState.volume > 0) {
        playerState.previousVolume = playerState.volume;
        playerElements.volumeSlider.value = 0;
        playerState.volume = 0;
    } else {
        const restoreVolume = playerState.previousVolume || 50;
        playerElements.volumeSlider.value = restoreVolume;
        playerState.volume = restoreVolume;
    }
    
    updateVolumeIcon();
    
    // Update audio volume
    if (audioElement) {
        audioElement.volume = playerState.volume / 100;
    }
    
    // Save state
    savePlayerState();
    
    // Update audio volume
    if (audioElement) {
        audioElement.volume = playerState.volume / 100;
    }
}

function handleProgressClick(e) {
    if (!playerElements.progressBar || !audioElement) return;
    
    const rect = playerElements.progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = playerState.duration * percent;
    
    playerState.currentTime = newTime;
    audioElement.currentTime = newTime;
    updateProgress();
    
    // Save state
    savePlayerState();
}

function toggleLike() {
    playerElements = getPlayerElements();
    if (!playerElements.likeBtn || !playerState.currentTrack) {
        console.log('Cannot toggle like: no button or no current track');
        return;
    }
    
    const isActive = playerElements.likeBtn.classList.contains('active');
    const icon = playerElements.likeBtn.querySelector('i');
    
    if (isActive) {
        // Remove from favorites
        playerElements.likeBtn.classList.remove('active');
        if (icon) {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
        
        // Remove from favorites
        if (window.FavoritesStorage) {
            window.FavoritesStorage.removeFavorite(playerState.currentTrack.id);
        } else {
            // Fallback: use localStorage directly
            try {
                const favorites = JSON.parse(localStorage.getItem('musicstream_favorites') || '[]');
                const filtered = favorites.filter(f => f.id !== playerState.currentTrack.id);
                localStorage.setItem('musicstream_favorites', JSON.stringify(filtered));
            } catch (e) {
                console.error('Error removing favorite:', e);
            }
        }
        
        // Dispatch event for favorites page
        window.dispatchEvent(new CustomEvent('favoriteChanged'));
        console.log('Removed from favorites:', playerState.currentTrack.name);
    } else {
        // Add to favorites
        playerElements.likeBtn.classList.add('active');
        if (icon) {
            icon.classList.remove('far');
            icon.classList.add('fas');
        }
        
        // Add to favorites
        const favoriteSong = {
            id: playerState.currentTrack.id,
            title: playerState.currentTrack.name,
            artist: playerState.currentTrack.artist,
            image: playerState.currentTrack.image,
            audio: playerState.currentTrack.audio,
            duration: playerState.currentTrack.duration
        };
        
        if (window.FavoritesStorage) {
            window.FavoritesStorage.addFavorite(favoriteSong);
        } else {
            // Fallback: use localStorage directly
            try {
                const favorites = JSON.parse(localStorage.getItem('musicstream_favorites') || '[]');
                if (!favorites.some(f => f.id === favoriteSong.id)) {
                    favoriteSong.addedAt = Date.now();
                    favorites.push(favoriteSong);
                    localStorage.setItem('musicstream_favorites', JSON.stringify(favorites));
                }
            } catch (e) {
                console.error('Error adding favorite:', e);
            }
        }
        
        // Dispatch event for favorites page
        window.dispatchEvent(new CustomEvent('favoriteChanged'));
        console.log('Added to favorites:', playerState.currentTrack.name);
    }
}

// Update like button state based on favorites
function updateLikeButton() {
    playerElements = getPlayerElements();
    if (!playerElements.likeBtn || !playerState.currentTrack) return;
    
    // Wait for FavoritesStorage to be available
    if (window.FavoritesStorage) {
        const isFavorite = window.FavoritesStorage.isFavorite(playerState.currentTrack.id);
        const icon = playerElements.likeBtn.querySelector('i');
        
        if (isFavorite) {
            playerElements.likeBtn.classList.add('active');
            if (icon) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        } else {
            playerElements.likeBtn.classList.remove('active');
            if (icon) {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        }
    } else {
        // If FavoritesStorage not loaded yet, check localStorage directly
        try {
            const favorites = JSON.parse(localStorage.getItem('musicstream_favorites') || '[]');
            const isFavorite = favorites.some(f => f.id === playerState.currentTrack.id);
            const icon = playerElements.likeBtn.querySelector('i');
            
            if (isFavorite) {
                playerElements.likeBtn.classList.add('active');
                if (icon) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
            } else {
                playerElements.likeBtn.classList.remove('active');
                if (icon) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
            }
        } catch (e) {
            console.error('Error checking favorites:', e);
        }
    }
}

// Update volume icon function
function updateVolumeIcon() {
    if (!playerElements.volumeBtn) return;
    const icon = playerElements.volumeBtn.querySelector('i');
    
    if (playerState.volume === 0) {
        icon.classList.remove('fa-volume-up', 'fa-volume-down');
        icon.classList.add('fa-volume-mute');
    } else if (playerState.volume < 50) {
        icon.classList.remove('fa-volume-up', 'fa-volume-mute');
        icon.classList.add('fa-volume-down');
    } else {
        icon.classList.remove('fa-volume-down', 'fa-volume-mute');
        icon.classList.add('fa-volume-up');
    }
}

// Progress bar click is now handled in initPlayerControls

function updateProgress() {
    playerElements = getPlayerElements();
    
    if (!playerElements.progressFill || !playerElements.currentTimeEl) return;
    
    const percent = playerState.duration > 0 
        ? (playerState.currentTime / playerState.duration) * 100 
        : 0;
    
    playerElements.progressFill.style.width = percent + '%';
    playerElements.currentTimeEl.textContent = formatTime(playerState.currentTime);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// SIMULATE PLAYBACK
// ============================================

let playbackInterval = null;

function simulatePlayback() {
    if (!playerState.currentTrack) {
        // Set a default track for demo
        playerState.currentTrack = {
            name: 'Bài hát mẫu',
            artist: 'Nghệ sĩ mẫu',
            duration: 180 // 3 minutes
        };
        playerState.duration = playerState.currentTrack.duration;
        updateTrackInfo();
    }
    
    if (playbackInterval) {
        clearInterval(playbackInterval);
    }
    
    playbackInterval = setInterval(() => {
        if (playerState.isPlaying) {
            playerState.currentTime += 1;
            if (playerState.currentTime >= playerState.duration) {
                playerState.currentTime = 0;
                if (!playerState.isRepeated) {
                    togglePlay();
                }
            }
            updateProgress();
        }
    }, 1000);
}

function updateTrackInfo() {
    playerElements = getPlayerElements();
    
    if (playerElements.trackNameEl && playerState.currentTrack) {
        playerElements.trackNameEl.textContent = playerState.currentTrack.name;
    }
    
    if (playerElements.trackArtistEl && playerState.currentTrack) {
        playerElements.trackArtistEl.textContent = playerState.currentTrack.artist;
    }
    
    if (playerElements.totalTimeEl) {
        playerElements.totalTimeEl.textContent = formatTime(playerState.duration);
    }
    
    // Update album art
    if (playerElements.albumArtEl && playerState.currentTrack && playerState.currentTrack.image) {
        playerElements.albumArtEl.style.backgroundImage = `url('${playerState.currentTrack.image}')`;
        playerElements.albumArtEl.style.backgroundSize = 'cover';
        playerElements.albumArtEl.style.backgroundPosition = 'center';
        playerElements.albumArtEl.innerHTML = '';
    } else if (playerElements.albumArtEl) {
        playerElements.albumArtEl.style.background = 'var(--gradient-primary)';
        playerElements.albumArtEl.innerHTML = '<i class="fas fa-music"></i>';
    }
}

// ============================================
// GLOBAL AUDIO MANAGER
// Đảm bảo chỉ có một audio element được phát tại một thời điểm
// ============================================

// Global audio element - duy nhất trong toàn hệ thống
let audioElement = null;

// Global Audio Manager - Kiểm soát chặt chẽ chỉ 1 audio được phát
const AudioManager = {
    // Track tất cả audio elements đang được quản lý
    _managedAudioElements: new Set(),
    
    /**
     * Dừng tất cả audio đang phát - CHẶT CHẼ
     */
    stopAllAudio() {
        console.log('[AudioManager] Stopping all audio...');
        
        // Stop current audio element
        if (audioElement) {
            try {
                audioElement.pause();
                audioElement.currentTime = 0;
                // Cleanup event listeners
                if (audioElement._restoreHandler) {
                    audioElement.removeEventListener('loadedmetadata', audioElement._restoreHandler);
                }
                if (audioElement._timeupdateHandler) {
                    audioElement.removeEventListener('timeupdate', audioElement._timeupdateHandler);
                }
                if (audioElement._endedHandler) {
                    audioElement.removeEventListener('ended', audioElement._endedHandler);
                }
                // Remove from DOM if needed
                if (audioElement.parentNode) {
                    audioElement.parentNode.removeChild(audioElement);
                }
                // Remove from managed set
                this._managedAudioElements.delete(audioElement);
                // Only set to null if it's not the preloaded audio
                if (audioElement !== window._preloadedAudio) {
                    audioElement = null;
                }
            } catch (e) {
                console.error('[AudioManager] Error stopping audio:', e);
                if (audioElement !== window._preloadedAudio) {
                    audioElement = null;
                }
            }
        }
        
        // Pause preloaded audio if it's playing (but don't delete it yet)
        if (window._preloadedAudio) {
            try {
                if (!window._preloadedAudio.paused) {
                    window._preloadedAudio.pause();
                    window._preloadedAudio.currentTime = 0;
                }
            } catch (e) {
                console.error('[AudioManager] Error pausing preloaded audio:', e);
            }
        }
        
        // Stop ALL audio elements in DOM - CHẶT CHẼ HƠN
        const allAudioElements = document.querySelectorAll('audio');
        let stoppedCount = 0;
        allAudioElements.forEach(audio => {
            try {
                if (!audio.paused) {
                    audio.pause();
                    audio.currentTime = 0;
                    stoppedCount++;
                }
                // Remove from managed set
                this._managedAudioElements.delete(audio);
            } catch (e) {
                // Ignore errors but log them
                console.warn('[AudioManager] Error stopping audio element:', e);
            }
        });
        
        // Stop all managed audio elements
        this._managedAudioElements.forEach(audio => {
            try {
                if (audio && !audio.paused) {
                    audio.pause();
                    audio.currentTime = 0;
                    stoppedCount++;
                }
            } catch (e) {
                console.warn('[AudioManager] Error stopping managed audio:', e);
            }
        });
        this._managedAudioElements.clear();
        
        if (stoppedCount > 0) {
            console.log(`[AudioManager] Stopped ${stoppedCount} audio element(s)`);
        }
    },
    
    /**
     * Đăng ký audio element để quản lý
     */
    registerAudio(audioEl) {
        if (audioEl) {
            this._managedAudioElements.add(audioEl);
            console.log('[AudioManager] Registered audio element');
            
            // Thêm event listener để tự động dừng audio khác khi audio này bắt đầu phát
            const playHandler = () => {
                // Dừng tất cả audio khác (trừ chính nó)
                this._managedAudioElements.forEach(audio => {
                    if (audio !== audioEl && !audio.paused) {
                        try {
                            audio.pause();
                            audio.currentTime = 0;
                        } catch (e) {
                            console.warn('[AudioManager] Error stopping other audio:', e);
                        }
                    }
                });
                
                // Dừng tất cả audio trong DOM (trừ chính nó)
                const allAudio = document.querySelectorAll('audio');
                allAudio.forEach(audio => {
                    if (audio !== audioEl && !audio.paused) {
                        try {
                            audio.pause();
                            audio.currentTime = 0;
                        } catch (e) {
                            // Ignore
                        }
                    }
                });
            };
            
            // Remove old listener if exists
            if (audioEl._playHandler) {
                audioEl.removeEventListener('play', audioEl._playHandler);
            }
            audioEl._playHandler = playHandler;
            audioEl.addEventListener('play', playHandler);
        }
    },
    
    /**
     * Lấy audio element hiện tại (hoặc tạo mới nếu chưa có)
     */
    getAudioElement() {
        return audioElement;
    },
    
    /**
     * Set audio element mới (sau khi đã dừng audio cũ) - CHẶT CHẼ
     */
    setAudioElement(newAudioElement) {
        // Dừng tất cả audio trước
        this.stopAllAudio();
        
        // Set audio mới
        audioElement = newAudioElement;
        
        // Đăng ký để quản lý
        if (audioElement) {
            this.registerAudio(audioElement);
        }
        
        return audioElement;
    },
    
    /**
     * Kiểm tra và dừng audio không được quản lý - CHẶT CHẼ
     */
    enforceSingleAudio() {
        // Tìm tất cả audio elements
        const allAudio = document.querySelectorAll('audio');
        let playingCount = 0;
        let playingAudio = null;
        
        allAudio.forEach(audio => {
            if (!audio.paused && audio.readyState > 0) {
                playingCount++;
                if (!playingAudio) {
                    playingAudio = audio;
                }
            }
        });
        
        // Nếu có nhiều hơn 1 audio đang phát, dừng tất cả trừ audioElement hiện tại
        if (playingCount > 1) {
            console.warn(`[AudioManager] Multiple audio playing (${playingCount}), enforcing single audio...`);
            allAudio.forEach(audio => {
                if (audio !== audioElement && !audio.paused) {
                    try {
                        audio.pause();
                        audio.currentTime = 0;
                    } catch (e) {
                        console.warn('[AudioManager] Error enforcing single audio:', e);
                    }
                }
            });
        }
    }
};

// Export AudioManager to window for global access
window.AudioManager = AudioManager;

// Thêm periodic check để đảm bảo chỉ 1 audio phát - CHẶT CHẼ
setInterval(() => {
    if (window.AudioManager) {
        window.AudioManager.enforceSingleAudio();
    }
}, 1000); // Kiểm tra mỗi giây

// Thêm event listener để theo dõi khi có audio mới được tạo - CHẶT CHẼ
if (typeof MutationObserver !== 'undefined') {
    const audioObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName === 'AUDIO' || (node.querySelector && node.querySelector('audio'))) {
                    const audioElements = node.nodeName === 'AUDIO' 
                        ? [node] 
                        : node.querySelectorAll('audio');
                    
                    audioElements.forEach(audio => {
                        if (audio !== audioElement && !window.AudioManager._managedAudioElements.has(audio)) {
                            console.warn('[AudioManager] Detected unmanaged audio element, stopping it...');
                            try {
                                audio.pause();
                                audio.currentTime = 0;
                            } catch (e) {
                                console.warn('[AudioManager] Error stopping unmanaged audio:', e);
                            }
                        }
                    });
                }
            });
        });
    });
    
    // Bắt đầu quan sát
    audioObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// ============================================
// PLAY SONG
// ============================================

function playSong(song) {
    // QUAN TRỌNG: Dừng tất cả audio đang phát trước khi phát bài mới
    AudioManager.stopAllAudio();
    
    // Kiểm tra lại để đảm bảo
    AudioManager.enforceSingleAudio();
    
    // Lưu bài hiện tại thành lastPlayedTrack trước khi chuyển (nếu có và khác bài mới)
    if (playerState.currentTrack && playerState.currentTrack.id !== song.id) {
        playerState.lastPlayedTrack = { ...playerState.currentTrack };
    }
    
    playerState.currentTrack = {
        id: song.id,
        name: song.title,
        artist: song.artist,
        duration: song.duration,
        audio: song.audio,
        image: song.image
    };
    playerState.duration = song.duration;
    playerState.currentTime = 0;
    playerState.isPlaying = true;
    
    playerElements = getPlayerElements();
    updateTrackInfo();
    updateLikeButton(); // Update like button based on favorites
    
    // Save to recently played history
    saveToRecentlyPlayed(song);
    
    // Play audio if available
    if (song.audio) {
        playAudio(song.audio);
    } else {
        simulatePlayback();
    }
    
    if (playerElements.playBtn) {
        const icon = playerElements.playBtn.querySelector('i');
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    }
    
    // Save state
    savePlayerState();
}

// ============================================
// RECENTLY PLAYED HISTORY
// ============================================

function saveToRecentlyPlayed(song) {
    try {
        let recentlyPlayed = JSON.parse(localStorage.getItem('musicstream_recently_played') || '[]');
        
        // Remove if already exists (to avoid duplicates)
        recentlyPlayed = recentlyPlayed.filter(item => item.id !== song.id);
        
        // Add to beginning with timestamp
        recentlyPlayed.unshift({
            ...song,
            playedAt: new Date().toISOString()
        });
        
        // Keep only last 100 songs
        if (recentlyPlayed.length > 100) {
            recentlyPlayed = recentlyPlayed.slice(0, 100);
        }
        
        localStorage.setItem('musicstream_recently_played', JSON.stringify(recentlyPlayed));
    } catch (e) {
        console.error('Error saving recently played:', e);
    }
}

function getRecentlyPlayed() {
    try {
        return JSON.parse(localStorage.getItem('musicstream_recently_played') || '[]');
    } catch (e) {
        console.error('Error loading recently played:', e);
        return [];
    }
}

// Make playSong available globally for artist.js
window.playSong = playSong;

// Export createSongCard for use in other files
window.createSongCard = createSongCard;

// updatePlayerImage is now handled in updateTrackInfo

// Setup audio event listeners (reusable function)
function setupAudioEventListeners(audioEl, restoreTime = null) {
    // Remove old listeners if any
    if (audioEl._restoreHandler) {
        audioEl.removeEventListener('loadedmetadata', audioEl._restoreHandler);
    }
    
    // Handler for loadedmetadata event
    const metadataHandler = () => {
        playerState.duration = audioEl.duration;
        updateProgress();
        playerElements = getPlayerElements();
        if (playerElements.totalTimeEl) {
            playerElements.totalTimeEl.textContent = formatTime(playerState.duration);
        }
        
        // Restore currentTime if provided (for page navigation)
        if (restoreTime !== null && restoreTime > 0) {
            // Use canplay event for more reliable currentTime setting
            const canplayHandler = () => {
                audioEl.currentTime = restoreTime;
                playerState.currentTime = restoreTime;
                updateProgress();
                
                // Play if was playing before
                if (playerState.isPlaying) {
                    audioEl.play().catch(err => {
                        console.log('Audio play error:', err);
                        playerState.isPlaying = false;
                    });
                }
                
                audioEl.removeEventListener('canplay', canplayHandler);
            };
            
            // If already can play, set immediately
            if (audioEl.readyState >= 3) {
                canplayHandler();
            } else {
                audioEl.addEventListener('canplay', canplayHandler, { once: true });
            }
        } else if (playerState.isPlaying) {
            // No restore time, just play if was playing
            audioEl.play().catch(err => {
                console.log('Audio play error:', err);
                playerState.isPlaying = false;
            });
        }
    };
    
    // Store handler reference for cleanup
    audioEl._restoreHandler = metadataHandler;
    
    // Only add listener if metadata not already loaded
    if (audioEl.readyState < 1) {
        audioEl.addEventListener('loadedmetadata', metadataHandler);
    } else {
        // Metadata already loaded, call handler immediately
        metadataHandler();
    }
    
    // Timeupdate listener (if not already added)
    if (!audioEl._timeupdateHandler) {
        audioEl._timeupdateHandler = () => {
            playerState.currentTime = audioEl.currentTime;
            updateProgress();
            // Save state periodically (throttled)
            if (!audioEl._lastSaveTime || Date.now() - audioEl._lastSaveTime > 1000) {
                savePlayerState();
                audioEl._lastSaveTime = Date.now();
            }
        };
        audioEl.addEventListener('timeupdate', audioEl._timeupdateHandler);
    }
    
    // Ended listener (if not already added)
    if (!audioEl._endedHandler) {
        audioEl._endedHandler = () => {
            playerState.isPlaying = false;
            playerElements = getPlayerElements();
            if (playerElements.playBtn) {
                const icon = playerElements.playBtn.querySelector('i');
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
            
            // Save state
            savePlayerState();
            
            // Auto play next if not repeated
            if (!playerState.isRepeated && window.songsData) {
                const currentIndex = window.songsData.findIndex(song => 
                    song.id === playerState.currentTrack?.id
                );
                if (currentIndex < window.songsData.length - 1) {
                    playSong(window.songsData[currentIndex + 1]);
                } else if (currentIndex === window.songsData.length - 1 && window.songsData.length > 0) {
                    playSong(window.songsData[0]); // Loop back to first
                }
            } else if (playerState.isRepeated && playerState.currentTrack) {
                // Repeat current song
                playSong(playerState.currentTrack);
            }
        };
        audioEl.addEventListener('ended', audioEl._endedHandler);
    }
}

function playAudio(audioSrc, restoreTime = null) {
    // QUAN TRỌNG: Dừng tất cả audio đang phát trước khi tạo audio mới
    AudioManager.stopAllAudio();
    
    // Kiểm tra lại để đảm bảo không có audio nào đang phát
    AudioManager.enforceSingleAudio();
    
    // Create new audio element
    audioElement = new Audio(audioSrc);
    
    // Đăng ký với AudioManager ngay lập tức
    AudioManager.registerAudio(audioElement);
    
    audioElement.volume = playerState.volume / 100;
    
    // Preload audio to reduce delay
    audioElement.preload = 'auto';
    
    // Setup event listeners (includes timeupdate and ended)
    setupAudioEventListeners(audioElement, restoreTime);
    
    // Thêm listener để đảm bảo chỉ audio này phát
    const ensureSinglePlay = () => {
        AudioManager.enforceSingleAudio();
    };
    audioElement.addEventListener('play', ensureSinglePlay);
    
    // Play immediately if not restoring (normal playback)
    if (restoreTime === null && playerState.isPlaying) {
        audioElement.play().then(() => {
            // Sau khi play thành công, kiểm tra lại
            AudioManager.enforceSingleAudio();
        }).catch(err => {
            console.log('Audio play error:', err);
            // Fallback to simulated playback
            simulatePlayback();
        });
    }
}

// ============================================
// PLAY PLAYLIST
// ============================================

function playPlaylist(playlist) {
    if (playlist.songs && playlist.songs.length > 0) {
        playSong(playlist.songs[0]);
    } else {
        playerState.currentTrack = {
            name: playlist.title,
            artist: 'Various Artists',
            duration: 180
        };
        playerState.duration = playerState.currentTrack.duration;
        playerState.currentTime = 0;
        playerState.isPlaying = true;
        
        playerElements = getPlayerElements();
        updateTrackInfo();
        
        if (playerElements.playBtn) {
            const icon = playerElements.playBtn.querySelector('i');
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        }
        
        simulatePlayback();
    }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

const searchInput = document.querySelector('.top-nav__search-input');
const notificationBtn = document.getElementById('notificationBtn');

if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        if (query.length > 0) {
            // Implement search functionality here
            console.log('Searching for:', query);
        }
    });

    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                console.log('Perform search for:', query);
                // Navigate to search results page or show results
            }
        }
    });
}

// ============================================
// NOTIFICATION BUTTON
// ============================================

if (notificationBtn) {
    notificationBtn.addEventListener('click', function() {
        // Toggle notification panel or navigate to notifications page
        console.log('Open notifications');
        // You can implement a dropdown notification panel here
    });
}

// ============================================
// NAVIGATION CONTROLS
// ============================================

// ============================================
// INITIALIZE
// ============================================

// ============================================
// AUTO-SCROLL SECTIONS
// ============================================

function initAutoScroll() {
    const grids = document.querySelectorAll('.section-block__grid');
    
    grids.forEach(grid => {
        // Clone content để tạo infinite scroll effect
        const originalContent = grid.innerHTML;
        const clonedContent = originalContent;
        
        // Tạo wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'section-block__grid-wrapper';
        wrapper.style.cssText = 'display: flex; gap: var(--spacing-md);';
        
        // Move existing children to wrapper
        while (grid.firstChild) {
            wrapper.appendChild(grid.firstChild);
        }
        
        // Clone wrapper for seamless loop
        const clonedWrapper = wrapper.cloneNode(true);
        wrapper.appendChild(clonedWrapper);
        
        grid.appendChild(wrapper);
        
        // Add auto-scroll class
        grid.classList.add('section-block__grid--auto-scroll');
        
        // Pause on hover
        grid.addEventListener('mouseenter', () => {
            grid.style.animationPlayState = 'paused';
        });
        
        grid.addEventListener('mouseleave', () => {
            grid.style.animationPlayState = 'running';
        });
    });
}

// ============================================
// SCROLLBAR HOVER EFFECT
// ============================================

function initScrollbarHover() {
    const grids = document.querySelectorAll('.section-block__grid, .section-block__grid--songs');
    
    grids.forEach(grid => {
        // Add hover class when mouse enters grid
        grid.addEventListener('mouseenter', () => {
            grid.classList.add('scrollbar-visible');
        });
        
        // Remove hover class when mouse leaves grid
        grid.addEventListener('mouseleave', () => {
            grid.classList.remove('scrollbar-visible');
        });
    });
}

// Export checkLoginStatus to window for use in other scripts
window.checkLoginStatus = checkLoginStatus;
window.setupLogout = setupLogout;

document.addEventListener('DOMContentLoaded', () => {
    // Check login status
    checkLoginStatus();
    setupLogout();
    
    // Setup mobile sidebar toggle will be called after sidebar is loaded (in layout.js)
    // But also try to setup immediately in case sidebar is already loaded
    setTimeout(() => {
        if (!document.querySelector('.sidebar--active')) {
            setupMobileSidebar();
        }
    }, 500);
    
    // Render featured songs
    renderSongs('featuredSongs', songsData);
    
    // Render playlists
    renderPlaylists('madeForYou', playlistsData.madeForYou);
    renderPlaylists('recentlyPlayed', playlistsData.recentlyPlayed);
    renderPlaylists('topCharts', playlistsData.topCharts);
    
    // Render artists
    renderArtists('popularArtists', playlistsData.artists);
    
    // Initialize default albums if needed (this will also update old album names)
    initializeDefaultAlbums();
    
    // Render albums from localStorage (after potential update)
    const albums = getAlbums();
    if (albums.length > 0) {
        // Show first 6 albums
        renderAlbums('featuredAlbums', albums.slice(0, 6));
    }
    
    // Initialize scrollbar hover effect
    initScrollbarHover();
    
    // Initialize player controls after components are loaded
    setTimeout(() => {
        initPlayerControls();
        
        // Restore player state from localStorage
        const restored = restorePlayerState();
        
        // If state was not restored, load volume from localStorage
        if (!restored) {
            try {
                const savedVolume = localStorage.getItem('musicstream_volume');
                if (savedVolume !== null) {
                    playerState.volume = parseInt(savedVolume);
                }
            } catch (e) {
                console.error('Error loading volume:', e);
            }
            
            // Set volume slider value
            playerElements = getPlayerElements();
            if (playerElements.volumeSlider) {
                playerElements.volumeSlider.value = playerState.volume;
            }
            
            // Set audio volume
            if (audioElement) {
                audioElement.volume = playerState.volume / 100;
            }
            
            updateVolumeIcon();
        }
        
        // Update like button state if there's a current track
        if (playerState.currentTrack) {
            updateLikeButton();
        }
        
        // Listen for favorite changes to update like button
        window.addEventListener('favoriteChanged', () => {
            if (playerState.currentTrack) {
                updateLikeButton();
            }
        });
    }, 100);
    
    // Initialize progress
    updateProgress();
    
    console.log('%c🎵 MusicStream Home', 'font-size: 20px; font-weight: bold; color: #6C5CE7;');
    console.log('Trang home đã sẵn sàng!');
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe playlist cards
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const cards = document.querySelectorAll('.playlist-card, .artist-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }, 100);
});

