import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css'
import SmartTable from 'vuejs-smart-table'


Vue.use(SmartTable)
Vue.use(require('vue-moment'))

Vue.config.productionTip = false
Vue.use(vuetify)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')