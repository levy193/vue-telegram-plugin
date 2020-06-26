import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import VueTelegram from 'vue-telegram-plugin'
import VueTelegram from '../index'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueTelegram, {
  logVerbosityLevel: 0,
  jsLogVerbosityLevel: 0,
  apiId: '1497957',
  apiHash: '178cf1000113c595e64ab1513dc687c4'
})

new Vue({
  render: h => h(App),
}).$mount('#app')
