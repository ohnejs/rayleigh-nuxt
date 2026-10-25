<script setup lang="ts">
// The `ohne` middleware asks the CMS what this path shows, once, before the page renders.
// A redirect or a missing page answers with its own status code, so this page only renders content.
definePageMeta({ middleware: 'ohne' });

// Each block renders its own heading, so a page adds no `<h1>` of its own.
// A path no page answers shows your CMS page with the slug `404`, when you create one.
const page = useOhnePage();
</script>

<template>
  <main v-if="page?.kind === 'page' && page.collection === 'Pages'" class="main">
    <OhneBlocks :blocks="page.record.content" />
  </main>
  <main v-else-if="page?.kind === 'notFound' && page.page" class="main">
    <OhneBlocks :blocks="page.page.content" />
  </main>
</template>
