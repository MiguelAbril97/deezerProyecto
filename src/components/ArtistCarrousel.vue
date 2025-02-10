<template>
  <div v-if="artists && artists.length > 0">
    <h2>Artistas más escuchados</h2>
    <div id="artistCarousel" class="carousel slide my-3" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div 
          v-for="(artist, index) in artists" 
          :key="artist.id" 
          :class="['carousel-item', { 'active': index === 0 }]"
        >
          <img 
            :src="artist.picture_xl" 
            class="d-block w-100" 
            :alt="artist.name"
            style="object-fit: cover; height: 400px;"
          >
          <div class="carousel-caption">
            <h3>{{ artist.name }}</h3>
          </div>
        </div>
      </div>
      
      <button class="carousel-control-prev" type="button" data-bs-target="#artistCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#artistCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
      </button>
    </div>
  </div>
  <div v-else-if="artists && artists.length === 0" class="alert alert-info">
    No hay artistas para mostrar
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  artists: {
    type: Array,
    required: true,
    default: () => []
  }
});

let carousel = null;

const initCarousel = () => {
  try {
    console.log('Initializing carousel with artists:', props.artists.length);
    const element = document.getElementById('artistCarousel');
    if (typeof bootstrap !== 'undefined' && element) {
      carousel = new bootstrap.Carousel(element, {
        interval: 5000,
        wrap: true
      });
      console.log('Carousel initialized successfully');
    } else {
      console.warn('Bootstrap or carousel element not found');
    }
  } catch (error) {
    console.error('Error initializing carousel:', error);
  }
};

// Watch for changes in artists prop
watch(() => props.artists, (newArtists) => {
  console.log('Artists changed:', newArtists.length);
  if (newArtists.length > 0) {
    // Re-initialize carousel when artists change
    setTimeout(initCarousel, 100);
  }
}, { deep: true });

onMounted(() => {
  console.log('ArtistCarrousel mounted');
  if (props.artists.length > 0) {
    initCarousel();
  }
});

onUnmounted(() => {
  if (carousel && typeof carousel.dispose === 'function') {
    carousel.dispose();
    console.log('Carousel disposed');
  }
});
</script>

<style scoped>
.carousel-item img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.carousel-caption {
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
}
</style>