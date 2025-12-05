// ============================================
// ARTIST PAGE JAVASCRIPT
// ============================================

// ============================================
// GET ARTIST ID FROM URL
// ============================================

function getArtistIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || null;
}

// ============================================
// ARTIST DATA (Should match home.js)
// ============================================

// Get songsData from window (loaded from home.js) - don't redeclare
// Use a function to get songsData to avoid redeclaration issues
function getSongsData() {
    if (window.songsData && window.songsData.length > 0) {
        return window.songsData;
    }
    // Fallback if window.songsData doesn't exist
    return [
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
            duration: 0
        }
    ];
}

// Get songsData once and use it throughout
// Use a local variable name to avoid conflicts with home.js
const artistSongsData = getSongsData();

const artistsData = [
    { 
        id: 1, 
        name: 'ERIK', 
        image: '../assets/images/Erik.jpg', 
        songs: [
            artistSongsData.find(s => s.id === 1) || artistSongsData[0],
            artistSongsData.find(s => s.id === 5) || artistSongsData[4],
            artistSongsData.find(s => s.id === 7) || artistSongsData[6],
            // Demo songs for ERIK
            {
                id: 101,
                name: "Chạm đáy nỗi đau",
                title: "Chạm đáy nỗi đau",
                artist: "ERIK",
                album: "ERIK - Chạm đáy nỗi đau",
                audio: "../assets/audio/DuChoTanThe.mp3", // Demo - using same audio
                image: "../assets/images/DuChoTanThe_avatar.png",
                artistImage: "../assets/images/Erik.jpg",
                duration: 215
            },
            {
                id: 102,
                name: "Sau tất cả",
                title: "Sau tất cả",
                artist: "ERIK",
                album: "ERIK - Sau tất cả",
                audio: "../assets/audio/DuChoTanThe.mp3",
                image: "../assets/images/DuChoTanThe_avatar.png",
                artistImage: "../assets/images/Erik.jpg",
                duration: 198
            },
            {
                id: 103,
                title: "Tình yêu màu nắng",
                artist: "ERIK",
                album: "ERIK - Tình yêu màu nắng",
                audio: "../assets/audio/DuChoTanThe.mp3",
                image: "../assets/images/DuChoTanThe_avatar.png",
                artistImage: "../assets/images/Erik.jpg",
                duration: 225
            }
        ],
        albums: [
            {
                title: "Dù cho tận thế",
                image: "../assets/images/DuChoTanThe_avatar.png",
                year: 2025,
                type: "Single"
            },
            {
                title: "Tình yêu màu nắng",
                image: "../assets/images/DuChoTanThe_avatar.png",
                year: 2024,
                type: "EP"
            },
            {
                title: "Sau tất cả",
                image: "../assets/images/DuChoTanThe_avatar.png",
                year: 2023,
                type: "Album"
            }
        ],
        listeners: 1250000,
        description: 'Ca sĩ, nhạc sĩ người Việt Nam'
    },
    { 
        id: 2, 
        name: 'Trọng Hiếu', 
        image: '../assets/images/TrongHieu_avatar.jpg', 
        songs: [
            artistSongsData.find(s => s.id === 2) || artistSongsData[1],
            {
                id: 201,
                name: "Đừng như thói quen",
                title: "Đừng như thói quen",
                artist: "Trọng Hiếu",
                album: "Trọng Hiếu - Đừng như thói quen",
                audio: "../assets/audio/KhoBau.mp3",
                image: "../assets/images/KhoBau_avatar.png",
                artistImage: "../assets/images/TrongHieu_avatar.jpg",
                duration: 205
            },
            {
                id: 202,
                name: "Ngày mai",
                title: "Ngày mai",
                artist: "Trọng Hiếu",
                album: "Trọng Hiếu - Ngày mai",
                audio: "../assets/audio/KhoBau.mp3",
                image: "../assets/images/KhoBau_avatar.png",
                artistImage: "../assets/images/TrongHieu_avatar.jpg",
                duration: 190
            }
        ],
        albums: [
            {
                title: "Kho Báu",
                image: "../assets/images/KhoBau_avatar.png",
                year: 2025,
                type: "Single"
            },
            {
                title: "Đừng như thói quen",
                image: "../assets/images/KhoBau_avatar.png",
                year: 2024,
                type: "Single"
            }
        ],
        listeners: 890000,
        description: 'Rapper, nhạc sĩ'
    },
    { 
        id: 3, 
        name: 'Juky San', 
        image: '../assets/images/BuiTruongLinh_avatar.jpg', 
        songs: [
            artistSongsData[2],
            {
                id: 301,
                title: "Em là của tôi",
                artist: "Juky San",
                album: "Juky San - Em là của tôi",
                audio: "../assets/audio/NguoiDauTien.mp3",
                image: "../assets/images/NguoiDauTien_avatar.png",
                artistImage: "../assets/images/BuiTruongLinh_avatar.jpg",
                duration: 210
            },
            {
                id: 302,
                title: "Một ngày không em",
                artist: "Juky San",
                album: "Juky San - Một ngày không em",
                audio: "../assets/audio/NguoiDauTien.mp3",
                image: "../assets/images/NguoiDauTien_avatar.png",
                artistImage: "../assets/images/BuiTruongLinh_avatar.jpg",
                duration: 185
            }
        ],
        albums: [
            {
                title: "Người Đầu Tiên",
                image: "../assets/images/NguoiDauTien_avatar.png",
                year: 2025,
                type: "Single"
            },
            {
                title: "Em là của tôi",
                image: "../assets/images/NguoiDauTien_avatar.png",
                year: 2024,
                type: "EP"
            }
        ],
        listeners: 650000,
        description: 'Ca sĩ, nhạc sĩ'
    },
    { 
        id: 4, 
        name: 'B Ray', 
        image: '../assets/images/Bray_avatar.jpg', 
        songs: [
            artistSongsData[3],
            {
                id: 401,
                title: "Đi về nhà",
                artist: "B Ray",
                album: "B Ray - Đi về nhà",
                audio: "../assets/audio/ThieuThan.mp3",
                image: "../assets/images/ThieuThan_avatar.png",
                artistImage: "../assets/images/Bray_avatar.jpg",
                duration: 220
            },
            {
                id: 402,
                title: "Lạc lối",
                artist: "B Ray",
                album: "B Ray - Lạc lối",
                audio: "../assets/audio/ThieuThan.mp3",
                image: "../assets/images/ThieuThan_avatar.png",
                artistImage: "../assets/images/Bray_avatar.jpg",
                duration: 200
            },
            {
                id: 403,
                title: "Người ta nói",
                artist: "B Ray",
                album: "B Ray - Người ta nói",
                audio: "../assets/audio/ThieuThan.mp3",
                image: "../assets/images/ThieuThan_avatar.png",
                artistImage: "../assets/images/Bray_avatar.jpg",
                duration: 195
            }
        ],
        albums: [
            {
                title: "THIÊU THÂN",
                image: "../assets/images/ThieuThan_avatar.png",
                year: 2025,
                type: "Single"
            },
            {
                title: "Đi về nhà",
                image: "../assets/images/ThieuThan_avatar.png",
                year: 2024,
                type: "Single"
            },
            {
                title: "Lạc lối",
                image: "../assets/images/ThieuThan_avatar.png",
                year: 2023,
                type: "Album"
            }
        ],
        listeners: 2100000,
        description: 'Rapper, nhạc sĩ'
    },
    { 
        id: 5, 
        name: 'Rhymastic', 
        image: '../assets/images/Rhymastic_avatar.jpg', 
        songs: [
            artistSongsData.find(s => s.id === 2) || artistSongsData[1], // Kho Báu
            artistSongsData.find(s => s.id === 6) || artistSongsData[5], // Yêu 5
            {
                id: 501,
                name: "Đừng hỏi em",
                title: "Đừng hỏi em",
                artist: "Rhymastic",
                album: "Rhymastic - Đừng hỏi em",
                audio: "../assets/audio/KhoBau.mp3",
                image: "../assets/images/KhoBau_avatar.png",
                artistImage: "../assets/images/Rhymastic_avatar.jpg",
                duration: 208
            },
            {
                id: 502,
                name: "Người lạ ơi",
                title: "Người lạ ơi",
                artist: "Rhymastic",
                album: "Rhymastic - Người lạ ơi",
                audio: "../assets/audio/KhoBau.mp3",
                image: "../assets/images/KhoBau_avatar.png",
                artistImage: "../assets/images/Rhymastic_avatar.jpg",
                duration: 192
            }
        ],
        albums: [
            {
                title: "Kho Báu",
                image: "../assets/images/KhoBau_avatar.png",
                year: 2025,
                type: "Single"
            },
            {
                title: "Yêu 5",
                image: "../assets/images/Yeu5_avatar.jpg",
                year: 2025,
                type: "Single"
            },
            {
                title: "Đừng hỏi em",
                image: "../assets/images/KhoBau_avatar.png",
                year: 2024,
                type: "EP"
            }
        ],
        listeners: 1500000,
        description: 'Rapper, nhạc sĩ'
    },
    { 
        id: 6, 
        name: 'Buitruonglinh', 
        image: '../assets/images/BuiTruongLinh_avatar.jpg', 
        songs: [
            artistSongsData[2],
            {
                id: 601,
                title: "Yêu thương",
                artist: "Buitruonglinh",
                album: "Buitruonglinh - Yêu thương",
                audio: "../assets/audio/NguoiDauTien.mp3",
                image: "../assets/images/NguoiDauTien_avatar.png",
                artistImage: "../assets/images/BuiTruongLinh_avatar.jpg",
                duration: 203
            }
        ],
        albums: [
            {
                title: "Người Đầu Tiên",
                image: "../assets/images/NguoiDauTien_avatar.png",
                year: 2025,
                type: "Single"
            },
            {
                title: "Yêu thương",
                image: "../assets/images/NguoiDauTien_avatar.png",
                year: 2024,
                type: "Single"
            }
        ],
        listeners: 450000,
        description: 'Ca sĩ'
    },
    { 
        id: 7, 
        name: 'Hiếu Thứ Hai', 
        image: '../assets/images/HieuThuHai_avatar.jpg', 
        songs: [
            artistSongsData.find(s => s.id === 7) || artistSongsData[6]
        ],
        albums: [
            {
                title: "Ngáo Ngơ",
                image: "../assets/images/HieuThuHai_avatar.jpg",
                year: 2025,
                type: "Single"
            }
        ],
        listeners: 320000,
        description: 'Rapper, nhạc sĩ'
    }
];

// ============================================
// LOAD ARTIST DATA
// ============================================

function loadArtistData(artistId) {
    const artist = artistsData.find(a => a.id === parseInt(artistId));
    
    if (!artist) {
        // Redirect to home if artist not found
        window.location.href = 'home.html';
        return null;
    }
    
    return artist;
}

// ============================================
// RENDER ARTIST HEADER
// ============================================

function renderArtistHeader(artist) {
    const artistImage = document.getElementById('artistImage');
    const artistName = document.getElementById('artistName');
    const songCount = document.getElementById('songCount');
    const listenerCount = document.getElementById('listenerCount');
    
    if (artistImage) {
        if (artist.image) {
            artistImage.style.backgroundImage = `url('${artist.image}')`;
            artistImage.style.backgroundSize = 'cover';
            artistImage.style.backgroundPosition = 'center';
            artistImage.innerHTML = '';
        } else {
            artistImage.style.background = 'var(--gradient-primary)';
            artistImage.innerHTML = '<i class="fas fa-user"></i>';
        }
    }
    
    if (artistName) {
        artistName.textContent = artist.name;
    }
    
    if (songCount) {
        const count = artist.songs ? artist.songs.length : 0;
        songCount.textContent = `${count} bài hát`;
    }
    
    if (listenerCount) {
        const listeners = artist.listeners || 0;
        const formatted = listeners >= 1000000 
            ? `${(listeners / 1000000).toFixed(1)}M`
            : listeners >= 1000
            ? `${(listeners / 1000).toFixed(1)}K`
            : listeners;
        listenerCount.textContent = `${formatted} người nghe`;
    }
}

// ============================================
// RENDER ARTIST SONGS
// ============================================

function renderArtistSongs(artist) {
    const container = document.getElementById('artistSongsList');
    if (!container || !artist.songs) return;
    
    container.innerHTML = '';
    
    artist.songs.forEach((song, index) => {
        const songItem = createSongListItem(song, index + 1);
        container.appendChild(songItem);
    });
}

function createSongListItem(song, number) {
    const item = document.createElement('div');
    item.className = 'artist-song-item';
    item.dataset.songId = song.id;
    
    const duration = formatTime(song.duration || 0);
    
    item.innerHTML = `
        <div class="artist-song-item__number">${number}</div>
        <button class="artist-song-item__play-btn">
            <i class="fas fa-play"></i>
        </button>
        <div class="artist-song-item__image" style="background-image: url('${song.image}'); background-size: cover; background-position: center;"></div>
        <div class="artist-song-item__info">
            <div class="artist-song-item__title">${song.title}</div>
            <div class="artist-song-item__album">${song.album}</div>
        </div>
        <div class="artist-song-item__duration">${duration}</div>
        <div class="artist-song-item__actions">
            <button class="artist-song-item__action-btn" title="Thêm vào playlist">
                <i class="fas fa-plus"></i>
            </button>
            <button class="artist-song-item__action-btn" title="Yêu thích">
                <i class="far fa-heart"></i>
            </button>
        </div>
    `;
    
    // Play button click
    const playBtn = item.querySelector('.artist-song-item__play-btn');
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSong(song);
        updatePlayingState(song.id);
    });
    
    // Item click
    item.addEventListener('click', (e) => {
        if (!e.target.closest('.artist-song-item__actions') && 
            !e.target.closest('.artist-song-item__play-btn')) {
            playSong(song);
            updatePlayingState(song.id);
        }
    });
    
    return item;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updatePlayingState(songId) {
    const items = document.querySelectorAll('.artist-song-item');
    items.forEach(item => {
        item.classList.remove('artist-song-item--playing');
        const title = item.querySelector('.artist-song-item__title');
        if (title) {
            title.classList.remove('artist-song-item__title--playing');
        }
    });
    
    const currentItem = document.querySelector(`[data-song-id="${songId}"]`);
    if (currentItem) {
        currentItem.classList.add('artist-song-item--playing');
        const title = currentItem.querySelector('.artist-song-item__title');
        if (title) {
            title.classList.add('artist-song-item__title--playing');
        }
    }
}

// ============================================
// RENDER ARTIST ALBUMS
// ============================================

function renderArtistAlbums(artist) {
    const container = document.getElementById('artistAlbumsGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Use albums array if available, otherwise group songs by album
    let albums = [];
    
    if (artist.albums && artist.albums.length > 0) {
        // Use predefined albums
        albums = artist.albums.map(album => ({
            title: album.title,
            image: album.image,
            year: album.year,
            type: album.type || 'Album',
            songs: artist.songs ? artist.songs.filter(s => s.album === album.title) : []
        }));
    } else if (artist.songs) {
        // Group songs by album (fallback)
        const albumsMap = new Map();
        artist.songs.forEach(song => {
            const albumName = song.album || 'Single';
            if (!albumsMap.has(albumName)) {
                albumsMap.set(albumName, {
                    title: albumName,
                    image: song.image,
                    year: new Date().getFullYear(),
                    type: 'Single',
                    songs: [song]
                });
            } else {
                albumsMap.get(albumName).songs.push(song);
            }
        });
        albums = Array.from(albumsMap.values());
    }
    
    // If still no albums, create demo albums
    if (albums.length === 0) {
        albums = [
            {
                title: `${artist.name} - Album Demo`,
                image: artist.image || '../assets/images/DuChoTanThe_avatar.png',
                year: new Date().getFullYear(),
                type: 'Album',
                songs: []
            }
        ];
    }
    
    albums.forEach(album => {
        const albumCard = createAlbumCard(album);
        container.appendChild(albumCard);
    });
}

function createAlbumCard(album) {
    const card = document.createElement('a');
    card.className = 'artist-album-card';
    card.href = '#';
    
    const imageUrl = album.image || '../assets/images/DuChoTanThe_avatar.png';
    const typeLabel = album.type || 'Album';
    
    card.innerHTML = `
        <div class="artist-album-card__image" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;">
            <button class="artist-album-card__play-btn">
                <i class="fas fa-play"></i>
            </button>
        </div>
        <div class="artist-album-card__title">${album.title}</div>
        <div class="artist-album-card__meta">
            <span class="artist-album-card__year">${album.year}</span>
            <span class="artist-album-card__type">${typeLabel}</span>
        </div>
    `;
    
    const playBtn = card.querySelector('.artist-album-card__play-btn');
    playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (album.songs && album.songs.length > 0) {
            playSong(album.songs[0]);
        } else if (window.songsData && window.songsData.length > 0) {
            // Fallback: play first available song
            playSong(window.songsData[0]);
        }
    });
    
    return card;
}

// ============================================
// RENDER RELATED ARTISTS
// ============================================

function renderRelatedArtists(currentArtist) {
    const container = document.getElementById('relatedArtists');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Get related artists (exclude current artist)
    const related = artistsData
        .filter(a => a.id !== currentArtist.id)
        .slice(0, 6);
    
    related.forEach(artist => {
        const card = createArtistCard(artist);
        container.appendChild(card);
    });
}

function createArtistCard(artist) {
    const card = document.createElement('div');
    card.className = 'artist-card';
    card.dataset.artistId = artist.id;
    
    const imageStyle = artist.image 
        ? `background-image: url('${artist.image}'); background-size: cover; background-position: center;`
        : `background: var(--gradient-primary);`;
    
    card.innerHTML = `
        <div class="artist-card__image" style="${imageStyle}">
            ${!artist.image ? '<i class="fas fa-user"></i>' : ''}
        </div>
        <div class="artist-card__name">${artist.name}</div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `artist.html?id=${artist.id}`;
    });
    
    return card;
}

// ============================================
// PLAY SONG (Use from home.js if available)
// ============================================

function playSong(song) {
    if (window.playSong && typeof window.playSong === 'function') {
        window.playSong(song);
    } else {
        // Fallback implementation
        console.log('Playing song:', song.title);
    }
}

// ============================================
// BUTTON HANDLERS
// ============================================

function setupButtons(artist) {
    const playAllBtn = document.getElementById('playAllBtn');
    const followBtn = document.getElementById('followBtn');
    
    if (playAllBtn) {
        playAllBtn.addEventListener('click', () => {
            if (artist.songs && artist.songs.length > 0) {
                playSong(artist.songs[0]);
            }
        });
    }
    
    if (followBtn) {
        let isFollowing = false;
        followBtn.addEventListener('click', () => {
            isFollowing = !isFollowing;
            const icon = followBtn.querySelector('i');
            const text = followBtn.querySelector('span') || followBtn.childNodes[followBtn.childNodes.length - 1];
            
            if (isFollowing) {
                icon.className = 'fas fa-check';
                followBtn.classList.remove('btn--outline');
                followBtn.classList.add('btn--primary');
                if (text && text.nodeType === 3) {
                    text.textContent = 'Đã theo dõi';
                } else if (text) {
                    text.textContent = 'Đã theo dõi';
                }
            } else {
                icon.className = 'fas fa-plus';
                followBtn.classList.remove('btn--primary');
                followBtn.classList.add('btn--outline');
                if (text && text.nodeType === 3) {
                    text.textContent = 'Theo dõi';
                } else if (text) {
                    text.textContent = 'Theo dõi';
                }
            }
        });
    }
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // artistSongsData is already set from getSongsData() at the top of the file
    // No need to update it here as it already uses window.songsData if available
    
    const artistId = getArtistIdFromURL();
    
    if (!artistId) {
        window.location.href = 'home.html';
        return;
    }
    
    const artist = loadArtistData(artistId);
    
    if (!artist) {
        return;
    }
    
    // Render all sections
    renderArtistHeader(artist);
    renderArtistSongs(artist);
    renderArtistAlbums(artist);
    renderRelatedArtists(artist);
    setupButtons(artist);
    
    // Check login status (from home.js)
    if (window.checkLoginStatus) {
        window.checkLoginStatus();
    }
    
    console.log('%c🎵 Artist Page Loaded', 'font-size: 20px; font-weight: bold; color: #6C5CE7;');
    console.log('Artist:', artist.name);
});

