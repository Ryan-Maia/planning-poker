<script setup>
import { onMounted, provide } from 'vue';
import { io } from 'socket.io-client';
const testeson = 'testeson';

function initializeSocket() {
  const socket = io('http://localhost:3030');
  socket.on('connect', () => {
    console.log('connected');
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

  socket.on('roomCreated', (data) => {
    console.log(data);
    navigateTo(`/room/${data.roomId}`)
  });

  console.log(socket);
  provide('socket', socket);

}

onMounted(() => {
  provide('aoba', "salve appson")
  console.log('app.vue')
  initializeSocket();
});

</script>
<template>
  <link id="stylesheetLink" rel="stylesheet" href="/lumen.min.css">
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
