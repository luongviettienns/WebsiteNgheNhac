// ============================================
// FAVORITES PAGE JAVASCRIPT
// ============================================

// ============================================
// LOCAL STORAGE UTILITIES
// ============================================

const FavoritesStorage = {
    // Get all favorites from localStorage
    getFavorites: () => {
        try {
            const data = localStorage.getItem('musicstream_favorites');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading favorites:', e);
            return [];
        }
    },

    // Save favorites to localStorage
    saveFavorites: (favorites) => {
        try {
            localStorage.setItem('musicstream_favorites', JSON.stringify(favorites));
            return true;
        } catch (e) {
            console.error('Error saving favorites:', e);
            return false;
        }
    },

    // Add song to favorites
    addFavorite: (song) => {
        const favorites = FavoritesStorage.getFavorites();
        
        // Check if already exists
        if (favorites.some(f => f.id === song.id)) {
            return favorites;
        }
        
        // Add timestamp for sorting
        const favoriteSong = {
            ...song,
            addedAt: Date.now()
        };
        
        favorites.push(favoriteSong);
        FavoritesStorage.saveFavorites(favorites);
        return favorites;
    },

    // Remove song from favorites
    removeFavorite: (songId) => {
        const favorites = FavoritesStorage.getFavorites();
        const filtered = favorites.filter(f => f.id !== songId);
        FavoritesStorage.saveFavorites(filtered);
        return filtered;
    },

    // Check if song is favorite
    isFavorite: (songId) => {
        const favorites = FavoritesStorage.getFavorites();
        return favorites.some(f => f.id === songId);
    }
};

// ============================================
// STATE
// ============================================

let currentFilter = 'all';
let currentSearch = '';
let sortOrder = 'recent'; // 'recent' or 'oldest'

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderFavorites() {
    const container = document.getElementById('favoritesList');
    const emptyState = document.getElementById('favoritesEmpty');
    const content = document.getElementById('favoritesContent');
    const countEl = document.getElementById('favoritesCount');
    
    if (!container) return;
    
    let favorites = FavoritesStorage.getFavorites();
    
    // Apply search filter
    if (currentSearch.trim()) {
        const searchLower = currentSearch.toLowerCase();
        favorites = favorites.filter(song => 
            song.title.toLowerCase().includes(searchLower) ||
            song.artist.toLowerCase().includes(searchLower)
        );
    }
    
    // Apply sort
    if (sortOrder === 'recent') {
        favorites.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    } else if (sortOrder === 'oldest') {
        favorites.sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0));
    }
    
    // Update count
    if (countEl) {
        const totalCount = FavoritesStorage.getFavorites().length;
        countEl.textContent = `${totalCount} bài hát`;
    }
    
    // Show/hide empty state
    if (favorites.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (content) content.style.display = 'none';
        return;
    } else {
        if (emptyState) emptyState.style.display = 'none';
        if (content) content.style.display = 'block';
    }
    
    container.innerHTML = '';
    
    favorites.forEach((song, index) => {
        const item = createFavoriteItem(song, index);
        container.appendChild(item);
    });
}

function createFavoriteItem(song, index) {
    const item = document.createElement('div');
    item.className = 'favorite-item';
    item.dataset.songId = song.id;
    
    const duration = formatTime(song.duration || 0);
    const imageUrl = song.image || '../assets/images/DuChoTanThe_avatar.png';
    
    // Check if currently playing
    const isPlaying = window.playerState && 
                      window.playerState.currentTrack && 
                      window.playerState.currentTrack.id === song.id &&
                      window.playerState.isPlaying;
    
    if (isPlaying) {
        item.classList.add('favorite-item--playing');
    }
    
    item.innerHTML = `
        <div class="favorite-item__image" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;">
            <div class="favorite-item__play-overlay">
                <button class="favorite-item__play-btn">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        </div>
        <div class="favorite-item__info">
            <div class="favorite-item__title">${song.title}</div>
            <div class="favorite-item__artist">${song.artist}</div>
        </div>
        <div class="favorite-item__duration">${duration}</div>
        <div class="favorite-item__actions">
            <button class="favorite-item__action-btn favorite-item__action-btn--remove" title="Xóa khỏi yêu thích">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `;
    
    // Play button
    const playBtn = item.querySelector('.favorite-item__play-btn');
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSong(song);
        updatePlayingState();
    });
    
    // Item click
    item.addEventListener('click', (e) => {
        if (!e.target.closest('.favorite-item__actions') && 
            !e.target.closest('.favorite-item__play-btn')) {
            playSong(song);
            updatePlayingState();
        }
    });
    
    // Remove button
    const removeBtn = item.querySelector('.favorite-item__action-btn--remove');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFavorite(song.id);
    });
    
    return item;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updatePlayingState() {
    const items = document.querySelectorAll('.favorite-item');
    items.forEach(item => {
        item.classList.remove('favorite-item--playing');
    });
    
    if (window.playerState && window.playerState.currentTrack) {
        const currentItem = document.querySelector(`[data-song-id="${window.playerState.currentTrack.id}"]`);
        if (currentItem && window.playerState.isPlaying) {
            currentItem.classList.add('favorite-item--playing');
        }
    }
}

// ============================================
// PLAY SONG
// ============================================

function playSong(song) {
    // Use playSong from home.js if available
    if (window.playSong && typeof window.playSong === 'function') {
        window.playSong(song);
    } else {
        console.log('Playing song:', song.title);
    }
    
    // Update playing state after a short delay
    setTimeout(updatePlayingState, 100);
}

// ============================================
// REMOVE FAVORITE
// ============================================

function removeFavorite(songId) {
    FavoritesStorage.removeFavorite(songId);
    renderFavorites();
    
    // Update like button in player bar if this song is playing
    if (window.playerState && window.playerState.currentTrack && 
        window.playerState.currentTrack.id === songId) {
        const likeBtn = document.querySelector('.player-bar__like-btn');
        if (likeBtn) {
            likeBtn.classList.remove('active');
            const icon = likeBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        }
    }
}

// ============================================
// EVENT HANDLERS
// ============================================

function setupEventHandlers() {
    // Play all button
    const playAllBtn = document.getElementById('playAllBtn');
    if (playAllBtn) {
        playAllBtn.addEventListener('click', () => {
            const favorites = FavoritesStorage.getFavorites();
            if (favorites.length > 0 && window.playSong) {
                window.playSong(favorites[0]);
            }
        });
    }
    
    // Sort button
    const sortBtn = document.getElementById('sortBtn');
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            sortOrder = sortOrder === 'recent' ? 'oldest' : 'recent';
            renderFavorites();
            
            // Update button icon
            const icon = sortBtn.querySelector('i');
            if (icon) {
                icon.className = sortOrder === 'recent' 
                    ? 'fas fa-sort-amount-down' 
                    : 'fas fa-sort-amount-up';
            }
        });
    }
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.favorites-filter');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderFavorites();
        });
    });
    
    // Search input
    const searchInput = document.getElementById('favoritesSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            renderFavorites();
        });
    }
}

// ============================================
// LISTEN FOR FAVORITE CHANGES
// ============================================

// Listen for favorite changes from other pages
function setupFavoriteListener() {
    // Listen for custom event when favorites change
    window.addEventListener('favoriteChanged', () => {
        renderFavorites();
    });
    
    // Listen for player state changes to update playing indicator
    setInterval(() => {
        updatePlayingState();
    }, 1000);
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Render favorites
    renderFavorites();
    
    // Setup event handlers
    setupEventHandlers();
    
    // Setup favorite listener
    setupFavoriteListener();
    
    // Check login status (from home.js)
    if (window.checkLoginStatus) {
        window.checkLoginStatus();
    }
    
    console.log('%c❤️ Favorites Page Loaded', 'font-size: 20px; font-weight: bold; color: #FF6B6B;');
    console.log('Favorites:', FavoritesStorage.getFavorites().length);
});

// Export for use in other files
window.FavoritesStorage = FavoritesStorage;

