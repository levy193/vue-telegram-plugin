<template>
  <div class="vue-telegram">
    <div class="logout">
      <el-button @click="handleLogout">Logout</el-button>
    </div>
    <el-dialog
      :visible.sync="showDialog"
      :append-to-body="true"
    >
      <el-row :gutter="20">
        <el-col :span="8" :offset="8">
          <el-form v-if="state === 'enterPhoneNumber'">
            <el-form-item label="Số điện thoại">
              <el-input v-model="phone" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="medium" @click="handleLogin">
                Đăng nhập
              </el-button>
            </el-form-item>
          </el-form>
          <el-form v-if="state === 'enterVerificationCode'">
            <el-form-item label="Mã xác nhận">
              <el-input v-model="verificationCode" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="medium" @click="handleVerificationCode">
                Xác nhận
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      state: '',
      showDialog: false,
      phone: '+84',
      verificationCode: ''
    }
  },

  created() {
    this.$vTelegramBus.on('authorizationStateWaitPhoneNumber', async () => {
      this.state = 'enterPhoneNumber'
      this.showDialog = true
    })

    this.$vTelegramBus.on('authorizationStateWaitCode', async () => {
      this.state = 'enterVerificationCode'
      this.showDialog = true
    })

    this.$vTelegramBus.on('authorizationStateReady', () => {
      this.state = 'authorizationStateReady'
      this.showDialog = false
    })
  },

  destroyed() {
    this.$vTelegramBus.off('authorizationStateWaitPhoneNumber', () => {
      console.log('[VUE_TELEGRAM] Stop listening authorizationStateWaitPhoneNumber')
    })

    this.$vTelegramBus.off('authorizationStateWaitCode', () => {
      console.log('[VUE_TELEGRAM] Stop listening authorizationStateWaitCode')
    })
  },

  methods: {
    handleLogin() {
      this.$vTelegram
        .login(this.phone)
        .catch(error => {
          console.error(error)
        })
    },

    handleVerificationCode() {
      this.$vTelegram
        .confirmVerificationCode(this.verificationCode)
        .catch(error => {
          console.error(error)
        })
    },

    handleLogout() {
      this.$vTelegram.logout()
    }
  }
}
</script>
