<template>
  <v-card
    class="board-tile-form"
  >
    <v-row align="center">
      <v-col cols="12">
        <v-form
          v-if="!creating"
          v-model="valid"
          ref="form"
          @submit.prevent="onCreateBoard"
          @keydown.prevent.enter
        >
          <v-row justify="center" align="center" no-gutters>
            <v-col cols="8">
              <v-text-field
                v-model="board.name"
                :rules="notEmptyRules"
                label="Name"
                required
              >
              </v-text-field>
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
      </v-col>
    </v-row>
    <v-progress-linear
      v-if="creating"
      color="deep-purple accent-4"
      indeterminate
      rounded
      height="6"
    ></v-progress-linear>
  </v-card>
</template>

<script>
import notEmptyRules from '../rules';

export default {
  name: 'board-form',
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

<style scoped lang="scss">
.board-tile-form {
  display: flex;
  height: 100px;
  align-items: center;
  background-color: rbga(0, 0, 0, 0.5) !important;

  &__input > form {
    flex-direction: row;
  }
}
</style>
