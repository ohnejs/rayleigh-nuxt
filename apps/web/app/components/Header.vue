<script setup lang="ts">
// The header, the menu and the footer each read `Settings`.
// `useOhneRead` keys the read by its collection, so they share one request.
const settings = await useOhneRead('Settings');
const open = useMobileMenu();
const route = useRoute();

// The open menu covers the page, so the page behind it stops scrolling.
watch(open, (value) => {
  document.documentElement.classList.toggle('scroll-lock', value);
  if (value) window.scrollTo({ top: 0, behavior: 'smooth' });
});

watch(
  () => route.path,
  () => (open.value = false),
);

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false;
}

onMounted(() => addEventListener('keydown', onKeydown));

onBeforeUnmount(() => {
  removeEventListener('keydown', onKeydown);
  document.documentElement.classList.remove('scroll-lock');
});
</script>

<template>
  <header class="container header">
    <NuxtLink to="/" class="header__home" aria-label="Rayleigh">
      <Logo :logo="settings.logo" />
    </NuxtLink>
    <Menu />
    <DarkModeSwitch />
    <button
      type="button"
      class="header__burger"
      aria-controls="menu"
      :aria-expanded="open"
      :title="open ? 'Close menu' : 'Open menu'"
      @click="open = !open"
    >
      <span />
      <span />
    </button>
  </header>
</template>
