<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-form
          v-if="!loading"
          @submit.prevent="createUser"
          @keydown.prevent.enter
          ref="form"
          v-model="valid"
        >
          <v-text-field
            v-model="user.name"
            :counter="30"
            :rules="nameRules"
            label="Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :rules="passwordRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.confirmPassword"
            :rules="confirmPasswordRules"
            label="Confirm Password"
            type="password"
            required
          ></v-text-field>
          <v-btn type="submit" :disabled="!valid">Sign Up</v-btn>
        </v-form>
        <v-progress-circular
          v-if="loading"
          :size="50"
          color="primary"
          indeterminate
         ></v-progress-circular>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'signUp',
  data: self => ({
    valid: false,
    user: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 30) || 'Name must be less than 30 characters',
    ],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length > 6) || 'Password must be greater than 6 characters',
    ],
    confirmPasswordRules: [
      v => (v && v === self.user.password) || 'Passwords do not match',
    ],
  }),
  computed: {
    ...mapState('users', { loading: 'isCreatePending' }),
  },
  methods: {
    createUser() {
      if (this.valid) {
        const { User } = this.$FeathersVuex.api;
        const user = new User(this.user);
        user
          .save()
          .then(() => {
            this.$router.push('/login');
          });
      }
    },
  },
};
</script>
