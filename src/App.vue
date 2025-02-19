<script setup>
import { ref } from 'vue'
import WelcomeModal from './components/WelcomeModal.vue'
import { RouterLink, RouterView } from 'vue-router'
import Menu from "./components/menu.vue";
import PlayerBar from './components/PlayerBar.vue'
import { useFavoritesStore } from './stores/favorites'

const favoritesStore = useFavoritesStore()
const user = ref(JSON.parse(localStorage.getItem('user')) || null)

const handleUserCreated = (userData) => {
  user.value = userData
}

const handleLogin = () => {
  const welcomeModal = new bootstrap.Modal(document.getElementById('modal'))
  welcomeModal.show()
}

const handleLogout = () => {
  // Mostrar modal de despedida
  const goodbyeModal = new bootstrap.Modal(document.getElementById('goodbyeModal'))
  goodbyeModal.show()
  
  // Limpiar datos después de 2 segundos
  setTimeout(() => {
    localStorage.removeItem('user')
    user.value = null
    favoritesStore.playlist = [] // Limpiar playlist
    goodbyeModal.hide()
  }, 1000)
}
</script>

<template>
  <div id="app">
    <!-- Header -->
    <header class="bg-primary text-white py-3">
      <div class="container text-center">
        <h1>Deezer Music Client</h1>
      </div>
    </header>
    <WelcomeModal @user-created="handleUserCreated" />

    <!-- Modal de despedida -->
    <div class="modal fade" id="goodbyeModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center p-5">
            <h3>¡Hasta pronto!</h3>
            <p class="mb-0">Esperamos verte de nuevo pronto</p>
            <div class="spinner-border mt-3" role="status">
              <span class="visually-hidden">Cerrando sesión...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu -->
    <Menu :user="user" @logout="handleLogout" @login="handleLogin" />
    

    <!-- Main Content -->
    <main class="container my-4">
      <router-view />
    </main>

    <!-- Player Bar -->
    <PlayerBar />

    <!-- Footer -->
    <footer class="bg-dark text-white text-center py-3">
      <p>&copy; 2024 Deezer Music Client. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<style lang="scss">
nav{
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


</style>
