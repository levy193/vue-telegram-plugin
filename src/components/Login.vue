<template>
  <div class="login">
    <el-row :gutter="20">
      <el-col :span="8" :offset="8">
        <el-form>
          <el-form-item label="Số điện thoại">
            <el-input v-model="phone" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="medium" @click="handleLogin">
              Đăng nhập
            </el-button>
          </el-form-item>
        </el-form>
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
      countryCode: '+84',
      phone: '+84'
    }
  },
  created() {
    TdLibController.init()

  },
  methods: {
    handleLogin() {
      if (!this.isValidPhoneNumber(this.phone)) {
        return
      }

      TdLibController
        .send({
          '@type': 'setAuthenticationPhoneNumber',
          phone_number: this.phone
        })
        .then(result => {
          console.log(result)
        })
        .catch (error => {
          console.log(error)
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
