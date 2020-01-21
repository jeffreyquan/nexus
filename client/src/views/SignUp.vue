<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12">
        <v-row justify="center" align="center">
          <v-col xs="12" sm="4" md="3">
            <v-form
              v-if="!loading"
              @submit.prevent="createUser"
              @keydown.prevent.enter
              ref="form"
              v-model="valid"
            >
              <v-text-field
                v-model="user.name"
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
              <v-row align="center" justify="center">
                <v-btn
                  type="submit"
                  class="ma-2"
                  :loading="loading"
                  :disabled="!valid"
                >Sign Up
                </v-btn>
              </v-row>
            </v-form>
            <div class="error-message">
              <app-error-message
                v-if="error"
                :error="error"
              ></app-error-message>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import AppErrorMessage from '../components/AppErrorMessage.vue';

export default {
  name: 'signUp',
  components: {
    AppErrorMessage,
  },
  data: self => ({
    valid: false,
    error: '',
    user: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
    nameRules: [
      v => !!v || 'Name is required',
    ],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length > 6) || 'Must be greater than 6 characters',
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
          })
          .catch(() => {
            this.error = 'Email taken.';
            this.$refs.form.reset();
            setTimeout(() => {
              this.error = '';
            }, 2000);
          });
      }
    },
  },
};
</script>

<style scoped>
.error-message {
  height: 10rem;
  margin-top: 1rem;
}
</style>
