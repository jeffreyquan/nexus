<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-form
          v-if="!loading"
          v-model="valid"
          @submit.prevent="login"
          @keydown.prevent.enter
          ref="form"
        >
          <v-text-field
            v-model="user.email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :rules="notEmptyRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-btn type="submit" :disabled="!valid">Login</v-btn>
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
import { mapActions, mapState } from 'vuex';
import notEmptyRules from '../rules';

export default {
  name: 'login',
  data: () => ({
    valid: false,
    user: {
      email: '',
      password: '',
    },
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    notEmptyRules,
  }),
  computed: {
    ...mapState('users', { loading: 'isAuthenticatePending' }),
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    login() {
      if (this.valid) {
        this.authenticate({
          strategy: 'local',
          ...this.user,
        }).then(() => {
          this.$router.push('/boards');
        }).catch(() => {
          this.$router.push('/login');
        });
      }
    },
  },
};
</script>
