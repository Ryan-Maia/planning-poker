<script setup>
import { ref, onMounted } from 'vue';

const route = useRoute();
const { id } = route.params;

const user = ref();

const showingResults = ref(false);
const selectedCardIndex = ref();
const isOwner = ref(false);
const options = ref([]);
const users = ref([]);
const showIssuesManagerModal = ref(true);

const subPage = ref("info");

const { $socket } = useNuxtApp()
const cookie = useCookie('session', { maxAge: 60 * 60 * 8 })

function flipCards() {
  showingResults.value = !showingResults.value;
}

// VAI SER REMOVIDO
const stylesheets = [
  "/cerulian.min.css",
  "/cosmo.min.css",
  "/cyborg.min.css",
  "/darkly.min.css",
  "/flaty.min.css",
  "/journal.min.css",
  "/litera.min.css",
  "/lumen.min.css",
  "/lux.min.css",
  "/materia.min.css",
  "/minty.min.css",
  "/morph.min.css",
  "/pulse.min.css",
  "/quartz.min.css",
  "/sandstone.min.css",
  "/simplex.min.css",
  "/sketchy.min.css",
  "/slate.min.css",
  "/solar.min.css",
  "/spacelab.min.css",
  "/superhero.min.css",
  "/united.min.css",
  "/vapor.min.css",
  "/yeti.min.css",
  "/zephyr.min.css"
];

const selectedStyle = ref();
function applyStyle(style) {
  console.log(style);
  const stylesheetLink = document.getElementById("stylesheetLink");
  stylesheetLink.href = selectedStyle.value;
}
// ATÉ AQUI

function initializeSocket() {
  $socket.on('userInfo', (data) => {
    console.log('recebeu o owner')
    isOwner.value = data.owner;
    console.log(data);
    cookie.value = data.cookie;
  });

  $socket.on('roomData', (data) => {
    console.log('recebeu os dados')
    options.value = data.options;
    const title = data.title.length > 15 ? `${data.title.slice(0, 12)}...` : data.title
    document.title = `${title} - ${data.id}` || "Planning Poker"
    users.value = data.users;
    console.log(data);
  })

  $socket.on('invalidRoom', () => {
    console.log('sala invalida')
    navigateTo('/')
  })

  $socket.on('userVoted', (data) => {
    console.log("USERVOTED")
    console.log(data)
    const usersModified = users.value.map(e => {
      if (e.id == data.userId) {
        e.vote = data.vote
      }
      return e
    })
    users.value = usersModified;
  })

  $socket.on('invalidCookie', () => {
    console.log('cookie invalido')
    cookie.value = null;
  })

  if (cookie.value) {
    console.log('cookie exists')
    $socket.emit('joinRoom', { roomId: id, cookie: cookie.value, user: user.value })
  } else {
    console.log('cookie does not exist')
    $socket.emit('joinRoom', { roomId: id, user: user.value })
  }

  // console.log('joining room');
  // $socket.emit('joinRoom', { roomId: id })
  // console.log('joined room');
}

function vote(value) {
  console.log('votou')
  $socket.emit('vote', { roomId: id, value: value })
}

onMounted(() => {
  if (process.client) {
    user.value = localStorage.getItem("user")
    console.log(localStorage.getItem("user") == "");
    if (!user.value || user.value == "") {
      navigateTo(`/?id=${id}`)
    }
  }
  initializeSocket();
});

</script>

<template>
  <Navbar />
  <select @change="applyStyle()" v-model="selectedStyle">
    <option v-for="stylesheet in stylesheets">
      {{ stylesheet }}</option>
  </select>
  <div class="container mt-3">
    <div class="row">
      <div class="col px-2">
        <div class="container card border-primary p-3" v-if="isOwner">
          <h1> Controles </h1>
          <div class="row">
            <div class="col">
              <button class="btn btn-primary" @click="showIssuesManagerModal = true">Gerenciar Issues</button>
              <Modal v-model="showIssuesManagerModal">
                <template v-slot:header>
                  <h4 class="modal-title">Controle de issues</h4>
                </template>
                <template v-slot:body>
                  <form>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                      <label class="form-check-label" for="flexCheckDefault">
                        Integração ao gitlab (Feature Exprimental)
                      </label>
                    </div>
                    <div>
                      <label>Título da Issue</label>
                      <div class="mb-3">
                        <input type="text" class="form-control">
                      </div>
                    </div>
                    <div>
                      <label>Id do projeto no Gitlab</label>
                      <input class="form-control" type="number">
                    </div>
                    <div>
                      <label>Id da issue no Gitlab</label>
                      <input class="form-control" type="number">
                    </div>
                    <div>
                      <button class="btn btn-primary">
                        Verificar Issue
                      </button>
                    </div>
                  </form>
                  <!-- <table>
                    <thead>
                      <tr>
                        <th>A</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>AOSDKJ</td>
                      </tr>
                    </tbody>
                  </table> -->
                </template>
              </Modal>
            </div>
            <div class="col">
              <button class="btn btn-primary" @click="flipCards">Virar
                cartas</button>
            </div>
            <div class="col">
              <button class="btn btn-primary">Próxima Issue</button>
            </div>
            <div class="col">
              <button class="btn btn-primary">Voltar Issue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container mt-4 pb-4">
    <div class="row gy-4">
      <Transition mode="out-in" duration="200">
        <div class="col-sm-12 col-xl-9 px-2" v-if="subPage == 'voting'">
          <div class="card border-primary">
            <div class="container card-body">
              <div class="mb-5">
                <button class="btn btn-primary" @click="subPage = 'info'">
                  Acessar Informação da Issue
                </button>
                <br>
                <label>Progresso da votação:</label>
                <div class="progress">
                  <div class="progress-bar bg-success progress-bar-animated" role="progressbar" style="width: 25%;"
                    aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
              <!-- <hr> -->
              <!-- <div style="display: grid; grid-template-columns: repeat(4, 220px); gap: 20px 11px; justify-content: center;"
                  class="my-4"> -->
              <div class="row justify-content-center gy-4">
                <div class="col-sm-12 col-md-6 col-lg-4 text-center d-flex justify-content-center"
                  v-for="(number, index) in options">

                  <PokerCard :cardValue=number :selected="selectedCardIndex == index"
                    @click="selectedCardIndex = index; vote(number)" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <template v-else>
          <div class="col-sm-12 col-xl-9 px-2" v-if="!showingResults">
            <div class="card border-primary">
              <div class="container card-body">
                <div>
                  <div class="text-center">
                    <button class="btn btn-primary" @click="subPage = 'voting'">
                      Acessar Votação
                    </button>
                    <label style="font-size: 42px;" class="mt-4">Issue xpto do gitlab</label>
                  </div>
                  <Markdown />
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-xl-9 px-2" v-else>
            <div class="container card border-primary text-center">
              <label style="font-size: 42px;" class="my-4">Resultados da Votação</label>
              <div class="row justify-content-center">
                <div class="col-sm-6 col-xl-4">
                  <div class="card border-primary mb-3" style="min-height: 200px;">
                    <div class="card-header" style="font-size: 24px;">Mediana</div>
                    <div class="card-body d-grid" style="align-items: center;">
                      <label style="font-size: 80px !important;">2</label>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6 col-xl-4">
                  <div class="card border-primary mb-3" style="min-height: 200px;">
                    <div class="card-header" style="font-size: 24px;">Média</div>
                    <div class="card-body d-grid" style="align-items: center;">
                      <label style="font-size: 80px !important;">3</label>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6 col-xl-4">
                  <div class="card border-primary mb-3" style="min-height: 200px;">
                    <div class="card-header" style="font-size: 24px;">Total de Votos</div>
                    <div class="card-body d-grid" style="align-items: center;">
                      <label style="font-size: 80px !important;">7</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Transition>
      <div class="col-sm-12 col-xl-3 px-2">
        <div class="card border-primary mb-3 " v-for="(user, index) in users">
          <div class="card-body row">
            <label class="label" style="font-size: 26px;">{{ user.name }}</label>
            <div>
              <span class="badge rounded-pill bg-primary" style="font-size: 14px;">{{ user.vote }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>