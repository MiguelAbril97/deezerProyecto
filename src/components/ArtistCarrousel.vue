<template>
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
          <p>Posición #{{ index + 1 }}</p>
          <p>{{ artist.nb_fan.toLocaleString() }} fans</p>
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
</template>

<script setup>
defineProps({
  artists: {
    type: Array,
    required: true
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