<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap>
        <v-progress-circular
          v-if="loadingBoard || loadingLists"
          :size="50"
          color="primary"
          indeterminate
         ></v-progress-circular>
          <v-flex xs12>
            <h2 v-if="board">{{ board.name }}</h2>
          </v-flex>
          <v-flex sm3 v-for="list in lists" :key="list._id" pa-2>
            <v-card v-if="!loadingLists">
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
                      <v-card>
                        {{ card.title }}
                      </v-card>
                    </v-flex>
                  </div>
                </v-layout>
              </v-card-title>
              <v-card-actions>
                  <create-card
                    :listId="list._id"
                    :boardId="$route.params.id"
                  >
                  </create-card>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-flex sm4 pa-2>
            <v-card
            class="mx-auto"
            max-width="400"
          >
            <v-card-text class="text--primary">
              <div>Create List</div>
              <div>
                <v-form
                  v-if="!creatingList"
                  v-model="validList"
                  ref="form"
                  @submit.prevent="createList"
                  @keydown.prevent.enter
                >
                  <v-text-field
                    v-model="list.name"
                    :rules="nameRules"
                    label="Name"
                    required
                  ></v-text-field>
                  <v-btn type="submit" :disabled="!validList">Create list</v-btn>
                </v-form>
                <v-progress-circular
                  v-if="creatingList"
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
import CreateCard from '../components/CreateCard.vue';

export default {
  name: 'board',
  components: {
    CreateCard,
  },
  data: () => ({
    board: {},
    validList: false,
    list: {
      name: '',
      boardId: '',
      order: 0,
      archived: false,
    },
    nameRules: [
      v => !!v || 'Name is required',
    ],
  }),
  mounted() {
    this.getBoard(this.$route.params.id)
      .then((response) => {
        console.log(response);
        this.board = response.data || response;
        console.log(this.board);
      });
    this.findLists({
      query: {
        boardId: this.$route.params.id,
      },
    }).then((response) => {
      console.log(response);
      // eslint-disable-next-line no-unused-vars
      const lists = response.data || response;
      console.log(this.lists);
    });
    this.findCards({
      query: {
        boardId: this.$route.params.id,
      },
    }).then((response) => {
      console.log(response);
      // eslint-disable-next-line no-unused-vars
      const cards = response.data || response;
      console.log(this.cards);
    });
  },
  methods: {
    ...mapActions('boards', { getBoard: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
    ...mapActions('cards', { findCards: 'find' }),
    createList() {
      if (this.validList) {
        const { List } = this.$FeathersVuex.api;
        console.log(List);
        this.list.boardId = this.$route.params.id;
        const list = new List(this.list);
        list.save();
        this.list = {
          name: '',
          order: 0,
          archived: false,
        };
      }
    },
  },
  computed: {
    ...mapState('boards', {
      loadingBoard: 'isGetPending',
    }),
    ...mapState('lists', {
      loadingLists: 'isFindPending',
      creatingList: 'isCreatePending',
    }),
    ...mapGetters('lists', { findListsInStore: 'find' }),
    ...mapGetters('cards', { findCardsInStore: 'find' }),
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
  },
};
</script>
