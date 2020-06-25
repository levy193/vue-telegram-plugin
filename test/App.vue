<template>
  <div id="vue-telegram">
    <VueTelegramAuth />
    <div class="message">
      <div v-if="user">Login as {{ user.first_name + ' ' + user.last_name }}</div>
      <div v-if="chats !== {}">
        <el-select
          v-model="chatId"
        >
          <el-option
            v-for="item in chats"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </div>
      <el-form v-if="chatId">
        <el-form-item label="Message">
          <el-input v-model="message" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="handleSendMessage">
            Gửi
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      chats: {},
      chatId: null,
      message: ''
    }
  },

  created() {
    this.$vTelegram.init()

    this.$vTelegramBus.on('authorizationStateReady', async () => {
      this.user = await this.$vTelegram.getMe()
      this.chats = await this.$vTelegram.getChats({
        query: 'MANTIS',
        limit: 10
      })
    })
  },

  methods: {
    handleSendMessage() {
      this.$vTelegram.sendMessage({
        chatId: this.chatId,
        message: this.message
      }).then(() => {
        this.message = ''
      }).catch(error => {
        console.error(error)
      })
    }
  }
}
</script>
