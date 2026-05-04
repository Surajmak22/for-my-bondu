/* ============================================
   MUSICPLAYER.JS — Custom Central Music Player
   ============================================ */

const MusicPlayer = {
  tracks: [
    {
      title: "Our First Song (Placeholder)",
      audioSrc: "assets/song1.mp3",
      imageSrc: "photos/music player photo to use/IMG_20260504_162103.jpg",
      lyrics: "Every time our eyes meet...<br>I know I found my home."
    },
    {
      title: "Forever Yours (Placeholder)",
      audioSrc: "assets/song2.mp3",
      imageSrc: "photos/music player photo to use/IMG_20260504_162116.jpg",
      lyrics: "You are the best thing...<br>That's ever been mine."
    },
    {
      title: "Endless Love (Placeholder)",
      audioSrc: "assets/song3.mp3",
      imageSrc: "photos/music player photo to use/IMG_20260504_162128.jpg",
      lyrics: "I'll be waiting for you here...<br>Forever and always."
    }
  ],
  currentIndex: 0,
  isPlaying: false,

  init() {
    this.audio = document.getElementById('main-audio-player');
    this.cover = document.getElementById('music-cover');
    this.title = document.getElementById('music-title');
    this.lyrics = document.getElementById('music-lyrics');
    this.playBtn = document.getElementById('btn-play-pause');
    this.prevBtn = document.getElementById('btn-prev');
    this.nextBtn = document.getElementById('btn-next');
    this.progressBar = document.getElementById('progress-bar');
    this.progressContainer = document.getElementById('progress-container');
    this.currentTimeEl = document.getElementById('music-current-time');
    this.durationEl = document.getElementById('music-duration');

    if (!this.audio) return;

    this.loadTrack(this.currentIndex);
    this.bindEvents();
  },

  loadTrack(index) {
    const track = this.tracks[index];
    this.title.textContent = track.title;
    this.cover.src = track.imageSrc;
    this.lyrics.innerHTML = `<p>${track.lyrics}</p>`;
    this.audio.src = track.audioSrc;
    this.audio.load();
    
    // Reset progress
    this.progressBar.style.width = '0%';
    this.currentTimeEl.textContent = '0:00';
  },

  bindEvents() {
    this.playBtn.addEventListener('click', () => this.togglePlay());
    this.prevBtn.addEventListener('click', () => this.prevTrack());
    this.nextBtn.addEventListener('click', () => this.nextTrack());

    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('loadedmetadata', () => {
      this.durationEl.textContent = this.formatTime(this.audio.duration);
    });
    this.audio.addEventListener('ended', () => this.nextTrack());

    this.progressContainer.addEventListener('click', (e) => {
      const width = this.progressContainer.clientWidth;
      const clickX = e.offsetX;
      const duration = this.audio.duration;
      this.audio.currentTime = (clickX / width) * duration;
    });
  },

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
      this.playBtn.innerHTML = '▶';
    } else {
      this.audio.play().catch(e => console.log('Audio play failed (maybe missing file):', e));
      this.playBtn.innerHTML = '⏸';
    }
    this.isPlaying = !this.isPlaying;
  },

  prevTrack() {
    this.currentIndex--;
    if (this.currentIndex < 0) this.currentIndex = this.tracks.length - 1;
    this.loadTrack(this.currentIndex);
    if (this.isPlaying) this.audio.play().catch(e => {});
  },

  nextTrack() {
    this.currentIndex++;
    if (this.currentIndex > this.tracks.length - 1) this.currentIndex = 0;
    this.loadTrack(this.currentIndex);
    
    // Auto play when switching track
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.playBtn.innerHTML = '⏸';
    }
    this.audio.play().catch(e => {});
  },

  updateProgress() {
    if (isNaN(this.audio.duration)) return;
    const current = this.audio.currentTime;
    const duration = this.audio.duration;
    const progressPercent = (current / duration) * 100;
    this.progressBar.style.width = `${progressPercent}%`;
    this.currentTimeEl.textContent = this.formatTime(current);
  },

  formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MusicPlayer.init();
});
