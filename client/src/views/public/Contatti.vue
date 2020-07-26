<template>
  <b-container>
  <div class="mt-3">

    <h1>Contatti</h1>
    <hr>

    <!-- Page main -->
    <section id="contacts">
      
      <!-- ChiassoTV contact -->
      <b-row class="mb-5">
        <b-col>
          <!-- Redazione -->
          <b-row class="mb-3">

            <!-- Information -->
            <b-col class="text-left">
              <h3>Redazione</h3>
              <div class="d-block">
                <a href="mailto:redazione@chiassotv.ch" target="_blank" rel="noopener noreferrer">redazione@chiassotv.ch</a>
              </div>
            </b-col>

          </b-row>
        </b-col>
        <b-col>
          <!-- Redazione -->
          <b-row class="mb-3">

            <!-- Information -->
            <b-col class="text-left">
              <h3>Marketing</h3>
              <div class="d-block">
                <a href="mailto:marketing@chiassotv.ch" target="_blank" rel="noopener noreferrer">marketing@chiassotv.ch</a>
              </div>
            </b-col>

          </b-row>
        </b-col>
      </b-row>

      <h1>Il nostro team</h1>
      <hr>

      <!-- Luca Di Bello -->
      <b-row class="mt-3">
        <!-- Avatar -->
        <b-col cols='3' class="team-pic">
          <b-avatar src="https://avatars2.githubusercontent.com/u/37295664" class="align-center" size="7rem"></b-avatar>
        </b-col>

        <!-- Information -->
        <b-col class="text-left team-person">
          <h3>Luca Di Bello</h3>
          <dl>
            <dt class="text-uppercase">Web Master</dt>
            <dd class="d-block">
              <a href="mailto:info@lucadibello.ch" target="_blank" rel="noopener noreferrer">info@lucadibello.ch</a>
              <br>
              <a href="https://lucadibello.ch" target="_blank" rel="noopener noreferrer">www.lucadibello.ch</a>
            </dd>
          </dl>
        </b-col>
      </b-row>
    </section>
  </div>
  </b-container>
</template>

<script>
// Import custom header
export default {
  name: 'Contatti'
}
</script>

<style scoped>
  #contacts {
    font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  }

  @media only screen and (max-width: 700px) {
    #contacts div, h3 {
      text-align: center;
    }

		#contacts > div{
      display: block;
      width: 100%;
    }

    .team-pic {
      max-width: 100%;
    }

    .team-person {
      align-content: center !important;
      text-align: center !important;
    }
	}
</style>
