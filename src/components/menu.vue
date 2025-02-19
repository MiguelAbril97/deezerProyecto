<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/playlists">Playlists</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/search">Buscador</RouterLink>
          </li>
        </ul>
        
        <!-- Usuario-->
        <div v-if="user" class="d-flex align-items-center">
          <div class="text-white me-3 d-flex align-items-center">
            <img 
              :src="user.avatar" 
              alt="User avatar" 
              class="rounded-circle me-2"
              width="32" 
              height="32"
            >
            <span>{{ user.name }}</span>
          </div>
          <button 
            @click="$emit('logout')" 
            class="btn btn-outline-light btn-sm"
          >
            <i class="fas fa-sign-out-alt me-1"></i>
            Cerrar sesión
          </button>
        </div>

        <div v-else class="d-flex align-items-center">
          <button 
            @click="$emit('login')" 
            class="btn btn-outline-light btn-sm"
          >
            <i class="fas fa-sign-in-alt me-1"></i>
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  user: {
    type: Object,
    default: null
  }
})

defineEmits(['logout','login'])
</script>

<style lang="scss" scoped>
nav {
  border: 1px solid gray;
}

$hover-bg-color: #007bff;
$hover-text-color: #ffffff;

li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: $hover-bg-color;
    color: $hover-text-color;
    font-weight: bold;
  }
}

.btn-outline-light:hover {
  background-color: #dc3545;
  border-color: #dc3545;
}
</style>