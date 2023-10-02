<script setup>
import { ref, onMounted } from 'vue';
const { $socket } = useNuxtApp()
const formView = ref("entrar");
const cardsForTypes = {
  "Fibonnacci": {
    cards: ["0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "?", "Coffee"]
  },
  "Scrum": {
    cards: ["0", "1/2", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?", "Coffee"]
  },
  "Sequencial": {
    cards: ["0", "1", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "?", "Coffee"]
  },
  "T-Shirt": {
    cards: ["XS", "S", "M", "L", "XL", "XXL", "?", "Coffee"]
  }
};

const roomTitle = ref("");
const roomCardsType = ref(Object.keys(cardsForTypes)[0]);

const username = ref("");
const roomAvaliableCards = ref(cardsForTypes[roomCardsType.value].cards)
const roomSelectedCards = ref([])
const allowChangingVote = ref(false)
const autoRevealVotes = ref(false)
const realTimeSpectate = ref(false)
const roomNumber = ref("")

function changeFormView() {
  formView.value = (formView.value == "entrar") ? "criar" : "entrar";
}

function changeCustomizationOptions() {
  console.log(roomCardsType.value);
}

function selectAllCards() {
  if (roomSelectedCards.value.length != roomAvaliableCards.value.length) {
    roomSelectedCards.value = roomAvaliableCards.value
  } else {
    roomSelectedCards.value = []
  }
}

function checkSelectedAllAvaliableCards() {
  return roomSelectedCards.value.length == roomAvaliableCards.value.length;
}

function initializeSocket() {
  $socket.on('roomCreated', (data) => {
    joinRoom(data.roomId, true)
  });
}

function createRoom() {
  const cookie = useCookie('session', { maxAge: 60 * 60 * 8 })
  cookie.value = null;
  console.group("Room Creation");
  console.log(roomTitle.value);
  console.log(roomCardsType.value);
  console.log(roomSelectedCards.value);
  console.log(allowChangingVote.value);
  console.log(autoRevealVotes.value);
  console.log(realTimeSpectate.value);
  console.groupEnd();

  $socket.emit('createRoom', {
    user: username.value,
    room: {
      title: roomTitle.value,
      options: roomSelectedCards.value,
      allowChangingVote: allowChangingVote.value,
      autoRevealVotes: autoRevealVotes.value,
      realTimeSpectate: realTimeSpectate.value
    }
  });

}

function joinRoom(roomId, createRoom = false) {
  console.log('🚀 ~ file: index.vue:84 ~ createRoom:', createRoom);
  if (!createRoom) useCookie('session', { maxAge: 60 * 60 * 8 })
  if (process.client) {
    localStorage.setItem("user", username.value)
  }
  console.log('🚀 ~ file: index.vue:91 ~ roomId:', roomId);
  navigateTo(`/room/${roomId}`)
}

onMounted(() => {
  initializeSocket();
  provide('aoba', "salve")
});

</script>

<template>
  <Navbar />
  <div style="display: grid; justify-content: center;" class="mt-4">
    <div class="card" style="width: 500px">
      <div class="card-header text-center">
        Vamos começar
      </div>
      <div class="card-body">
        <Transition mode="out-in" duration="200">
          <div v-if="formView == 'entrar'">
            <legend class="text-center">Entrar em uma Sala</legend>
            <div>
              <label for="username">Usuário</label>
              <div class="mb-3">
                <input type="text" v-model="username" class="form-control" id="username" aria-describedby="usernameHelp">
              </div>
            </div>
            <div>
              <label for="roomCode">Código da sala</label>
              <div class="mb-3">
                <input type="text" v-model="roomNumber" class="form-control" id="roomCode"
                  aria-describedby="roomCodeHelp">
              </div>
            </div>
            <div class="text-center mt-3 d-flex flex-column">
              <a href="#" @click="joinRoom(roomNumber)" class="btn btn-primary">Entrar</a>
              <a href="#" @click="changeFormView">Ou criar sala</a>
            </div>

          </div>
          <template v-else>
            <div>
              <legend class="text-center">Criação de Sala</legend>
              <div>
                <label for="username">Usuário</label>
                <div class="mb-3">
                  <input type="text" v-model="username" class="form-control" id="username"
                    aria-describedby="usernameHelp">
                </div>
              </div>
              <label for="roomName">Titulo da sala</label>
              <div class="mb-3">
                <input type="text" class="form-control" id="roomName" aria-describedby="roomNameHelp" v-model="roomTitle">
              </div>
              <label for="roomType">Estilo das Cartas</label>
              <div class="form-group">
                <select class="form-select" id="roomType" v-model="roomCardsType" @change="changeCustomizationOptions">
                  <option v-for="card in Object.keys(cardsForTypes)">{{ card }}</option>
                  <option disabled>Customizado (Em breve)</option>
                </select>
              </div>
              <div class="mt-3">
                <legend class="text-center">Customização</legend>
                <fieldset class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="useAllCards" @change="selectAllCards"
                      :checked="checkSelectedAllAvaliableCards()">
                    <label class="form-check-label" for="useAllCards">
                      Usar todas as cartas
                    </label>
                  </div>
                  <TransitionGroup duration="200" moveClass="form-check">
                    <template v-if="!checkSelectedAllAvaliableCards()">
                      <hr>
                      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr">
                        <div class="form-check" v-for="card in cardsForTypes[roomCardsType].cards">
                          <input class="form-check-input" type="checkbox" :value="card" v-model="roomSelectedCards"
                            :id="`card-${card}`">
                          <label class="form-check-label" :for="`card-${card}`">
                            {{ card }}
                          </label>
                        </div>
                      </div>
                    </template>
                  </TransitionGroup>
                </fieldset>
              </div>
              <legend class="text-center mt-3">Regras da Sala</legend>
              <div class="form-check">
                <input class="form-check-input" v-model="allowChangingVote" type="checkbox" value=""
                  id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                  Permitir usuários mudarem seus votos após serem exibidos?
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" v-model="autoRevealVotes" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                  Auto revelar os votos quando todos votarem?
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" v-model="realTimeSpectate" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                  Espectadores podem observar outros jogadores votando em tempo real?
                </label>
              </div>
              <div class="text-center mt-3 d-flex flex-column">
                <a href="#" @click="createRoom" class="btn btn-primary">Criar Sala</a>
                <a href="#" @click="changeFormView">Ou entrar em uma sala</a>
              </div>
            </div>
          </template>
        </Transition>
      </div>
      <div class="card-footer text-muted text-center">
        Made by: Ryan Maia
      </div>
    </div>
  </div>
</template>

<style>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>