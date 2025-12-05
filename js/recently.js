// ============================================
// RECENTLY PLAYED PAGE
// Hiển thị các bài hát đã phát gần đây
// ============================================

const RecentlyPage = {
    /**
     * Initialize recently played page
     */
    init() {
        this.loadRecentlyPlayed();
        this.setupEventListeners();
    },
    
    /**
     * Load and display recently played songs
     */
    loadRecentlyPlayed() {
        const recentlyPlayed = this.getRecentlyPlayed();
        const recentlyList = document.getElementById('recentlyList');
        const recentlyCount = document.getElementById('recentlyCount');
        
        if (!recentlyList) return;
        
        // Update count
        if (recentlyCount) {
            recentlyCount.textContent = `${recentlyPlayed.length} bài hát`;
        }
        
        // Clear list
        recentlyList.innerHTML = '';
        
        if (recentlyPlayed.length === 0) {
            recentlyList.innerHTML = `
                <div class="favorites-empty" style="display: block;">
                    <div class="favorites-empty__icon">
                        <i class="far fa-clock"></i>
                    </div>
                    <h2 class="favorites-empty__title">Chưa có bài hát nào được phát</h2>
                    <p class="favorites-empty__description">Bắt đầu nghe nhạc để xem lịch sử phát gần đây của bạn</p>
                    <a href="explore.html" class="btn btn--primary">
                        <i class="fas fa-compass"></i>
                        Khám phá âm nhạc
                    </a>
                </div>
            `;
            return;
        }
        
        // Render songs
        recentlyPlayed.forEach((song, index) => {
            const songItem = this.createSongItem(song, index);
            recentlyList.appendChild(songItem);
        });
    },
    
    /**
     * Get recently played songs
     */
    getRecentlyPlayed() {
        try {
            return JSON.parse(localStorage.getItem('musicstream_recently_played') || '[]');
        } catch (e) {
            console.error('Error loading recently played:', e);
            return [];
        }
    },
    
    /**
     * Create song item element
     */
    createSongItem(song, index) {
        const item = document.createElement('div');
        item.className = 'favorite-item';
        item.dataset.songId = song.id;
        
        const playedDate = song.playedAt ? new Date(song.playedAt) : new Date();
        const timeAgo = this.getTimeAgo(playedDate);
        
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
                <span class="favorite-item__time">${timeAgo}</span>
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
            
            // Update like button state
            this.updateLikeButton(song, likeBtn);
        }
        
        return item;
    },
    
    /**
     * Get time ago string
     */
    getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 7) return `${days} ngày trước`;
        return date.toLocaleDateString('vi-VN');
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
            
            // Dispatch event
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
                const recentlyPlayed = this.getRecentlyPlayed();
                if (recentlyPlayed.length > 0 && window.playSong) {
                    window.playSong(recentlyPlayed[0]);
                }
            });
        }
        
        // Clear history button
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử phát nhạc?')) {
                    localStorage.removeItem('musicstream_recently_played');
                    this.loadRecentlyPlayed();
                }
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
    RecentlyPage.init();
});

