<script setup lang="ts">
import { linkHref } from '@ohnejs/client';

const settings = await useOhneRead('Settings');
const open = useMobileMenu();
const route = useRoute();
const list = useTemplateRef('list');

// The dot's distance from the menu's left edge, or `null` to hide it.
const dot = ref<number | null>(null);

// `linkHref` turns a link field into its address.
// An item is active on its own page and on every page below it, so Blog stays marked on a post.
const active = computed(() =>
  settings.value.menu.findIndex(({ link }) => {
    const href = linkHref(link);
    return href === route.path || (!!href && href !== '/' && route.path.startsWith(`${href}/`));
  }),
);

// The dot sits under the active item, and follows the pointer while it is over the menu.
function moveDot(index = active.value) {
  const item = active.value < 0 ? undefined : list.value?.children[index];
  dot.value = item instanceof HTMLElement ? item.offsetLeft : null;
}

const onResize = () => moveDot();

watch(active, onResize);

onMounted(() => {
  moveDot();
  addEventListener('resize', onResize);
});

onBeforeUnmount(() => removeEventListener('resize', onResize));
</script>

<template>
  <nav v-if="settings.menu.length" id="menu" class="menu" :class="{ 'menu--open': open }">
    <ul ref="list" class="menu__list" @mouseleave="moveDot()">
      <li v-for="(item, index) in settings.menu" :key="item.UUID" @mouseenter="moveDot(index)">
        <!-- `OhneLink` renders a link field as a `NuxtLink`, so moving between pages needs no reload. -->
        <OhneLink
          :link="item.link"
          class="menu__link"
          :class="{ 'menu__link--active': index === active }"
          @click="open = false"
        >
          {{ item.label }}
        </OhneLink>
      </li>
    </ul>
    <span v-if="dot !== null" class="menu__dot" :style="{ '--dot-x': `${dot}px` }" />
  </nav>
</template>
