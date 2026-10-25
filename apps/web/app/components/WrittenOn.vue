<script setup lang="ts">
const props = defineProps<{ date: number | null; author: { name: string } | null }>();

// A date reads as a timestamp in milliseconds.
// One fixed locale and time zone give the same text on the server and in the browser, so hydration matches.
const format = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' });
const day = computed(() => (props.date === null ? null : new Date(props.date)));
</script>

<template>
  <p v-if="day" class="written-on">
    Written on
    <time :datetime="day.toISOString().slice(0, 10)">{{ format.format(day) }}</time>
    <template v-if="author"> by {{ author.name }}</template>
  </p>
</template>
