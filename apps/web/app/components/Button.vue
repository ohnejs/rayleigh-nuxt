<script setup lang="ts">
// The router marks a link as the current page by its path alone.
// A button always leads somewhere else, like `?page=2` of this page, so it never reads as current.
defineProps<{ to: string }>();
</script>

<template>
  <NuxtLink :to="to" class="button" aria-current="false">
    <span class="button__label"><slot /></span>
  </NuxtLink>
</template>
