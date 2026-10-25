<script setup lang="ts">
import type { Blocks } from '~~/ohne';

// An image field may be empty, and then the block shows nothing.
defineProps<{ fields: Blocks['Image'] }>();
</script>

<template>
  <Container v-if="fields.image" class="content-block">
    <img
      class="image-block"
      :src="fields.image.url"
      :width="fields.image.width ?? undefined"
      :height="fields.image.height ?? undefined"
      :alt="fields.image.description ?? ''"
      decoding="async"
    />
  </Container>
</template>
