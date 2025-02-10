<template>
  <div class="info-container" v-if="item">
    <div class="loading" v-if="loading">Cargando...</div>
    
    <!-- Información de Canción -->
    <div v-if="type === 'track'" class="track-info">
      <div class="header-section">
        <img :src="item.album?.cover_medium" :alt="item.title" class="cover-image">
        <div class="main-info">
          <h1>{{ item.title }}</h1>
          <h2>{{ item.artist?.name }}</h2>
          <p>Álbum: {{ item.album?.title }}</p>
          <div class="stats">
            <span><i class="fas fa-play"></i> {{ item.rank }}</span>
            <span><i class="fas fa-clock"></i> {{ formatDuration(item.duration) }}</span>
          </div>
          <audio v-if="item.preview" controls :src="item.preview"></audio>
          <button @click="playSong(item)" class="play-button">
            <i class="fas fa-play"></i> Reproducir
          </button>
        </div>
      </div>
    </div>

    <!-- Información de Artista -->
    <div v-if="type === 'artist'" class="artist-info">
      <div class="header-section">
        <img :src="item.picture_medium" :alt="item.name" class="cover-image">
        <div class="main-info">
          <h1>{{ item.name }}</h1>
          <div class="stats">
            <span><i class="fas fa-users"></i> {{ item.nb_fan }} fans</span>
            <span><i class="fas fa-album"></i> {{ item.nb_album }} álbumes</span>
          </div>
        </div>
      </div>
      <div class="top-tracks" v-if="item.topTracks">
        <h3>Canciones Populares</h3>
        <ul>
          <li v-for="track in item.topTracks" :key="track.id">
            {{ track.title }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Información de Álbum -->
    <div v-if="type === 'album'" class="album-info">
      <div class="header-section">
        <img :src="item.cover_medium" :alt="item.title" class="cover-image">
        <div class="main-info">
          <h1>{{ item.title }}</h1>
          <h2>{{ item.artist?.name }}</h2>
          <div class="stats">
            <span><i class="fas fa-calendar"></i> {{ new Date(item.release_date).getFullYear() }}</span>
            <span><i class="fas fa-music"></i> {{ item.nb_tracks }} canciones</span>
          </div>
        </div>
      </div>
      <div class="tracklist" v-if="item.tracks">
        <h3>Lista de canciones</h3>
        <ol>
          <li v-for="track in item.tracks.data" :key="track.id">
            {{ track.title }} - {{ formatDuration(track.duration) }}
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePlayerStore } from '../stores/playerStore';

const route = useRoute();
const item = ref(null);
const loading = ref(true);
const type = ref('');

const playerStore = usePlayerStore();

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const fetchInfo = async () => {
  loading.value = true;
  try {
    const { id, type: itemType } = route.params;
    type.value = itemType;
    
    const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/${itemType}/${id}`);
    if (!response.ok) throw new Error('Error fetching data');
    
    const data = await response.json();
    item.value = data;

    // Fetch additional data for artists
    if (itemType === 'artist') {
      const tracksResponse = await fetch(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/${id}/top`);
      if (tracksResponse.ok) {
        const tracksData = await tracksResponse.json();
        item.value.topTracks = tracksData.data;
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

const playSong = (song) => {
  playerStore.playSong(song);
};

onMounted(fetchInfo);
</script>

<style scoped>
.info-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.cover-image {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.main-info {
  flex: 1;
}

.stats {
  display: flex;
  gap: 20px;
  margin: 15px 0;
}

.stats span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.tracklist, .top-tracks {
  margin-top: 30px;
}

audio {
  width: 100%;
  margin-top: 15px;
}

.loading {
  text-align: center;
  padding: 20px;
}
</style>
