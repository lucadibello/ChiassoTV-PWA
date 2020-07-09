<template>
    <b-container>
      <!-- Error alert -->
      <b-alert
        :show="dismissCountDown"
        dismissible
        :variant="notification"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged">

        <div v-html="message"></div>

        <b-progress
          :variant="notification"
          :max="dismissSecs"
          :value="dismissCountDown"
          height="4px"/>
      </b-alert>
      <div class="row mb-3">
        <div class="col-md-6">
          <h6 class="custom-link"><a href="/admin/serie"><b-icon icon='arrow-bar-left'></b-icon> torna alla gestione delle serie</a></h6>
        </div>
      </div>

      <b-button variant='outline-dark' v-b-toggle.sidebar-footer>Mostra informazioni serie</b-button>
      <b-sidebar id="sidebar-footer" aria-label="Sidebar with custom footer" no-header shadow>
        <template v-slot:footer="{ hide }">
          <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
            <strong class="mr-auto">{{ serie.title }}</strong>
            <b-button size="sm" @click="hide">Chiudi</b-button>
          </div>
        </template>
        <div class="px-3 py-2">
          <h3>Informazioni serie</h3>
          <img class='mb-2' :src="imgBase + serie.banner" fluid thumbnail>
          <h4>Titolo</h4>
          <p>{{ serie.title }}</p>

          <h4>Descrizione</h4>
          <p> {{ serie.description }}</p>
        </div>
      </b-sidebar>

      <div class="d-block text-center mb-5 mt-1">
        
      </div>

      <hr>

      <div class="d-block text-center mb-5 mt-1">
        <h3>Crea episodio</h3>
        <small>Tramite il modulo sottostante è possibile creare nuovi episodi all'interno della serie <b>{{ serie.title }}</b></small>
        <hr>

        <!-- Choose origin (local server or youtube) -->
        <b-form-checkbox v-model="add.isFromYoutube" switch class="mb-2">
          <b>Server locale <b-icon icon="cloud-slash"></b-icon></b>
            /
          <b>You<span class="text-danger">Tube</span> <b-icon icon="cloud-upload"></b-icon></b>
        </b-form-checkbox>

        <!-- From local server -->
        <div v-if="!add.isFromYoutube">
          LOCAL SERVER: WORK IN PROGRESS ...
        </div>
        <!-- From youtube -->
        <div v-else>
          <b-form @submit="addEpisodeYoutube">
            
            <YoutubeLogo class="mb-2"></YoutubeLogo>

            <!-- URL VIDEO -->
            <b-form-group
              label="URL video"
              label-for="input-youtube-url"
              description="La copertina viene presa direttamente da YouTube, non è necessario impostarne una">
              
              <b-form-input
                id="input-youtube-url"
                v-model="add.link"
                type="text"
                required
                placeholder="Es: https://youtube.com/v/h76xeD"
              ></b-form-input>
            </b-form-group>

              <b-form-input
                class="mb-3"
                v-model="add.title"
                type="text"
                required
                placeholder="Titolo"
              ></b-form-input>

            <b-form-textarea
              class="mb-3"
              v-model="add.description"
              placeholder="Descrizione"
              rows="3"
              max-rows="6"
            ></b-form-textarea>

            <!-- COPERTINA (letta automaticamente) -->
            <b-button type='submit' variant="primary">Aggiungi episodio <b-icon icon='bookmark-plus'></b-icon></b-button>
          </b-form>
        </div>
      </div>

      <!-- Lista episodi -->
      <div class="d-block text-center mb-3 mt-1">
        <h3>Lista episodi</h3>
        <small>
          Lista degli episodi della serie <b>{{ serie.title }}</b>. Essi sono ordinati in modo <b>ascendente</b> in base alla data di creazione.
        </small>
        <hr>

        <div v-if="episodes.length !== 0">
          <h1>Not empty</h1>
        </div>
        <div v-else>
          <h6 class='text-danger'>La serie <b>{{ serie.title }}</b> non contiene alcun episodio. Per aggiungere episodi puoi utilizzare il modulo sovrastante</h6>
        </div>
      </div>
    </b-container>
</template>

<script>
// eslint-disable-next-line no-async-promise-executor
import EpisodeService from '@/services/EpisodeService'
import SeriesService from '@/services/SeriesService'
import YoutubeLogo from '@/components/YoutubeLogo'

export default {
  components: {
    YoutubeLogo
  },
  data () {
    return {
      // Add form variables
      add: {
        title: '',
        description: '',
        link: '',
        isFromYoutube: false
      },
      // Service variables
      serie: {
        title: '',
        description: '',
        banner: '',
        createdAt: '',
        encoded: ''
      },
      episodes: [],
      fields: [
        {
          key: 'name',
          label: 'Nome',
          sortable: true
        },
        {
          key: 'createdAt',
          label: 'Creato il',
          sortable: true
        },
        {
          key: 'actions',
          label: '',
          sortable: false
        }
      ],
      imgBase: process.env.VUE_APP_SERVER_URL + 'series/',
      notification: 'success',
      message: '',
      dismissSecs: 5,
      dismissCountDown: 0,
      showDismissibleAlert: false
    }
  },
  methods: {
    loadEpisodes () {
      // Load series episodes
      EpisodeService.get(this.$route.params.name).then((result) => {
        this.episodes = result.data
      }).catch((err) => {
        alert(err)
      })
    },
    loadSerie () {
      SeriesService.getSerie(this.$route.params.name).then((serie) => {
        console.log(serie.data)
        this.serie.title = serie.data.name
        this.serie.encoded = serie.data.encoded
        this.serie.description = serie.data.description
        this.serie.banner = serie.data.banner
        this.serie.createdAt = serie.data.createdAt
      }).catch((err) => {
        alert(err)
      })
    },
    async addEpisodeYoutube (e) {
      // Prevent default event execution
      e.preventDefault()

      // Data
      const data = {
        title: this.add.title,
        description: this.add.description,
        link: this.add.link,
      }      
       
      // Read data
      EpisodeService.add(data, this.serie.encoded, false).then(() => {
        // Episode added -> show notification
        // TODO: Da finire e testare
        this.message = `Episodio aggiunto alla serie <b>${this.serie}</b> correttamente`
        this.notification = 'success'
        this.showAlert()

        // Clear form fields
        this.add.title = this.add.description = this.add.link = ''
      }).catch((err) => {
        if (err.response) {
          this.message = err.response.data.error
          this.notification = 'danger'
          this.showAlert()
        } else {
          // Generic error handling
          alert(err)
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
  },
  created () {
    // Load data from APIs
    this.loadSerie()
    this.loadEpisodes()
  }
}
</script>

<style scoped>
.custom-link {
  cursor:pointer;
  color:blue;
  text-decoration:underline;
}
</style>