<template>
<v-form
  @submit.prevent="inviteMember"
>
  <v-text-field
    v-model="email"
    :rules="emailRules"
    label="Email"
    required
  ></v-text-field>
  <v-btn type="submit">Add</v-btn>
</v-form>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'board-invite',
  data: () => ({
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
  }),
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
