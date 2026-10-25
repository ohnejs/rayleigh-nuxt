<script setup lang="ts">
import type { Blocks } from '~~/ohne';

// The block's editor offers only headings, lists, bold, italic and links, the styles `prose.css` has.
// A click on a link to one of your pages moves there without a full page load.
defineProps<{ fields: Blocks['Prose'] }>();
</script>

<template>
  <Container class="content-block">
    <OhneRichText :value="fields.body" class="prose" />
  </Container>
</template>
