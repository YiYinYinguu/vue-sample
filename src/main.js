import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  BootstrapVue,
  //IconsPlugin
} from 'bootstrap-vue'
// import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
//Vue.use(IconsPlugin)

import VueMeta from 'vue-meta'

Vue.use(VueMeta)
import VueCollapse from 'vue2-collapse'

Vue.use(VueCollapse);


Vue.config.productionTip = false
/* GLOBAL CSS */
/* note this is outside of 'components' and global for the whole site */
import './assets/css/global.css'
import { library } from '@fortawesome/fontawesome-svg-core'
// SOLID
import {
  faCheckCircle,
  faEnvelope,
  faCheck,
  faCircle as fasFaCircle,
  faDotCircle as fasFaDotCircle,
  faPhoneAlt,
  faAngleDown,
  faAngleUp,

} from '@fortawesome/free-solid-svg-icons'
// REGULAR
import {
  faCircle as farFaCircle,
  faDotCircle as farFaDotCircle

} from '@fortawesome/free-regular-svg-icons'

// BRANDS


import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(
  faCheckCircle,
  faEnvelope,
  faPhoneAlt,
  faCheck,
  fasFaDotCircle, farFaDotCircle,
  fasFaCircle, farFaCircle,
  faAngleDown,
  faAngleUp,


)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
