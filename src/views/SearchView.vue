<template>
  <div>
      <h1>Búsqueda de canciones en Deezer</h1>
      <!-- Componente hijo -->
      <SearchBar @results="handleResults" />
      <hr />
      <div class="filters my-3">
        <label>
          <input type="checkbox" v-model="sortAscending" aria-label="Ordenar ascendente" />
          Ordenar por nombre (ascendente)
        </label>
        <label>
          Duracion mínima:
          <input type="number" v-model="minDuration" placeholder="Ejemplo: 100" aria-label="Filtrar por BPM"/>
        </label>
      </div>
      <!-- Lista de canciones -->
  <div v-if="songs.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="song in filteredAndSortedSongs" :key="song.id">
        <div class="card text-center">
          <div class="card-body d-flex flex-column align-items-center">
            <h5 v-if="song.title.length > 20" class="card-title">{{ song.title.substring(0,25)+"..."}}</h5>
            <h5 v-else class="card-title">{{ song.title }}</h5>
            <img 
              :src="song.album.cover_medium" 
              :alt="`Portada de ${song.album.title}`" 
              class="img-fluid rounded mb-3">
            <ul class="card-text list-group list-group-flush">
                <li class="list-group-item"> <strong>Artista:</strong> {{ song.artist.name }}</li>
                <li v-if="song.album.length > 20" class="list-group-item"> <strong>Álbum:</strong> {{ song.album.title.substring(0,20)+"..." }}</li>
                <li v-else class="list-group-item"> <strong>Álbum:</strong> {{ song.album.title.substring(0,20)+"..." }}</li>
                <li class="list-group-item"><strong>Duración:</strong> {{ song.duration }}</li>
            </ul>

            <audio :src="song.preview" controls></audio>
          </div>
          <div class="card-footer">
            <button 
              @click="toggleFavorite(song)" 
              class="btn"
              :class="isFavorite(song.id) ? 'btn-danger' : 'btn-primary'"
            >
              {{
                isFavorite(song.id)
                  ? "Quitar de favoritos"
                  : "Añadir a favoritos"
              }}
            </button>
          </div>
        </div>
      </div>
  </div>
  <p v-else>No hay resultados para mostrar</p>
</div>
</template>
 
 
 <script setup>
 import { ref, computed } from "vue";
 import SearchBar from "../components/SearchBar.vue"; // Importa el componente hijo
 import { useFavoritesStore } from '../stores/favorites';
 
 
 const songs = ref([]); // Estado para almacenar la lista de canciones
 
 
 const sortAscending = ref(false); // Controla el orden ascendente o descendente
 const minDuration = ref(0); // BPM mínimo para el filtro
 
 const favoritesStore = useFavoritesStore();
  const isFavorite = (id) => favoritesStore.isFavorite(id);
  
  const toggleFavorite = (song) => {
    if (favoritesStore.isFavorite(song.id)) {
      favoritesStore.removeSong(song.id);
    } else {
      favoritesStore.addSong(song);
    }
  };
 // Lista filtrada y ordenada
 const filteredAndSortedSongs = computed(() => {
  let result = [...songs.value];
 
  // Filtrar por BPM mínimo
  if (minDuration.value > 0) {
    result = result.filter(song => song.duration && song.duration >= minDuration.value);
  }
 
 
  // Ordenar por nombre
  if (sortAscending.value) {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    result.sort((a, b) => b.title.localeCompare(a.title));
  }
 
 
  return result;
 });
 
 
 // Maneja los resultados emitidos por el componente hijo
 const handleResults = (data) => {
  songs.value = data; // Actualiza la lista de canciones
 };
 </script>
 
 <style>

</style>