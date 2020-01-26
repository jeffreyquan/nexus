<template>
  <v-container fluid pa-8>
    <v-row class="progress-bar board-header">
      <v-col cols="12">
        <v-progress-linear
          v-if="loadingBoard || loadingLists || loadingCards"
          indeterminate
          color="green"
        ></v-progress-linear>
        <v-row>
          <h2 v-if="board">{{ board.name }}</h2>
          <v-spacer></v-spacer>
          <v-btn
            v-if="board"
            @click="toggleActivities"
          >
            Activities
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-row
          v-if="!loadingBoardError && !loadingLists && !loadingCards && user"
          justify="start"
          align="start"
          class="list-tiles"
        >
          <v-col
            v-for="list in lists"
            :key="list._id"
            class="flex-grow-0 pl-1"
          >
            <list-tile
              @delete-list="deleteList(list._id, list.name)"
              :list="list"
              :setDroppingList="setDroppingList"
              :droppingList="droppingList"
              :cardsByListId="cardsByListId"
              :startDraggingCard="startDraggingCard"
              :dropCard="dropCard"
              :createActivity="createActivity"
              :user="user"
            >
            </list-tile>
          </v-col>
          <v-col
            class="flex-grow-0"
          >
            <list-form
              :createActivity="createActivity"
              :boardId="this.$route.params.id"
              :user="user"
            >
            </list-form>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div
      class="activities-log"
      v-if="activitiesOpen"
    >
      <activities
        :activitiesByDate="activitiesByDate"
        @close-activities="toggleActivities"
      >
      </activities>
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Activities from '../components/Activities.vue';
import ListForm from '../components/ListForm.vue';
import ListTile from '../components/ListTile.vue';

export default {
  name: 'board',
  components: {
    Activities,
    ListForm,
    ListTile,
  },
  data: () => ({
    activitiesOpen: true,
    draggingCard: null,
    droppingList: null,
    board: {},
  }),
  async mounted() {
    this.board = await this.getBoard(this.$route.params.id);
    this.findLists({
      query: {
        boardId: this.$route.params.id,
      },
    });
    this.findCards({
      query: {
        boardId: this.$route.params.id,
      },
    });
    this.findActivities({
      query: {
        boardId: this.$route.params.id,
      },
    });
  },
  methods: {
    ...mapActions('boards', { getBoard: 'get' }),
    ...mapActions('lists', { findLists: 'find', removeList: 'remove' }),
    ...mapActions('cards', { findCards: 'find' }),
    ...mapActions('activities', { findActivities: 'find' }),
    deleteList(id, listName) {
      this.removeList([id, {
        query: {
          boardId: this.$route.params.id,
        },
      }]);
      this.createActivity(`**${this.user.user.name}** deleted list **${listName}**`);
    },
    createActivity(str) {
      const { Activity } = this.$FeathersVuex.api;
      const activity = new Activity();
      activity.text = str;
      activity.boardId = this.$route.params.id;
      activity.userId = this.user.userId;
      activity.save();
    },
    toggleActivities() {
      this.activitiesOpen = !this.activitiesOpen;
    },
    startDraggingCard(card) {
      this.draggingCard = card;
    },
    setDroppingList(event, list) {
      event.preventDefault();
      this.droppingList = list;
    },
    async dropCard() {
      if (this.droppingList) {
        if (this.draggingCard.listId !== this.droppingList._id) {
          const fromList = this.lists.find(list => list._id === this.draggingCard.listId);
          const toList = this.lists.find(list => list._id === this.droppingList._id);
          this.draggingCard.listId = this.droppingList._id;
          await this.draggingCard.save();
          this.createActivity(`**${this.user.user.name}** moved card **${this.draggingCard.title}** from **${fromList.name}** to **${toList.name}**`);
        }
      }
      this.droppingList = null;
      this.draggingCard = null;
    },
  },
  computed: {
    ...mapState('auth', {
      user: 'payload',
    }),
    ...mapState('boards', {
      loadingBoard: 'isGetPending',
      loadingBoardError: 'errorOnGet',
    }),
    ...mapState('lists', {
      loadingLists: 'isFindPending',
      loadingListsError: 'errorOnfind',
    }),
    ...mapState('cards', {
      loadingCards: 'isFindPending',
      loadingCardsError: 'errorOnfind',
    }),
    ...mapGetters('lists', { findListsInStore: 'find' }),
    ...mapGetters('cards', { findCardsInStore: 'find' }),
    ...mapGetters('activities', { findActivitiesInStore: 'find' }),
    activities() {
      return this.findActivitiesInStore({
        query: {
          boardId: this.$route.params.id,
        },
      }).data;
    },
    lists() {
      return this.findListsInStore({
        query: {
          boardId: this.$route.params.id,
        },
      }).data;
    },
    cards() {
      return this.findCardsInStore({
        query: {
          boardId: this.$route.params.id,
        },
      }).data;
    },
    cardsByListId() {
      return this.cards.reduce((obj, card) => {
        if (!obj[card.listId]) {
          // eslint-disable-next-line no-param-reassign
          obj[card.listId] = [];
        }
        obj[card.listId].push(card);
        return obj;
      }, {});
    },
    activitiesByDate() {
      return this.activities.slice().reverse();
    },
  },
};
</script>

<style scoped lang="scss">
.list-tiles {
  display: flex;
  flex: 1;
  overflow-x: auto;
  height: 80vh;
  max-width: 100vw;
  flex-wrap: nowrap;
}

.activities-log {
  position: fixed;
  width: 300px;
  top: 50px;
  right: 0;
}
</style>
