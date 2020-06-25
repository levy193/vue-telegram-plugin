import VueTelegramComponent from './VueTelegram/Auth.vue'
import TdControllerLib from './VueTelegram/TdClient'

const VueTelegram = {
  install: (Vue, options) => {
    Vue.component('VueTelegramAuth', VueTelegramComponent)

    const tdController = new TdControllerLib(options)

    Vue.TdControllerLib = tdController
  }
}

export default VueTelegram
