<template>
  <v-container fluid>
    <v-layout>
      <v-layout row wrap>
        <v-progress-circular
          v-if="loadingBoard || loadingLists"
          :size="50"
          color="primary"
          indeterminate
        >
        </v-progress-circular>
        <v-flex xs10 v-if="!loadingBoardError && user">
          <v-layout row wrap>
            <v-flex xs12>
              <h2 v-if="board">{{ board.name }}</h2>
            </v-flex>
            <v-flex sm3 v-for="list in lists" :key="list._id" pa-2>
              <v-card v-if="!loadingLists" @dragover="setDroppingList($event, list)" :class="droppingList === list ? 'light-blue' : ''" @dragend="dropCard()">
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
            </v-flex>
            <v-flex sm4 pa-2>
              <list-form
                :createActivity="createActivity"
                :boardId="this.$route.params.id"
                :user="user"
                >
              </list-form>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs2>
          <activities :activitiesByDate="activitiesByDate"></activities>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Activities from '../components/Activities.vue';
import CardForm from '../components/CardForm.vue';
import ListForm from '../components/ListForm.vue';

export default {
  name: 'board',
  components: {
    Activities,
    CardForm,
    ListForm,
  },
  data: () => ({
    draggingCard: null,
    droppingList: null,
    board: {},
  }),
  mounted() {
    this.getBoard(this.$route.params.id);
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
    ...mapActions('lists', { findLists: 'find' }),
    ...mapActions('cards', { findCards: 'find' }),
    ...mapActions('activities', { findActivities: 'find' }),
    createActivity(str) {
      const { Activity } = this.$FeathersVuex.api;
      const activity = new Activity();
      activity.text = str;
      activity.boardId = this.$route.params.id;
      activity.userId = this.user.userId;
      activity.save();
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
