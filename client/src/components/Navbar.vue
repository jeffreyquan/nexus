<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <v-toolbar-title>
        <v-btn :to="{ name: 'home' }">Nexus</v-btn>
      </v-toolbar-title>
    </div>
    <v-spacer></v-spacer>
    <v-toolbar-items v-if="!user">
      <v-btn :to="{ name: 'login' }">Login</v-btn>
      <v-btn :to="{ name: 'signup' }">Sign Up</v-btn>
    </v-toolbar-items>
    <v-toolbar-items v-if="user">
      <v-layout justify-content align-center pa-2>
        <span class="white--text headline">{{ user.user.name }}</span>
      </v-layout>
      <v-btn @click="logout">Logout</v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
export default {
  props: ['user', 'logout'],
};
</script>
