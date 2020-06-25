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
        variant="success"
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
                  v-model="series.file"
                  :state="Boolean(series.file)"
                  accept=".jpg, .png, .gif"
                  placeholder="Scegli una copertina da caricare oppure trascinala qui"
                  drop-placeholder="Trascina il file qui..."
                  :file-name-formatter="name_formatter"
                ></b-form-file>
                
                <transition name="slide-fade">
                  <b-button id='remove-image-banner' class="mb-4" @click="series.file = null" v-if='Boolean(series.file)'>Rimuovi immagine scelta</b-button>
                </transition>
              </div>
            </div>
            <div v-else>
              <small> Seleziona una copertina tramite il menu a tendina </small>
              <b-form-select v-model='selectedBanner' :options="availableBanners"></b-form-select>
              <div class="float-right" v-if="this.selectedBanner !== ''">
                <a 
                  id='banner-showcase-button' 
                  @click="triggerBannerShowcase(selectedBanner)"
                  >visualizza anteprima copertina..
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
          

      <!-- User table -->
      <b-table id='user-table' class="mt-3" striped hover :items="items" :fields="fields">
        <template v-slot:cell(actions)="{ item }">
          <b-btn @click="toggleActions(item)">
            {{ button_text }}
          </b-btn>
        </template>
        <template v-slot:row-details="{ item }">
            <b-card class="text-left">
              <b-button variant="danger" @click="deleteUser(item)">Elimina</b-button>
              <b-button id="edit-button" variant="warning" @click="toggleModal(item)">Modifica</b-button>
            </b-card>
        </template>
      </b-table>
    </div>

    <!-- Edit modal -->
    <b-modal ref="banner-showcase-modal" hide-footer>
      <div class="d-block text-center">
        <h3>Anteprima copertina</h3>
      </div>
      <!-- Banner -->
      <img alt="Banner showcase" v-bind:src="this.modal.banner" :fluid='true' />
    </b-modal>
  </b-container>
</template>


<script>
import Breadcumb from '@/components/global/Breadcumb'
import SeriesService from '@/services/SeriesService'
import BannerService from '@/services/BannerService'

export default {
  components: {
    Breadcumb
  },
  data () {
    return {
      items: [],
      availableBanners: [],
      fields: ['username', 'name', 'surname', {
        key: 'actions',
        label: ''
      }],
      notification: 'success',
      button_text: 'Mostra azioni',
      message: '',
      dismissSecs: 5,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      isUploading: true,
      selectedBanner: null,
      series: {
        name: '',
        file: null,
        description: ''
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
        // Got response
        this.items = result.data
      }).catch((err) => {
        // Error found
        console.log(err)
      })
    },
    async uploadImage () {
      // Set form data
      const formData = new FormData()
      formData.set('banner', this.series.file, this.series.file.name)
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
        console.log('Found data:', result)
        this.availableBanners = result.data.banners
      }).catch((err) => {
        // Error found
        alert(err)
      })
    },
    deleteSerie (user) {
      SeriesService.delete(user.username).then((result) => {
        this.notification = 'success'
        this.message = 'Utente eliminato correttamente'
        this.showAlert()

        // Reload table
        this.fillTable()
      }).catch((err) => {
        alert(err)
      })
    },
    toggleActions (item) {
      if (item._showDetails) {
        this.button_text = 'Mostra azioni'
      } else {
        this.button_text = 'Nascondi opzioni'
      }

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
    async addSerie (e) {
      // Prevent default event execution
      e.preventDefault()

      // Create formData object
      const formData = new FormData()

      // Upload image (if selected)
      if (this.series.file) {
        // Wait for image upload on the server
        let uploadedFile = await this.uploadImage()
        // Append filename
        formData.append('banner', uploadedFile.originalname)
      } else {
        // Use image path -> Append filename
        console.log('Empty')
      }

      console.log('Form data: ', formData)
    },
    name_formatter () {
      if (this.series.file) {
        // Re-Format name
        let name = this.series.file.name.replace(/\s+/g, '-').toLowerCase()

        // Set new file name
        Object.defineProperty(this.series.file, 'name', {
          writable: true,
          value: name
        })

        // Return new file name
        return name
      }
    },
    triggerBannerShowcase (img) {
      // Build URL
      let link = 'http://localhost:5000/series/' + img

      // Show modal
      console.warn('SHOWCASE MODAL WIP')

      // Toggle modal state
      this.$refs['banner-showcase-modal'].toggle('edit-button')

      // Set full image
      this.modal.banner = link
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
  transition: all 2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
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
</style>