/* eslint-disable no-underscore-dangle */
<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row align-center wrap>
        <v-progress-circular
          v-if="loading"
          :size="50"
          color="primary"
          indeterminate
         ></v-progress-circular>
          <v-flex sm3 v-for="board in boards" :key="board._id" pa-2>
            <v-card v-if="!loading">
              <v-card-title primary-title>
                <div class="headline">{{ board.name }}</div>
              </v-card-title>
              <v-card-actions>
                <v-btn color="primary" :to="{ name: 'board', params: { id: board._id } }">Go</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-flex sm4 pa-2>
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
                  @submit.prevent="createBoard"
                  @keydown.prevent.enter
                >
                  <v-text-field
                    v-model="board.name"
                    :rules="nameRules"
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
        this.board = {
          name: '',
        };
      }
    },
  },
  computed: {
    ...mapState('auth', { user: 'payload' }),
    ...mapState('boards', {
      loading: 'isFindPending',
      creating: 'isCreatePending',
    }),
    ...mapGetters('boards', { findBoardsInStore: 'find' }),
    boards() {
      return this.user ? this.findBoardsInStore({
        query: {
          ownerId: this.user.user._id,
        },
      }).data : [];
    },
  },
};
</script>
