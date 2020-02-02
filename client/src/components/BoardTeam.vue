<template>
  <div class="text-center">
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
        >
          Team
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="user in this.users"
          :key="user._id"
          @click=""
        >
          <v-list-item-title>{{ user.name }} ({{ user.email }})</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'board-team',
  props: ['users'],
};
</script>
