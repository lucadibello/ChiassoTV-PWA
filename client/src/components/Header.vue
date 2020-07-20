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

          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <b-form-input size="sm" class="mr-sm-2" placeholder="Ricerca episodi"></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit">Cerca</b-button>
            </b-nav-form>
            
            <!-- Using 'button-content' slot 
            <b-nav-item-dropdown right>
              <template v-slot:button-content>
                <em>User</em>
              </template>
              <b-dropdown-item href="#">Profile</b-dropdown-item>
              <b-dropdown-item href="#">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
            -->
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
</template>