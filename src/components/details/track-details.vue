<template>
  <div class="track-details">
    <div class="header-section">
      <img :src="track.album?.cover_xl" :alt="track.title" class="cover-image">
      <div class="main-info">
        <h1>{{ track.title }}</h1>
        <p>
            <a href="#" 
              @click.prevent="navigateToArtist(track.artist.id)" 
              class="text-decoration-none">
              {{ track.artist?.name }}
            </a>
        </p>
        <p>
            <a href="#" 
              @click.prevent="navigateToAlbum(track.album.id)" 
              class="text-decoration-none">
              {{ track.album?.title }}
            </a>
        </p>
        <div class="stats">
          <span><i class="fas fa-play"></i> {{ track.rank }}</span>
          <span><i class="fas fa-clock"></i> {{ formatDuration(track.duration) }}</span>
        </div>
        <button @click="playSong" class="play-button">
          <i class="fas fa-play"></i> 
          {{ playerStore.isPlaying && playerStore.currentSong?.id === track.id ? 'Pausar' : 'Reproducir' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useFavoritesStore } from '../../stores/favorites';
import { usePlayerStore } from '../../stores/playerStore';
import { useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)
const track = ref([])
const playerStore = usePlayerStore()
const favoritesStore = useFavoritesStore()


const navigateToArtist = (artistId) => {
  router.push(`/info/artist/${artistId}`);
};

const navigateToAlbum = (albumId) => {
  router.push(`/info/album/${albumId}`);
};

const fetchTrack = async () => {
  try {
    const url = 'http://localhost:8080/https://api.deezer.com/track/'+id.value;
    console.log(url)
    const response = await fetch(url);  
    const data = await response.json();
    track.value = data;
    return track.value;
  } catch (error) {
    console.error('Error in fetchAlbums:', error);
  }
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const playSong = () => {
  playerStore.playSong(track.value);
};

onMounted(() => {
  fetchTrack();
});
</script>

<style scoped>
.track-details {
  padding: 2rem;
}

.header-section {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.cover-image {
  width: 400px;
  height: 400px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  border-radius: 8px;
}

.main-info {
  flex: 1;
}

.stats {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.play-button {
  background: #1db954;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.play-button:hover {
  background: #1ed760;
  transform: scale(1.05);
}

.play-button i {
  font-size: 1.2rem;
}
</style>
