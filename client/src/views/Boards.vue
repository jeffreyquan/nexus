<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-progress-circular
          v-if="loading"
          :size="50"
          color="primary"
          indeterminate
         ></v-progress-circular>
         <pre v-if="!loading">
           {{ boards }}
         </pre>
          <v-flex sm4>
            <v-card
            class="mx-auto"
            max-width="400"
          >
            <v-card-text class="text--primary">
              <div>Create Board</div>
              <div>
                <v-form
                  v-if="!creating"
                  @submit.prevent="createBoard"
                  @keydown.prevent.enter
                  ref="form"
                  v-model="valid"
                >
                  <v-text-field
                    v-model="board.name"
                    :rules="nameRules"
                    label="Name"
                    required
                  ></v-text-field>
                  <v-btn type="submit" :disabled="!valid">Create</v-btn>
                </v-form>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'boards',
  data: () => ({
    creating: false,
    valid: false,
    board: {
      name: '',
    },
    nameRules: [
      v => !!v || 'Name is required',
    ],
  }),
  mounted() {
    this.findBoards({ query: {} })
      .then((response) => {
        console.log(response);
        const boards = response.data || response;
        console.log(boards);
      });
  },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),
    createBoard() {
      if (this.valid) {
        const { Board } = this.$FeathersVuex.api;
        console.log(Board);
        const board = new Board(this.board);
        board.save();
      }
    },
  },
  computed: {
    ...mapState('boards', { loading: 'isFindPending' }),
    ...mapGetters('boards', { findBoardsInStore: 'find' }),
    boards() {
      return this.findBoardsInStore({ query: {} }).data;
    },
  },
};
</script>
