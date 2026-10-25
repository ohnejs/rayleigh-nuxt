<script setup lang="ts">
import type { Refused } from '@ohnejs/client';
import type { Blocks } from '~~/ohne';

// The block has no fields to edit: it renders the form, and each message lands in `Messages`.
defineProps<{ fields: Blocks['ContactForm'] }>();

const ohne = useOhne();
const settings = await useOhneRead('Settings');
const form = useTemplateRef('form');
const thanks = useTemplateRef('thanks');
const sending = ref(false);
const sent = ref(false);
const failure = ref<string>();
const errors = ref<Refused['errors']>({});

// The spam check is a switch in `Settings`, so reCAPTCHA's script loads only while it is on.
const siteKey = computed(() =>
  settings.value.recaptcha && settings.value.recaptchaSiteKey
    ? settings.value.recaptchaSiteKey
    : null,
);
useHead(() => ({
  script: siteKey.value ? [{ src: recaptchaScript(siteKey.value), async: true }] : [],
}));

async function send() {
  if (!form.value) return;
  const data = new FormData(form.value);
  const text = (name: string) => String(data.get(name) ?? '');
  sending.value = true;
  try {
    const recaptcha = siteKey.value ? await recaptchaToken(siteKey.value) : undefined;
    // Your website hands the message on to your CMS, which checks every field.
    // See https://ohne.dev/docs/cms/website#forms
    const result = await ohne.create(
      'Messages',
      { name: text('name'), email: text('email'), message: text('message') },
      // The backend's `recaptcha` middleware reads the token from this header.
      { headers: recaptcha ? { 'recaptcha-token': recaptcha } : {} },
    );
    if (!result.ok) return refuse(result);
    sent.value = true;
    await nextTick();
    thanks.value?.focus();
  } catch {
    refuse();
  }
}

async function refuse(refusal?: Refused) {
  errors.value = refusal?.errors ?? {};
  failure.value = Object.keys(errors.value).length
    ? undefined
    : refusal?.message || 'Something went wrong. Please try again.';
  sending.value = false;
  // Focus moves to the first field to fix, so a keyboard or screen reader visitor lands on it.
  await nextTick();
  form.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
}
</script>

<template>
  <Container class="content-block">
    <p v-if="sent" ref="thanks" class="contact-form__note" tabindex="-1">
      Thank you for your message! We'll get back to you as soon as possible.
    </p>
    <!-- `novalidate` leaves every check to the CMS, so the form shows the CMS's own messages. -->
    <form v-else ref="form" class="contact-form" novalidate @submit.prevent="send">
      <!-- While the message is sent, a disabled `<fieldset>` disables every field and the button. -->
      <fieldset class="contact-form__fields" :disabled="sending">
        <p v-if="failure" class="contact-form__note contact-form__note--error" role="alert">
          {{ failure }}
        </p>
        <TextInput label="Your name" name="name" autocomplete="name" :error="errors.name" />
        <TextInput
          label="Your email address"
          name="email"
          type="email"
          autocomplete="email"
          :error="errors.email"
        />
        <TextInput label="Message" name="message" type="textarea" :error="errors.message" />
        <Button type="submit">Send</Button>
      </fieldset>
    </form>
  </Container>
</template>
