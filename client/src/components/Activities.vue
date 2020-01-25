<template>
  <v-layout
    class="activities-log"
    row
    min-width="300px"
  >
    <v-card
      width="100%"
      min-height="100vh"
    >
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Activities</h3>
        </div>
        <v-spacer></v-spacer>
        <v-icon @click="onToggleActivities">mdi-close</v-icon>
      </v-card-title>
      <v-list three-line class="overflow-y-auto" max-height="80vh">
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
  </v-layout>
</template>

<script>
import marked from 'marked';

export default {
  props: ['activitiesByDate', 'toggleActivities'],
  methods: {
    markdown(str) {
      return marked(str);
    },
    onToggleActivities() {
      this.$emit('close-activities');
    },
  },
};
</script>
