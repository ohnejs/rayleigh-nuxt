<script setup lang="ts">
const settings = await useOhneRead('Settings');

// The names of the icons an editor picks from in `Settings`, for a link without a title.
const names = { github: 'GitHub', x: 'X', discord: 'Discord', website: 'Website' };
</script>

<template>
  <footer class="container footer">
    <p v-if="settings.copyright" class="footer__copyright">{{ settings.copyright }}</p>
    <ul v-if="settings.social.length" class="footer__social">
      <li v-for="item in settings.social" :key="item.UUID">
        <OhneLink
          :link="item.link"
          class="footer__social-link"
          :title="item.title ?? undefined"
          :aria-label="item.title ?? names[item.icon]"
        >
          <IconBrandGithub v-if="item.icon === 'github'" />
          <IconBrandX v-else-if="item.icon === 'x'" />
          <IconBrandDiscord v-else-if="item.icon === 'discord'" />
          <IconWorld v-else />
        </OhneLink>
      </li>
    </ul>
  </footer>
</template>
