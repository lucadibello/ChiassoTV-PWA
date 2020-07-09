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
        <h3>Crea utente</h3>
        <small>Tramite il modulo sottostante è possibile l'aggiunta di nuovi utenti amministratori al sistema</small>
        <b-form id='edit-modal-form' @submit="addUser">
          <b-row>
            <b-col>
              <!-- Nome -->
              <b-form-input
                v-model="add.name"
                type="text"
                required
                placeholder="Nome"
              ></b-form-input>
            </b-col>
            <b-col>
              <!-- Cognome -->
              <b-form-input
                v-model="add.surname"
                type="text"
                required
                placeholder="Cognome"
              ></b-form-input>
            </b-col>
          </b-row>

          <!-- Username -->
          <b-input-group prepend="@" class="mt-3">
              <b-form-input
                v-model="add.username"
                type="text"
                required
                placeholder="Username"
              ></b-form-input>
          </b-input-group>

          <b-button type='submit' class="mt-2" variant="outline-success" block>Aggiungi</b-button>
        </b-form>
    </div>

    <hr>

    <div class="d-block text-center mb-3 mt-1">
      <h3>Lista utenti</h3>
      <small>Lista di tutti gli utenti amministratori presenti nel sistema</small>
          

      <!-- User table -->
      <b-table id='user-table' striped hover :items="items" :fields="fields">
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
          <b-row>
            <b-col>
              <!-- Nome -->
              <b-form-input
                v-model="modal.name"
                type="text"
                required
                placeholder="Nome"
              ></b-form-input>
            </b-col>
            <b-col>
              <!-- Cognome -->
              <b-form-input
                v-model="modal.surname"
                type="text"
                required
                placeholder="Cognome"
              ></b-form-input>
            </b-col>
          </b-row>

          <!-- Username -->
          <b-input-group prepend="@" class="mt-3">
              <b-form-input
                v-model="modal.username"
                type="text"
                required
                placeholder="Username"
              ></b-form-input>
          </b-input-group>

          <b-button type='reset' class="mt-3" variant="success" block @click="toggleModal">Annulla</b-button>
          <b-button type='submit' class="mt-2" variant="outline-danger" block>Applica</b-button>
        </b-form>
      </div>
    </b-modal>
  </b-container>
</template>


<script>
import Breadcumb from '@/components/Breadcumb'
import UserService from '@/services/UserService'

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
      modal: {
        username: '',
        name: '',
        surname: ''
      },
      add: {
        username: '',
        name: '',
        surname: '',
        password: 'temp'
      },
      defaultData: {}
    }
  },
  methods: {
    async fillTable () {
      // Send request to User API
      await UserService.get().then((result) => {
        // Got response
        console.log(result)
        this.items = result.data
      }).catch((err) => {
        // Error found
        console.log(err)
        return []
      })
    },
    deleteUser (user) {
      UserService.delete(user.username).then(() => {
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
      this.defaultData = item
    },
    onSubmit (e) {
      e.preventDefault()
      // Send data to APIs
      UserService.edit(this.modal, this.defaultData.username).then(() => {
        this.message = 'Utente modificato correttamente'
        this.showAlert()

        // Reload table
        this.fillTable()
      }).catch(function (err) {
        alert(err)
      }).then(() => {
        // Toggle modal state
        this.$refs['edit-modal'].toggle('edit-button')
      })
    },
    onReset () {
      console.log('Resetting form')
      this.modal.username = ''
      this.modal.name = ''
      this.modal.surname = ''
    },
    addUser (e) {
      // Prevent default event execution
      e.preventDefault()

      // Send API request
      UserService.create(this.add).then(() => {
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
    }
  },
  created () {
    // On load fill table with user infos
    this.fillTable()
  }
}
</script>