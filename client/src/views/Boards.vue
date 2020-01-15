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
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'boards',
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
  },
  computed: {
    ...mapState('boards', { loading: 'isFindPending' }),
    ...mapGetters('boards', { findBoardsInStore: 'find' }),
    boards() {
      return this.findBoardsInStore({ query: {} });
    },
  },
};
</script>
