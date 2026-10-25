<script setup lang="ts">
import type { Blocks } from '~~/ohne';

defineProps<{ fields: Blocks['PageIntro'] }>();
</script>

<template>
  <Container>
    <div class="page-intro">
      <h1>{{ fields.title }}</h1>
      <p v-if="fields.kicker" class="page-intro__kicker">{{ fields.kicker }}</p>
    </div>
  </Container>
</template>
