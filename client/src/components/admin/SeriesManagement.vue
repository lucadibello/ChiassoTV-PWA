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
        <b-form id='add-serie' @submit="addSerie">
          <b-row>
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
    <b-modal ref="edit-modal" hide-footer title="Using Component Methods">
      <div class="d-block text-center">
        <h3>Modifica utente</h3>

        <b-form id='edit-modal-form' @submit="onSubmit" @reset="onReset">
            <!-- Nome -->
            <b-form-input
              v-model="modal.name"
              type="text"
              required
              placeholder="Nome"
            ></b-form-input>

          <b-button type='reset' class="mt-3" variant="success" block @click="toggleModal">Annulla</b-button>
          <b-button type='submit' class="mt-2" variant="outline-danger" block>Applica</b-button>
        </b-form>
      </div>
    </b-modal>
  </b-container>
</template>


<script>
import Breadcumb from '@/components/global/Breadcumb'
import SeriesService from '@/services/SeriesService'

export default {
  components: {
    Breadcumb
  },
  data () {
    return {
      items: [],
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
      series: {
        name: ''
      },
      modal: {
        name: ''
      }
    }
  },
  methods: {
    fillTable () {
      // Send request to User API
      SeriesService.get().then((result) => {
        // Got response
        console.log(result)
        this.items = result.data
      }).catch((err) => {
        // Error found
        console.log(err)
        return []
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
    toggleModal (item) {
      // Toggle modal state
      this.$refs['edit-modal'].toggle('edit-button')

      // Set data
      this.modal.username = item.username
      this.modal.name = item.name
      this.modal.surname = item.surname

      // Set default data
      this._default_data = item
    },
    addSerie (e) {
      // Prevent default event execution
      e.preventDefault()

      // Send API request
      SeriesService.create(this.add).then((result) => {
        this.message = 'Hai creato correttamente l\'utente ' + this.add.username

        // Show notification
        this.showAlert()

        // Reload table
        this.fillTable()
      }).catch(function (err) {
        console.log(err)
        if (err.response) {
          // Request made and server responded
          console.log(err.response.data)
          console.log(err.response.status)
          console.log(err.response.headers)
        } else {
          alert(err)
        }
      }).then(() => {
        this.add.username = ''
        this.add.name = ''
        this.add.surname = ''
      })
    },
    onReset () {
      // Reset modal values
      this.modal.name = ''
    },
    onSubmit (e) {
      // Prevent default event execution
      e.preventDefault()
    }
  },
  created () {
    // On load fill table with user infos
    this.fillTable()
  }
}
</script>

<style scoped>
#btn-example {
  display: inline;
  vertical-align: middle;
}
</style>