import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appURL: 'https://reqres.in/api/users?',
    menu: true,
    geodataIn: {
      users: []
    },
  },
  getters: {
  },
  mutations: {
    updateMenu(state, data) {
      // mutate state
      state.menu = data
    }
  },
  actions: {
  },
  modules: {
  }
})
