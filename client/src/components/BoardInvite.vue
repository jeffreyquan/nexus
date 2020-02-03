<template>
  <div class="text-center">
    <v-menu
      offset-y
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
        >
          Invite
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-form
            v-model="valid"
            v-if="!updatingUsers"
            @submit.prevent="addUser"
            ref="form"
          >
            <v-row justify="center" align="center" no-gutters>
              <v-col cols="8">
                <v-text-field
                  v-model="email"
                  @keydown.enter.prevent
                  :rules="emailRules"
                  :disabled="addingUser"
                  label="Email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-btn
                  type="button"
                  @click="addUser"
                  :disabled="!valid"
                  text
                  icon
                >
                  <v-icon dark large>mdi-plus</v-icon>
                </v-btn>
                <v-progress-circular
                  v-if="addingUser"
                  indeterminate
                  color="green"
                ></v-progress-circular>
              </v-col>
            </v-row>
            <v-row justify="center">
              <app-error-message
                v-if="error"
                :error="error"
              >
              </app-error-message>
              <app-success-message
                v-if="success"
                :success="success"
              >
              </app-success-message>
            </v-row>
          </v-form>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AppErrorMessage from './AppErrorMessage.vue';
import AppSuccessMessage from './AppSuccessMessage.vue';

export default {
  name: 'board-invite',
  components: {
    AppErrorMessage,
    AppSuccessMessage,
  },
  props: ['users', 'createActivity'],
  data() {
    return {
      valid: false,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        v => !this.users.some(user => user.email === v) || 'Already invited',
      ],
      error: null,
      success: null,
    };
  },
  methods: {
    ...mapActions('users', { findUser: 'find' }),
    ...mapActions('boards', { addUserToBoard: 'patch' }),
    addUser() {
      this.findUser({
        query: {
          email: this.email,
        },
      }).then((res) => {
        const boardId = this.$route.params.id;
        this.addUserToBoard([boardId, { $push: { users: res.data[0]._id } }]);
        this.success = 'User successfully added.';
        this.createActivity(`**${res.data[0].name}** was successfully added to the board`);
        this.$refs.form.reset();
        setTimeout(() => {
          this.success = '';
        }, 2000);
      }).catch(() => {
        this.error = 'User does not exist.';
        this.$refs.form.reset();
        setTimeout(() => {
          this.error = '';
        }, 2000);
      });
    },
  },
  computed: {
    ...mapState('boards', {
      addingUser: 'isPatchPending',
    }),
  },
};
</script>
