// stores/favorites.js
import { defineStore } from 'pinia';

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    playlist: [], // Lista de canciones favoritas
  }),
  getters: {
    // Devuelve true si la canción ya está en favoritos
    isFavorite: (state) => (id) => {
      return state.playlist.some((song) => song.id === id);
    },
  },
  actions: {
    // Añade una canción a favoritos
    addSong(song) {
      if (!this.isFavorite(song.id)) {
        this.playlist.push(song);
      }
    },
    // Elimina una canción de favoritos
    removeSong(songId) {
      this.playlist = this.playlist.filter((song) => song.id !== songId);
    },
  },
});
