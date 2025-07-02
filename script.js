// DOM Elements
const loginBtn = document.getElementById('login-btn');
const authModal = document.getElementById('auth-modal');
const tabBtns = document.querySelectorAll('.tab-btn');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const playBtn = document.querySelector('.play-btn');
const progressBar = document.querySelector('.progress');
const volumeBar = document.querySelector('.volume');
const alert = document.getElementById('alert');
const audioPlayer = document.getElementById('audio-player');
const currentTimeDisplay = document.querySelector('.current-time');
const totalTimeDisplay = document.querySelector('.total-time');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const shuffleBtn = document.getElementById('shuffle-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const repeatBtn = document.getElementById('repeat-btn');
const volumeBtn = document.getElementById('volume-btn');

// State
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let isMuted = false;
let currentProgress = 0;
let currentVolume = 70;
let currentTrackIndex = -1;
let playlist = [];
let likedSongs = new Set();

// Add track images data
const trackImages = {
    'Midnight Dreams': 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400&h=400&fit=crop',
    'Electric Emotions': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    'Sunset Boulevard': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    'Crystal Clear': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
    'Digital Daydream': 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop'
};

// Default track image if no image is found
const defaultTrackImage = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop';

// Initialize audio player
audioPlayer.volume = currentVolume / 100;

// Collect all tracks with images
document.querySelectorAll('.track-item').forEach(track => {
    const title = track.querySelector('.track-title').textContent;
    const trackImage = track.querySelector('.track-image');
    
    // Add image to track
    trackImage.innerHTML = `<img src="${trackImages[title] || defaultTrackImage}" alt="${title}">`;
    
    const trackData = {
        url: track.dataset.track,
        title: title,
        artist: track.querySelector('.track-artist').textContent,
        duration: track.querySelector('.track-duration').textContent,
        element: track,
        image: trackImages[title] || defaultTrackImage
    };
    playlist.push(trackData);
});

// Page-specific data
const pageData = {
    explore: {
        genres: [
            { name: 'Pop', icon: '🎵', color: '#ff4081' },
            { name: 'Rock', icon: '🎸', color: '#7c4dff' },
            { name: 'Hip Hop', icon: '🎤', color: '#ff6e40' },
            { name: 'Electronic', icon: '🎹', color: '#18ffff' },
            { name: 'Jazz', icon: '🎷', color: '#ffab40' },
            { name: 'Classical', icon: '🎻', color: '#b388ff' }
        ],
        featured: [
            {
                title: 'Summer Hits 2024',
                description: 'The hottest tracks of the season',
                image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=400&fit=crop'
            },
            {
                title: 'Chill & Relax',
                description: 'Perfect for your relaxation time',
                image: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=400&h=400&fit=crop'
            },
            {
                title: 'Workout Energy',
                description: 'Keep your motivation high',
                image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&h=400&fit=crop'
            }
        ]
    },
    charts: {
        global: [
            { rank: 1, title: 'Dancing in the Moonlight', artist: 'Luna Nova', streams: '2.5M' },
            { rank: 2, title: 'Neon Dreams', artist: 'Electric Wave', streams: '2.1M' },
            { rank: 3, title: 'Summer Breeze', artist: 'Coastal Vibes', streams: '1.8M' },
            { rank: 4, title: 'Midnight City', artist: 'Urban Echo', streams: '1.6M' },
            { rank: 5, title: 'Starlight', artist: 'Galaxy Pulse', streams: '1.4M' }
        ],
        local: [
            { rank: 1, title: 'City Lights', artist: 'Metro Beat', streams: '500K' },
            { rank: 2, title: 'Ocean Waves', artist: 'Beach Harmony', streams: '450K' },
            { rank: 3, title: 'Mountain High', artist: 'Nature Sound', streams: '400K' },
            { rank: 4, title: 'Urban Jungle', artist: 'City Pulse', streams: '350K' },
            { rank: 5, title: 'Desert Wind', artist: 'Sand Storm', streams: '300K' }
        ]
    },
    radio: {
        stations: [
            {
                name: 'Electric Dreams FM',
                genre: 'Electronic',
                listeners: '15K',
                image: 'https://images.unsplash.com/photo-1526328828355-69b01701ca6a?w=400&h=400&fit=crop'
            },
            {
                name: 'Chill Wave Radio',
                genre: 'Lo-fi',
                listeners: '12K',
                image: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=400&h=400&fit=crop'
            },
            {
                name: 'Jazz Café',
                genre: 'Jazz',
                listeners: '8K',
                image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=400&fit=crop'
            }
        ]
    },
    home: {
        forYou: [
            {
                title: 'Daily Mix 1',
                description: 'Based on your recent listening',
                image: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=400&h=400&fit=crop',
                tracks: ['Midnight Dreams', 'Electric Emotions', 'Crystal Clear']
            },
            {
                title: 'Mood Booster',
                description: 'Upbeat tracks to lift your spirits',
                image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop',
                tracks: ['Summer Breeze', 'Dancing in the Moonlight', 'Neon Dreams']
            },
            {
                title: 'Chill Mix',
                description: 'Perfect for relaxation',
                image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop',
                tracks: ['Ocean Waves', 'Mountain High', 'Desert Wind']
            }
        ],
        moodPlaylists: [
            { mood: 'Happy', color: '#FFD700', icon: '😊' },
            { mood: 'Energetic', color: '#FF4500', icon: '⚡' },
            { mood: 'Relaxed', color: '#4169E1', icon: '😌' },
            { mood: 'Focused', color: '#32CD32', icon: '🎯' },
            { mood: 'Romantic', color: '#FF69B4', icon: '💝' },
            { mood: 'Melancholic', color: '#9370DB', icon: '🌙' }
        ]
    }
};


function populatePageContent(pageName) {
    switch(pageName) {
        case 'home':
            populateHomePage();
            break;
        case 'explore':
            populateExplorePage();
            break;
        case 'charts':
            populateChartsPage();
            break;
        case 'radio':
            populateRadioPage();
            break;
    }
}

// Populate Explore page
function populateExplorePage() {
    const explorePage = document.getElementById('explore-page');
    const genresGrid = explorePage.querySelector('.cards-grid');
    genresGrid.innerHTML = pageData.explore.genres.map(genre => `
        <div class="genre-card" style="background-color: ${genre.color}">
            <div class="genre-icon">${genre.icon}</div>
            <h3>${genre.name}</h3>
        </div>
    `).join('');

    const featuredGrid = explorePage.querySelector('.featured-grid');
    if (featuredGrid) {
        featuredGrid.innerHTML = pageData.explore.featured.map(item => `
            <div class="featured-card">
                <img src="${item.image}" alt="${item.title}">
                <div class="featured-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');
    }
}

// Populate Charts page
function populateChartsPage() {
    const chartsPage = document.getElementById('charts-page');
    const globalCharts = chartsPage.querySelector('#global-charts');
    const localCharts = chartsPage.querySelector('#local-charts');

    if (globalCharts) {
        globalCharts.innerHTML = pageData.charts.global.map(track => `
            <div class="chart-track">
                <div class="chart-rank">${track.rank}</div>
                <div class="chart-info">
                    <h3>${track.title}</h3>
                    <p>${track.artist}</p>
                </div>
                <div class="chart-streams">${track.streams}</div>
            </div>
        `).join('');
    }

    if (localCharts) {
        localCharts.innerHTML = pageData.charts.local.map(track => `
            <div class="chart-track">
                <div class="chart-rank">${track.rank}</div>
                <div class="chart-info">
                    <h3>${track.title}</h3>
                    <p>${track.artist}</p>
                </div>
                <div class="chart-streams">${track.streams}</div>
            </div>
        `).join('');
    }
}

// Populate Radio page
function populateRadioPage() {
    const radioPage = document.getElementById('radio-page');
    const stationsGrid = radioPage.querySelector('.cards-grid');
    
    if (stationsGrid) {
        stationsGrid.innerHTML = pageData.radio.stations.map(station => `
            <div class="station-card">
                <img src="${station.image}" alt="${station.name}">
                <div class="station-info">
                    <h3>${station.name}</h3>
                    <p>${station.genre}</p>
                    <span class="listeners">🎧 ${station.listeners} listening</span>
                </div>
                <button class="play-station-btn">▶️</button>
            </div>
        `).join('');
    }
}

// Enhanced navigation event listener
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.dataset.page;
        
        // Remove active class from all links and pages
        navLinks.forEach(l => l.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked link and corresponding page
        link.classList.add('active');
        document.getElementById(`${targetPage}-page`).classList.add('active');
        
        // Populate page content
        populatePageContent(targetPage);
        
        // Update liked songs list when navigating to liked page
        if (targetPage === 'liked') {
            updateLikedSongsList();
        }
    });
});

// Initialize pages on load
document.addEventListener('DOMContentLoaded', () => {
    // Populate initial page content
    populatePageContent('explore');
    populatePageContent('charts');
    populatePageContent('radio');
});

// Auth Modal
loginBtn.addEventListener('click', () => {
    authModal.style.display = 'flex';
});

// Close modal when clicking outside
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (btn.dataset.tab === 'login') {
            loginTab.style.display = 'block';
            signupTab.style.display = 'none';
        } else {
            loginTab.style.display = 'none';
            signupTab.style.display = 'block';
        }
    });
});

// Form submission
document.querySelectorAll('.auth-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const form = btn.closest('.tab-content');
        const inputs = form.querySelectorAll('.form-input');
        const formData = {};
        
        inputs.forEach(input => {
            formData[input.type] = input.value;
        });
        
        // Here you would typically send this data to a server
        console.log('Form submitted:', formData);
        showAlert('Authentication successful!');
        authModal.style.display = 'none';
    });
});

// Music Player Controls
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', playPrevious);
nextBtn.addEventListener('click', playNext);
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);
volumeBtn.addEventListener('click', toggleMute);

// Track selection
document.querySelectorAll('.track-item').forEach((track, index) => {
    track.addEventListener('click', () => {
        currentTrackIndex = index;
        loadAndPlayTrack(playlist[currentTrackIndex]);
    });
});

// Progress bar
document.querySelector('.progress-bar').addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (x / width) * 100;
    const time = (percentage / 100) * audioPlayer.duration;
    audioPlayer.currentTime = time;
});

// Volume control
document.querySelector('.volume-bar').addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    currentVolume = (x / width) * 100;
    updateVolume(currentVolume);
});

// Like button functionality
document.querySelectorAll('.action-btn').forEach(btn => {
    if (btn.textContent === '❤️') {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const trackItem = btn.closest('.track-item');
            const trackTitle = trackItem.querySelector('.track-title').textContent;
            
            if (likedSongs.has(trackTitle)) {
                likedSongs.delete(trackTitle);
                btn.style.color = 'var(--light)';
                showAlert(`Removed "${trackTitle}" from Liked Songs`);
            } else {
                likedSongs.add(trackTitle);
                btn.style.color = 'var(--secondary)';
                showAlert(`Added "${trackTitle}" to Liked Songs`);
            }
            updateLikedSongsList();
        });
    }
});

// Audio player event listeners
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', handleTrackEnd);
audioPlayer.addEventListener('loadedmetadata', () => {
    totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
});

// Functions
function togglePlay() {
    if (currentTrackIndex === -1 && playlist.length > 0) {
        currentTrackIndex = 0;
        loadAndPlayTrack(playlist[currentTrackIndex]);
    } else if (audioPlayer.src) {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        isPlaying = !isPlaying;
        playBtn.innerHTML = isPlaying ? '⏸️' : '▶️';
    }
}

function loadAndPlayTrack(track) {
    audioPlayer.src = track.url;
    audioPlayer.play();
    isPlaying = true;
    playBtn.innerHTML = '⏸️';
    updateNowPlaying(track);
    showAlert(`Now playing: ${track.title} by ${track.artist}`);
    
    // Update active track in UI
    document.querySelectorAll('.track-item').forEach(item => {
        item.classList.remove('active');
    });
    track.element.classList.add('active');
    
    // Update now playing image
    document.querySelector('.now-playing-image').innerHTML = `
        <img src="${track.image}" alt="${track.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
    `;
}

function playNext() {
    if (playlist.length === 0) return;
    
    if (isShuffle) {
        currentTrackIndex = Math.floor(Math.random() * playlist.length);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    }
    
    loadAndPlayTrack(playlist[currentTrackIndex]);
}

function playPrevious() {
    if (playlist.length === 0) return;
    
    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
    } else {
        currentTrackIndex = currentTrackIndex <= 0 ? playlist.length - 1 : currentTrackIndex - 1;
        loadAndPlayTrack(playlist[currentTrackIndex]);
    }
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.style.color = isShuffle ? 'var(--secondary)' : 'var(--light)';
    showAlert(isShuffle ? 'Shuffle: On' : 'Shuffle: Off');
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.style.color = isRepeat ? 'var(--secondary)' : 'var(--light)';
    showAlert(isRepeat ? 'Repeat: On' : 'Repeat: Off');
}

function toggleMute() {
    isMuted = !isMuted;
    audioPlayer.muted = isMuted;
    volumeBtn.textContent = isMuted ? '🔇' : '🔊';
    showAlert(isMuted ? 'Muted' : 'Unmuted');
}

function updateProgress() {
    const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${percentage}%`;
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
}

function updateVolume(volume) {
    currentVolume = volume;
    audioPlayer.volume = volume / 100;
    volumeBar.style.width = `${volume}%`;
    showAlert(`Volume: ${Math.round(volume)}%`);
}

function handleTrackEnd() {
    if (isRepeat) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        playNext();
    }
}

function updateNowPlaying(track) {
    document.querySelector('.now-playing-title').textContent = track.title;
    document.querySelector('.now-playing-artist').textContent = track.artist;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function showAlert(message) {
    alert.querySelector('span').textContent = message;
    alert.classList.add('show');
    setTimeout(() => {
        alert.classList.remove('show');
    }, 3000);
}

// Search functionality
const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const tracks = document.querySelectorAll('.track-item');
    
    tracks.forEach(track => {
        const title = track.querySelector('.track-title').textContent.toLowerCase();
        const artist = track.querySelector('.track-artist').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || artist.includes(searchTerm)) {
            track.style.display = 'flex';
        } else {
            track.style.display = 'none';
        }
    });
});

// Update liked songs list
function updateLikedSongsList() {
    const likedSongsList = document.getElementById('liked-songs-list');
    likedSongsList.innerHTML = '';
    
    if (likedSongs.size === 0) {
        likedSongsList.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px;">
                <p style="color: rgba(255,255,255,0.6);">No liked songs yet. Start liking some tracks!</p>
            </div>
        `;
        return;
    }
    
    playlist.forEach((track, index) => {
        if (likedSongs.has(track.title)) {
            const trackElement = document.createElement('div');
            trackElement.className = 'track-item';
            trackElement.dataset.track = track.url;
            trackElement.innerHTML = `
                <div class="track-number">${index + 1}</div>
                <div class="track-image">
                    <img src="${track.image}" alt="${track.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="track-info">
                    <h3 class="track-title">${track.title}</h3>
                    <p class="track-artist">${track.artist}</p>
                </div>
                <div class="track-duration">${track.duration}</div>
                <div class="track-actions">
                    <button class="action-btn" style="color: var(--secondary);">❤️</button>
                    <button class="action-btn">➕</button>
                    <button class="action-btn">🔄</button>
                </div>
            `;
            
            // Add click event to play the track
            trackElement.addEventListener('click', () => {
                currentTrackIndex = index;
                loadAndPlayTrack(track);
            });
            
            // Add like button functionality
            const likeBtn = trackElement.querySelector('.action-btn');
            likeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                likedSongs.delete(track.title);
                showAlert(`Removed "${track.title}" from Liked Songs`);
                updateLikedSongsList();
            });
            
            likedSongsList.appendChild(trackElement);
        }
    });
}

// Add visual feedback for track progress
audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    document.documentElement.style.setProperty('--playback-progress', `${progress}%`);
});

// Add smooth transitions for player controls
function addButtonAnimation(button) {
    button.addEventListener('click', () => {
        button.classList.add('clicked');
        setTimeout(() => button.classList.remove('clicked'), 200);
    });
}

[playBtn, prevBtn, nextBtn, shuffleBtn, repeatBtn].forEach(addButtonAnimation);

// Initialize with empty now playing image
document.querySelector('.now-playing-image').innerHTML = `
    <img src="${defaultTrackImage}" alt="Select a track" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
`;

// Initialize liked songs list
updateLikedSongsList();

// Add new function to populate home page content
function populateHomePage() {
    const homePage = document.getElementById('home-page');
    
    // Add For You section
    const forYouSection = homePage.querySelector('.for-you-section .cards-grid');
    if (forYouSection) {
        forYouSection.innerHTML = pageData.home.forYou.map(mix => `
            <div class="mix-card" data-mix="${mix.title}">
                <div class="mix-image">
                    <img src="${mix.image}" alt="${mix.title}">
                    <button class="play-mix-btn">▶️</button>
                </div>
                <div class="mix-content">
                    <h3>${mix.title}</h3>
                    <p>${mix.description}</p>
                </div>
            </div>
        `).join('');

        // Add click handlers for mix cards
        forYouSection.querySelectorAll('.mix-card').forEach(card => {
            card.addEventListener('click', () => {
                const mix = pageData.home.forYou.find(m => m.title === card.dataset.mix);
                if (mix) {
                    // Find tracks from the mix in the main playlist
                    const mixTracks = playlist.filter(track => mix.tracks.includes(track.title));
                    if (mixTracks.length > 0) {
                        currentTrackIndex = playlist.indexOf(mixTracks[0]);
                        loadAndPlayTrack(mixTracks[0]);
                    }
                }
            });
        });
    }

    // Add Mood Playlists section
    const moodSection = homePage.querySelector('.mood-section .mood-grid');
    if (moodSection) {
        moodSection.innerHTML = pageData.home.moodPlaylists.map(mood => `
            <div class="mood-card" style="background: ${mood.color}">
                <div class="mood-icon">${mood.icon}</div>
                <h3>${mood.mood}</h3>
            </div>
        `).join('');

        // Add hover effects for mood cards
        moodSection.querySelectorAll('.mood-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05) rotate(5deg)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }
}