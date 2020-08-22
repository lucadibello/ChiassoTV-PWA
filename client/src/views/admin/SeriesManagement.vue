<template>
  <b-container>
    <breadcumb></breadcumb>
    <hr>
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

    <!-- Add users -->
    <div class="d-block text-center mb-3 mt-1">
        <h3>Crea serie</h3>
        <small>Tramite il modulo sottostante è possibile l'aggiunta di nuove serie all'interno della piattaforma</small>
        <b-form id='add-serie' @submit="addSerie" enctype="multipart/form-data">
          <b-row class="mb-2">
            <b-col>
              <!-- Nome -->
              <b-form-input
                v-model="series.name"
                type="text"
                required
                placeholder="Nome"
              ></b-form-input>
            </b-col>
          </b-row>

          <div class="mb-2">
              <b-form-textarea
                v-model="series.description"
                placeholder="Descrizione"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
          </div>

          <!-- Choose input type (upload or normal image) -->
          <b-form-checkbox v-model="isUploading" switch class="mb-2">
            <b>Scegli immagine </b>
              /
            <b>Carica immagine</b>
          </b-form-checkbox>

          <transition name="slide-fade">
            <div v-if="isUploading==true">
              <!-- Img input -->
              <div class="mb-4">
                <b-form-file
                  class="mb-2"
                  v-model="series.upload"
                  :state="Boolean(series.upload)"
                  accept="image/*"
                  placeholder="Scegli una copertina da caricare oppure trascinala qui"
                  drop-placeholder="Trascina il file qui..."
                ></b-form-file>
                
                <b-button id='remove-image-banner' class="mb-4" @click="series.upload = null" v-if='Boolean(series.upload)'>Rimuovi immagine scelta</b-button>
              </div>
            </div>
            <div v-else>
              <small> Seleziona una copertina tramite il menu a tendina </small>
              <b-form-select v-model='selectedBanner' :options="availableBanners"></b-form-select>
              <div class="float-right" v-if="Boolean(selectedBanner)">
                <a 
                  id='banner-showcase-button' 
                  @click="triggerBannerShowcase(selectedBanner)">visualizza anteprima copertina..
                </a>
              </div>
            </div>
          </transition>

          <!-- Submit button -->
          <b-button type='submit' class="mt-2" variant="outline-success" block>Aggiungi</b-button>
        </b-form>
    </div>

    <hr>

    <div class="d-block text-center mb-3 mt-1">
      <h3>Lista serie</h3>
      <small>
        Lista di tutte le serie presenti nel sistema. È possibile modificare il nome e gli episodi
        presenti in ogni serie cliccando sul pulsante: <b-col id="btn-example" lg="2" class="pb-2"><b-button size="sm" disabled>Mostra azioni</b-button></b-col>
      </small>
          
      <div v-if="items.length !== 0">
        <!-- Series table -->
        <b-table id='series-table' class="mt-3" striped hover responsive :items="items" :fields="fields">
          <template v-slot:cell(actions)="{ item }">
            <b-btn @click="toggleActions(item)">
              Mostra azioni
            </b-btn>
          </template>
          <template v-slot:row-details="{ item }">
              <b-card class="text-left">
                <b-row>
                  <b-col>
                    <!-- Banner -->
                    <b-img-lazy :src="getBannerUrl(item.banner)" thumbnail fluid></b-img-lazy>
                  </b-col>
                  <b-col>
                    <h6>Informazioni aggiuntive</h6>
                    <p>Ultima modifica: {{ moment(item.updatedAt).format('DD/MM/YYYY HH:mm') }}</p>

                    <h6>Descrizione</h6>
                    <p>{{ item.description }}</p>
                  </b-col>
                </b-row>
                <hr>
                
                <!-- Button group -->
                <b-button-group>
                  <b-button variant="danger" @click="toggleDeleteModal(item)">Elimina</b-button>
                  <b-button variant="warning" @click="toggleEditModal(item)">Modifica</b-button>
                  <b-button variant="info" @click="manageEpisodes(item.encoded)">Gestisci episodi</b-button>
                </b-button-group>
              </b-card>
          </template>
        </b-table>
      </div>
      <div v-else class="mt-2">
        <h6 class='text-danger'>Non è disponibile alcuna serie. Per crearne una puoi utilizzare il modulo sovrastante</h6>
      </div>
    </div>

    <!-- Showcase modal -->
    <b-modal ref="banner-showcase-modal" hide-footer title="Anteprima copertina">
      <div class="d-block text-center">
        <!-- Banner -->
        <img alt="Banner showcase" v-bind:src="modal.banner" :fluid='true' />
      </div>
    </b-modal>

    <!-- Edit modal -->
    <b-modal ref="edit-serie" centered title="Modifica serie" variant='warning' hide-footer>
      <!-- Add users -->
      <div class="d-block text-center mb-3 mt-1">
        <b-form v-if='Boolean(selectedItem)'>
          <h1 class="text-danger">Non usare, è un po' buggata</h1>
          <b-row class="mb-2">
            <b-col>
              <!-- Nome -->
              <label for="modal-name">Nome</label>
              <b-form-input
                id="modal-name"
                v-model="selectedItem.name"
                type="text"
                required
                placeholder="Nome"
              ></b-form-input>
            </b-col>
          </b-row>

          <div class="mb-2">
              <label for="modal-description">Descrizione</label>
              <b-form-textarea
                id="modal-description"
                v-model="selectedItem.description"
                placeholder="Descrizione"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
          </div>

          <small> Seleziona una copertina tramite il menu a tendina </small>
          <b-form-select v-model='this.selectedItem.banner' :options="availableBanners"></b-form-select>
          <div class="text-right mb-3">
            <a id='banner-showcase-button' 
              @click="triggerBannerShowcase(selectedItem.banner)">visualizza anteprima copertina..
            </a>
          </div>

          <!-- buttons -->
          <b-row class="mt-3">
            <b-col>
              <b-button variant="outline-success" @click="updateSerie">Applica modifiche</b-button>
            </b-col>
            <b-col>
              <b-button variant="warning" @click="toggleEditModal">Annulla</b-button>
            </b-col>
          </b-row>
        </b-form>
      </div>
    </b-modal>

    <!-- Delete confirmation modal-->
    <b-modal ref="delete-serie" centered title="Elimina serie" variant='danger' hide-footer>
      <div class="text-center">
        <b-icon-trash class="rounded-circle bg-danger p-2" variant="light" font-scale='5'></b-icon-trash>
        <p>Sei sicuro di voler eliminare questa serie? Eliminandola verranno eliminati anche tutti i suoi episodi</p>        
        
        <b-row class="mt-3">
          <b-col>
            <b-button variant="outline-danger" @click="deleteSerie()">Conferma eliminazione</b-button>
          </b-col>
          <b-col>
            <b-button variant="warning" @click="toggleDeleteModal()">Annulla</b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </b-container>
</template>


<script>
import Breadcumb from '@/components/Breadcumb'
import moment from 'moment/src/moment'
import SeriesService from '@/services/SeriesService'
import BannerService from '@/services/BannerService'

export default {
  name: 'SeriesManagement',
  components: {
    Breadcumb
  },
  metaInfo: {
    title: 'ChiassoTV - Gestione serie',
    meta: [
      { name: 'description', content:  `Gestione delle serie presenti nella piattaforma ChiassoTV`},
      { property: 'og:title', content: 'ChiassoTV - Gestione serie'},
    ]
  },
  data () {
    return {
      items: [],
      moment: moment,
      availableBanners: [],
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
      notification: 'success',
      message: '',
      dismissSecs: 5,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      isUploading: true,
      selectedBanner: null,
      selectedItem: null,
      defaultItem: null,
      series: {
        name: '',
        file: null,
        description: '',
        upload: null
      },
      modal: {
        name: '',
        file: null,
        banner: ''
      }
    }
  },
  methods: {
    fillTable () {
      // Send request to User API
      SeriesService.get().then((result) => {
        // Parse data using moment.js
        result.data.forEach(data => {
          data.createdAt = moment(data.createdAt).format('DD/MM/YYYY HH:mm')
        })

        // Got response
        this.items = result.data
      }).catch((err) => {
        // Error foun
        alert(err)
      })
    },
    async uploadImage () {
      // Set form data
      const formData = new FormData()

      // Read extension
      let temp = this.series.upload.name.split('.')
      const extension = temp[temp.length-1]

      // Set values
      formData.set('banner', this.series.upload, this.series.name + '.' + extension)
      formData.set('name', this.series.name)

      // Upload image
      let result = await BannerService.upload(formData).then((result) => {
        // Return uploaded file infos
        return result.data.file
      }).catch((err) => {
        if (err.response) {
          // Set alert message
          this.message = err.response.data.error

          // Set notification type
          this.notification = 'danger'

          // Show alert
          this.showAlert()
        } else {
          alert(err)
        }
      })

      return result
    },
    fillBannerSelector () {
      // Send request to User API
      BannerService.get().then((result) => {
        // Got response
        this.availableBanners = result.data.banners
      }).catch((err) => {
        // Error found
        alert(err)
      })
    },
    toggleActions (item) {
      this.$set(item, '_showDetails', !item._showDetails)
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
    toggleDeleteModal (item) {
      this.selectedItem = item
      this.$refs['delete-serie'].toggle()
    },
    toggleEditModal (item) {
      if (item !== undefined) {
        this.defaultItem = this.selectedItem = item
      }
      this.$refs['edit-serie'].toggle()
    },
    async addSerie (e) {
      // Prevent default event execution
      e.preventDefault()

      // Upload image (if selected)
      if (this.series.upload) {
        // Wait for image upload on the server
        let uploadedFile = await this.uploadImage()
        // Reset flag
        this.series.upload = null
        // Append filename
        this.series.file = uploadedFile.filename
      } else {
        // Set value from select
        this.series.file = this.selectedBanner
      }

      // create data object
      const data = {
        'name': this.series.name,
        'description': this.series.description,
        'file': this.series.file
      }

      // Send HTTP request to APIs
      SeriesService.create(data).then(() => {
        // Empty inputs
        this.series.name = ''
        this.series.file = null
        this.series.description = ''
        this.selectedBanner = null

        // Hide errors
        this.hideAlert()

        // Show success alert
        this.message = 'Serie creata correttamente'
        this.notification = 'success'
        this.showAlert()
      }).catch((err) => {
        if (err.response) {
          // Set message
          this.message = err.response.data.error
          // Set notification type
          this.notification = 'danger'
          // Show notification
          this.showAlert()
        } else {
          alert(err)
        }
      }).then(() => {
        // Reload table
        this.fillTable()
      })
    },
    async deleteSerie () {
      // Send DELETE request to API
      await SeriesService.delete(this.selectedItem.encoded).then(() => {
        // Delete successfully
        this.message = 'Serie eliminata con successo'
        this.notification = 'success'
        this.showAlert()
      }).catch((err) => {
        if (err.response) {
          // Set alert message
          this.message = err.response.data.error

          // Set notification type
          this.notification = 'danger'

          // Show alert
          this.showAlert()
        } else {
          alert(err)
        }
      }).then(() => {
        // Reload table
        this.fillTable()
        // Reload banner selector
        this.fillBannerSelector()
        // Close modal
        this.toggleDeleteModal()
        // Scroll to top
        window.scrollTo(0, 0)
      })
    },
    async updateSerie () {
      // Get data
      const data = {
        'name': this.selectedItem.name,
        'description': this.selectedItem.description,
        'banner': this.selectedItem.banner
      }

      // Send data to update API
      await SeriesService.edit(data, this.defaultItem.name).then(() => {
        // Delete successfully
        this.message = 'Serie modificata con successo'
        this.notification = 'success'
        this.showAlert()
      }).catch((err) => {
        if (err.response) {
          // Set alert message
          this.message = err.response.data.error

          // Set notification type
          this.notification = 'danger'

          // Show alert
          this.showAlert()
        } else {
          alert(err)
        }
      }).then(() => {
        // Reload table
        this.fillTable()
        // Close modal
        this.toggleEditModal()
        // Scroll to top
        window.scrollTo(0, 0)
      })
    },
    triggerBannerShowcase (img) {
      // Set full image
      this.modal.banner = (process.env.VUE_APP_SERVER_URL + 'series/' + img)
      
      // Toggle modal state
      this.$refs['banner-showcase-modal'].toggle('edit-button')
    },
    manageEpisodes (serieName) {
      // Redirect to page
      this.$router.push('/admin/serie/' + serieName)
    },
    getBannerUrl (banner) {
      return process.env.VUE_APP_SERVER_URL + 'series/' + banner
    }
  },
  created () {
    // On load fill table with user infos
    this.fillTable()

    // Load banners
    this.fillBannerSelector()
  }
}
</script>

<style scoped>
#btn-example {
  display: inline;
  vertical-align: middle;
}
#remove-image-banner {
  float: left;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
#banner-showcase {
  max-height: 30vh;
}
#banner-showcase-button {
  cursor:pointer;
  color:blue;
  text-decoration:underline;
}
.custom-file-control[data-selected]::after {
    content: attr(data-selected);
}
.custom-file-control[data-choose]::before {
    content: attr(data-choose);
}
</style>