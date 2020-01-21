<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>
      <v-btn :to="{ name: 'home' }">Nexus</v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items v-if="!user">
      <v-btn :to="{ name: 'login' }" text>Login</v-btn>
      <v-btn :to="{ name: 'signup' }" text>Sign Up</v-btn>
    </v-toolbar-items>
    <v-toolbar-items v-if="user">
      <v-row align="center">
        <span class="title pa-1 mr-2 name-tag">{{ user.user.name }}</span>
      </v-row>
      <v-btn @click="logout" class="ml-1" text>Logout</v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
export default {
  props: ['user', 'logout'],
};
</script>

<style scoped>
.name-tag {
  color: black;
}
</style>
