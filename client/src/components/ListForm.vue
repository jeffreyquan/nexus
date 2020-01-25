<template>
  <v-card
    class="list-form"
    >
    <v-row align="center">
      <v-col cols="12">
        <v-form
          v-if="!creatingList"
          v-model="validList"
          ref="form"
          @submit.prevent="createList"
          @keydown.prevent.enter
        >
          <v-row justify="center" align="center" no-gutters>
            <v-col cols="8">
              <v-text-field
                v-model="list.name"
                :rules="notEmptyRules"
                label="Name"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn
                type="submit"
                :disabled="!validList"
                text
                icon
              >
                <v-icon dark large>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <v-progress-linear
      v-if="creatingList"
      color="deep-purple accent-4"
      indeterminate
      rounded
      height="6"
    ></v-progress-linear>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import notEmptyRules from '../rules';

export default {
  props: ['createActivity', 'boardId', 'user'],
  data: () => ({
    validList: false,
    list: {
      name: '',
      order: 0,
      archived: false,
    },
    notEmptyRules,
  }),
  methods: {
    async createList() {
      if (this.validList) {
        const { List } = this.$FeathersVuex.api;
        this.list.boardId = this.boardId;
        const list = new List(this.list);
        await list.save();
        this.list = {
          name: '',
          order: 0,
          archived: false,
        };
        this.createActivity(`**${this.user.user.name}** created list **${list.name}**`);
      }
    },
  },
  computed: {
    ...mapState('lists', {
      creatingList: 'isCreatePending',
    }),
  },
};
</script>

<style scoped lang="scss">
.list-form {
  display: flex;
  height: 100px;
  width: 300px;
  align-items: center;
  background-color: rbga(0, 0, 0, 0.5) !important;

  &__input > form {
    flex-direction: row;
  }
}
</style>
