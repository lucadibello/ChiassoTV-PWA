<template>
    <b-container>
      <div class="row mb-3">
        <div class="col-md-6">
          <h6 class="custom-link">
            <router-link
              to="/admin/serie"
              v-slot="{ href, navigate}">
              <a :href="href" @click="navigate"><b-icon icon='arrow-bar-left'></b-icon> torna alla gestione delle serie</a>
            </router-link>
          </h6>
        </div>
      </div>

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
          <div class="w-100">
            <b-img class='mb-2' v-if="Boolean(serie.banner)" :src="imgBase + serie.banner" fluid thumbnail></b-img>
          </div>
          <h4>Titolo</h4>
          <p>{{ serie.title }}</p>

          <h4>Descrizione</h4>
          <p> {{ serie.description }}</p>
        </div>
      </b-sidebar>

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
          <b-form @submit="addEpisodeLocal">
            <file-pond
              name="video"
              ref="pond"
              :allow-multiple="false"
              accepted-file-types="video/*"
              :server="filePondOptions"
              v-on:processfile="processFile"
              v-on:removefile="removeFile"/>
            
            <div v-if="upload.show">
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
                required
              ></b-form-textarea>

              <small>Immagine di copertina</small>
              <file-pond
                name="thumbnail"
                ref="image-pond"
                :allow-multiple="false"
                accepted-file-types="image/*"
                :server="filePondThumbnailOptions"
                v-on:processfile="processThumbnail"
                v-on:removefile="removeThumbnail"/>

              <b-button type='submit' variant="primary" :disabled='!thumbnail.done'>Aggiungi episodio <b-icon icon='bookmark-plus'></b-icon></b-button>
            </div>
          </b-form>
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
          <!-- Episodes table -->
          <b-table id='series-table' class="mt-3" striped hover responsive :items="episodes" :fields="fields">
            <template v-slot:cell(actions)="{ item }">
              <b-btn @click="toggleActions(item)">
                Mostra azioni
              </b-btn>
            </template>
            <template v-slot:row-details="{ item }">
                <b-card class="text-left">
                  <b-row>
                    <b-col>
                      <b-img-lazy :src='getEpisodeThumbnail(item)' thumbnail fluid></b-img-lazy>
                    </b-col>
                    <b-col>
                      <h6>Descrizione</h6>
                      <p>{{ item.description }}</p>

                      <h6>Informazioni aggiuntive</h6>
                      <p>Ultima modifica: {{ moment(item.updatedAt).format('DD/MM/YYYY HH:mm') }}</p>
                    </b-col>
                  </b-row>
                  <b-row>
                    <div v-if="item.isFromYoutube">
                      <b-col>
                        <p>Tipo: <b-icon icon="cloud-upload" v-b-popover.hover.top="'Video salvato su YouTube'" variant="danger"></b-icon></p>
                      </b-col>
                    </div>
                    <div v-else>
                      <b-col>
                        <p>Tipo: <b-icon icon="cloud-slash" v-b-popover.hover.top="'Video salvato sul server di ChiassoTV'" variant="success"></b-icon></p>
                      </b-col>
                    </div>
                  </b-row>
                  <hr>
                  <b-button-group>
                    <b-button variant="danger" @click="toggleDeleteModal(item)">Elimina</b-button>
                  </b-button-group>
                </b-card>
            </template>
          </b-table>
        </div>
        <div v-else>
          <h6 class='text-danger'>La serie "<b>{{ serie.title }}</b>" non contiene alcun episodio. Per aggiungere episodi puoi utilizzare il modulo sovrastante</h6>
        </div>
      </div>

      <!-- Delete confirmation modal-->
      <b-modal ref="delete-episode" centered title="Elimina episodio" variant='danger' hide-footer>
        <div class="text-center">
          <div v-if="Boolean(this.delete.episode)">
            <b-icon-trash class="rounded-circle bg-danger p-2" variant="light" font-scale='5'></b-icon-trash>
            <p>Sei sicuro di voler l'episodio "<b>{{ this.delete.episode.title }}</b>"? Una volta eliminato non potrà essere recuperato</p>        
            
            <b-row class="mt-3">
              <b-col>
                <b-button variant="outline-danger" @click="deleteEpisode()">Conferma eliminazione</b-button>
              </b-col>
              <b-col>
                <b-button variant="warning" @click="toggleDeleteModal(null)">Annulla</b-button>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-modal>
    </b-container>
</template>

<script>
// eslint-disable-next-line no-async-promise-executor
import EpisodeService from '@/services/EpisodeService'
import SeriesService from '@/services/SeriesService'
import YoutubeLogo from '@/components/YoutubeLogo'
import moment from 'moment'

// Import Vue FilePond
import VueFilePond from 'vue-filepond';
// Import FilePond styles
import 'filepond/dist/filepond.min.css';
// Import the plugin code
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
// Import the plugin styles + Import the plugin code
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Create FilePond component
const FilePond = VueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview)

export default {
  components: {
    YoutubeLogo,
    FilePond
  },
  metaInfo() {
    return {
      title: 'ChiassoTV - Gestione episodi',
      meta: [
        { name: 'description', content:  `Gestione degli episodi della serie ${this.serie.title} presenti nella piattaforma ChiassoTV`},
        { property: 'og:title', content: 'ChiassoTV - Gestione episodi'},
      ]
    }
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
      upload: {
        video: null,
        show: false
      },
      thumbnail: {
        image: null,
        done: false
      },
      delete: {
        episode: null
      },
      // Serie variables
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
          key: 'title',
          label: 'Titolo',
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
      showDismissibleAlert: false,
      moment: moment,
      filePondOptions: {
        url: process.env.VUE_APP_SERVER_URL + 'api/episodes/' + this.$route.params.name + '/upload',
        process: {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        },
        revert: {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      },
      filePondThumbnailOptions: {
        url: process.env.VUE_APP_SERVER_URL + 'api/episodes/' + this.$route.params.name + '/thumbnail',
        process: {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          },
          ondata: (formData) => {
            // Add episode title to request
            formData.append('title', this.add.title);
            return formData;
          }
        },
        revert: {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          },
          ondata: (formData) => {
            // Add episode title to request
            formData.append('title', this.add.title);
            return formData;
          }
        }
      }
    }
  },
  methods: {
    loadEpisodes () {
      // Load series episodes
      EpisodeService.get(this.$route.params.name).then((result) => {
        // Format create date
        result.data.forEach((episode) => {
          episode.createdAt = moment(episode.createdAt).format('DD/MM/YYYY HH:mm')
        })

        // Set data inside variable
        this.episodes = result.data
      }).catch((err) => {
        alert(err)
      })
    },
    loadSerie () {
      SeriesService.getSerie(this.$route.params.name).then((serie) => {
        // Save data inside this.serie parameter
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
        this.message = `Episodio aggiunto alla serie <b>${this.serie.title}</b> correttamente`
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
      }).then(() => {
            // Reload table
            this.loadEpisodes()
        })
    },
    async addEpisodeLocal (e) {
      // Prevent default event execution
      e.preventDefault()

      // Data
      const data = {
        title: this.add.title,
        description: this.add.description,
        video: this.upload.video,
        thumbnail: this.thumbnail.image
      }

      // Add data
      EpisodeService.add(data, this.serie.encoded, true).then(() => {
        // Episode added -> show notification
        this.message = `Episodio aggiunto alla serie <b>${this.serie.title}</b> correttamente`
        this.notification = 'success'
        this.showAlert()

        // Clear form fields
        this.add.title = this.add.description = this.upload.video = ''
        // Hide local upload form
        this.upload.show = false

        // Remove file from FilePond
        this.$refs.pond.removeFile()
      }).catch((err) => {
        if (err.response) {
          this.message = err.response.data.error
          this.notification = 'danger'
          this.showAlert()
        } else {
          // Generic error handling
          alert(err)
        }
      }).then(() => {
            // Reload table
            this.loadEpisodes()
        })
    },
    async deleteEpisode () {
      // Get episode encoded name
      const encodedName = this.delete.episode.encoded

      // Send delete request to APIs
      EpisodeService.delete(this.serie.encoded, encodedName).then(() => {
        // Set success message
        this.message = `Episodio <b>${this.delete.episode.title}</b> eliminato correttamente`
      }).catch((err) => {
        alert(err)
      }).then(() => {
        // Close modal
        this.toggleDeleteModal(null)

        // Reload table
        this.loadEpisodes()
      })
    },
    getEpisodeThumbnail (item) {
      // Return local thumbnail
      return process.env.VUE_APP_SERVER_URL + `api/episodes/${this.$route.params.name}/${item.encoded}/thumbnail`
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissSecs
    },
    hideAlert () {
      this.dismissCountDown = 0
    },
    toggleActions (item) {
      this.$set(item, '_showDetails', !item._showDetails)
    },
    processFile (err, file) {
      if (err) {
        // Hide data
        this.upload.show = false
      } else {
        // Show inputs
        this.upload.show = true
        this.upload.video = file.filename
      }
    },
    processThumbnail (err, file) {
      if (err) {
        alert(err)
        // Hide data
        this.thumbnail.done = false
      } else {
        this.thumbnail.done = true
        this.thumbnail.image = file.filename
      }
    },
    removeThumbnail (err) {
      if (err) {
        // Log errors
        alert(err)
      }
      this.thumbnail.image = null
      this.upload.done = false
    },
    removeFile (err) {
      if (err) {
        // Log errors
        alert(err)
      }
      this.upload.video = null
      this.upload.show = false
    },
    processFileAbort (err) {
      if (err) {
        alert(err)
      }
      this.upload.show = false
    },
    toggleDeleteModal (item) {
      // Set delete option
      this.delete.episode = item
      
      // Open modal
      this.$refs['delete-episode'].toggle()
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