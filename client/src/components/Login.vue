<template>
  <div>
      <h1>Effettua il login</h1>

      <input type="username" v-model="username" name="username" placeholder="Username">
      <input type="password" v-model="password" name="password" placeholder="Password">
      <br>
      <button @click="login">Login</button>

      <div class="error" v-html="error"/>
      <br>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async login () {
      try {
        await AuthenticationService.login({
          'username': this.username,
          'password': this.password
        })
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.error{
  color: red;
}
</style>>