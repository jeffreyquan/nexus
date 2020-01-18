<template>
<v-card
  class="mx-auto"
  max-width="400"
  >
  <v-card-text class="text--primary">
    <div>Create Board</div>
    <div>
      <v-form
        v-if="!creating"
        v-model="valid"
        ref="form"
        @submit.prevent="onCreateBoard"
        @keydown.prevent.enter
      >
        <v-text-field
          v-model="board.name"
          :rules="notEmptyRules"
          label="Name"
          required
        ></v-text-field>
        <v-btn type="submit" :disabled="!valid">Create</v-btn>
      </v-form>
      <v-progress-circular
        v-if="creating"
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
  </v-card-text>
</v-card>
</template>

<script>
import notEmptyRules from '../rules';

export default {
  props: ['creating', 'createBoard'],
  data: () => ({
    valid: false,
    board: {
      name: '',
    },
    notEmptyRules,
  }),
  methods: {
    async onCreateBoard() {
      console.log(this.board);
      if (this.valid) {
        await this.createBoard(this.board);
        this.board = {
          name: '',
        };
      }
    },
  },
};
</script>
