<template>
  <v-alert
    type="error"
    dense
  >
    {{ error }}
  </v-alert>
</template>

<script>
export default {
  props: ['error'],
};
</script>
