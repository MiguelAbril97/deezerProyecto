<template>
  <p>{{ props.attrs.id }}</p>
</template>

<script setup>
import { ref, onMounted } from 'vue'


const artist = ref(null)
const albums = ref([])

const props = defineProps({
  id: {                      
    type: String, 
    required: true        
  }
})

const fetchArtist = async () => {
  try {
    const response = await fetch(`http://localhost:8080/https://api.deezer.com/artist/${props.attrs.id}`)
    if (!response.ok) throw new Error('Error fetching artist')
    const data = await response.json()
    artist.value = data
  } catch (error) {
    console.error('Error:', error)
  }
}

const fetchAlbums = async () => {
  try {
    const response = await fetch(`http://localhost:8080/https://api.deezer.com/artist/${props.attrs.id}/albums`)
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
