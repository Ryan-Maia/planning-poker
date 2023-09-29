import io from 'socket.io-client'
const socket = io('http://localhost:3030')

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      socket: socket
    }
  }
})