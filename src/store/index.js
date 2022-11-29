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
    audioSrc: null,
    description: "",
    insightType: ['MIN', 'MAX', 'MEAN'],
    spec: {
      title: "Kodak’s Share Price",
      column: 8,
      data: {
        values: [
          {"x": "1990", "Kodak’s Share Price": 28.85, "type": "Cost Per Person"},
          {"x": "1995", "Kodak’s Share Price": 29.64, "type": "Cost Per Person"},
          {"x": "2000", "Kodak’s Share Price": 32.37, "type": "Cost Per Person"},
          {"x": "2005", "Kodak’s Share Price": 36.78, "type": "Cost Per Person"},
          {"x": "2010", "Kodak’s Share Price": 43.47, "type": "Cost Per Person"},
          {"x": "2015", "Kodak’s Share Price": 50.11, "type": "Cost Per Person"},
          {"x": "2020", "Kodak’s Share Price": 106.9,  "type": "Cost Per Person"},
          {"x": "2021", "Kodak’s Share Price": 53.31, "type": "Cost Per Person"},
          {"x": "1990", "Kodak’s Share Price": 2.88,  "type": "Total Cost"},
          {"x": "1995", "Kodak’s Share Price": 2.96,  "type": "Total Cost"},
          {"x": "2000", "Kodak’s Share Price": 3.23,  "type": "Total Cost"},
          {"x": "2005", "Kodak’s Share Price": 3.67,  "type": "Total Cost"},
          {"x": "2010", "Kodak’s Share Price": 4.34,  "type": "Total Cost"},
          {"x": "2015", "Kodak’s Share Price": 5.01,  "type": "Total Cost"},
          {"x": "2020", "Kodak’s Share Price": 4.69,  "type": "Total Cost"},
          {"x": "2021", "Kodak’s Share Price": 5.33,  "type": "Total Cost"},
          // {"x": "1990", "Kodak’s Share Price": 12.88,  "type": "Total "},
          // {"x": "1995", "Kodak’s Share Price": 22.96,  "type": "Total "},
          // {"x": "2000", "Kodak’s Share Price": 33.23,  "type": "Total "},
          // {"x": "2005", "Kodak’s Share Price": 34.67,  "type": "Total "},
          // {"x": "2010", "Kodak’s Share Price": 42.34,  "type": "Total "},
          // {"x": "2015", "Kodak’s Share Price": 51.01,  "type": "Total "},
          // {"x": "2020", "Kodak’s Share Price": 61.69,  "type": "Total "},
          // {"x": "2021", "Kodak’s Share Price": 72.33,  "type": "Total "},
        ]
      },
      layer: [
        {
          "mark": "line",
          "target": ".mark-line",
          "encoding": {
              "x": {"field": "x"},
              "y": {"field": "Kodak’s Share Price"},
              "color": {"field": "type"}
          }
        },
        {
          "mark": "point",
          "target": [".mark-symbol"],
          "encoding": {
              "x": {"field": "x"},
              "y": {"field": "Kodak’s Share Price"},
              "color": {"field": "type"}
          }
        },
        {
          "mark": "text",
          "target": [".mark-text"],
          "encoding": {
              "x": {"field": "x"},
              "y": {"field": "Kodak’s Share Price"},
              "text": {"field": "Kodak’s Share Price"},
          }
        },
      ]
    },
    insights: null

  },
  getters: {
  },
  mutations: {
    updateMenu(state, data) {
      // mutate state
      state.menu = data
    },
    updateAudioSrc(state, src) {
      state.audioSrc = src
    },
    updateDescription(state, des) {
      state.description = des
    },
    updateInsights(state, insights) {
      state.insights = insights
    },
  },
  actions: {
  },
  modules: {
  }
})
