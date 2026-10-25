<script setup lang="ts">
import type { NuxtError } from '#app';

// Nuxt shows this page for a path no page in the CMS answers, and when the API fails.
// A failure skips the layout, since the header and the footer may read the API that just failed.
const props = defineProps<{ error: NuxtError }>();

const missing = computed(() => props.error.statusCode === 404);
</script>

<template>
  <NuxtLayout :name="missing ? 'default' : false">
    <main class="main">
      <Container>
        <div class="page-intro">
          <h1>{{ missing ? 'Page not found' : 'Something went wrong' }}</h1>
          <p class="page-intro__kicker"><NuxtLink to="/">Back to the home page</NuxtLink></p>
        </div>
      </Container>
    </main>
  </NuxtLayout>
</template>
