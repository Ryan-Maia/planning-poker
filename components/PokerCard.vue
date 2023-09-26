<script setup>

const props = defineProps({
  cardValue: String,
  selected: Boolean
});


</script>

<template>
  <div style="width: fit-content;position: relative; cursor: pointer;" class="card border-primary bg-primary pointer"
    v-if="selected">
    <label style="position: absolute; left: 5px; top: 2px;" class="text-white">{{ cardValue }}</label>
    <label style="position: absolute; bottom: 2px; right: 5px" class="text-white">{{ cardValue }}</label>
    <div class="card"
      style="background-color: inherit; width: 160px; height: 200px; margin: 30px 25px; display: grid; text-align: center; justify-content: center; align-items: center;">
      <label class="display-3 text-white">{{ cardValue }}</label>
    </div>
  </div>
  <div style="width: fit-content;position: relative; cursor: pointer;" class="card border-primary bg-light pointer"
    v-else>
    <label style="position: absolute; left: 5px; top: 2px;">{{ cardValue }}</label>
    <label style="position: absolute; bottom: 2px; right: 5px">{{ cardValue }}</label>
    <div class="card"
      style="background-color: inherit; width: 160px; height: 200px; margin: 30px 25px; display: grid; text-align: center; justify-content: center; align-items: center;">
      <label class="display-3">{{ cardValue }}</label>
    </div>
  </div>
</template>