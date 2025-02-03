<template>
  <div>
    <!-- Carrusel de artistas -->
    <h2>Artistas más escuchados</h2>
      <div v-if="topArtists.length > 0" id="artistCarousel" class="carousel slide my-3" data-bs-ride="carousel">
    <div class="carousel-inner">
        <div 
          v-for="(artist, index) in topArtists" 
          :key="artist.id" 
          :class="['carousel-item', { 'active': index === 0 }]"
        >
          <img :src="artist.picture_medium" class="d-block w-100" :alt="artist.name">
          <div class="carousel-caption d-none d-md-block">
            <h5>{{ artist.name }}</h5>
          </div>
        </div>
      </div>
    
      <!-- Controles -->
      <button class="carousel-control-prev" type="button" data-bs-target="#artistCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#artistCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- Fila de radios más populares -->
     <h2>Radios más escuchadas</h2>
    <div v-if="topRadios.length > 0" class="row g-4">
      <div v-for="radio in topRadios" :key="radio.id" class="col-12 col-md-3">
        <div class="card">
          <img 
            :src="radio.picture_small" 
            class="img-fluid rounded mb-3"
          >
          <div class="card-body">
            <h5 class="card-title">{{ radio.title }}</h5>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mensaje en caso de que no haya resultados -->
    <p v-else>No hay resultados para mostrar.</p>

    <!-- Grid de canciones -->
    <div v-if="topSongs.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="song in topSongs" :key="song.id">
        <div class="card text-center">
          <div class="card-body d-flex flex-column align-items-center">
            <h5 v-if="song.title.length > 20" class="card-title">
              {{ song.title.substring(0, 25) + "..." }}
            </h5>
            <h5 v-else class="card-title">{{ song.title }}</h5>

            <img 
              :src="song.album.cover_medium" 
              :alt="`Portada de ${song.album.title}`" 
              class="img-fluid rounded mb-3"
            >

            <ul class="card-text list-group list-group-flush">
              <li class="list-group-item">
                <strong>{{ song.artist.name }}</strong>
              </li>
              <li v-if="song.album.title.length > 20" class="list-group-item">
                {{ song.album.title.substring(0, 20) + "..." }}
              </li>
              <li v-else class="list-group-item">{{ song.album.title }}</li>
            </ul>

            <div class="audio-controls mt-2">
              <button class="btn btn-primary" @click="playSong(song)">
                <i :class="isPlaying && currentSong?.id === song.id ? 'fas fa-pause' : 'fas fa-play'"></i>
              </button>
            </div>
          </div>

          <div class="card-footer">
            <button 
              @click="toggleFavorite(song)" 
              class="btn d-flex align-items-center gap-2"
              :class="isFavorite(song.id) ? 'btn-danger' : 'btn-primary'"
            >
              <i :class="isFavorite(song.id) ? 'fas fa-trash' : 'fas fa-heart'"></i>
              {{ isFavorite(song.id) ? "Eliminar" : " Añadir" }}
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

const favoritesStore = useFavoritesStore();
const topArtists = ref([]);
const topSongs = ref([]);
const topRadios = ref([]);

// Función para obtener datos del chart de Deezer
const fetchTopArtists = async () => {
  try {
    const url = 'https://cors-anywhere.herokuapp.com/https://api.deezer.com/chart/0/artists';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching top artists from Deezer');
    }
    const data = await response.json();
    
    // Asignar los artistas a la variable topArtists
    topArtists.value = data.data.slice(0, 3) || [];
  } catch (error) {
    console.error('Error fetching top artists:', error);
  }
};

const fetchTopSongs = async () => {
  try {
    const url = 'https://cors-anywhere.herokuapp.com/https://api.deezer.com/chart/0/tracks';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching top songs from Deezer');
    }
    const data = await response.json();
    
    // Asignar las canciones a la variable topSongs
    topSongs.value = data.data || [];
  } catch (error) {
    console.error('Error fetching top songs:', error);
  }
};


const fetchTopRadio = async () => {
  try {
    const url = 'https://cors-anywhere.herokuapp.com/https://api.deezer.com/radio/top';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching chart data from Deezer');
    }
    const data = await response.json();

    topRadios.value = data.data.slice(0, 9) || [];
  } catch (error) {
    console.error('Error fetching chart data:', error);
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
  // Implementa tu lógica de reproducción aquí
  if (currentSong.value?.id === song.id) {
    isPlaying.value = !isPlaying.value;
  } else {
    currentSong.value = song;
    isPlaying.value = true;
  }
};

onMounted(() => {
  fetchTopArtists();
  fetchTopSongs();
  fetchTopRadio();
});
</script>

<style scoped>
.carousel-item img {
  max-height: 400px;
  object-fit: cover;
}

.card {
  height: 100%;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.img-fluid {
  max-width: 200px;
  height: auto;
}

.list-group-item {
  background-color: transparent;
  padding: 0.5rem;
} 
</style>
