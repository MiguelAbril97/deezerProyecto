import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentSong: null,
    isPlaying: false,
    volume: 0.5,
    audio: null
  }),

  actions: {
    initAudio() {
      this.audio = new Audio()
      this.audio.volume = this.volume
    },

    playSong(song) {
      if (!this.audio) this.initAudio()
      
      if (this.currentSong?.id === song.id) {
        this.togglePlay()
        return
      }

      this.currentSong = song
      this.audio.src = song.preview
      this.audio.play()
      this.isPlaying = true
    },

    togglePlay() {
      if (!this.currentSong) return
      
      if (this.isPlaying) {
        this.audio.pause()
      } else {
        this.audio.play()
      }
      this.isPlaying = !this.isPlaying
    },

    setVolume(value) {
      this.volume = value
      if (this.audio) this.audio.volume = value
    }
  }
})
