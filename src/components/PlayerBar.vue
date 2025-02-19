<template>
  <div v-if="playerStore.currentSong" class="player-bar">
    <audio
      ref="audioPlayer"
      :src="playerStore.currentSong.preview"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @loadedmetadata="onLoadedMetadata"
    ></audio>
    <div class="container">
      <div class="d-flex align-items-center justify-content-between py-2">
        <div class="d-flex align-items-center gap-3">
          <img 
            :src="playerStore.currentSong.album.cover_small" 
            :alt="playerStore.currentSong.title"
            class="rounded"
            width="40"
          >
          <div class="song-info">
            <div class="fw-bold">{{ playerStore.currentSong.title }}</div>
            <div class="small text-muted">{{ playerStore.currentSong.artist.name }}</div>
          </div>
        </div>

        <div class="player-controls d-flex flex-column align-items-center">
          <div class="btn-group">
            <button class="btn btn-sm btn-primary" @click="togglePlay">
              <i :class="playerStore.isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
            </button>
            <button class="btn btn-sm btn-secondary" @click="stop">
              <i class="fas fa-stop"></i>
            </button>
          </div>
          <div class="progress w-100 mt-2" style="height: 4px;">
            <div 
              class="progress-bar" 
              :style="{ width: playerStore.progress + '%' }"
            ></div>
          </div>
        </div>

        <div class="volume-control d-flex align-items-center gap-2">
          <i class="fas fa-volume-up"></i>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            v-model="playerStore.volume"
            @input="updateVolume"
            class="form-range"
            style="width: 100px;"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '../stores/playerStore'
import { ref, watch } from 'vue'

const playerStore = usePlayerStore()
const audioPlayer = ref(null)

// Manejar cambios en el estado de reproducción
watch(() => playerStore.isPlaying, (newValue) => {
  if (newValue) {
    audioPlayer.value?.play()
  } else {
    audioPlayer.value?.pause()
  }
})

// Manejar cambios en el volumen
watch(() => playerStore.volume, (newValue) => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = newValue
  }
})

// Manejar cambios en la canción actual
watch(() => playerStore.currentSong, () => {
  if (playerStore.isPlaying) {
    audioPlayer.value?.play()
  }
})

const togglePlay = () => {
  playerStore.togglePlay()
}

const stop = () => {
  playerStore.stopSong()
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = 0
    audioPlayer.value.pause()
  }
}

const onTimeUpdate = () => {
  if (audioPlayer.value) {
    const progress = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100
    playerStore.updateProgress(progress)
  }
}

const onEnded = () => {
  playerStore.stopSong()
}

const onLoadedMetadata = () => {
  if (audioPlayer.value) {
    playerStore.setDuration(audioPlayer.value.duration)
  }
}

const updateVolume = () => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = playerStore.volume
  }
}
</script>

<style scoped>
.player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 1rem;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.song-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.song-info img {
  width: 50px;
  height: 50px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.play-btn, .stop-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
}

.play-btn:hover, .stop-btn:hover {
  background: rgba(0,0,0,0.1);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-control input[type="range"] {
  width: 100px;
}
</style>
