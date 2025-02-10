<template>
    <div>
      <h1>Playlists</h1>
      <p>Gestiona tus playlists aquí.</p>
    </div>
  <!-- Integrar el componente Pinia -->
  <div v-if="playlist.length > 0" class="playlist">
    <transition-group name="fade" tag="div">
      <div v-for="song in playlist" :key="song.id" class="song-item">
        <img :src="song.album.cover" alt="Portada del álbum" class="album-cover" />
        <div class="song-info">
          <h3>{{ song.title }}</h3>
          <p>{{ song.artist.name }}</p>
        </div>
        <div class="song-actions">
          <button class="deleteBtn" @click="removeFromFavorites(song.id)">Eliminar</button>
          <button @click="playSong(song)">
            <i class="fas fa-play"></i> Reproducir
          </button>
        </div>
      </div>
    </transition-group>
    </div>
    <p v-else>No hay canciones en tu lista de favoritos.</p>  
  </template>
  
  <script setup>
  // Accede a la store
import { useFavoritesStore } from '@/stores/favorites'; 
import { usePlayerStore } from '@/stores/playerStore';
import { computed } from 'vue';
// Vincula datos de la store
const favoritesStore = useFavoritesStore();
const playerStore = usePlayerStore();
//const playlist = ref(favoritesStore.playlist);
/*
No funcionará porque favoritesStore.favorites es array reactivo manejado internamente por Pinia. Al envolverlo en un ref, estás creando una nueva referencia que no se sincronizará automáticamente con el estado del Store.
Para resolver esto, usa una propiedad computada en lugar de asignar directamente el estado. De esta forma, la propiedad computada se actualizará automáticamente cuando cambie el estado del Store y los componentes que la utilicen se volverán a renderizar.
*/ 
const playlist = computed(() => favoritesStore.playlist);

const removeFromFavorites = (songId) => {
  favoritesStore.removeSong(songId);
};

const playSong = (song) => {
  playerStore.playSong(song);
};

  </script>
  
  <style scoped>
  h1 {
    color: #28a745;
  }
  .playlist {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.song-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 8px 16px;
  width: 100%;
  box-sizing: border-box;
}
.album-cover {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  margin-right: 16px;
}
.song-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.song-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
button:hover {
  background-color: #0056b3;
}
.deleteBtn {
  background-color: #dc3545;
}
/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
  </style>