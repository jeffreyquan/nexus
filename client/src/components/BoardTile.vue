<template>
  <a class="board-tile" :href="'#/boards/' + board._id">
    <v-card class="board-tile__card">
      <v-card-subtitle>
        <div class="subtitle-2">{{ board.name }}</div>
      </v-card-subtitle>
  </v-card>
  </a>
</template>

<script>
export default {
  props: ['board'],
};
</script>

<style scoped lang="scss">
.board-tile {
  text-decoration: none;
  &__card {
    height: 100px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
