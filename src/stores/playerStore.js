import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const currentSong = ref(null)
  const isPlaying = ref(false)
  const progress = ref(0)
  const volume = ref(1)
  const duration = ref(0)

  function playSong(song) {
    currentSong.value = song
    // Aseguramos que isPlaying se establece a true después de asignar la canción
    setTimeout(() => {
      isPlaying.value = true
    }, 0)
    progress.value = 0
  }

  function togglePlay() {
    isPlaying.value = !isPlaying.value
  }

  function stopSong() {
    isPlaying.value = false
    progress.value = 0
  }

  function updateProgress(newProgress) {
    progress.value = newProgress
  }

  function setVolume(newVolume) {
    volume.value = newVolume
  }

  function setDuration(newDuration) {
    duration.value = newDuration
  }

  return {
    currentSong,
    isPlaying,
    progress,
    volume,
    duration,
    playSong,
    togglePlay,
    stopSong,
    updateProgress,
    setVolume,
    setDuration
  }
})
