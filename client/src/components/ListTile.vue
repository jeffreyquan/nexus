<template>
  <v-card @dragover="setDroppingList($event, list)" :class="droppingList === list ? 'light-blue' : ''" @dragend="dropCard()">
    <v-card-title primary-title>
      <v-layout column>
        <v-flex xs12>
          <div class="headline">{{ list.name }}</div>
        </v-flex>
        <div v-if="cardsByListId[list._id]">
          <v-flex
            xs12
            v-for="card in cardsByListId[list._id]"
            :key="card._id"
            class="pa-1"
          >
            <v-card draggable="true" @dragstart="startDraggingCard(card)">
              {{ card.title }}
            </v-card>
          </v-flex>
        </div>
      </v-layout>
    </v-card-title>
    <v-card-actions>
        <card-form
          :user="user.user"
          :createActivity="createActivity"
          :listId="list._id"
          :boardId="$route.params.id"
        >
        </card-form>
    </v-card-actions>
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
