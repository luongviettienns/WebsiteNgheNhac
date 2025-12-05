// ============================================
// ADMIN PAGE JAVASCRIPT
// Quản lý và thêm bài hát
// ============================================

const AdminPage = {
    // Storage key for admin songs
    STORAGE_KEY: 'musicstream_admin_songs',
    
    /**
     * Initialize admin page
     */
    init() {
        this.loadSongs();
        this.setupForm();
        this.checkAdminAccess();
        this.initPlans();
        this.setupTabs();
        this.initUsers();
        this.initAlbums();
    },
    
    /**
     * Setup tab navigation
     */
    setupTabs() {
        const tabButtons = document.querySelectorAll('.admin-tabs__btn');
        const tabContents = document.querySelectorAll('.admin-tabs__content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('admin-tabs__btn--active'));
                tabContents.forEach(content => content.classList.remove('admin-tabs__content--active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('admin-tabs__btn--active');
                const targetContent = document.querySelector(`[data-tab-content="${targetTab}"]`);
                if (targetContent) {
                    targetContent.classList.add('admin-tabs__content--active');
                }
            });
        });
    },
    
    /**
     * Check if user has admin access
     */
    checkAdminAccess() {
        const currentUser = window.authUtils ? window.authUtils.getCurrentUser() : null;
        const isAdmin = currentUser && currentUser.username === 'admin';
        
        if (!isAdmin) {
            // Verify admin account
            const accounts = JSON.parse(localStorage.getItem('musicstream_accounts') || '[]');
            const adminAccount = accounts.find(acc => acc.username === 'admin' && acc.password === 'admin123');
            
            if (!adminAccount) {
                window.location.href = 'home.html';
            }
        }
    },
    
    /**
     * Get all admin songs from localStorage
     */
    getAdminSongs() {
        try {
            const songs = localStorage.getItem(this.STORAGE_KEY);
            return songs ? JSON.parse(songs) : [];
        } catch (e) {
            console.error('Error loading admin songs:', e);
            return [];
        }
    },
    
    /**
     * Save admin songs to localStorage
     */
    saveAdminSongs(songs) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(songs));
            return true;
        } catch (e) {
            console.error('Error saving admin songs:', e);
            return false;
        }
    },
    
    /**
     * Merge admin songs with main songsData
     */
    mergeWithMainSongs() {
        const adminSongs = this.getAdminSongs();
        
        if (adminSongs.length > 0 && window.songsData) {
            // Get existing IDs to avoid duplicates
            const existingIds = new Set(window.songsData.map(s => s.id));
            
            // Add admin songs that don't exist in main data
            adminSongs.forEach(song => {
                if (!existingIds.has(song.id)) {
                    window.songsData.push(song);
                }
            });
        }
    },
    
    /**
     * Setup form submission
     */
    setupForm() {
        const form = document.getElementById('addSongForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddSong(form);
        });
        
        // Setup auto-detect duration
        this.setupAutoDetectDuration();
    },
    
    /**
     * Setup auto-detect duration from audio file
     */
    setupAutoDetectDuration() {
        const audioInput = document.getElementById('songAudio');
        const durationInput = document.getElementById('songDuration');
        const durationHidden = document.getElementById('songDurationHidden');
        const getDurationBtn = document.getElementById('getDurationBtn');
        const durationHint = document.getElementById('durationHint');
        
        if (!audioInput || !durationInput || !getDurationBtn) return;
        
        // Auto-detect when audio URL changes
        let detectTimeout;
        audioInput.addEventListener('input', () => {
            clearTimeout(detectTimeout);
            detectTimeout = setTimeout(() => {
                if (audioInput.value.trim()) {
                    this.detectAudioDuration(audioInput.value.trim());
                }
            }, 1000); // Wait 1 second after user stops typing
        });
        
        // Manual button click
        getDurationBtn.addEventListener('click', () => {
            const audioUrl = audioInput.value.trim();
            if (audioUrl) {
                this.detectAudioDuration(audioUrl);
            } else {
                this.showMessage('Vui lòng nhập đường dẫn audio trước', 'error');
            }
        });
    },
    
    /**
     * Detect audio duration from URL
     */
    async detectAudioDuration(audioUrl) {
        const durationInput = document.getElementById('songDuration');
        const durationHidden = document.getElementById('songDurationHidden');
        const getDurationBtn = document.getElementById('getDurationBtn');
        const durationHint = document.getElementById('durationHint');
        
        if (!durationInput || !getDurationBtn) return;
        
        // Show loading state
        getDurationBtn.disabled = true;
        getDurationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        durationHint.textContent = 'Đang tải file audio...';
        durationHint.style.color = 'var(--color-primary)';
        
        try {
            // Create audio element to get duration
            const audio = new Audio(audioUrl);
            
            // Wait for metadata to load
            await new Promise((resolve, reject) => {
                audio.addEventListener('loadedmetadata', () => {
                    resolve();
                });
                
                audio.addEventListener('error', (e) => {
                    reject(new Error('Không thể tải file audio'));
                });
                
                // Timeout after 10 seconds
                setTimeout(() => {
                    reject(new Error('Timeout: Không thể tải file audio'));
                }, 10000);
                
                // Load audio
                audio.load();
            });
            
            // Get duration in seconds
            const duration = Math.floor(audio.duration);
            
            if (duration && !isNaN(duration) && duration > 0) {
                durationInput.value = duration;
                if (durationHidden) {
                    durationHidden.value = duration;
                }
                durationHint.textContent = `Đã nhận biết: ${this.formatDuration(duration)}`;
                durationHint.style.color = 'var(--color-success, #00D2D3)';
                this.showMessage(`Đã nhận biết thời lượng: ${this.formatDuration(duration)}`, 'success');
            } else {
                throw new Error('Không thể xác định thời lượng');
            }
        } catch (error) {
            console.error('Error detecting duration:', error);
            durationInput.value = '';
            if (durationHidden) {
                durationHidden.value = '';
            }
            durationHint.textContent = 'Không thể nhận biết thời lượng. Vui lòng kiểm tra đường dẫn audio.';
            durationHint.style.color = 'var(--color-accent, #FF6B6B)';
            this.showMessage('Không thể nhận biết thời lượng từ file audio. Vui lòng kiểm tra đường dẫn.', 'error');
        } finally {
            // Reset button
            getDurationBtn.disabled = false;
            getDurationBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        }
    },
    
    /**
     * Handle add song form submission
     */
    handleAddSong(form) {
        const formData = new FormData(form);
        const title = formData.get('title').trim();
        const artist = formData.get('artist').trim();
        const audio = formData.get('audio').trim();
        const image = formData.get('image').trim();
        const album = formData.get('album').trim();
        // Get duration from hidden input or visible input
        const durationHidden = document.getElementById('songDurationHidden');
        const durationInput = document.getElementById('songDuration');
        const duration = parseInt(durationHidden?.value || durationInput?.value || formData.get('duration') || '0') || 0;
        const artistImage = formData.get('artistImage').trim();
        
        // Validate
        if (!title || !artist || !audio || !image) {
            this.showMessage('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            return;
        }
        
        // Check if duration is available
        if (!duration || duration <= 0) {
            this.showMessage('Vui lòng đợi hệ thống nhận biết thời lượng từ file audio, hoặc nhập thời lượng thủ công', 'error');
            return;
        }
        
        // Get existing songs
        const adminSongs = this.getAdminSongs();
        
        // Generate new ID
        const maxId = adminSongs.length > 0 
            ? Math.max(...adminSongs.map(s => s.id || 0))
            : (window.songsData ? Math.max(...window.songsData.map(s => s.id || 0)) : 0);
        const newId = maxId + 1;
        
        // Create song object
        const newSong = {
            id: newId,
            name: title,
            title: title,
            artist: artist,
            album: album || `${artist} - ${title}`,
            audio: audio,
            image: image,
            artistImage: artistImage || image,
            duration: duration
        };
        
        // Add to admin songs
        adminSongs.push(newSong);
        
        // Save to localStorage
        if (this.saveAdminSongs(adminSongs)) {
            // Merge with main songsData if available
            if (window.songsData) {
                window.songsData.push(newSong);
            }
            
            // Show success message
            this.showMessage('Thêm bài hát thành công!', 'success');
            
            // Reset form
            form.reset();
            
            // Reload songs list
            this.loadSongs();
            
            // Dispatch event to update other pages
            window.dispatchEvent(new CustomEvent('adminSongAdded', { detail: newSong }));
        } else {
            this.showMessage('Có lỗi xảy ra khi lưu bài hát', 'error');
        }
    },
    
    /**
     * Load and display songs
     */
    loadSongs() {
        const songs = this.getAdminSongs();
        const songsList = document.getElementById('songsList');
        const songsCount = document.getElementById('songsCount');
        
        if (!songsList) return;
        
        // Update count
        if (songsCount) {
            songsCount.textContent = `(${songs.length})`;
        }
        
        // Clear list
        songsList.innerHTML = '';
        
        if (songs.length === 0) {
            songsList.innerHTML = `
                <div class="admin-empty">
                    <i class="fas fa-music"></i>
                    <p>Chưa có bài hát nào được thêm</p>
                    <small>Hãy thêm bài hát mới bằng form phía trên</small>
                </div>
            `;
            return;
        }
        
        // Render songs
        songs.forEach(song => {
            const songCard = this.createSongCard(song);
            songsList.appendChild(songCard);
        });
    },
    
    /**
     * Create song card element
     */
    createSongCard(song) {
        const card = document.createElement('div');
        card.className = 'admin-song-card';
        card.dataset.songId = song.id;
        
        card.innerHTML = `
            <div class="admin-song-card__image" style="background-image: url('${song.image}');">
                <div class="admin-song-card__overlay">
                    <button class="admin-song-card__delete" data-song-id="${song.id}" title="Xóa bài hát">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="admin-song-card__info">
                <h3 class="admin-song-card__title">${song.title || song.name}</h3>
                <p class="admin-song-card__artist">${song.artist}</p>
                <div class="admin-song-card__meta">
                    <span class="admin-song-card__duration">
                        <i class="fas fa-clock"></i>
                        ${this.formatDuration(song.duration)}
                    </span>
                    ${song.album ? `<span class="admin-song-card__album">${song.album}</span>` : ''}
                </div>
            </div>
        `;
        
        // Add delete handler
        const deleteBtn = card.querySelector('.admin-song-card__delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleDeleteSong(song.id);
            });
        }
        
        return card;
    },
    
    /**
     * Handle delete song
     */
    handleDeleteSong(songId) {
        if (!confirm('Bạn có chắc chắn muốn xóa bài hát này?')) {
            return;
        }
        
        const adminSongs = this.getAdminSongs();
        const filteredSongs = adminSongs.filter(s => s.id !== songId);
        
        if (this.saveAdminSongs(filteredSongs)) {
            // Remove from main songsData if available
            if (window.songsData) {
                const index = window.songsData.findIndex(s => s.id === songId);
                if (index > -1) {
                    window.songsData.splice(index, 1);
                }
            }
            
            this.showMessage('Xóa bài hát thành công!', 'success');
            this.loadSongs();
            
            // Dispatch event
            window.dispatchEvent(new CustomEvent('adminSongDeleted', { detail: { id: songId } }));
        } else {
            this.showMessage('Có lỗi xảy ra khi xóa bài hát', 'error');
        }
    },
    
    /**
     * Format duration from seconds to MM:SS
     */
    formatDuration(seconds) {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    /**
     * Show message
     */
    showMessage(message, type = 'info') {
        const messageEl = document.getElementById('formMessage');
        if (!messageEl) return;
        
        messageEl.textContent = message;
        messageEl.className = `admin-form__message admin-form__message--${type}`;
        messageEl.style.display = 'block';
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    },

    // ============================================
    // PLAN MANAGEMENT
    // ============================================
    
    STORAGE_KEY_PLANS: 'musicstream_premium_plans',
    editingPlanId: null,
    
    /**
     * Initialize plan management
     */
    initPlans() {
        this.loadPlans();
        this.setupPlanForm();
        this.initializeDefaultPlans();
    },
    
    /**
     * Initialize default plans if none exist
     */
    initializeDefaultPlans() {
        const plans = this.getPlans();
        if (plans.length === 0) {
            const defaultPlans = [
                {
                    id: 1,
                    name: 'Premium Individual',
                    type: 'individual',
                    originalPrice: 99000,
                    discountPrice: 49000,
                    discount: 50,
                    period: 'tháng',
                    features: [
                        'Không quảng cáo',
                        'Chất lượng âm thanh cao (320kbps)',
                        'Tải xuống offline không giới hạn',
                        'Bỏ qua bài hát không giới hạn',
                        'Phát nhạc theo yêu cầu',
                        'Hỗ trợ 1 thiết bị'
                    ],
                    studentPrice: 29000,
                    isActive: true
                },
                {
                    id: 2,
                    name: 'Premium Family',
                    type: 'family',
                    originalPrice: 149000,
                    discountPrice: 74500,
                    discount: 50,
                    period: 'tháng',
                    features: [
                        'Tất cả tính năng Premium Individual',
                        'Hỗ trợ tối đa 6 tài khoản',
                        'Playlist gia đình',
                        'Kiểm soát nội dung trẻ em',
                        'Chia sẻ với gia đình',
                        'Tiết kiệm hơn 40%'
                    ],
                    studentPrice: null,
                    isActive: true
                }
            ];
            this.savePlans(defaultPlans);
        }
    },
    
    /**
     * Get all plans from localStorage
     */
    getPlans() {
        try {
            const plans = localStorage.getItem(this.STORAGE_KEY_PLANS);
            return plans ? JSON.parse(plans) : [];
        } catch (e) {
            console.error('Error loading plans:', e);
            return [];
        }
    },
    
    /**
     * Save plans to localStorage
     */
    savePlans(plans) {
        try {
            localStorage.setItem(this.STORAGE_KEY_PLANS, JSON.stringify(plans));
            return true;
        } catch (e) {
            console.error('Error saving plans:', e);
            return false;
        }
    },
    
    /**
     * Setup plan form
     */
    setupPlanForm() {
        const form = document.getElementById('planForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePlanSubmit(form);
        });
        
        const cancelBtn = document.getElementById('planCancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelPlanEdit();
            });
        }
        
        // Auto calculate discount percentage
        const originalPriceInput = document.getElementById('planOriginalPrice');
        const discountPriceInput = document.getElementById('planDiscountPrice');
        const discountInput = document.getElementById('planDiscount');
        
        if (originalPriceInput && discountPriceInput && discountInput) {
            const calculateDiscount = () => {
                const original = parseFloat(originalPriceInput.value) || 0;
                const discount = parseFloat(discountPriceInput.value) || 0;
                if (original > 0 && discount < original) {
                    const percent = Math.round(((original - discount) / original) * 100);
                    discountInput.value = percent;
                }
            };
            
            originalPriceInput.addEventListener('input', calculateDiscount);
            discountPriceInput.addEventListener('input', calculateDiscount);
        }
    },
    
    /**
     * Handle plan form submission
     */
    handlePlanSubmit(form) {
        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const type = formData.get('type').trim().toLowerCase();
        const originalPrice = parseInt(formData.get('originalPrice')) || 0;
        const discountPrice = parseInt(formData.get('discountPrice')) || 0;
        const discount = parseInt(formData.get('discount')) || 0;
        const period = formData.get('period');
        const featuresText = formData.get('features').trim();
        const studentPrice = formData.get('studentPrice') ? parseInt(formData.get('studentPrice')) : null;
        const isActive = formData.get('isActive') === 'on';
        
        // Validate
        if (!name || !type || !originalPrice || !discountPrice || !featuresText) {
            this.showPlanMessage('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            return;
        }
        
        // Parse features
        const features = featuresText.split('\n')
            .map(f => f.trim())
            .filter(f => f.length > 0);
        
        if (features.length === 0) {
            this.showPlanMessage('Vui lòng nhập ít nhất một tính năng', 'error');
            return;
        }
        
        const plans = this.getPlans();
        
        if (this.editingPlanId) {
            // Update existing plan
            const planIndex = plans.findIndex(p => p.id === this.editingPlanId);
            if (planIndex > -1) {
                // Check if type is being changed and if it conflicts
                if (plans[planIndex].type !== type) {
                    const typeExists = plans.some(p => p.type === type && p.id !== this.editingPlanId);
                    if (typeExists) {
                        this.showPlanMessage('Mã gói (type) đã tồn tại', 'error');
                        return;
                    }
                }
                
                plans[planIndex] = {
                    ...plans[planIndex],
                    name,
                    type,
                    originalPrice,
                    discountPrice,
                    discount,
                    period,
                    features,
                    studentPrice,
                    isActive
                };
                
                if (this.savePlans(plans)) {
                    this.showPlanMessage('Cập nhật gói thành công!', 'success');
                    this.cancelPlanEdit();
                    this.loadPlans();
                    this.dispatchPlanUpdate();
                } else {
                    this.showPlanMessage('Có lỗi xảy ra khi lưu gói', 'error');
                }
            }
        } else {
            // Add new plan
            // Check if type already exists
            const typeExists = plans.some(p => p.type === type);
            if (typeExists) {
                this.showPlanMessage('Mã gói (type) đã tồn tại', 'error');
                return;
            }
            
            // Generate new ID
            const maxId = plans.length > 0 ? Math.max(...plans.map(p => p.id || 0)) : 0;
            const newId = maxId + 1;
            
            const newPlan = {
                id: newId,
                name,
                type,
                originalPrice,
                discountPrice,
                discount,
                period,
                features,
                studentPrice,
                isActive
            };
            
            plans.push(newPlan);
            
            if (this.savePlans(plans)) {
                this.showPlanMessage('Thêm gói thành công!', 'success');
                form.reset();
                this.loadPlans();
                this.dispatchPlanUpdate();
            } else {
                this.showPlanMessage('Có lỗi xảy ra khi lưu gói', 'error');
            }
        }
    },
    
    /**
     * Load and display plans
     */
    loadPlans() {
        const plans = this.getPlans();
        const plansList = document.getElementById('plansList');
        const plansCount = document.getElementById('plansCount');
        
        if (!plansList) return;
        
        // Update count
        if (plansCount) {
            plansCount.textContent = `(${plans.length})`;
        }
        
        // Clear list
        plansList.innerHTML = '';
        
        if (plans.length === 0) {
            plansList.innerHTML = `
                <div class="admin-empty">
                    <i class="fas fa-crown"></i>
                    <p>Chưa có gói nào được tạo</p>
                    <small>Hãy thêm gói mới bằng form phía trên</small>
                </div>
            `;
            return;
        }
        
        // Render plans
        plans.forEach(plan => {
            const planCard = this.createPlanCard(plan);
            plansList.appendChild(planCard);
        });
    },
    
    /**
     * Create plan card element
     */
    createPlanCard(plan) {
        const card = document.createElement('div');
        card.className = `admin-plan-card ${!plan.isActive ? 'admin-plan-card--inactive' : ''}`;
        card.dataset.planId = plan.id;
        
        const statusBadge = plan.isActive 
            ? '<span class="admin-plan-card__badge admin-plan-card__badge--active">Đang hoạt động</span>'
            : '<span class="admin-plan-card__badge admin-plan-card__badge--inactive">Tạm ẩn</span>';
        
        card.innerHTML = `
            <div class="admin-plan-card__header">
                <div class="admin-plan-card__info">
                    <h3 class="admin-plan-card__name">${plan.name}</h3>
                    <p class="admin-plan-card__type">Mã: <code>${plan.type}</code></p>
                    ${statusBadge}
                </div>
                <div class="admin-plan-card__actions">
                    <button class="admin-plan-card__btn admin-plan-card__btn--edit" data-plan-id="${plan.id}" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="admin-plan-card__btn admin-plan-card__btn--delete" data-plan-id="${plan.id}" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="admin-plan-card__body">
                <div class="admin-plan-card__pricing">
                    <div class="admin-plan-card__price">
                        <span class="admin-plan-card__old-price">${this.formatPrice(plan.originalPrice)}</span>
                        <span class="admin-plan-card__current-price">${this.formatPrice(plan.discountPrice)}</span>
                        <span class="admin-plan-card__period">/${plan.period}</span>
                    </div>
                    ${plan.discount > 0 ? `<span class="admin-plan-card__discount">Giảm ${plan.discount}%</span>` : ''}
                    ${plan.studentPrice ? `<div class="admin-plan-card__student">Sinh viên: ${this.formatPrice(plan.studentPrice)}/${plan.period}</div>` : ''}
                </div>
                <div class="admin-plan-card__features">
                    <strong>Tính năng:</strong>
                    <ul>
                        ${plan.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        // Add event handlers
        const editBtn = card.querySelector('.admin-plan-card__btn--edit');
        const deleteBtn = card.querySelector('.admin-plan-card__btn--delete');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.editPlan(plan.id);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.handleDeletePlan(plan.id);
            });
        }
        
        return card;
    },
    
    /**
     * Edit plan
     */
    editPlan(planId) {
        const plans = this.getPlans();
        const plan = plans.find(p => p.id === planId);
        
        if (!plan) return;
        
        this.editingPlanId = planId;
        
        // Fill form
        document.getElementById('planName').value = plan.name;
        document.getElementById('planType').value = plan.type;
        document.getElementById('planOriginalPrice').value = plan.originalPrice;
        document.getElementById('planDiscountPrice').value = plan.discountPrice;
        document.getElementById('planDiscount').value = plan.discount || '';
        document.getElementById('planPeriod').value = plan.period;
        document.getElementById('planFeatures').value = plan.features.join('\n');
        document.getElementById('planStudentPrice').value = plan.studentPrice || '';
        document.getElementById('planIsActive').checked = plan.isActive !== false;
        
        // Update button
        const submitBtn = document.getElementById('planSubmitBtn');
        const cancelBtn = document.getElementById('planCancelBtn');
        
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Cập nhật gói';
        }
        if (cancelBtn) {
            cancelBtn.style.display = 'inline-flex';
        }
        
        // Scroll to form
        document.getElementById('planForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    
    /**
     * Cancel plan edit
     */
    cancelPlanEdit() {
        this.editingPlanId = null;
        const form = document.getElementById('planForm');
        if (form) {
            form.reset();
        }
        
        const submitBtn = document.getElementById('planSubmitBtn');
        const cancelBtn = document.getElementById('planCancelBtn');
        
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> Thêm gói';
        }
        if (cancelBtn) {
            cancelBtn.style.display = 'none';
        }
    },
    
    /**
     * Handle delete plan
     */
    handleDeletePlan(planId) {
        if (!confirm('Bạn có chắc chắn muốn xóa gói này? Hành động này không thể hoàn tác.')) {
            return;
        }
        
        const plans = this.getPlans();
        const filteredPlans = plans.filter(p => p.id !== planId);
        
        if (this.savePlans(filteredPlans)) {
            this.showPlanMessage('Xóa gói thành công!', 'success');
            this.loadPlans();
            this.dispatchPlanUpdate();
        } else {
            this.showPlanMessage('Có lỗi xảy ra khi xóa gói', 'error');
        }
    },
    
    /**
     * Format price
     */
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    },
    
    /**
     * Show plan message
     */
    showPlanMessage(message, type = 'info') {
        const messageEl = document.getElementById('planFormMessage');
        if (!messageEl) return;
        
        messageEl.textContent = message;
        messageEl.className = `admin-form__message admin-form__message--${type}`;
        messageEl.style.display = 'block';
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    },
    
    /**
     * Dispatch plan update event
     */
    dispatchPlanUpdate() {
        window.dispatchEvent(new CustomEvent('plansUpdated'));
    },

    // ============================================
    // USER MANAGEMENT
    // ============================================
    
    STORAGE_KEY_ACCOUNTS: 'musicstream_accounts',
    
    /**
     * Initialize user management
     */
    initUsers() {
        this.loadUsers();
    },
    
    /**
     * Get all accounts from localStorage
     */
    getAccounts() {
        try {
            const accounts = localStorage.getItem(this.STORAGE_KEY_ACCOUNTS);
            return accounts ? JSON.parse(accounts) : [];
        } catch (e) {
            console.error('Error loading accounts:', e);
            return [];
        }
    },
    
    /**
     * Save accounts to localStorage
     */
    saveAccounts(accounts) {
        try {
            localStorage.setItem(this.STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
            return true;
        } catch (e) {
            console.error('Error saving accounts:', e);
            return false;
        }
    },
    
    /**
     * Load and display users
     */
    loadUsers() {
        const accounts = this.getAccounts();
        const usersList = document.getElementById('usersList');
        const usersCount = document.getElementById('usersCount');
        
        if (!usersList) return;
        
        // Update count (exclude admin)
        const userAccounts = accounts.filter(acc => acc.username !== 'admin');
        if (usersCount) {
            usersCount.textContent = `(${userAccounts.length})`;
        }
        
        // Clear list
        usersList.innerHTML = '';
        
        if (userAccounts.length === 0) {
            usersList.innerHTML = `
                <div class="admin-empty">
                    <i class="fas fa-users"></i>
                    <p>Chưa có tài khoản người dùng nào</p>
                    <small>Người dùng sẽ được tạo khi đăng ký tài khoản mới</small>
                </div>
            `;
            return;
        }
        
        // Render users
        userAccounts.forEach(account => {
            const userCard = this.createUserCard(account);
            usersList.appendChild(userCard);
        });
    },
    
    /**
     * Create user card element
     */
    createUserCard(account) {
        const card = document.createElement('div');
        card.className = 'admin-user-card';
        card.dataset.username = account.username;
        
        // Check if this user is currently logged in and has subscription
        const currentSession = JSON.parse(sessionStorage.getItem('musicstream_session') || localStorage.getItem('musicstream_session') || '{}');
        const isCurrentUser = currentSession.username === account.username;
        
        let subscriptionInfo = '<div class="admin-user-card__subscription admin-user-card__subscription--free">Free</div>';
        if (isCurrentUser) {
            const subscription = window.SubscriptionManager ? window.SubscriptionManager.getSubscription() : null;
            const hasActiveSubscription = subscription && subscription.status === 'active' && 
                new Date(subscription.expiryDate) > new Date();
            if (hasActiveSubscription) {
                subscriptionInfo = `
                    <div class="admin-user-card__subscription">
                        <i class="fas fa-crown"></i>
                        <span>${subscription.plan || 'Premium'}</span>
                        <small>Hết hạn: ${new Date(subscription.expiryDate).toLocaleDateString('vi-VN')}</small>
                    </div>
                `;
            }
        }
        
        // Get created date
        const createdDate = account.createdAt ? new Date(account.createdAt).toLocaleDateString('vi-VN') : 'Không xác định';
        
        card.innerHTML = `
            <div class="admin-user-card__header">
                <div class="admin-user-card__avatar">
                    ${account.username ? account.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div class="admin-user-card__info">
                    <h3 class="admin-user-card__name">${account.username || 'Người dùng'}</h3>
                    <p class="admin-user-card__email">${account.email || 'Chưa có email'}</p>
                    <div class="admin-user-card__meta">
                        <span class="admin-user-card__date">
                            <i class="fas fa-calendar"></i>
                            Đăng ký: ${createdDate}
                        </span>
                    </div>
                </div>
                ${subscriptionInfo}
            </div>
            <div class="admin-user-card__body">
                <div class="admin-user-card__actions">
                    <button class="admin-user-card__btn admin-user-card__btn--delete" data-username="${account.username}" title="Xóa tài khoản">
                        <i class="fas fa-trash"></i>
                        Xóa tài khoản
                    </button>
                </div>
            </div>
        `;
        
        // Add delete handler
        const deleteBtn = card.querySelector('.admin-user-card__btn--delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.handleDeleteUser(account.username);
            });
        }
        
        return card;
    },
    
    /**
     * Handle delete user
     */
    handleDeleteUser(username) {
        if (!username || username === 'admin') {
            this.showUsersMessage('Không thể xóa tài khoản admin', 'error');
            return;
        }
        
        if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}"? Hành động này không thể hoàn tác.`)) {
            return;
        }
        
        const accounts = this.getAccounts();
        const filteredAccounts = accounts.filter(acc => acc.username !== username);
        
        if (this.saveAccounts(filteredAccounts)) {
            // Also remove user's session if exists
            const session = JSON.parse(sessionStorage.getItem('musicstream_session') || localStorage.getItem('musicstream_session') || '{}');
            if (session.username === username) {
                sessionStorage.removeItem('musicstream_session');
                localStorage.removeItem('musicstream_session');
            }
            
            // Remove user's subscription if exists
            const subscription = window.SubscriptionManager ? window.SubscriptionManager.getSubscription() : null;
            if (subscription) {
                // Note: Subscription is stored globally, not per user in current implementation
                // This might need adjustment based on your subscription storage structure
            }
            
            this.showUsersMessage('Xóa tài khoản thành công!', 'success');
            this.loadUsers();
        } else {
            this.showUsersMessage('Có lỗi xảy ra khi xóa tài khoản', 'error');
        }
    },
    
    /**
     * Show users message
     */
    showUsersMessage(message, type = 'info') {
        // Try to use existing message element or create one
        let messageEl = document.getElementById('usersFormMessage');
        if (!messageEl) {
            const usersList = document.getElementById('usersList');
            if (usersList && usersList.parentElement) {
                messageEl = document.createElement('div');
                messageEl.id = 'usersFormMessage';
                messageEl.className = 'admin-form__message';
                usersList.parentElement.insertBefore(messageEl, usersList);
            } else {
                console.log(message);
                return;
            }
        }
        
        messageEl.textContent = message;
        messageEl.className = `admin-form__message admin-form__message--${type}`;
        messageEl.style.display = 'block';
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    },

    // ============================================
    // ALBUM MANAGEMENT
    // ============================================
    
    STORAGE_KEY_ALBUMS: 'musicstream_albums',
    
    /**
     * Initialize album management
     */
    initAlbums() {
        this.loadAlbums();
        this.setupAlbumForm();
    },
    
    /**
     * Get all albums from localStorage
     */
    getAlbums() {
        try {
            const albums = localStorage.getItem(this.STORAGE_KEY_ALBUMS);
            return albums ? JSON.parse(albums) : [];
        } catch (e) {
            console.error('Error loading albums:', e);
            return [];
        }
    },
    
    /**
     * Save albums to localStorage
     */
    saveAlbums(albums) {
        try {
            localStorage.setItem(this.STORAGE_KEY_ALBUMS, JSON.stringify(albums));
            return true;
        } catch (e) {
            console.error('Error saving albums:', e);
            return false;
        }
    },
    
    /**
     * Setup album form
     */
    setupAlbumForm() {
        const form = document.getElementById('albumForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAlbumSubmit(form);
        });
    },
    
    /**
     * Handle album form submission
     */
    handleAlbumSubmit(form) {
        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const artist = formData.get('artist').trim();
        const image = formData.get('image').trim();
        const year = formData.get('year') ? parseInt(formData.get('year')) : null;
        const description = formData.get('description').trim();
        
        // Validate
        if (!name || !artist || !image) {
            this.showAlbumMessage('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            return;
        }
        
        const albums = this.getAlbums();
        
        // Generate new ID
        const maxId = albums.length > 0 ? Math.max(...albums.map(a => a.id || 0)) : 0;
        const newId = maxId + 1;
        
        const newAlbum = {
            id: newId,
            name: name,
            artist: artist,
            image: image,
            year: year,
            description: description || '',
            songs: [] // Array to store song IDs
        };
        
        albums.push(newAlbum);
        
        if (this.saveAlbums(albums)) {
            this.showAlbumMessage('Tạo album thành công!', 'success');
            form.reset();
            this.loadAlbums();
        } else {
            this.showAlbumMessage('Có lỗi xảy ra khi lưu album', 'error');
        }
    },
    
    /**
     * Load and display albums
     */
    loadAlbums() {
        const albums = this.getAlbums();
        const albumsList = document.getElementById('albumsList');
        const albumsCount = document.getElementById('albumsCount');
        
        if (!albumsList) return;
        
        // Update count
        if (albumsCount) {
            albumsCount.textContent = `(${albums.length})`;
        }
        
        // Clear list
        albumsList.innerHTML = '';
        
        if (albums.length === 0) {
            albumsList.innerHTML = `
                <div class="admin-empty">
                    <i class="fas fa-compact-disc"></i>
                    <p>Chưa có album nào được tạo</p>
                    <small>Hãy tạo album mới bằng form phía trên</small>
                </div>
            `;
            return;
        }
        
        // Render albums
        albums.forEach(album => {
            const albumCard = this.createAlbumCard(album);
            albumsList.appendChild(albumCard);
        });
    },
    
    /**
     * Create album card element
     */
    createAlbumCard(album) {
        const card = document.createElement('div');
        card.className = 'admin-album-card';
        card.dataset.albumId = album.id;
        
        const songsCount = album.songs ? album.songs.length : 0;
        
        card.innerHTML = `
            <div class="admin-album-card__image" style="background-image: url('${album.image}');">
                <div class="admin-album-card__overlay">
                    <button class="admin-album-card__btn admin-album-card__btn--add-songs" data-album-id="${album.id}" title="Thêm bài hát">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="admin-album-card__btn admin-album-card__btn--delete" data-album-id="${album.id}" title="Xóa album">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="admin-album-card__info">
                <h3 class="admin-album-card__name">${album.name}</h3>
                <p class="admin-album-card__artist">${album.artist}</p>
                <div class="admin-album-card__meta">
                    ${album.year ? `<span class="admin-album-card__year"><i class="fas fa-calendar"></i> ${album.year}</span>` : ''}
                    <span class="admin-album-card__songs-count">
                        <i class="fas fa-music"></i>
                        ${songsCount} bài hát
                    </span>
                </div>
                ${album.description ? `<p class="admin-album-card__description">${album.description}</p>` : ''}
            </div>
        `;
        
        // Add event handlers
        const addSongsBtn = card.querySelector('.admin-album-card__btn--add-songs');
        const deleteBtn = card.querySelector('.admin-album-card__btn--delete');
        
        if (addSongsBtn) {
            addSongsBtn.addEventListener('click', () => {
                this.showAddSongsModal(album);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.handleDeleteAlbum(album.id);
            });
        }
        
        return card;
    },
    
    /**
     * Show modal to add songs to album
     */
    showAddSongsModal(album) {
        // Get all available songs
        const allSongs = [];
        
        // Get songs from main data
        if (window.songsData && window.songsData.length > 0) {
            allSongs.push(...window.songsData);
        }
        
        // Get admin songs
        const adminSongs = this.getAdminSongs();
        allSongs.push(...adminSongs);
        
        // Remove duplicates by ID
        const uniqueSongs = [];
        const seenIds = new Set();
        allSongs.forEach(song => {
            if (!seenIds.has(song.id)) {
                seenIds.add(song.id);
                uniqueSongs.push(song);
            }
        });
        
        // Filter songs that match album artist (optional, can be removed)
        const matchingSongs = uniqueSongs.filter(song => 
            song.artist && album.artist && 
            song.artist.toLowerCase().includes(album.artist.toLowerCase())
        );
        
        // Use matching songs if available, otherwise use all songs
        const songsToShow = matchingSongs.length > 0 ? matchingSongs : uniqueSongs;
        
        if (songsToShow.length === 0) {
            this.showAlbumMessage('Không có bài hát nào trong hệ thống', 'error');
            return;
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.innerHTML = `
            <div class="admin-modal__overlay"></div>
            <div class="admin-modal__content">
                <div class="admin-modal__header">
                    <h3 class="admin-modal__title">
                        <i class="fas fa-music"></i>
                        Thêm bài hát vào "${album.name}"
                    </h3>
                    <button class="admin-modal__close" id="closeAddSongsModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="admin-modal__body">
                    <div class="admin-modal__search">
                        <input type="text" class="admin-modal__search-input" id="albumSongSearch" placeholder="Tìm kiếm bài hát...">
                    </div>
                    <div class="admin-modal__songs-list" id="albumSongsList">
                        ${this.renderSongsForAlbum(songsToShow, album)}
                    </div>
                </div>
                <div class="admin-modal__footer">
                    <button class="btn btn--primary" id="saveAlbumSongsBtn">
                        <i class="fas fa-save"></i>
                        Lưu thay đổi
                    </button>
                    <button class="btn btn--secondary" id="cancelAddSongsModal">
                        Hủy
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup search
        const searchInput = modal.querySelector('#albumSongSearch');
        const songsList = modal.querySelector('#albumSongsList');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = songsToShow.filter(song => 
                song.name.toLowerCase().includes(query) || 
                song.title.toLowerCase().includes(query) ||
                (song.artist && song.artist.toLowerCase().includes(query))
            );
            songsList.innerHTML = this.renderSongsForAlbum(filtered, album);
            this.setupSongCheckboxes(album);
        });
        
        // Setup checkboxes
        this.setupSongCheckboxes(album);
        
        // Close modal handlers
        const closeBtn = modal.querySelector('#closeAddSongsModal');
        const cancelBtn = modal.querySelector('#cancelAddSongsModal');
        const overlay = modal.querySelector('.admin-modal__overlay');
        
        const closeModal = () => {
            document.body.removeChild(modal);
        };
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // Save button
        const saveBtn = modal.querySelector('#saveAlbumSongsBtn');
        saveBtn.addEventListener('click', () => {
            this.saveAlbumSongs(album.id);
            closeModal();
        });
    },
    
    /**
     * Render songs list for album modal
     */
    renderSongsForAlbum(songs, album) {
        const albumSongs = album.songs || [];
        
        if (songs.length === 0) {
            return '<div class="admin-empty">Không có bài hát nào</div>';
        }
        
        return songs.map(song => {
            const isInAlbum = albumSongs.includes(song.id);
            return `
                <div class="admin-modal__song-item">
                    <label class="admin-modal__song-checkbox">
                        <input type="checkbox" value="${song.id}" ${isInAlbum ? 'checked' : ''} data-song-id="${song.id}">
                        <div class="admin-modal__song-info">
                            <div class="admin-modal__song-name">${song.name || song.title}</div>
                            <div class="admin-modal__song-artist">${song.artist || 'Unknown'}</div>
                        </div>
                    </label>
                </div>
            `;
        }).join('');
    },
    
    /**
     * Setup song checkboxes
     */
    setupSongCheckboxes(album) {
        // Checkboxes are already set up in the HTML
        // This function can be used for additional setup if needed
    },
    
    /**
     * Save songs to album
     */
    saveAlbumSongs(albumId) {
        const checkboxes = document.querySelectorAll('#albumSongsList input[type="checkbox"]:checked');
        const songIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
        
        const albums = this.getAlbums();
        const album = albums.find(a => a.id === albumId);
        
        if (!album) {
            this.showAlbumMessage('Không tìm thấy album', 'error');
            return;
        }
        
        album.songs = songIds;
        
        if (this.saveAlbums(albums)) {
            this.showAlbumMessage(`Đã thêm ${songIds.length} bài hát vào album!`, 'success');
            this.loadAlbums();
        } else {
            this.showAlbumMessage('Có lỗi xảy ra khi lưu album', 'error');
        }
    },
    
    /**
     * Handle delete album
     */
    handleDeleteAlbum(albumId) {
        if (!confirm('Bạn có chắc chắn muốn xóa album này? Hành động này không thể hoàn tác.')) {
            return;
        }
        
        const albums = this.getAlbums();
        const filteredAlbums = albums.filter(a => a.id !== albumId);
        
        if (this.saveAlbums(filteredAlbums)) {
            this.showAlbumMessage('Xóa album thành công!', 'success');
            this.loadAlbums();
        } else {
            this.showAlbumMessage('Có lỗi xảy ra khi xóa album', 'error');
        }
    },
    
    /**
     * Show album message
     */
    showAlbumMessage(message, type = 'info') {
        const messageEl = document.getElementById('albumFormMessage');
        if (!messageEl) return;
        
        messageEl.textContent = message;
        messageEl.className = `admin-form__message admin-form__message--${type}`;
        messageEl.style.display = 'block';
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }
};

// Export to window
window.AdminPage = AdminPage;

// Auto-merge admin songs with main songsData when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.AdminPage) {
        window.AdminPage.mergeWithMainSongs();
    }
});

