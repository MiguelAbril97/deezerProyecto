<template>
  <div class="track-details">
    <div class="header-section">
      <img :src="track.album?.cover_medium" :alt="track.title" class="cover-image">
      <div class="main-info">
        <h1>{{ track.title }}</h1>
        <h2>{{ track.artist?.name }}</h2>
        <p>Álbum: {{ track.album?.title }}</p>
        <div class="stats">
          <span><i class="fas fa-play"></i> {{ track.rank }}</span>
          <span><i class="fas fa-clock"></i> {{ formatDuration(track.duration) }}</span>
        </div>
        <audio v-if="track.preview" controls :src="track.preview"></audio>
        <button @click="playSong" class="play-button">
          <i class="fas fa-play"></i> Reproducir
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '../../stores/playerStore';

const props = defineProps({
  track: {
    type: Object,
    required: true
  }
});

const playerStore = usePlayerStore();

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const playSong = () => {
  playerStore.playSong(props.track);
};
</script>
