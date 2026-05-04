/* ============================================
   MUSICPLAYER.JS — Simple Play/Pause Player
   Plays from 0:40 to 1:40 of the song
   ============================================ */

const MusicPlayer = {
  START_TIME: 40,   // Start at 40 seconds
  END_TIME: 100,    // End at 1 minute 40 seconds
  isPlaying: false,

  init() {
    this.audio = document.getElementById('main-audio-player');
    this.playBtn = document.getElementById('btn-play-pause');
    this.progressBar = document.getElementById('progress-bar');
    this.progressContainer = document.getElementById('progress-container');
    this.currentTimeEl = document.getElementById('music-current-time');
    this.durationEl = document.getElementById('music-duration');

    if (!this.audio || !this.playBtn) return;

    // Set start time once audio is ready
    this.audio.addEventListener('loadedmetadata', () => {
      this.audio.currentTime = this.START_TIME;
      this.durationEl.textContent = '1:00';
    });

    this.bindEvents();
  },

  bindEvents() {
    this.playBtn.addEventListener('click', () => this.togglePlay());

    this.audio.addEventListener('timeupdate', () => {
      // Stop at END_TIME
      if (this.audio.currentTime >= this.END_TIME) {
        this.audio.pause();
        this.audio.currentTime = this.START_TIME;
        this.isPlaying = false;
        this.playBtn.innerHTML = '▶';
        this.progressBar.style.width = '0%';
        this.currentTimeEl.textContent = '0:00';
        return;
      }
      this.updateProgress();
    });

    if (this.progressContainer) {
      this.progressContainer.addEventListener('click', (e) => {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.END_TIME - this.START_TIME; // 60 seconds
        const seekTime = this.START_TIME + (clickX / width) * duration;
        this.audio.currentTime = seekTime;
      });
    }
  },

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
      this.playBtn.innerHTML = '▶';
    } else {
      // Make sure we start from the right position
      if (this.audio.currentTime < this.START_TIME || this.audio.currentTime >= this.END_TIME) {
        this.audio.currentTime = this.START_TIME;
      }
      this.audio.play().catch(e => console.log('Audio play failed:', e));
      this.playBtn.innerHTML = '⏸';
    }
    this.isPlaying = !this.isPlaying;
  },

  updateProgress() {
    const elapsed = this.audio.currentTime - this.START_TIME;
    const totalDuration = this.END_TIME - this.START_TIME;
    const progressPercent = Math.max(0, (elapsed / totalDuration) * 100);
    this.progressBar.style.width = `${progressPercent}%`;
    this.currentTimeEl.textContent = this.formatTime(elapsed);
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
