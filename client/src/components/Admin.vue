<template>
  <div id="admin">
    <b-navbar toggleable="sm" type="light" variant="light">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

      <b-navbar-brand>ChiassoTV</b-navbar-brand>

      <b-collapse id="nav-text-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/admin/utenti">Gestione utenti</b-nav-item>
          <b-nav-item href="/admin/serie">Gestione serie</b-nav-item>
          <b-nav-item href="/admin/banner">Gestione banner</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <main>
      <h1>Admin panel</h1>
      <!-- <img src="./assets/logo.png" alt="Vue.js PWA"> -->
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'admin'
}
</script>

<style>
body {
  margin: 0;
}
</style>