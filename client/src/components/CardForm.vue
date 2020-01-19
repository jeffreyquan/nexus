<template>
<v-flex sm12 pa-2>
  <v-card
    class="mx-auto"
    max-width="400"
  >
    <v-card-text class="text--primary">
      <div>Create Card</div>
        <div>
          <v-form
            v-if="!creatingCard"
            v-model="validCard"
            ref="form"
            @submit.prevent="createCard"
            @keydown.prevent.enter
          >
            <v-text-field
              v-model="card.title"
              :rules="notEmptyRules"
              label="Title"
              required
            ></v-text-field>
            <v-btn type="submit" :disabled="!validCard">Create Card</v-btn>
          </v-form>
          <v-progress-circular
            v-if="creatingCard"
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import { mapState } from 'vuex';
import notEmptyRules from '../rules';

export default {
  name: 'card-form',
  props: ['listId', 'boardId', 'createActivity', 'user'],
  data: () => ({
    validCard: false,
    card: {
      title: '',
      members: [],
    },
    notEmptyRules,
  }),
  methods: {
    async createCard() {
      if (this.validCard) {
        const { Card } = this.$FeathersVuex.api;
        this.card.boardId = this.boardId;
        this.card.listId = this.listId;
        const card = new Card(this.card);
        await card.save();
        this.card = {
          title: '',
          members: [],
        };
        this.createActivity(`**${this.user.name}** created card **${card.title}**`);
      }
    },
  },
  computed: {
    ...mapState('cards', {
      creatingCard: 'isCreatePending',
    }),
  },
};
</script>
