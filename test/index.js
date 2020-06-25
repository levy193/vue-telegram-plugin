import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueTelegram from '../src/index'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueTelegram, {
  logVerbosityLevel: 0,
  jsLogVerbosityLevel: 0
})

new Vue({
  render: h => h(App),
}).$mount('#app')
