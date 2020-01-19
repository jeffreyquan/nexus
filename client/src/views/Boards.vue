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
          <v-flex row v-if="!loading">
            <v-flex sm3 v-for="board in boards" :key="board._id" pa-2>
              <board-tile :board="board"></board-tile>
            </v-flex>
          </v-flex>
          <v-flex sm4 pa-2>
            <board-form
              :creating="creating"
              :createBoard="createBoard"
            ></board-form>
          </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import BoardTile from '../components/BoardTile.vue';
import BoardForm from '../components/BoardForm.vue';

export default {
  name: 'boards',
  components: {
    BoardTile,
    BoardForm,
  },
  mounted() {
    this.findBoards({ query: {} });
  },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),
    async createBoard(board) {
      const { Board } = this.$FeathersVuex.api;
      const newBoard = new Board(board);
      await newBoard.save();
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
