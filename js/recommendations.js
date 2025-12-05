// ============================================
// RECOMMENDATIONS PAGE
// Đề xuất bài hát dựa trên lịch sử nghe và ca sĩ đã theo dõi
// ============================================

const RecommendationsPage = {
    /**
     * Initialize recommendations page
     */
    init() {
        this.loadRecommendations();
        this.setupEventListeners();
    },
    
    /**
     * Load and display recommended songs
     */
    loadRecommendations() {
        const recommendedSongs = this.calculateRecommendations();
        
        const recommendationsList = document.getElementById('recommendationsList');
        const recommendationsCount = document.getElementById('recommendationsCount');
        
        if (!recommendationsList) return;
        
        // Update count
        if (recommendationsCount) {
            recommendationsCount.textContent = `${recommendedSongs.length} bài hát`;
        }
        
        // Clear list
        recommendationsList.innerHTML = '';
        
        if (recommendedSongs.length === 0) {
            recommendationsList.innerHTML = `
                <div class="favorites-empty" style="display: block;">
                    <div class="favorites-empty__icon">
                        <i class="far fa-star"></i>
                    </div>
                    <h2 class="favorites-empty__title">Chưa có đề xuất</h2>
                    <p class="favorites-empty__description">Bắt đầu nghe nhạc để nhận đề xuất cá nhân hóa</p>
                    <a href="explore.html" class="btn btn--primary">
                        <i class="fas fa-compass"></i>
                        Khám phá âm nhạc
                    </a>
                </div>
            `;
            return;
        }
        
        // Render songs
        recommendedSongs.forEach((song, index) => {
            const songItem = this.createSongItem(song, index);
            recommendationsList.appendChild(songItem);
        });
    },
    
    /**
     * Calculate recommended songs based on listening history
     */
    calculateRecommendations() {
        const allSongs = this.getAllSongs();
        const recentlyPlayed = this.getRecentlyPlayed();
        const favorites = this.getFavorites();
        
        if (recentlyPlayed.length === 0 && favorites.length === 0) {
            // If no history, return random songs
            return this.getRandomSongs(allSongs, 20);
        }
        
        // Get artists from recently played and favorites
        const artistSet = new Set();
        recentlyPlayed.forEach(song => {
            if (song.artist) {
                artistSet.add(song.artist.toLowerCase());
            }
        });
        favorites.forEach(song => {
            if (song.artist) {
                artistSet.add(song.artist.toLowerCase());
            }
        });
        
        // Get songs from same artists
        const artistSongs = allSongs.filter(song => {
            if (!song.artist) return false;
            return artistSet.has(song.artist.toLowerCase());
        });
        
        // Remove already played/favorited songs
        const playedIds = new Set([
            ...recentlyPlayed.map(s => s.id),
            ...favorites.map(s => s.id)
        ]);
        
        const newSongs = artistSongs.filter(song => !playedIds.has(song.id));
        
        // If not enough songs, add similar songs (same genre/album or random)
        if (newSongs.length < 20) {
            const remaining = 20 - newSongs.length;
            const otherSongs = allSongs.filter(song => 
                !playedIds.has(song.id) && !newSongs.some(s => s.id === song.id)
            );
            newSongs.push(...this.getRandomSongs(otherSongs, remaining));
        }
        
        // Shuffle and return top 20
        return this.shuffleArray(newSongs).slice(0, 20);
    },
    
    /**
     * Get all available songs
     */
    getAllSongs() {
        const songs = [];
        
        if (window.songsData && window.songsData.length > 0) {
            songs.push(...window.songsData);
        }
        
        try {
            const adminSongs = JSON.parse(localStorage.getItem('musicstream_admin_songs') || '[]');
            songs.push(...adminSongs);
        } catch (e) {
            console.error('Error loading admin songs:', e);
        }
        
        // Remove duplicates
        const uniqueSongs = [];
        const seenIds = new Set();
        songs.forEach(song => {
            if (!seenIds.has(song.id)) {
                seenIds.add(song.id);
                uniqueSongs.push(song);
            }
        });
        
        return uniqueSongs;
    },
    
    /**
     * Get recently played songs
     */
    getRecentlyPlayed() {
        try {
            return JSON.parse(localStorage.getItem('musicstream_recently_played') || '[]');
        } catch (e) {
            return [];
        }
    },
    
    /**
     * Get favorite songs
     */
    getFavorites() {
        try {
            return JSON.parse(localStorage.getItem('musicstream_favorites') || '[]');
        } catch (e) {
            return [];
        }
    },
    
    /**
     * Get random songs
     */
    getRandomSongs(songs, count) {
        const shuffled = this.shuffleArray([...songs]);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },
    
    /**
     * Shuffle array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    /**
     * Create song item element
     */
    createSongItem(song, index) {
        const item = document.createElement('div');
        item.className = 'favorite-item';
        item.dataset.songId = song.id;
        
        item.innerHTML = `
            <div class="favorite-item__image" style="background-image: url('${song.image || song.artistImage || ''}');">
                <button class="favorite-item__play-btn" data-song-id="${song.id}">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="favorite-item__info">
                <div class="favorite-item__title">${song.name || song.title}</div>
                <div class="favorite-item__artist">${song.artist}</div>
            </div>
            <div class="favorite-item__meta">
                <span class="favorite-item__duration">${this.formatDuration(song.duration)}</span>
            </div>
            <div class="favorite-item__actions">
                <button class="favorite-item__action-btn" data-song-id="${song.id}" title="Thêm vào yêu thích">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        `;
        
        // Add event handlers
        const playBtn = item.querySelector('.favorite-item__play-btn');
        const likeBtn = item.querySelector('.favorite-item__action-btn');
        
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playSong(song);
            });
        }
        
        if (likeBtn) {
            likeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(song, likeBtn);
            });
            
            this.updateLikeButton(song, likeBtn);
        }
        
        return item;
    },
    
    /**
     * Format duration
     */
    formatDuration(seconds) {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    /**
     * Play song
     */
    playSong(song) {
        if (window.playSong) {
            window.playSong(song);
        }
    },
    
    /**
     * Toggle favorite
     */
    toggleFavorite(song, button) {
        try {
            let favorites = JSON.parse(localStorage.getItem('musicstream_favorites') || '[]');
            const isFavorite = favorites.some(fav => fav.id === song.id);
            
            if (isFavorite) {
                favorites = favorites.filter(fav => fav.id !== song.id);
                button.querySelector('i').classList.remove('fas');
                button.querySelector('i').classList.add('far');
            } else {
                favorites.push(song);
                button.querySelector('i').classList.remove('far');
                button.querySelector('i').classList.add('fas');
            }
            
            localStorage.setItem('musicstream_favorites', JSON.stringify(favorites));
            window.dispatchEvent(new CustomEvent('favoritesUpdated'));
        } catch (e) {
            console.error('Error toggling favorite:', e);
        }
    },
    
    /**
     * Update like button state
     */
    updateLikeButton(song, button) {
        try {
            const favorites = JSON.parse(localStorage.getItem('musicstream_favorites') || '[]');
            const isFavorite = favorites.some(fav => fav.id === song.id);
            const icon = button.querySelector('i');
            
            if (isFavorite) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        } catch (e) {
            console.error('Error updating like button:', e);
        }
    },
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Play all button
        const playAllBtn = document.getElementById('playAllBtn');
        if (playAllBtn) {
            playAllBtn.addEventListener('click', () => {
                const recommendedSongs = this.calculateRecommendations();
                if (recommendedSongs.length > 0 && window.playSong) {
                    window.playSong(recommendedSongs[0]);
                }
            });
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadRecommendations();
            });
        }
        
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterSongs(e.target.value);
            });
        }
    },
    
    /**
     * Filter songs by search query
     */
    filterSongs(query) {
        const items = document.querySelectorAll('.favorite-item');
        const lowerQuery = query.toLowerCase();
        
        items.forEach(item => {
            const title = item.querySelector('.favorite-item__title')?.textContent.toLowerCase() || '';
            const artist = item.querySelector('.favorite-item__artist')?.textContent.toLowerCase() || '';
            
            if (title.includes(lowerQuery) || artist.includes(lowerQuery)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    RecommendationsPage.init();
});

