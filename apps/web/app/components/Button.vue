<script setup lang="ts">
// With `to`, the button is a link. Without it, it is a real `<button>`, like the contact form's Send.
// The router marks a link as the current page by its path alone.
// A button always leads somewhere else, like `?page=2` of this page, so it never reads as current.
withDefaults(defineProps<{ to?: string; type?: 'button' | 'submit' }>(), { type: 'button' });
</script>

<template>
  <NuxtLink v-if="to" :to="to" class="button" aria-current="false">
    <span class="button__label"><slot /></span>
  </NuxtLink>
  <button v-else :type="type" class="button">
    <span class="button__label"><slot /></span>
  </button>
</template>
