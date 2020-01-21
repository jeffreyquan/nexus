<template>
  <v-container fluid>
    <v-row class="progress-bar">
      <v-progress-linear
      v-if="loading"
      indeterminate
      color="green"
    ></v-progress-linear>
    </v-row>
    <v-row align="start" justify="center">
      <v-col sm="12" md="8">
        <v-row v-if="!loading">
          <v-col cols="6" sm="6" md="4" lg="3" v-for="board in boards" :key="board._id" pa-2>
            <board-tile
            :board="board"
            >
            </board-tile>
          </v-col>
          <v-col cols="6" sm="6" md="4" lg="3">
            <board-form
                :creating="creating"
                :createBoard="createBoard"
            ></board-form>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
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

<style scoped lang="scss">
.progress-bar {
  height: 20px;
}
</style>
