import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import SignUp from '../views/SignUp.vue';
import Login from '../views/Login.vue';
import Boards from '../views/Boards.vue';
import Board from '../views/Board.vue';

import store from '../store';

Vue.use(VueRouter);

function isLoggedIn(to, from, next) {
  store.dispatch('auth/authenticate').then(() => {
    next();
  }).catch(() => {
    next('/login');
  });
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter(to, from, next) {
      store.dispatch('auth/authenticate').then(() => {
        next('/boards');
      }).catch(() => {
        next('/login');
      });
    },
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUp,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/boards',
    name: 'boards',
    component: Boards,
    beforeEnter: isLoggedIn,
  },
  {
    path: '/boards/:id',
    name: 'board',
    component: Board,
    beforeEnter: isLoggedIn,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
