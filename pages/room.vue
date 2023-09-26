<script setup>

const selectedCardIndex = ref(0);
const showingResults = ref(false);

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
        <div class="container card border-primary p-3">
          <h1> Controles </h1>
          <hr>
          <div class="row">
            <div class="col">
              <button class="btn btn-primary">Iniciar Votação</button>
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
        <div class="col-sm-12 col-xl-9 px-2" v-if="!showingResults">
          <div class="card border-primary">

            <div class="container card-body">

              <div class="text-center">
                <label style="font-size: 42px;" class="mt-4">Issue xpto do gitlab</label>
              </div>

              <div class="mb-5">
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
                  v-for="(number, index) in Array.from({ length: 7 }, (value, index) => index)">

                  <PokerCard cardValue="23" :selected="selectedCardIndex == index" @click="selectedCardIndex = index" />
                </div>
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
      </Transition>
      <div class="col-sm-12 col-xl-3 px-2">
        <div class="card border-primary mb-3 "
          v-for="(number, index) in Array.from({ length: 7 }, (value, index) => index)">
          <div class="card-body row">
            <label class="label" style="font-size: 26px;">RYAN MAIA</label>
            <div>
              <span class="badge rounded-pill bg-primary" style="font-size: 14px;">?</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>