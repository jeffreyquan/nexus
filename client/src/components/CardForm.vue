<template>
  <v-card
    class="card-form"
  >
    <v-row justify="center" align="center">
      <v-col cols="12">
        <v-form
          v-if="!creatingCard"
          v-model="validCard"
          ref="form"
          @submit.prevent="createCard"
        >
          <v-row justify="center" align="center" no-gutters>
            <v-col cols="8">
              <v-text-field
                v-model="card.title"
                :rules="notEmptyRules"
                label="Title"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn
                type="submit"
                :disabled="!validCard"
                text
                icon
              >
                <v-icon dark large>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-progress-linear
          v-if="creatingCard"
          color="deep-purple accent-4"
          indeterminate
          rounded
          height="6"
        ></v-progress-linear>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import notEmptyRules from '../rules';

export default {
  name: 'card-form',
  props: ['listId', 'list', 'boardId', 'createActivity', 'user'],
  data: () => ({
    creatingCard: false,
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
        this.creatingCard = true;
        await card.save();
        this.creatingCard = false;
        this.card = {
          title: '',
          members: [],
        };
        this.createActivity(`**${this.user.name}** added **${card.title}** card to **${this.list.name}** list`);
      }
    },
  },
};
</script>

<style scopedlang="scss">
.card-form {
  padding: 0;
}
</style>
