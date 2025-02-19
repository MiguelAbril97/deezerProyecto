<template>
  <div class="container">
    <h1>Buscador</h1>
    <SearchBar @results="handleSearchResults" ref="searchBarRef" />
    <hr />

    <div class="filters my-3">
      <label>
        <input type="checkbox" v-model="sortAscending" aria-label="Ordenar ascendente" />
        Ordenar por nombre (ascendente)
      </label>
      <label>
        Duración mínima:
        <input type="number" v-model="minDuration" placeholder="Ejemplo: 100" aria-label="Filtrar por BPM" />
      </label>
    </div>

    <!-- Lista de canciones -->
    <div v-if="songs.length > 0" class="row g-4">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="song in filteredAndSortedSongs" >
        <div class="card h-100">
          <img 
            :src="song.album.cover_medium" 
            :alt="`Portada de ${song.album.title}`" 
            class="card-img-top"
          >
          <div class="card-body">
            <h5 class="card-title text-truncate">
              <a href="#" @click.prevent="navigateToTrack(song.id)"
              class="text-decoration-none"
              >
                {{ song.title }}
              </a>
            </h5>
            <p class="card-text text-truncate">
              <a href="#" 
                @click.prevent="navigateToArtist(song.artist.id)" 
                class="text-decoration-none">
                {{ song.artist.name }}
              </a>
            </p>
            <p class="card-text text-truncate">
              <a href="#" 
                @click.prevent="navigateToAlbum(song.album.id)" 
                class="text-decoration-none">
                {{ song.album.title }}
              </a>
            </p>
          </div>
          <div class="card-footer d-flex gap-2">
            <button class="btn btn-primary flex-grow-1" @click="togglePlay(song)">
              <i :class="isPlayingId === song.id ? 'fas fa-pause' : 'fas fa-play'"></i>
              {{ isPlayingId === song.id ? 'Pausar' : 'Reproducir' }}
            </button>
            <button 
              @click="toggleFavorite(song)" 
              class="btn"
              :class="isFavorite(song.id) ? 'btn-danger' : 'btn-outline-primary'"
            >
              <i :class="isFavorite(song.id) ? 'fas fa-trash' : 'fas fa-heart'"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <p v-else>No hay resultados para mostrar</p>
    
    <div class="text-center mt-4 mb-4">
      <button 
        v-if="hasMore" 
        @click="loadMore" 
        class="btn btn-primary"
        :disabled="isLoading"
      >
        <span v-if="isLoading">
          <i class="fas fa-spinner fa-spin me-2"></i>Cargando...
        </span>
        <span v-else>
          Más resultados
        </span>
      </button>
      
      <div v-if="!hasMore && songs.length > 0" class="text-muted">
        No hay más resultados
      </div>
    </div>
  </div>
</template>

<script setup>
 import { ref, computed } from "vue";
 import SearchBar from "../components/SearchBar.vue"; // Importa el componente hijo
 import PlayerBar from "../components/PlayerBar.vue";
 import { useFavoritesStore } from '../stores/favorites';
 import { usePlayerStore } from '../stores/playerStore';
 import { useRouter } from 'vue-router';
 

const router = useRouter()
const searchBarRef = ref(null)
const loadingRef = ref(null)
const songs = ref([])
const isLoading = ref(false)
const hasMore = ref(false)
const total = ref(0)
const sortAscending = ref(false); // Controla el orden ascendente o descendente
const minDuration = ref(0); // BPM mínimo para el filtro

const favoritesStore = useFavoritesStore();
const isFavorite = (id) => favoritesStore.isFavorite(id);
  

const navigateToAlbum = (albumId) => {
  router.push({
    name: 'info',
    params: {
      type: 'album',
      id: albumId
    }
  });
};

const navigateToArtist = (artistId) => {
  router.push({
    name: 'info',
    params: {
      type: 'artist',
      id: artistId
    }
  });
};

const navigateToTrack = (trackId) => {
  router.push({
    name: 'info',
    params: {
      type: 'track',
      id: trackId
    }
  });
};

const handleSearchResults = ({ songs: newSongs, isNewSearch, total: newTotal, hasMore: moreAvailable }) => {
  if (isNewSearch) {
    songs.value = newSongs;
  } else {
    songs.value = [...songs.value, ...newSongs];
  }
  hasMore.value = moreAvailable;
  total.value = newTotal;
  isLoading.value = false; // Reset loading state after results are processed
};

const loadMore = async () => {
  if (!isLoading.value && hasMore.value) {
    isLoading.value = true;
    try {
      await searchBarRef.value?.loadMore();
    } catch (error) {
      console.error('Error loading more results:', error);
      isLoading.value = false; // Reset loading state on error
    }
  }
};

const toggleFavorite = (song) => {
  if (favoritesStore.isFavorite(song.id)) {
    favoritesStore.removeSong(song.id);
  } else {
    favoritesStore.addSong(song);
  }
};
// Lista filtrada y ordenada
const filteredAndSortedSongs = computed(() => {
 let result = [...songs.value];

 // Filtrar por BPM mínimo
 if (minDuration.value > 0) {
   result = result.filter(song => song.duration && song.duration >= minDuration.value);
  }
 
 
  // Ordenar por nombre
  if (sortAscending.value) {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    result.sort((a, b) => b.title.localeCompare(a.title));
  }
 
 
  return result;
 });
 
 
 // Maneja los resultados emitidos por el componente hijo

const playerStore = usePlayerStore();

const togglePlay = (song) => {
  if (playerStore.currentSong?.id === song.id) {
    playerStore.togglePlay()
  } else {
    playerStore.playSong(song)
  }
}

// Actualizar las propiedades computadas
const isPlayingId = computed(() => 
  playerStore.isPlaying ? playerStore.currentSong?.id : null
)


 </script>
 
 <style scoped>
.card {
  width: 250px;
  margin: 0 auto;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.card-img-top {
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  object-fit: cover;
}

.card-body {
  padding: 1rem;
}

.card-footer {
  background-color: transparent;
  border-top: 1px solid rgba(0,0,0,.125);
  padding: 1rem;
}

.text-truncate {
  max-width: 100%;
}

a {
  color: inherit;
  cursor: pointer;
}

a:hover {
  text-decoration: underline !important;
  opacity: 0.8;
}

/* Eliminar estilos antiguos */
.audio-controls {
  display: none;
}

.progress {
  display: none;
}

@media (max-width: 576px) {
  .card {
    width: 100%;
    max-width: 300px;
  }
}

@media (min-width: 577px) and (max-width: 768px) {
  .card {
    width: 220px;
  }
}

@media (min-width: 769px) {
  .card {
    width: 250px;
  }
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
}
</style>