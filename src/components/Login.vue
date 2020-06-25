<template>
  <div class="login">
    <el-row :gutter="20">
      <el-col :span="8" :offset="8">
        <el-form v-if="step === 'enterphone'">
          <el-form-item label="Số điện thoại">
            <el-input v-model="phone" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="medium" @click="handleLogin">
              Đăng nhập
            </el-button>
          </el-form-item>
        </el-form>
        <el-form v-if="step === 'entercode'">
          <el-form-item label="Mã xác nhận">
            <el-input v-model="verificationCode" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="medium" @click="handleVerificationCode">
              Xác nhận
            </el-button>
          </el-form-item>
        </el-form>
        <div class="send-message" v-if="step === 'sendmessage'">
          <div>
            <code>{{ user.id }} - {{ user.phone_number }} - {{ user.first_name }} {{ user.last_name }} </code>
          </div>
          <div>
            <code>{{ contacts }}</code>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TdLibController from '../telegram/tdclient'

export default {
  name: 'Login',
  props: {},
  data() {
    return {
      step: 'enterphone',
      countryCode: '+84',
      phone: '+84',
      verificationCode: '',
      user: '',
      contacts: ''
    }
  },
  created() {
    TdLibController.init({
      onUpdate: update => {
        console.log('Update: ', update)
        switch (update['@type']) {
          case 'updateAuthorizationState':
            switch (update.authorization_state['@type']) {
              case 'authorizationStateWaitTdlibParameters':
                TdLibController.sendTdParameters()
                break
              case 'authorizationStateWaitEncryptionKey':
                TdLibController.send({ '@type': 'checkDatabaseEncryptionKey' });
                break;
            }
            break
          case 'updateUser':
            this.step = 'sendmessage'
            this.user = update.user
            this.getContacts()
            break
        }
      }
    })

  },
  methods: {
    async getContacts() {
      this.contacts = await TdLibController.send({
        '@type': 'getContacts'
      })
    },

    handleLogin() {
      if (!this.isValidPhoneNumber(this.phone)) {
        return
      }

      TdLibController
        .send({
          '@type': 'setAuthenticationPhoneNumber',
          phone_number: this.phone
        })
        .then(() => {
          this.step = 'entercode'
        })
        .catch (error => {
          this.$message({
            message: error.mesage || error,
            type: 'error'
          })
        })
    },

    handleVerificationCode() {
      TdLibController
        .send({
          '@type': 'checkAuthenticationCode',
          code: this.verificationCode
        })
        .then(() => {
          console.log('success')
          this.step = 'sendmessage'
        })
        .catch(error => {
          this.$message({
            message: error.mesage || error,
            type: 'error'
          })
        })
    },

    isValidPhoneNumber(phoneNumber) {
      if (!phoneNumber) return false;

      let isBad = !phoneNumber.match(/^[\d\-+\s]+$/);
      if (!isBad) {
        phoneNumber = phoneNumber.replace(/\D/g, '');
        if (phoneNumber.length < 7) {
            isBad = true;
        }
      }

      return !isBad;
    },

    formatByPattern(phone, pattern) {
      phone = this.clearPhone(phone);

      let result = '';
      let index = 0;
      for (let i = 0; i < pattern.length && index < phone.length; i++) {
        if (pattern[i] >= '0' && pattern[i] <= '9') {
          result += pattern[i];
          if (phone[index] === pattern[i]) {
              index++;
          }
        } else if (pattern[i] === ' ') {
          result += pattern[i];
        } else if (pattern[i] === 'X') {
          result += phone[index++];
        }
      }

      result += ' ' + phone.substring(index);

      return '+' + result;
    },

    phoneEquals(phone1, phone2) {
        return this.clearPhone(phone1) === this.clearPhone(phone2);
    },

    isWhitelistKey(key) {
      if (key >= '0' && key <= '9') return true;
      if (key === ' ') return true;
      if (key === '+') return true;

      return false;
    },

    clearPhone(phone) {
      if (!phone) return phone;

      return phone
          .replace(/ /g, '')
          .replace('+', '')
          .toLowerCase();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
