<template>
  <v-row align="center">
    <v-col cols="10" class="body-2 pl-5">
      <v-textarea
        v-model="value"
        @blur="editCard"
        rows="1"
      >
      </v-textarea>
    </v-col>
    <v-col cols="2">
      <v-btn
        @click="deleteCard()"
        text
        icon
        x-small
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'card-tile',
  props: ['card', 'list', 'createActivity', 'user'],
  data: () => ({
    initialCardTitle: '',
    value: '',
  }),
  mounted() {
    this.initialCardTitle = this.card.title;
    this.value = this.card.title;
  },
  methods: {
    ...mapActions('cards', { removeCard: 'remove', updateCard: 'patch' }),
    deleteCard() {
      this.removeCard([this.card._id, {
        query: {
          boardId: this.$route.params.id,
        },
      }]);
      this.createActivity(`**${this.user.name}** deleted card **${this.card.title}** from **${this.list.name}**`);
    },
    async editCard() {
      if (this.initialCardTitle !== this.value) {
        await this.updateCard([this.card._id, { title: this.value }, { query: { boardId: this.$route.params.id } }]).title;
        await this.createActivity(`**${this.user.name}** changed **card** from **${this.initialCardTitle}** to **${this.value}**`);
        this.initialCardTitle = this.value;
      }
    },
  },
};
</script>
