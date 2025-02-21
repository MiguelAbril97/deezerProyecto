<template>
  <div class="container mb-4">
    <div class="row g-4 align-items-center flex-row-reverse">
      <!-- Imagen grande a la derecha -->
      <div class="col-md-8 text-center">
        <img :src="artist.picture_xl" alt="Foto del artista" 
             class="img-fluid shadow rounded">
      </div>

      <!-- Información más pequeña a la izquierda -->
      <div class="col-md-4">
        <h2 class="text-primary">{{ artist.name }}</h2>
        <p><strong>Álbumes:</strong> {{ artist.nb_album }}</p>
      </div>
    </div>
  </div>

  <div class="container">

    <h1 class="text-center mb-4">Álbumes en los que ha participado</h1>
  <div v-if="albums.length > 0" class="row g-4">
      <div v-for="album in albums" :key="album.id" class="col-12 col-md-3">
        <div class="card h-100">
          <img 
            :src="album.cover_medium" 
            class="card-img-top"
            :alt="album.title"
          >
          <div class="card-body">
            <h5 class="card-title text-truncate">{{ album.title }}</h5>
          </div>
          <div class="card-footer">
            <button 
              @click.prevent="navigateToAlbum(album.id)"
              class="btn btn-primary w-100"
            >
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()
const artist = ref([])
const albums = ref([])
const id = computed(() => route.params.id);
const fetchArtist = async () => {
  try {
    const url = "http://localhost:8080/https://api.deezer.com/artist/"+id.value;
    console.log(url)
    const response = await fetch(url);
    const data = await response.json()
    artist.value = data
  } catch (error) {
    console.error('Error:', error)
  }
}

const fetchAlbums = async () => {
  try {
    const response = await fetch("http://localhost:8080/https://api.deezer.com/artist/"+id.value+"/albums")
    if (!response.ok) throw new Error('Error fetching albums')
    const data = await response.json()
    albums.value = data.data
  } catch (error) {
    console.error('Error:', error)
  }
}

onMounted(() => {
  fetchArtist();
  fetchAlbums();
})
</script>

<style scoped>
.artist-details {
  padding: 20px;
  color: #333;
}

.header-section {
  display: flex;
  gap: 20px;
  margin-bottom: 2rem;
  align-items: center;
}

.cover-image {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

.content-section {
  display: grid;
  gap: 2rem;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.list-group-item {
  cursor: pointer;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}
</style>
