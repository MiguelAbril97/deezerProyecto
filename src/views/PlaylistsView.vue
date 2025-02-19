<template>
    <div class="container">
      <h1>Playlists</h1>
      <p>Gestiona tus playlists aquí.</p>
    
    <div v-if="playlist.length > 0" class="playlist row">
      <transition-group name="fade" tag="div" class="col-12">
        <div v-for="song in playlist" :key="song.id" class="song-item">
          <img 
            :src="song.album.cover_medium" 
            alt="Portada del álbum" 
            class="album-cover"
            @click="navigateToAlbum(song.album.id)"
            style="cursor: pointer;"
          />
          <div class="song-info">
            <h3>
              <a href="#" @click.prevent="navigateToTrack(song.id)" class="text-decoration-none">
                {{ song.title }}
              </a>
            </h3>
            <p>
              <a href="#" @click.prevent="navigateToArtist(song.artist.id)" class="text-decoration-none">
                {{ song.artist.name }}
              </a>
            </p>
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
  </div>
</template>

<script setup>
  // Accede a la store
import { useFavoritesStore } from '@/stores/favorites'; 
import { usePlayerStore } from '@/stores/playerStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

// Vincula datos de la store
const favoritesStore = useFavoritesStore();
const playerStore = usePlayerStore();
const router = useRouter();
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

const navigateToAlbum = (albumId) => {
  router.push({ name: 'info', params: { type: 'album', id: albumId }});
};

const navigateToArtist = (artistId) => {
  router.push({ name: 'info', params: { type: 'artist', id: artistId }});
};

const navigateToTrack = (trackId) => {
  router.push({ name: 'info', params: { type: 'track', id: trackId }});
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
  padding: 16px;
  margin: 8px 0;
  width: 100%;
  box-sizing: border-box;
}
.album-cover {
  width: 120px;
  height: 120px;
  border-radius: 4px;
  margin-right: 16px;
  transition: transform 0.2s;
}

.album-cover:hover {
  transform: scale(1.05);
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

@media (max-width: 768px) {
  .song-item {
    flex-direction: column;
    text-align: center;
  }
  
  .album-cover {
    margin-right: 0;
    margin-bottom: 16px;
  }

  .song-actions {
    margin-top: 16px;
  }
}

a {
  color: inherit;
  cursor: pointer;
}

a:hover {
  text-decoration: underline !important;
  opacity: 0.8;
}
</style>