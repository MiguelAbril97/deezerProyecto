<template>
  <div class="album-details">
    <div class="header-section">
      <img :src="album.cover_medium" :alt="album.title" class="cover-image">
      <div class="main-info">
        <h1>{{ album.title }}</h1>
        <h2>{{ album.artist?.name }}</h2>
        <div class="stats">
          <span><i class="fas fa-calendar"></i> {{ new Date(album.release_date).getFullYear() }}</span>
          <span><i class="fas fa-music"></i> {{ album.nb_tracks }} canciones</span>
        </div>
      </div>
    </div>
    <div class="tracklist" v-if="album.tracks">
      <h3>Lista de canciones</h3>
      <ol>
        <li v-for="track in album.tracks.data" :key="track.id">
          {{ track.title }} - {{ formatDuration(track.duration) }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue';


const route = useRoute()
const id = computed(() => route.params.id);
const album = ref([])

const fetchAlbum = async () => {
  try {
    const url = 'http://localhost:8080/https://api.deezer.com/album/'+id.value;
    console.log(url)
    const response = await fetch(url);  
    const data = await response.json();
    album.value = data.data;
    return album.value;
  } catch (error) {
    console.error('Error in fetchAlbums:', error);
  }
};


const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

onMounted(() => {
  fetchAlbum();
})
</script>
