<template>
  <div>
      <h1>Effettua il login</h1>

      <input type="email" v-model="email" name="email" placeholder="Email">
      <input type="password" v-model="password" name="password" placeholder="Password">
      <br>
      <button @click="login">Login</button>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login () {
      AuthenticationService.login({
        'email': this.email,
        'password': this.password
      }).then((response) => {
        console.log(response)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
