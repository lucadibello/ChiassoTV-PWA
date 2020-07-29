<template>
  <b-container>
    <b-alert :show="logged" variant="success">Accesso eseguito correttamente</b-alert>

    <b-alert
      :show="dismissCountDown"
      dismissible
      variant="danger"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged">

      <div v-html="errors"></div>

      <b-progress
        variant="danger"
        :max="dismissSecs"
        :value="dismissCountDown"
        height="4px"/>
    </b-alert>

    <b-form @submit.prevent="login">
      <h1>Accedi</h1>
      <b-form-group
        id="input-group-1">
        
        <b-form-input
          id="email-input"
          v-model="form.username"
          type="text"
          autocomplete="username"
          required
          placeholder="Inserisci username"/>


        <b-form-input
          class="mt-3"
          id="password-input"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          required
          placeholder="Inserisci password"/>
      </b-form-group>

      <b-button type="submit" variant="primary">Login</b-button>
    </b-form>
  </b-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      errors: '',
      dismissSecs: 10,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      logged: false
    }
  },
  metaInfo: {
    title: 'ChiassoTV - Login',
    meta: [
      { name: 'description', content:  `Accesso al pannello di amministrazione della piattaforma ChiassoTV`},
      { property: 'og:title', content: 'ChiassoTV - Gestione Login'},
    ]
  },
  methods: {
    async login () {
      AuthenticationService.login({
        'username': this.form.username,
        'password': this.form.password
      }).then((result) => {
        // Hide alert
        this.hideAlert()

        // Save token inside localStore
        AuthenticationService.setToken(result.data.token)

        // Show alert box
        this.logged = true

        // Redirect to admin panel
        this.$router.push('/admin')
      }).catch((err) => {
        if (err.response) {
          // add error message inside alert
          this.errors = err.response.data.error

          // Show alert box
          this.showAlert()

          // Hide login alert
          this.logged = false
        } else {
          alert(err.message)
        }
      })
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissSecs
    },
    hideAlert () {
      this.dismissCountDown = 0
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