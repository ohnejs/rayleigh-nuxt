<script setup lang="ts">
import type { Link } from '@ohnejs/client';

// The link comes from `Settings`, so an editor picks the page it goes back to.
defineProps<{ link: Link | null }>();
</script>

<template>
  <OhneLink v-if="link" :link="link" class="back-button">
    <IconChevronLeft />
    <slot />
  </OhneLink>
</template>
