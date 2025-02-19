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
      <div class="player-content">
        <!-- Sección izquierda con imagen y detalles -->
        <div class="song-details">
          <img 
            :src="playerStore.currentSong.album.cover_small" 
            :alt="playerStore.currentSong.title"
            class="song-cover"
          >
          <div class="song-info">
            <div class="fw-bold">{{ playerStore.currentSong.title }}</div>
            <div class="text-muted">{{ playerStore.currentSong.artist.name }}</div>
          </div>
        </div>

        <!-- Sección central con controles -->
        <div class="player-controls">
          <div class="controls-buttons">
            <button class="control-btn" @click="togglePlay">
              <i :class="playerStore.isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
            </button>
            <button class="control-btn" @click="stop">
              <i class="fas fa-stop"></i>
            </button>
          </div>
          <div class="progress-container">
            <div class="progress">
              <div 
                class="progress-bar" 
                :style="{ width: playerStore.progress + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Sección derecha con volumen -->
        <div class="volume-control">
          <i class="fas fa-volume-up"></i>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            v-model="playerStore.volume"
            @input="updateVolume"
            class="volume-slider"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '../stores/playerStore'
import { ref, watch, onMounted } from 'vue'

const playerStore = usePlayerStore()
const audioPlayer = ref(null)

// Añadir watcher para currentSong
watch(
  () => playerStore.currentSong,
  async (newSong) => {
    if (newSong && audioPlayer.value) {
      // Esperar a que el audio esté listo
      await audioPlayer.value.load()
      if (playerStore.isPlaying) {
        try {
          await audioPlayer.value.play()
        } catch (error) {
          console.error('Error playing audio:', error)
        }
      }
    }
  },
  { immediate: true }
)

// Modificar el watcher de isPlaying
watch(
  () => playerStore.isPlaying,
  async (newValue) => {
    if (audioPlayer.value) {
      if (newValue) {
        try {
          await audioPlayer.value.play()
        } catch (error) {
          console.error('Error playing audio:', error)
        }
      } else {
        audioPlayer.value.pause()
      }
    }
  }
)

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
  box-shadow: 0 -0.125rem 0.625rem rgba(0,0,0,0.1);
}

.player-content {
  display: grid;
  grid-template-columns: 25% 50% 25%;
  align-items: center;
  gap: 2rem;
}

.song-details {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.song-cover {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 0.25rem;
}

.song-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.player-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.controls-buttons {
  display: flex;
  gap: 1rem;
}

.control-btn {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #0056b3;
}

.progress-container {
  width: 100%;
}

.progress {
  height: 0.25rem;
  background: #e9ecef;
  border-radius: 0.125rem;
  overflow: hidden;
}

.progress-bar {
  background: #007bff;
  height: 100%;
  transition: width 0.1s linear;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: flex-end;
}

.volume-slider {
  width: 7.5rem;
}
</style>
