import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const currentSong = ref(null)
  const isPlaying = ref(false)
  const progress = ref(0)
  const volume = ref(1)
  const duration = ref(0)

  function playSong(song) {
    if (currentSong.value?.id === song.id) {
      isPlaying.value = true
      return
    }
    currentSong.value = song
    isPlaying.value = true
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
