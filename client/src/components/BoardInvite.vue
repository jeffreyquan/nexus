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
            @submit.prevent="inviteMember"
            v-model="valid"
          >
            <v-row justify="center" align="center" no-gutters>
            <v-col cols="8">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn
                type="submit"
                :disabled="!valid"
                text
                icon
              >
                <v-icon dark large>mdi-plus</v-icon>
              </v-btn>
             </v-col>
            </v-row>
          </v-form>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'board-invite',
  props: ['users'],
  data() {
    return {
      valid: false,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        v => !this.users.some(user => user.email === v) || 'Already invited',
      ],
    };
  },
  methods: {
    ...mapActions('users', { findUser: 'find' }),
    ...mapActions('boards', { addUserToBoard: 'patch' }),
    async inviteMember() {
      const invitedUser = await this.findUser({
        query: {
          email: this.email,
        },
      });
      const boardId = this.$route.params.id;
      this.addUserToBoard([boardId, { $push: { users: invitedUser.data[0]._id } }]);
    },
  },
};
</script>
