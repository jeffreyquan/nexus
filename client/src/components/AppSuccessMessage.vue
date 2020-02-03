<template>
  <v-alert
    type="success"
    dense
  >
    {{ success }}
  </v-alert>
</template>

<script>
export default {
  props: ['success'],
};
</script>
