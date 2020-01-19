<template>
  <v-layout row fill-height style="align-items:stretch;">
    <v-flex xs12>
      <v-card height="50%">
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Activities</h3>
          </div>
        </v-card-title>
        <v-list three-line>
          <v-list-item v-for="activity in activitiesByDate" :key="activity._id" class="activity-block" @click="">
            <v-list-item-avatar>
              <span class="mdi mdi-tooltip"></span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-subtitle class="activity-content" v-html="markdown(activity.text)"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import marked from 'marked';

export default {
  props: ['activitiesByDate'],
  methods: {
    markdown(str) {
      return marked(str);
    },
  },
};
</script>

<style>

</style>
