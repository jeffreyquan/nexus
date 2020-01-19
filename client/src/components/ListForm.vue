<template>
  <v-card
    class="mx-auto"
    max-width="400"
    >
    <v-card-text class="text--primary">
      <div>Create List</div>
      <div>
        <v-form
          v-if="!creatingList"
          v-model="validList"
          ref="form"
          @submit.prevent="createList"
          @keydown.prevent.enter
          >
          <v-text-field
            v-model="list.name"
            :rules="notEmptyRules"
            label="Name"
            required
          ></v-text-field>
          <v-btn type="submit" :disabled="!validList">Create list</v-btn>
        </v-form>
        <v-progress-circular
          v-if="creatingList"
          :size="50"
          color="primary"
          indeterminate
        >
        </v-progress-circular>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import notEmptyRules from '../rules';

export default {
  props: ['createActivity', 'boardId', 'user'],
  data: () => ({
    validList: false,
    list: {
      name: '',
      order: 0,
      archived: false,
    },
    notEmptyRules,
  }),
  methods: {
    async createList() {
      if (this.validList) {
        const { List } = this.$FeathersVuex.api;
        this.list.boardId = this.boardId;
        const list = new List(this.list);
        await list.save();
        this.list = {
          name: '',
          order: 0,
          archived: false,
        };
        this.createActivity(`**${this.user.user.name}** created list **${list.name}**`);
      }
    },
  },
  computed: {
    ...mapState('lists', {
      creatingList: 'isCreatePending',
    }),
  },
};
</script>
