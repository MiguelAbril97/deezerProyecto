<template>
  <div>
    <div v-if="isLoading" class="text-center my-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-if="!isLoading && topSongs.length === 0" class="alert alert-warning">
      No se pudieron cargar las canciones. Por favor, intente más tarde.
    </div>

    <ArtistCarrousel v-if="topArtists.length > 0" :artists="topArtists" />

    <!-- Fila de albums más populares -->
    <h2>Álbumes destacados</h2>
    <div v-if="topAlbum.length > 0" class="row g-4">
      <div v-for="album in topAlbum" :key="album.id" class="col-12 col-md-3">
        <div class="card h-100">
          <img 
            :src="album.cover_medium" 
            class="card-img-top"
            :alt="album.title"
          >
          <div class="card-body">
            <h5 class="card-title text-truncate">{{ album.title }}</h5>
            <p class="card-text text-truncate" v-if="album.artist">
              <a href="#" 
                @click.prevent="navigateToArtist(album.artist.id)" 
                class="text-decoration-none">
                {{ album.artist.name }}
              </a>
            </p>
          </div>
          <div class="card-footer">
            <button 
              @click="navigateToAlbum(album.id)"
              class="btn btn-primary w-100"
            >
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mensaje en caso de que no haya resultados -->
    <p v-else>No hay resultados para mostrar.</p>

    <!-- Grid de canciones -->
    <div v-if="topSongs.length > 0" class="row g-4">
      <div v-for="song in topSongs" :key="song.id" class="col-12 col-md-3">
        <div class="card h-100">
          <img 
            :src="song.album.cover_medium" 
            :alt="`Portada de ${song.album.title}`" 
            class="card-img-top"
          >
          <div class="card-body">
            <h5 class="card-title text-truncate">{{ song.title }}</h5>
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
            <button class="btn btn-primary flex-grow-1" @click="playSong(song)">
              <i :class="isPlaying && currentSong?.id === song.id ? 'fas fa-pause' : 'fas fa-play'"></i>
              {{ isPlaying && currentSong?.id === song.id ? 'Pausar' : 'Reproducir' }}
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFavoritesStore } from '@/stores/favorites'; 
import ArtistCarrousel from '../components/ArtistCarrousel.vue'; // Corregido Carousel
import { usePlayerStore } from '@/stores/playerStore';
import { useRouter } from 'vue-router';

const favoritesStore = useFavoritesStore();
const topArtists = ref([]);
const topSongs = ref([]);
const topAlbum = ref([]);

const playerStore = usePlayerStore();
const router = useRouter();

const isLoading = ref(true);

// Función para obtener datos del chart de Deezer
const fetchTopArtists = async () => {
  try {
    const url = 'http://localhost:8080/https://api.deezer.com/chart/0/artists';
    const response = await fetch(url);
    const data = await response.json();
    console.log('Artists data:', data);
    topArtists.value = data.data.slice(0, 3);
    return topArtists.value;
  } catch (error) {
    console.error('Error in fetchTopArtists:', error);
    topArtists.value = [];
  }
};

const fetchTopSongs = async () => {
  try {
    const url = 'http://localhost:8080/https://api.deezer.com/chart/0/tracks';
    const response = await fetch(url);  
    const data = await response.json();
    topSongs.value = data.data;
    return topSongs.value;
  } catch (error) {
    console.error('Error in fetchTopSongs:', error);
    topSongs.value = [];
  }
};

const fetchTopAlbum = async () => {
  try {
    // Corregir la URL - cambiada de artists a albums
    const url = 'http://localhost:8080/https://api.deezer.com/chart/0/albums';
    console.log('Fetching albums from:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Albums data:', data);

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid albums data format');
    }

    // Validar y filtrar álbumes válidos
    const validAlbums = data.data.filter(album => 
      album && 
      album.id && 
      album.title && 
      album.cover_medium
    );

    console.log(`Found ${validAlbums.length} valid albums`);
    topAlbum.value = validAlbums.slice(0, 9);
    return topAlbum.value;
  } catch (error) {
    console.error('Error in fetchTopAlbum:', error);
    console.error('Error details:', error.message);
    topAlbum.value = [];
  }
};

// Función para verificar favoritos
const isFavorite = (id) => favoritesStore.isFavorite(id);

// Función para alternar favoritos
const toggleFavorite = (song) => {
  if (favoritesStore.isFavorite(song.id)) {
    favoritesStore.removeSong(song.id);
  } else {
    favoritesStore.addSong(song);
  }
};

// Función de reproducción (mantenemos tu implementación existente)
const currentSong = ref(null);
const isPlaying = ref(false);

const playSong = (song) => {
  playerStore.playSong(song);
};

const navigateToArtist = (artistId) => {
  router.push(`/info/artist/${artistId}`);
};

const navigateToAlbum = (albumId) => {
  router.push(`/info/album/${albumId}`);
};

onMounted(async () => {
  console.log('Component mounted');
  isLoading.value = true;
  
  try {
    // Ejecutar las peticiones en orden y loggear resultados
    const artists = await fetchTopArtists();
    console.log('Artists loaded:', artists?.length || 0);
    
    const songs = await fetchTopSongs();
    console.log('Songs loaded:', songs?.length || 0);
    
    const albums = await fetchTopAlbum();
    console.log('Albums loaded:', albums?.length || 0);
    
  } catch (error) {
    console.error('Error in data loading:', error);
  } finally {
    isLoading.value = false;
    console.log('Loading completed. Data status:', {
      artists: topArtists.value.length,
      songs: topSongs.value.length,
      albums: topAlbum.value.length
    });
  }
});
</script>

<style scoped>
.carousel-item img {
  max-height: 400px;
  object-fit: cover;
}

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
  aspect-ratio: 1;  /* Mantiene proporción cuadrada */
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-group-item {
  background-color: transparent;
  padding: 0.5rem;
} 

a {
  color: inherit;
  cursor: pointer;
}

a:hover {
  text-decoration: underline !important;
  opacity: 0.8;
}

/* Eliminar estilos antiguos que ya no necesitamos */
.img-fluid {
  display: none;
}
</style>
