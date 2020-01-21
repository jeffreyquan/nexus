<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12">
        <v-row justify="center" align="center">
          <v-col xs="12" sm="3">
            <v-form
              v-model="valid"
              @submit.prevent="login"
              @keydown.prevent.enter
              ref="form"
            >
              <v-text-field
                v-model="user.email"
                :disabled="loading"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
              <v-text-field
                v-model="user.password"
                :disabled="loading"
                :rules="notEmptyRules"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-row align="center" justify="center">
                 <v-btn
                  type="submit"
                  class="ma-2"
                  :loading="loading"
                  :disabled="!valid"
                  color="secondary"
                >
                  Login
                </v-btn>
              </v-row>
            </v-form>
            <div class="error-message">
              <v-alert v-if="error" type="error">
                {{ error }}
              </v-alert>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import notEmptyRules from '../rules';

export default {
  name: 'login',
  data: () => ({
    valid: false,
    error: '',
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
          this.error = 'Please try again.';
          this.user = {
            email: '',
            password: '',
          };
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
