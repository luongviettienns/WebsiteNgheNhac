// ============================================
// TRENDING PAGE
// Hiển thị các bài hát xu hướng/top thịnh hành
// ============================================

const TrendingPage = {
    /**
     * Initialize trending page
     */
    init() {
        this.loadTrendingSongs();
        this.setupEventListeners();
    },
    
    /**
     * Load and display trending songs
     */
    loadTrendingSongs() {
        // Get all songs and sort by popularity (simulated by play count or random)
        const allSongs = this.getAllSongs();
        const trendingSongs = this.calculateTrending(allSongs);
        
        const trendingList = document.getElementById('trendingList');
        const trendingCount = document.getElementById('trendingCount');
        
        if (!trendingList) return;
        
        // Update count
        if (trendingCount) {
            trendingCount.textContent = `${trendingSongs.length} bài hát`;
        }
        
        // Clear list
        trendingList.innerHTML = '';
        
        if (trendingSongs.length === 0) {
            trendingList.innerHTML = `
                <div class="favorites-empty" style="display: block;">
                    <div class="favorites-empty__icon">
                        <i class="far fa-fire"></i>
                    </div>
                    <h2 class="favorites-empty__title">Không có bài hát xu hướng</h2>
                    <p class="favorites-empty__description">Hãy quay lại sau để xem các bài hát đang thịnh hành</p>
                </div>
            `;
            return;
        }
        
        // Render songs with rank
        trendingSongs.forEach((song, index) => {
            const songItem = this.createSongItem(song, index + 1);
            trendingList.appendChild(songItem);
        });
    },
    
    /**
     * Get all available songs
     */
    getAllSongs() {
        const songs = [];
        
        // Get from main songsData
        if (window.songsData && window.songsData.length > 0) {
            songs.push(...window.songsData);
        }
        
        // Get from admin songs
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
     * Calculate trending songs based on play count and recency
     */
    calculateTrending(songs) {
        // Get play history
        const recentlyPlayed = this.getRecentlyPlayed();
        
        // Count plays per song
        const playCounts = {};
        recentlyPlayed.forEach(item => {
            playCounts[item.id] = (playCounts[item.id] || 0) + 1;
        });
        
        // Calculate trending score (play count + recency)
        const trendingScores = songs.map(song => {
            const playCount = playCounts[song.id] || 0;
            const recentPlays = recentlyPlayed.filter(item => item.id === song.id).length;
            const score = playCount * 2 + recentPlays;
            
            return {
                ...song,
                score: score,
                playCount: playCount
            };
        });
        
        // Sort by score (descending), then by name
        trendingScores.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return (a.name || a.title || '').localeCompare(b.name || b.title || '');
        });
        
        // Return top 50 trending songs
        return trendingScores.slice(0, 50).map(song => {
            const { score, playCount, ...songData } = song;
            return songData;
        });
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
     * Create song item element
     */
    createSongItem(song, rank) {
        const item = document.createElement('div');
        item.className = 'favorite-item';
        item.dataset.songId = song.id;
        
        // Add rank badge for top 3
        const rankBadge = rank <= 3 ? `<span class="trending-rank trending-rank--${rank}">${rank}</span>` : `<span class="trending-rank">${rank}</span>`;
        
        item.innerHTML = `
            <div class="favorite-item__image" style="background-image: url('${song.image || song.artistImage || ''}');">
                ${rankBadge}
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
                const allSongs = this.getAllSongs();
                const trendingSongs = this.calculateTrending(allSongs);
                if (trendingSongs.length > 0 && window.playSong) {
                    window.playSong(trendingSongs[0]);
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
    TrendingPage.init();
});

