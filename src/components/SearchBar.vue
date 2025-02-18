<template>
  <div class="search-container">
    <div class="search-input">
      <input
        type="text"
        v-model="searchQuery"
        @keyup.enter="searchDeezer(true)"
        placeholder="Buscar en Deezer"
      />
      <button @click="searchDeezer(true)">
        <i class="bi bi-search"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const searchQuery = ref("");
const currentIndex = ref(0);
const isLoading = ref(false);
const emit = defineEmits(["results"]);

const searchDeezer = async (newSearch = false) => {
  if (searchQuery.value.trim() === "") return;
  
  if (newSearch) {
    currentIndex.value = 0;
  }

  try {
    const url = `http://localhost:8080/https://api.deezer.com/search?q=${searchQuery.value}&index=${currentIndex.value}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al buscar en Deezer");
    }
    const data = await response.json();
    
    // Ensure we emit all necessary data
    emit("results", {
      songs: data.data,
      isNewSearch: newSearch,
      total: data.total,
      hasMore: data.next !== undefined
    });
    
    currentIndex.value += 25; // Increment index after successful fetch
  } catch (error) {
    console.error(error.message);
    throw error; // Propagate error to parent
  }
};

defineExpose({ loadMore: () => searchDeezer(false) });
</script>
  <style scoped>
  .search-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
   .search-input {
    width: 90%;
    max-width: 600px; /* Opcional: limitar el ancho máximo */
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    padding: 0;
  }
   .search-input input {
    flex: 1;
    border: none;
    outline: none;
    padding: 10px;
    font-size: 16px;
    border-radius: 5px 0 0 5px;
  }
   .search-input button {
    border: none;
    background-color: transparent;
    padding: 0 10px;
    cursor: pointer;
    color: #777;
    font-size: 20px;
  }
   .search-input button:hover {
    color: #000;
  }
  </style>