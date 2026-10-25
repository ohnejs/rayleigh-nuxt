<script setup lang="ts">
import type { Blocks } from '~~/ohne';

import type { Slide } from '../Slider.vue';

const props = defineProps<{ fields: Blocks['Portfolio'] }>();

// An image field may be empty, so the gallery shows only the items that have one.
const slides = computed(() =>
  props.fields.gallery.filter((item): item is Slide => item.image !== null),
);

// The position of the image the slider shows, or `null` while it is closed.
const open = ref<number | null>(null);
let opener: HTMLElement | null = null;

function show(index: number, event: MouseEvent) {
  opener = event.currentTarget as HTMLElement;
  open.value = index;
}

// Focus returns to the image that opened the slider, so a keyboard visitor keeps their place.
function close() {
  open.value = null;
  opener?.focus();
}
</script>

<template>
  <Container class="portfolio">
    <h2 class="portfolio__title">{{ fields.title }}</h2>
    <div class="portfolio__grid">
      <button
        v-for="(item, index) in slides"
        :key="item.UUID"
        type="button"
        class="portfolio__item"
        :aria-label="item.caption ? `Open ${item.caption}` : 'Open image'"
        @click="show(index, $event)"
      >
        <!-- An upload carries its own size, so the grid keeps its shape while the image loads. -->
        <img
          :src="item.image.url"
          :width="item.image.width ?? undefined"
          :height="item.image.height ?? undefined"
          :alt="item.image.description ?? ''"
          loading="lazy"
          decoding="async"
        />
        <span class="portfolio__overlay">
          <span v-if="item.caption" class="portfolio__caption">{{ item.caption }}</span>
          <IconSearch />
        </span>
      </button>
    </div>
    <!-- `Lazy` loads the slider's code only when a visitor first opens it. -->
    <LazySlider v-if="open !== null" :slides="slides" :start="open" @close="close" />
  </Container>
</template>
