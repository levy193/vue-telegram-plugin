import VueTelegramComponent from './VueTelegram/Auth.vue'
import TdControllerLib from './VueTelegram/TdClient'
import TeleEventBus from './VueTelegram/TeleEventBus'

const VueTelegram = {
  install: (Vue, options) => {
    Vue.component('VueTelegramAuth', VueTelegramComponent)

    /**
     * TeleEventBus
     */
    const eventBus = new TeleEventBus(Vue)
    Vue.prototype.$vTelegramBus = eventBus

    /**
     * Tdlib controller
     */
    const tdController = new TdControllerLib(options)

    Vue.prototype.$vTelegram = {
      init: () => {
        tdController.init({
          onUpdate: update => {
            // console.log(update)

            switch (update['@type']) {
              case 'updateAuthorizationState':
                switch (update.authorization_state['@type']) {
                  case 'authorizationStateWaitTdlibParameters':
                    tdController.sendTdParameters()
                    break
                  case 'authorizationStateWaitEncryptionKey':
                    tdController.send({ '@type': 'checkDatabaseEncryptionKey' })
                    break
                  case 'authorizationStateWaitPhoneNumber':
                    eventBus.emit('authorizationStateWaitPhoneNumber')
                    break
                  case 'authorizationStateWaitCode':
                    eventBus.emit('authorizationStateWaitCode')
                    break
                  case 'authorizationStateReady':
                    tdController.update('isAuthenticated', true)
                    eventBus.emit('authorizationStateReady')
                    break
                }
            }
          }
        })

        tdController.update('hasInit', true)
      },

      login(phoneNumber) {
        return tdController
          .send({
            '@type': 'setAuthenticationPhoneNumber',
            phone_number: phoneNumber
          })
      },

      confirmVerificationCode(verificationCode) {
        return tdController
          .send({
            '@type': 'checkAuthenticationCode',
            code: verificationCode
          })
      },

      async getMe() {
        const user = await tdController.send({
          '@type': 'getMe'
        })

        tdController.update('user', user)

        return user
      },

      async searchChats({ query, limit }) {
        const chats = {}

        const chatList = await tdController.send({
          '@type': 'searchChatsOnServer',
          query,
          limit
        })

        for (const chatId of chatList.chat_ids) {
          const chat = await tdController.send({
            '@type': 'getChat',
            chat_id: chatId
          })

          chats[chatId] = {
            id: chat.id,
            type: chat.type,
            title: chat.title,
            permissions: chat.permissions
          }
        }

        tdController.update('chats', chats)

        return chats
      },

      sendMessage({ chatId, message }) {
        return tdController
          .send({
            '@type': 'sendMessage',
            chat_id: chatId,
            input_message_content: {
              '@type': 'inputMessageText',
              text: {
                '@type': 'formattedText',
                text: message
              },
              disable_web_page_preview: false,
              clear_draft: true
            }
          })
      },

      logout() {
        return tdController.logout()
      }
    }
  }
}

export default VueTelegram
