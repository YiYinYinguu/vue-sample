import Vue from 'vue'
import VueRouter from 'vue-router'
import welcomeView from '../views/welcome-view.vue'
import vueSample from '../views/vue-sample.vue'
import contactView from '../views/contact-view.vue'
import AudioView from '../views/AudioView.vue'
import DataInsight from "../views/DataInsight.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: welcomeView
  },
  {
    path: '/audio',
    name: 'audio',
    component: AudioView
  },
  {
    path: '/insight',
    name: 'insight',
    component: DataInsight
  },
  {
    path: '/vue-sample',
    name: 'vue sample',
    component: vueSample
  },

  {
    path: '/contact',
    name: 'contact',
    component: contactView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
