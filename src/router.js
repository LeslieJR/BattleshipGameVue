import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('./views/Registration.vue')
    },
    {
      path: '/game_view/:gp',
      name: 'game',
      component: () => import('./views/Gameview.vue'),
      props: true,
    },

  ]
})