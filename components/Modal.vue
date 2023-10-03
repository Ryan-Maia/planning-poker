<script setup>

defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

function closeModal() {
  emit('update:modelValue', false);
}


</script>
<template>
  <div v-if="modelValue" class="modal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-modal="true" role="dialog" style="background-color: rgb(0 0 0 / 40%);display: block;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header"></slot>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <slot name="body"> </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>