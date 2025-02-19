<template>
  <div class="album-details">
    <div class="header-section">
      <img :src="album.cover_medium" :alt="album.title" class="cover-image">
      <div class="main-info">
        <h1>{{ album.title }}</h1>
        <h2><a href="#" @click.prevent="navigateToArtist(album.artist.name)">{{ album.artist?.name }}</a></h2>
        <div class="stats">
          <span><i class="fas fa-calendar"></i> {{ new Date(album.release_date).getFullYear() }}</span>
          <span><i class="fas fa-music"></i> {{ album.nb_tracks }} canciones</span>
        </div>
      </div>
    </div>
    <div class="tracklist" v-if="album.tracks">
      <h3>Lista de canciones</h3>
      <ol>
        <li v-for="track in album.tracks.data" :key="track.id" class="track-item">
          <button @click="playTrack(track)" class="play-btn">
            <i :class="isCurrentTrack(track) ? 'fas fa-pause' : 'fas fa-play'"></i>
          </button>
          <button 
            @click="toggleFavorite(track)" 
            class="btn favorite-btn"
            :class="isFavorite(track.id) ? 'btn-danger' : 'btn-outline-primary'"
          >
            <i :class="isFavorite(track.id) ? 'fas fa-trash' : 'fas fa-heart'"></i>
          </button>
          <span class="track-title mx-3"><a href="#" @click.prevent="navigateToTrack(track.id)">{{ track.title }}</a></span>
          <span class="track-duration">{{ formatDuration(track.duration) }}</span>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useFavoritesStore } from '../../stores/favorites';
import { usePlayerStore } from '../../stores/playerStore';
import { useRouter } from 'vue-router';
 

const router = useRouter()
const route = useRoute()
const id = computed(() => route.params.id)
const album = ref([])
const playerStore = usePlayerStore()
const favoritesStore = useFavoritesStore()

// Add watcher for id changes
watch(id, async (newId) => {
  if (newId) {
    isLoading.value = true
    await fetchAlbum()
    isLoading.value = false
  }
})

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


const fetchAlbum = async () => {
  try {
    const url = 'http://localhost:8080/https://api.deezer.com/album/'+id.value;
    console.log(url)
    const response = await fetch(url);  
    const data = await response.json();
    album.value = data;
    return album.value;
  } catch (error) {
    console.error('Error in fetchAlbums:', error);
  }
};

const playTrack = (track) => {
  if (playerStore.currentSong?.id === track.id) {
    playerStore.togglePlay()
  } else {
    playerStore.playSong(track)
  }
}

const isCurrentTrack = (track) => {
  return playerStore.currentSong?.id === track.id && playerStore.isPlaying
}

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const isFavorite = (id) => favoritesStore.isFavorite(id);
 
const toggleFavorite = (song) => {
    if (favoritesStore.isFavorite(song.id)) {
      favoritesStore.removeSong(song.id);
    } else {
      favoritesStore.addSong(song);
    }
  };

onMounted(async () => {
  await fetchAlbum()
})
</script>

<style scoped>
.album-details {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.cover-image {
  width: 400px;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.main-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
}

.track-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.track-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.play-btn {
  background: none;
  border: none;
  color: #1DB954;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  transition: transform 0.2s;
}

.play-btn:hover {
  transform: scale(1.1);
  background-color: rgba(29, 185, 84, 0.1);
}

.track-title {
  flex-grow: 1;
  margin-right: 20px;
}

.track-duration {
  color: #666;
  font-size: 0.9em;
}

.stats {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  color: #666;
}

.stats span {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
