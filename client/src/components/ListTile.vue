<template>
  <v-card
    @dragover="setDroppingList($event, list)" :class="droppingList === list ? 'light-blue' : ''" @dragend="dropCard()"
    class="list-tile"
  >
    <v-card-title primary-title>
      <v-row>
        <v-col>
          <div class="headline">{{ list.name }}</div>
          <div v-if="cardsByListId[list._id]">
            <v-row
              xs12
              v-for="card in cardsByListId[list._id]"
              :key="card._id"
              class="pa-1"
            >
              <v-card
                width="100%"
                draggable="true" @dragstart="startDraggingCard(card)"
              >
                {{ card.title }}
              </v-card>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-card-title>
    <card-form
      :user="user.user"
      :createActivity="createActivity"
      :listId="list._id"
      :boardId="$route.params.id"
    >
    </card-form>
  </v-card>
</template>

<script>
import CardForm from './CardForm.vue';

export default {
  name: 'list-tile',
  props: [
    'list',
    'setDroppingList',
    'droppingList',
    'cardsByListId',
    'startDraggingCard',
    'dropCard',
    'createActivity',
    'user',
  ],
  components: {
    CardForm,
  },
};
</script>

<style scoped lang="scss">
.list-tile {
  width: 300px;
}
</style>
