<script setup lang="ts">
import type { Blocks } from '~~/ohne';

// The block has no fields to edit: it lists the newest posts, three to a page.
// Declaring the prop keeps `fields` from landing on the root element as an attribute.
defineProps<{ fields: Blocks['Posts'] }>();

const route = useRoute();

// `?page=2` asks for the second page, and no `page` means the first.
const page = computed(() => (route.query.page === undefined ? 1 : Number(route.query.page)));
const valid = computed(() => Number.isInteger(page.value) && page.value >= 1);

// `useOhneList` reads one page of the `Posts` collection, as an anonymous visitor would.
// The options are a getter, so the list reads again when the page number changes.
// See https://ohne.dev/docs/cms/website#site-data
const posts = await useOhneList('Posts', () => ({
  order: ['-publishedAt'],
  perPage: 3,
  page: valid.value ? page.value : 1,
  select: ['title', 'headline', 'author', 'image', 'description', 'publishedAt'],
}));

// A page past the last one, or a page number that is not one, answers `404`.
// The first load throws on the server, and a later move in the browser shows the error page.
// Fatal only in the browser: on the server a fatal error is also logged as a failure.
const missing = computed(() => !valid.value || page.value > posts.value.lastPage);
const notFound = { statusCode: 404, statusMessage: 'Page not found', fatal: import.meta.client };

if (missing.value) throw createError(notFound);

watch(missing, (value) => value && showError(notFound));

function pageLink(n: number) {
  return n > 1 ? `${route.path}?page=${n}` : route.path;
}
</script>

<template>
  <Container class="posts">
    <template v-for="post in posts.records" :key="post.UUID">
      <!-- A post the visitor can read always has a page, so it carries its `path`. -->
      <article v-if="post.path" class="posts__item">
        <img
          v-if="post.image"
          class="posts__image"
          :src="post.image.url"
          :width="post.image.width ?? undefined"
          :height="post.image.height ?? undefined"
          :alt="post.image.description ?? ''"
          loading="lazy"
          decoding="async"
        />
        <div class="posts__body">
          <h2>
            <NuxtLink :to="post.path">{{ post.headline || post.title }}</NuxtLink>
          </h2>
          <WrittenOn :date="post.publishedAt" :author="post.author" />
          <div v-if="post.description" class="prose posts__description">
            <p>{{ post.description }}</p>
          </div>
          <Button :to="post.path">Read more</Button>
        </div>
      </article>
    </template>
    <nav v-if="posts.lastPage > 1" class="posts__pager" aria-label="Pages">
      <Button v-if="posts.page > 1" :to="pageLink(posts.page - 1)">Previous page</Button>
      <Button v-if="posts.page < posts.lastPage" :to="pageLink(posts.page + 1)" class="posts__next">
        Next page
      </Button>
    </nav>
  </Container>
</template>
