<script lang="ts">
import type { Blocks, Upload } from '~~/ohne';

/**
 * A gallery item that has an image.
 */
export type Slide = Blocks['Portfolio']['gallery'][number] & { image: Upload };
</script>

<script setup lang="ts">
// A full-screen gallery on the browser's own `<dialog>`, which brings the backdrop, the focus trap and Esc.
// The slides sit side by side in a scroll-snapping track, so touch swipes work with no script.
const props = defineProps<{ slides: Slide[]; start: number }>();
// Esc closes a dialog natively, so its `close` event covers every way it closes.
const emit = defineEmits<{ close: [] }>();

const dialog = useTemplateRef('dialog');
const track = useTemplateRef('track');
const index = ref(props.start);
const imageWidth = ref(0);

function go(to: number, behavior: ScrollBehavior = 'smooth') {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamped = Math.min(Math.max(to, 0), props.slides.length - 1);
  track.value?.scrollTo({
    left: clamped * track.value.clientWidth,
    behavior: reduce ? 'instant' : behavior,
  });
}

function onScroll() {
  if (track.value) index.value = Math.round(track.value.scrollLeft / track.value.clientWidth);
}

// The arrows sit beside the image, so they need its width, which changes with each image and the window.
function measure() {
  imageWidth.value = track.value?.children[index.value]?.querySelector('img')?.offsetWidth ?? 0;
}

function onKeydown(event: KeyboardEvent) {
  const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
  if (!step) return;
  event.preventDefault();
  go(index.value + step);
}

// A click beside the image, its caption and the buttons closes the slider, like a backdrop click.
function onClick(event: MouseEvent) {
  if (!(event.target as Element).closest('img, figcaption, button')) dialog.value?.close();
}

function onResize() {
  go(index.value, 'instant');
  measure();
}

watch(index, measure);

onMounted(() => {
  // `showModal` moves focus into the dialog and makes the page behind it inert.
  dialog.value?.showModal();
  go(props.start, 'instant');
  measure();
  addEventListener('resize', onResize);
  // A disabled arrow drops the focus out of the dialog, so the window listens for the arrow keys.
  addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  removeEventListener('resize', onResize);
  removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <dialog
    ref="dialog"
    class="slider"
    aria-label="Gallery"
    :style="{ '--image-width': `${imageWidth}px` }"
    @close="emit('close')"
    @click="onClick"
  >
    <button type="button" class="slider__close" aria-label="Close" @click="dialog?.close()">
      <IconX />
    </button>
    <div ref="track" class="slider__track" @scroll="onScroll">
      <figure v-for="(slide, i) in slides" :key="slide.UUID" class="slider__slide">
        <img
          class="slider__image"
          :src="slide.image.url"
          :width="slide.image.width ?? undefined"
          :height="slide.image.height ?? undefined"
          :alt="slide.image.description ?? ''"
          loading="lazy"
          decoding="async"
          @load="i === index && measure()"
        />
        <figcaption v-if="slide.caption" class="slider__caption">{{ slide.caption }}</figcaption>
      </figure>
    </div>
    <button
      type="button"
      class="slider__arrow slider__arrow--prev"
      aria-label="Previous image"
      :disabled="index === 0"
      @click="go(index - 1)"
    >
      <IconChevronLeft />
    </button>
    <button
      type="button"
      class="slider__arrow slider__arrow--next"
      aria-label="Next image"
      :disabled="index === slides.length - 1"
      @click="go(index + 1)"
    >
      <IconChevronRight />
    </button>
  </dialog>
</template>
