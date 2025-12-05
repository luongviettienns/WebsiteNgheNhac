// ============================================
// EXPLORE PAGE JAVASCRIPT
// ============================================

// ============================================
// LOCAL STORAGE UTILITIES
// ============================================

const ExploreStorage = {
    // Get recently played from localStorage
    getRecentlyPlayed: () => {
        try {
            const data = localStorage.getItem('musicstream_recently_played');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    // Save to recently played
    addToRecentlyPlayed: (song) => {
        try {
            let recentlyPlayed = ExploreStorage.getRecentlyPlayed();
            
            // Remove if already exists
            recentlyPlayed = recentlyPlayed.filter(s => s.id !== song.id);
            
            // Add to beginning
            recentlyPlayed.unshift({
                id: song.id,
                title: song.title,
                artist: song.artist,
                image: song.image,
                audio: song.audio,
                timestamp: Date.now()
            });
            
            // Keep only last 20 items
            recentlyPlayed = recentlyPlayed.slice(0, 20);
            
            localStorage.setItem('musicstream_recently_played', JSON.stringify(recentlyPlayed));
            return recentlyPlayed;
        } catch (e) {
            console.error('Error saving to recently played:', e);
            return [];
        }
    },

    // Get user preferences
    getPreferences: () => {
        try {
            const data = localStorage.getItem('musicstream_preferences');
            return data ? JSON.parse(data) : {
                favoriteGenres: [],
                favoriteMoods: [],
                favoriteArtists: []
            };
        } catch (e) {
            return {
                favoriteGenres: [],
                favoriteMoods: [],
                favoriteArtists: []
            };
        }
    },

    // Save user preferences
    savePreferences: (preferences) => {
        try {
            localStorage.setItem('musicstream_preferences', JSON.stringify(preferences));
        } catch (e) {
            console.error('Error saving preferences:', e);
        }
    }
};

// ============================================
// DEMO DATA
// ============================================

const genresData = [
    {
        id: 1,
        name: 'Pop',
        image: '../assets/images/DuChoTanThe_avatar.png',
        count: 1250,
        color: '#FF6B6B'
    },
    {
        id: 2,
        name: 'Hip Hop',
        image: '../assets/images/KhoBau_avatar.png',
        count: 890,
        color: '#6C5CE7'
    },
    {
        id: 3,
        name: 'R&B',
        image: '../assets/images/NguoiDauTien_avatar.png',
        count: 650,
        color: '#00D2D3'
    },
    {
        id: 4,
        name: 'Rock',
        image: '../assets/images/ThieuThan_avatar.png',
        count: 420,
        color: '#FFA500'
    },
    {
        id: 5,
        name: 'Electronic',
        image: '../assets/images/DuChoTanThe_avatar.png',
        count: 780,
        color: '#9B59B6'
    },
    {
        id: 6,
        name: 'Jazz',
        image: '../assets/images/KhoBau_avatar.png',
        count: 320,
        color: '#3498DB'
    },
    {
        id: 7,
        name: 'Country',
        image: '../assets/images/NguoiDauTien_avatar.png',
        count: 210,
        color: '#2ECC71'
    },
    {
        id: 8,
        name: 'Classical',
        image: '../assets/images/ThieuThan_avatar.png',
        count: 150,
        color: '#E74C3C'
    }
];

const moodsData = [
    { id: 1, name: 'Vui vẻ', icon: 'fa-smile', color: '#FFD700' },
    { id: 2, name: 'Buồn', icon: 'fa-sad-tear', color: '#3498DB' },
    { id: 3, name: 'Năng động', icon: 'fa-fire', color: '#FF6B6B' },
    { id: 4, name: 'Thư giãn', icon: 'fa-spa', color: '#00D2D3' },
    { id: 5, name: 'Lãng mạn', icon: 'fa-heart', color: '#FF6B9D' },
    { id: 6, name: 'Tập trung', icon: 'fa-brain', color: '#6C5CE7' },
    { id: 7, name: 'Tập luyện', icon: 'fa-dumbbell', color: '#FFA500' },
    { id: 8, name: 'Party', icon: 'fa-glass-cheers', color: '#9B59B6' }
];

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderGenres() {
    const container = document.getElementById('genresGrid');
    if (!container) return;

    container.innerHTML = '';

    genresData.forEach(genre => {
        const card = document.createElement('div');
        card.className = 'genre-card';
        card.dataset.genreId = genre.id;

        const imageStyle = genre.image 
            ? `background-image: url('${genre.image}');`
            : `background: linear-gradient(135deg, ${genre.color} 0%, ${genre.color}80 100%);`;

        card.innerHTML = `
            <div class="genre-card__image" style="${imageStyle}"></div>
            <div class="genre-card__content">
                <div class="genre-card__title">${genre.name}</div>
                <div class="genre-card__count">${genre.count} bài hát</div>
            </div>
        `;

        card.addEventListener('click', () => {
            // Navigate to genre page (can be implemented later)
            console.log('Navigate to genre:', genre.name);
        });

        container.appendChild(card);
    });
}

function renderMoods() {
    const container = document.getElementById('moodsGrid');
    if (!container) return;

    container.innerHTML = '';

    moodsData.forEach(mood => {
        const card = document.createElement('div');
        card.className = 'mood-card';
        card.dataset.moodId = mood.id;

        card.innerHTML = `
            <div class="mood-card__icon" style="background: linear-gradient(135deg, ${mood.color} 0%, ${mood.color}80 100%);">
                <i class="fas ${mood.icon}"></i>
            </div>
            <div class="mood-card__content">
                <div class="mood-card__title">${mood.name}</div>
            </div>
        `;

        card.addEventListener('click', () => {
            // Navigate to mood playlist (can be implemented later)
            console.log('Navigate to mood:', mood.name);
        });

        container.appendChild(card);
    });
}

function renderNewReleases() {
    const container = document.getElementById('newReleasesGrid');
    if (!container) return;

    container.innerHTML = '';

    // Get songsData from window (from home.js)
    const songsData = window.songsData || [];
    
    // Use songsData or create demo data
    const newReleases = songsData.length > 0 
        ? songsData.slice(0, 6)
        : [
            {
                id: 101,
                title: "Bài hát mới 1",
                artist: "Nghệ sĩ mới",
                image: "../assets/images/DuChoTanThe_avatar.png",
                audio: "../assets/audio/DuChoTanThe.mp3"
            },
            {
                id: 102,
                title: "Bài hát mới 2",
                artist: "Nghệ sĩ mới",
                image: "../assets/images/KhoBau_avatar.png",
                audio: "../assets/audio/KhoBau.mp3"
            }
        ];

    newReleases.forEach(song => {
        const card = createSongCard(song);
        container.appendChild(card);
    });
}

function renderCharts() {
    const container = document.getElementById('chartsList');
    if (!container) return;

    container.innerHTML = '';

    // Get songsData from window (from home.js)
    const songsData = window.songsData || [];
    
    // Create chart data
    const chartSongs = songsData.length > 0 
        ? songsData.slice(0, 10)
        : Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            title: `Bài hát #${i + 1}`,
            artist: 'Nghệ sĩ',
            image: '../assets/images/DuChoTanThe_avatar.png',
            audio: '../assets/audio/DuChoTanThe.mp3'
        }));

    chartSongs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'chart-item';
        item.dataset.songId = song.id;

        const rankClass = index < 3 ? 'chart-item__rank--top' : '';

        item.innerHTML = `
            <div class="chart-item__rank ${rankClass}">${index + 1}</div>
            <div class="chart-item__image" style="background-image: url('${song.image}'); background-size: cover; background-position: center;"></div>
            <div class="chart-item__info">
                <div class="chart-item__title">${song.title}</div>
                <div class="chart-item__artist">${song.artist}</div>
            </div>
            <button class="chart-item__play-btn">
                <i class="fas fa-play"></i>
            </button>
        `;

        const playBtn = item.querySelector('.chart-item__play-btn');
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playSong(song);
        });

        item.addEventListener('click', (e) => {
            if (!e.target.closest('.chart-item__play-btn')) {
                playSong(song);
            }
        });

        container.appendChild(item);
    });
}

function renderRecommended() {
    const container = document.getElementById('recommendedGrid');
    if (!container) return;

    container.innerHTML = '';

    // Get user preferences to personalize recommendations
    const preferences = ExploreStorage.getPreferences();
    
    // Demo recommended playlists
    const recommended = [
        {
            id: 1,
            title: 'Daily Mix 1',
            description: 'Dựa trên sở thích của bạn',
            image: '../assets/images/DuChoTanThe_avatar.png'
        },
        {
            id: 2,
            title: 'Discover Weekly',
            description: 'Playlist cá nhân hóa mỗi tuần',
            image: '../assets/images/KhoBau_avatar.png'
        },
        {
            id: 3,
            title: 'Release Radar',
            description: 'Bài hát mới từ nghệ sĩ bạn theo dõi',
            image: '../assets/images/NguoiDauTien_avatar.png'
        },
        {
            id: 4,
            title: 'Chill Mix',
            description: 'Nhạc chill để thư giãn',
            image: '../assets/images/ThieuThan_avatar.png'
        }
    ];

    recommended.forEach(playlist => {
        const card = createPlaylistCard(playlist);
        container.appendChild(card);
    });
}

function renderRecentlyPlayed() {
    const container = document.getElementById('recentlyPlayedGrid');
    const section = document.getElementById('recentlyPlayedSection');
    if (!container || !section) return;

    const recentlyPlayed = ExploreStorage.getRecentlyPlayed();

    if (recentlyPlayed.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    container.innerHTML = '';

    recentlyPlayed.slice(0, 6).forEach(item => {
        const card = createSongCard(item);
        container.appendChild(card);
    });
}

// ============================================
// CARD CREATORS (Reuse from home.js if available)
// ============================================

function createSongCard(song) {
    // Store reference to avoid infinite recursion
    const homeCreateSongCard = window.createSongCard;
    
    // Use function from home.js if available and it's not this function
    if (homeCreateSongCard && 
        typeof homeCreateSongCard === 'function' && 
        homeCreateSongCard !== createSongCard) {
        return homeCreateSongCard(song);
    }

    // Fallback implementation
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
    
    const playBtn = card.querySelector('.song-card__play-btn');
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSong(song);
    });
    
    card.addEventListener('click', () => {
        playSong(song);
    });
    
    return card;
}

function createPlaylistCard(playlist) {
    // Use function from home.js if available (but avoid recursion)
    const homeCreatePlaylistCard = window.createPlaylistCard;
    if (homeCreatePlaylistCard && 
        typeof homeCreatePlaylistCard === 'function' &&
        homeCreatePlaylistCard !== createPlaylistCard) {
        return homeCreatePlaylistCard(playlist);
    }

    // Fallback implementation
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.dataset.playlistId = playlist.id;
    
    const imageStyle = playlist.image 
        ? `background-image: url('${playlist.image}'); background-size: cover; background-position: center;`
        : `background: var(--gradient-primary);`;
    
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
    
    const playBtn = card.querySelector('.playlist-card__play-btn');
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (playlist.songs && playlist.songs.length > 0) {
            playSong(playlist.songs[0]);
        }
    });
    
    return card;
}

// ============================================
// PLAY SONG (Use from home.js if available)
// ============================================

function playSong(song) {
    // Save to recently played
    ExploreStorage.addToRecentlyPlayed(song);
    
    // Use playSong from home.js if available
    if (window.playSong && typeof window.playSong === 'function') {
        window.playSong(song);
    } else {
        console.log('Playing song:', song.title);
    }
    
    // Refresh recently played section
    renderRecentlyPlayed();
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Render all sections
    renderGenres();
    renderMoods();
    renderNewReleases();
    renderCharts();
    renderRecommended();
    renderRecentlyPlayed();
    
    // Check login status (from home.js)
    if (window.checkLoginStatus) {
        window.checkLoginStatus();
    }
    
    // Listen for song play events to update recently played
    document.addEventListener('songPlayed', (e) => {
        if (e.detail && e.detail.song) {
            ExploreStorage.addToRecentlyPlayed(e.detail.song);
            renderRecentlyPlayed();
        }
    });
    
    console.log('%c🎵 Explore Page Loaded', 'font-size: 20px; font-weight: bold; color: #6C5CE7;');
    console.log('Khám phá âm nhạc mới!');
});

