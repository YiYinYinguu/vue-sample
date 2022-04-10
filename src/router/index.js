import Vue from 'vue'
import VueRouter from 'vue-router'
import welcomeView from '../views/welcome-view.vue'
import geoData from '../views/geo-data.vue'
import contactView from '../views/contact-view.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: welcomeView
  },
  {
    path: '/geo-data',
    name: 'geo data',
    component: geoData
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
