<template>
  <main class="home-page">
    <container>
      <vue-calendar />
    </container>
  </main>
</template>
<script setup lang="ts">
import VueCalendar from '@/components/VueCalendar.vue'
import Container from '@/components/shared/Container.vue'
</script>
<style scoped>
.home-page {
  padding: 0 40px;
}
</style>
