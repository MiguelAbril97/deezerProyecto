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
          <div class="image-container" @click="navigateToArtist(artist.id)" role="button">
            <img 
              :src="artist.picture_xl" 
              class="d-block w-100" 
              :alt="artist.name"
              style="object-fit: cover; height: 700px; cursor: pointer;"
            >
            <div class="carousel-caption">
              <h3>{{ artist.name }}</h3>
            </div>
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
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  artists: {
    type: Array,
    required: true,
    default: () => []
  }
});

const navigateToArtist = (artistId) => {
  router.push({
    name: 'info',
    params: {
      type: 'artist',
      id: artistId
    }
  });
};
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
  height: 600px;
  object-fit: contain;
  background-color: #000; /* Fondo negro para las imágenes */
}

.carousel-caption {
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
}

/* Nuevos estilos para las flechas */
.carousel-control-prev,
.carousel-control-next {
  width: 10%;
  background-color: rgba(0, 0, 0, 0.3);
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  width: 40px;
  height: 40px;
}

.image-container {
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.image-container:hover {
  opacity: 0.9;
}
</style>