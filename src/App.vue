<template>
  <div id="app">
    <login />
  </div>
</template>

<script>
import Login from './components/Login'

export default {
  name: 'App',
  components: {
    Login
  },
  props: {
    TdLibController: {
      type: [Object, Function],
      default: null
    }
  },
  data() {
    return {
      status: 'authSuccess',
      phone: '+84'
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
