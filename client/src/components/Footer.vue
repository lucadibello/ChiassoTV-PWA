<template>
    <div class="d-flex flex-column text-white">
        <footer>
          <div class="bg-primary" id="footer-content">
            <!-- Footer columns -->
            <b-row>
                <b-col class="mt-3">
                    <h5 class="text-uppercase">Web Master</h5>
                    <p><a href="https://lucadibello.ch/" target="_blank" rel="noreferrer">lucadibello.ch</a></p>
                </b-col>
                <b-col class="mt-3">
                    <h5 class="text-uppercase">Naviga</h5>

                    <p><router-link to="/" tag="a">Home</router-link></p>
                    <p><router-link to="/serie" tag="a">Serie</router-link></p>

                </b-col>
                <b-col class="mt-3">
                    <h5 class="text-uppercase">Altro</h5>

                    <p><router-link to="/condizioni" tag="a">Condizioni d'utilizzo</router-link></p>
                    <p><router-link to="/contatti" tag="a">Contatti</router-link></p>
                </b-col>
            </b-row>
          </div>
          <div class="bg-cyan" id="footer-copyright">
            <router-link
                to="/condizioni"
                v-slot="{ href, navigate}">
                <span><a class="font-weight-bold" :href="href" @click="navigate">ChiassoTV </a> &copy; Copyright {{ currentYear }}</span>
            </router-link>
          </div>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'Footer',
    data() {
        return {
            currentYear: new Date().getFullYear()
        }
    }
}
</script>


<style scoped>
    a, a:hover, a:active, a:visited { color: white; }

    .bg-cyan {
        background-color: #0077B6;
    }

    #footer-content p{
        margin-bottom: 2px !important;
    }

    #footer-content {
        padding: 2vh;
        text-align: left !important;
    }

  @media only screen and (max-width: 700px) {
    .row {
        display: block !important;
        text-align: center; 
    }

    #footer-content h5 {
        margin-bottom: 2vh;
    }
  }
</style>
