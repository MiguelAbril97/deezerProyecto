
<script setup>
import { computed, defineAsyncComponent, watch, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { type, id } = route.params;
const componentKey = ref(0);

// Cargar dinámicamente el componente según el tipo
const DynamicComponent = computed(() => {

  if(type==='album'){
    return defineAsyncComponent(() => import(`@/components/details/album-details.vue`));
  }else if(type==='artist'){
    return defineAsyncComponent(() => import(`@/components/details/artist-details.vue`));
  }else{
    return defineAsyncComponent(() => import(`@/components/details/track-details.vue`));
  }

  //return defineAsyncComponent(() => import(`@/components/details/${type}-details.vue`));
});

watch(
  () => route.params,
  () => {
    componentKey.value++; // Force component reload
  }
);
</script>

<template>
  <div class="info-container">
    <div class="loading" v-if="loading">Cargando...</div>
    
    <div>
    <component :is="DynamicComponent"  :key="componentKey"></component>
    </div>

  </div>
</template>

<style scoped>
.info-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.cover-image {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.main-info {
  flex: 1;
}

.stats {
  display: flex;
  gap: 20px;
  margin: 15px 0;
}

.stats span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.tracklist, .top-tracks {
  margin-top: 30px;
}

audio {
  width: 100%;
  margin-top: 15px;
}

.loading {
  text-align: center;
  padding: 20px;
}
</style>
