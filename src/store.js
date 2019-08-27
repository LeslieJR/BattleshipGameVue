import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  // state: {
  //   // put variables and collections here
  //   ships: []
  // },

  // actions: {
  //   // put asynchronous functions that can call one or more mutation functions
  //   loadingShips({
  //     commit
  //   }) {
  //     axios
  //       .get('/api/game_view/1')
  //       .then(response => response.data.ships)
  //       .then(ships => {
  //         commit('SET_SHIPS', ships)
  //       })
  //   }
  // },
  // mutations: {
  //   // put sychronous functions for changing state e.g. add, edit, delete
  //   SET_SHIPS(state, ships) {
  //     state.ships = ships
  //   }
  // }
})