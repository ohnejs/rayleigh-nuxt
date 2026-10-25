<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    name: string;
    type?: 'text' | 'email' | 'textarea';
    autocomplete?: string;
    error?: string;
  }>(),
  { type: 'text' },
);

// `useId` gives the same id on the server and in the browser, so the label finds its input after hydration.
const id = useId();
</script>

<template>
  <div class="text-input">
    <label :for="id" class="text-input__label">{{ label }}</label>
    <textarea
      v-if="type === 'textarea'"
      :id="id"
      :name="name"
      rows="12"
      class="text-input__field text-input__field--area"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
    />
    <input
      v-else
      :id="id"
      :name="name"
      :type="type"
      :autocomplete="autocomplete"
      spellcheck="false"
      class="text-input__field"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
    />
    <!-- ohne wraps the values in its messages in backticks, and the form shows them as code. -->
    <p v-if="error" :id="`${id}-error`" class="text-input__error">
      <template v-for="(part, index) in error.split('`')" :key="index">
        <code v-if="index % 2">{{ part }}</code>
        <template v-else>{{ part }}</template>
      </template>
    </p>
  </div>
</template>
