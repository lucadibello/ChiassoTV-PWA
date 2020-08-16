<template>
    <b-navbar class="text-left" toggleable="lg" type="dark" variant="primary">
        <router-link
          to="/"
          v-slot="{ href, navigate}">
          <b-navbar-brand :href="href" @click="navigate">ChiassoTV</b-navbar-brand >
        </router-link>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <router-link to="/" tag="b-nav-item">Home</router-link>
            <router-link to="/serie" tag="b-nav-item">Serie</router-link>
            <router-link to="/contatti" tag="b-nav-item">Contatti</router-link>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto" v-if="this.$parent.isOnline">
            <b-nav-form @submit="searchEpisode">
              <b-form-input size="sm" class="mr-sm-2" v-model="searchQuery" placeholder="Ricerca episodi"></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit">Cerca</b-button>
            </b-nav-form>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
</template>
<script>
export default {
  name: 'Header',
  data () {
    return {
      searchQuery: ''
    }
  },
  methods: {
    searchEpisode (e) {
      // TODO: FINISH SEARCH EPISODE
      
      // Prevent default form submit
      e.preventDefault()

      // Show error message
      this.$bvToast.toast(
        "Questa funzionalità non è ancora disponibile. Il nostro team sta lavorando per renderla disponibile il prima possibile.",
        {
          title: "Ricerca episodi",
          variant: "warning",
          autoHideDelay: 5000,
          appendToast: false
        }
      );
    }
  }   
}
</script>

<style>

</style>