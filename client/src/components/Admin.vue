<template>
  <div id="admin">
    <b-navbar class="mb-3" toggleable="sm" type="light" variant="light">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

      <b-navbar-brand>ChiassoTV</b-navbar-brand>

      <b-collapse id="nav-text-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/admin/utenti">Gestione utenti</b-nav-item>
          <b-nav-item href="/admin/serie">Gestione serie</b-nav-item>
          <b-nav-item href="/admin/banner">Gestione banner</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
            <b-nav-item class="font-weight-bold" v-on:click="logout">Logout</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <main>
      <!-- Admin pages will load inside router-view element -->
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
// Import Authentication service
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'admin',
  methods: {
    logout: function () {
      // Delete token
      AuthenticationService.removeToken()

      // Redirect to login page
      this.$router.push('/admin/login')
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

</style>