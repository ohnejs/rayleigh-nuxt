<script setup lang="ts">
import type { Blocks } from '~~/ohne';

// A click on a link to one of your pages moves there without a full page load.
defineProps<{ fields: Blocks['Prose'] }>();
</script>

<template>
  <Container>
    <OhneRichText :value="fields.body" class="prose" />
  </Container>
</template>
