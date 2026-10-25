<script setup lang="ts">
import type { Upload } from '~~/ohne';

// The logo is an upload in `Settings`, so an editor can replace it in the dashboard.
defineProps<{ logo: Upload | null }>();
</script>

<template>
  <img
    v-if="logo"
    class="logo"
    :src="logo.url"
    :width="logo.width ?? undefined"
    :height="logo.height ?? undefined"
    :alt="logo.description ?? 'Rayleigh'"
    decoding="async"
  />
</template>
