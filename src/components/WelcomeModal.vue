<template>
  <div class="modal fade" ref="modalRef" data-bs-backdrop="static" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">¡Bienvenido a Deezer Music Client!</h5>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveUser">
            <div class="mb-3">
              <label for="userName" class="form-label">¿Cómo te llamas?</label>
              <input 
                type="text" 
                class="form-control" 
                id="userName" 
                v-model="userName"
                required
                minlength="2"
              >
            </div>
            
            <div class="mb-3">
              <label class="form-label">Elige tu avatar</label>
              <div class="d-flex flex-wrap gap-2">
                <div 
                  v-for="(avatar, index) in avatars" 
                  :key="index"
                  class="avatar-option"
                  :class="{ selected: selectedAvatar === avatar }"
                  @click="selectedAvatar = avatar"
                >
                  <img :src="avatar" alt="Avatar option" class="img-fluid">
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-100">
              Comenzar
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min'

const userName = ref('')
const selectedAvatar = ref('')
const modalRef = ref(null)
let welcomeModal = null
// Array de URLs de avatares (puedes personalizar estas URLs)
const avatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara'
]

const emit = defineEmits(['userCreated'])

const saveUser = () => {
    
  if (!userName.value || !selectedAvatar.value) return

  const userData = {
    name: userName.value,
    avatar: selectedAvatar.value,
    createdAt: new Date().toISOString()
  }

  localStorage.setItem('user', JSON.stringify(userData))
  emit('userCreated', userData)
  modal.value.hide();
  console.log(userData)
}

onMounted(() => {
  // Seleccionar el primer avatar por defecto
  selectedAvatar.value = avatars[0]
  
  // Inicializar el modal de Bootstrap
  welcomeModal = new Modal(modalRef.value)
  
  // Mostrar el modal si no hay usuario guardado
  if (window.onload && !localStorage.getItem('user')) {
    welcomeModal.value.show()
  }
})
</script>

<style scoped>
.avatar-option {
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  padding: 4px;
  transition: all 0.2s ease;
}

.avatar-option:hover {
  transform: scale(1.05);
}

.avatar-option.selected {
  border-color: #0d6efd;
  background-color: #e7f1ff;
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>