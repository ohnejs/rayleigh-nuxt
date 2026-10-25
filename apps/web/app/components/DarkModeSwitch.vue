<script setup lang="ts">
// The server cannot know a visitor's theme, so it renders the same button for both.
// CSS picks the icon from the `data-theme` the theme script set, so the page never flashes.
// Each click turns the sun and the moon half a circle further, starting from the current theme.
const turns = ref<number>();

function toggle() {
  const dark = currentTheme() === 'dark';
  turns.value = (turns.value ?? (dark ? 1 : 0)) + 1;
  setTheme(dark ? 'light' : 'dark');
}
</script>

<template>
  <button
    type="button"
    class="theme-switch"
    aria-label="Toggle dark mode"
    title="Toggle dark mode"
    :style="turns === undefined ? undefined : { '--turns': turns }"
    @click="toggle"
  >
    <span class="theme-switch__orbit">
      <IconSun class="theme-switch__sun" />
      <IconMoon class="theme-switch__moon" />
    </span>
  </button>
</template>
