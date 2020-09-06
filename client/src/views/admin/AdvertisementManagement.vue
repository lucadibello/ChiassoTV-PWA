<template>
  <b-container>
    <breadcumb></breadcumb>
    <hr />

    <b-card no-body>
      <b-tabs card>
        <!-- Add banners -->
        <b-tab title="Aggiungi banner pubblicitari" active>
          <div class="d-block text-center mb-5 mt-1">
            <h3>Aggiungi banner pubblicitario</h3>
            <small>
              Tramite il modulo sottostante è possibile aggiungere un nuovo banner pubblicitario.
              I banner pubblicitari sono visibili in tutte le pagine di ChiassoTV
            </small>
            <hr />

            <b-form @submit="addBanner" @reset="clearForm" class="text-left">
              <div id="social-info">
                <h4 style="text-decoration: underline;" class="mb-4">Informazioni cliente</h4>
                <!-- Client Name & Surname -->
                <b-form-row>
                  <b-col>
                    <!-- Client Name -->
                    <b-form-group
                      id="input-group-name"
                      label="Nome*"
                      laber-for="name-input"
                      label-class="text-primary font-weight-bold"
                      variant="danger"
                    >
                      <b-form-input id="name-input" v-model="add.client_name" required placeholder="Es: Giovanni"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <!-- Client Surname -->
                    <b-form-group
                      id="input-group-surname"
                      label="Cognome*"
                      label-class="text-primary font-weight-bold"
                      laber-for="surname-input"
                    >
                      <b-form-input id="surname-input" v-model="add.client_surname" required placeholder="Es: Mucciaccia"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-form-row>

                <!-- Client E-Mail -->
                <b-form-group
                  id="input-group-email"
                  label="Indirizzo E-mail:"
                  laber-for="email-input"
                >
                  <b-form-input
                    id="email-input"
                    v-model="add.client_email"
                    type="email"
                    placeholder="Es: example@test.com"
                  ></b-form-input>
                </b-form-group>

                <!-- Client Phone number -->
                  <b-form-group
                    id="input-group-phone-number"
                    label="Numero di telefono"
                    laber-for="phone-number-input"
                    description="Il prefisso internazionale deve essere definito usando 00 al posto del '+'"
                  >
                    <b-form-input id="phone-number-input" v-model="add.client_phoneNumber" placeholder="Es: 0041765969985"></b-form-input>
                  </b-form-group>
              </div>

              <div id="banner-info" class="mt-4">
                <h4 style="text-decoration: underline;" class="mb-4">Impostazioni banner</h4>

                <!-- Image selection, Website --> 

                <h5 class="text-primary font-weight-bold">Upload immagine*</h5>
                <file-pond
                  name="banner"
                  ref="pond"
                  v-bind:required="true"
                  :allow-multiple="false"
                  accepted-file-types="image/*"
                  :server="filePondOptions"
                  v-on:processfile="processBanner"
                  v-on:removefile="removeBanner"/>


                <!-- Website selection -->
                <b-form-group
                  id="input-group-website"
                  label="Sito web"
                  laber-for="website-input"
                >
                  <b-form-input id="website-input" v-model="add.website_link" placeholder="Es: http://example.com"></b-form-input>
                </b-form-group>
              </div>

              <div class="mt-4">
                <h4 style="text-decoration: underline;" class="mb-4">Durata iscrizione</h4>

                <!-- Date selection shortcut -->
                <b-form-group
                  id="input-group-select"
                  label="Durata abbonamento*"
                  label-class="text-primary font-weight-bold"
                  laber-for="select-input"
                >
                  <b-form-select id="select-input" required v-model="subscription.days" @change="calculateEndDate()" :options="[
                      { value: null, text: 'Seleziona un tipo di abbonamento' },
                      { value: 7, text: '1 Settimana' },
                      { value: 30, text: '1 Mese' },
                      { value: 91, text: '3 Mesi' },
                      { value: 182, text: '6 Mesi' },
                      { value: 365, text: '12 Mesi' }]"
                  ></b-form-select>
                </b-form-group>

                <!-- Start and End subscription date -->
                <b-row>
                  <b-col>
                    <!-- Start date picker -->
                    <b-form-datepicker 
                      @input="calculateEndDate()" 
                      id="start-datepicker" 
                      v-model="add.start_date" 
                      class="mb-2" 
                      required 
                      today-button
                      reset-button
                      close-button
                      :date-format-options="subscription.date_format"
                      locale="it"/>
                  </b-col>
                  <b-col>
                    <!-- End date picker (auto calculated) -->
                    <b-form-datepicker 
                      :date-format-options="subscription.date_format"
                      locale="it" 
                      id="end-datepicker" 
                      v-model="add.end_date" 
                      class="mb-2" 
                      required 
                      disabled/>
                  </b-col>
                </b-row>

                <small>Puoi posticipare l'inizio dell'abbonamento cambiando la data iniziale</small>
                
              </div>

              <div class="mt-4">
                <h4 style="text-decoration: underline;" class="mb-4">Informazioni aggiuntive</h4>

                <!-- Description -->
                <b-form-group
                  id="input-group-description"
                  label="Osservazioni e note"
                  laber-for="description-input"
                >
                  <b-form-textarea
                    id="description-input"
                    v-model="add.description"
                    placeholder="Scrivi qualcosa..."
                    rows="3"
                    max-rows="6"
                  ></b-form-textarea>
                </b-form-group>
              </div>
              
              <!-- Submit & Reset button -->
              <b-row>
                <b-col cols="4">
                  <!-- Submit button -->
                  <b-btn variant="primary" type="submit">Aggiungi banner</b-btn>
                </b-col>
                <b-col cols="4">
                  <!-- Reset button -->
                  <b-btn class="text-right" variant="outline-danger" type="reset">Pulisci modulo</b-btn>
                </b-col>
              </b-row>
              
            </b-form>   
          </div>
        </b-tab>
        <!-- Manage banners -->
        <b-tab title="Gestione banner pubblicati">
          <div class="d-block text-center mb-5 mt-1">
            <h3>Gestione banner pubblicati</h3>
            <small>
              Tramite questa sezione è possibile visualizzare tutti i banner pubblicati all'interno di ChiassoTV.
              Essi sono divisi in 3 sezioni:
            </small>

            <b-row class="mt-3">
              <!-- Disponibili -->
              <b-col>
                <span class="text-success font-weight-bold">Disponibili </span> 
                <b-icon-info-circle v-b-tooltip.hover title="Pubblicità che sono attualmente mostrate agli utenti che accedono al sito web"/>
              </b-col>

              <!-- Parcheggiati -->
              <b-col>
                <span class="text-primary font-weight-bold">Parcheggiati </span>
                <b-icon-info-circle v-b-tooltip.hover title="Pubblicità già create ma l'iscrizione non è ancora attiva (data di inizio dell'iscrizione nel futuro)"/>
              </b-col>

              <!-- Scaduti -->
              <b-col>
                <span class="text-danger font-weight-bold">Scaduti </span>
                <b-icon-info-circle v-b-tooltip.hover title="Pubblicità non mostrate all'interno della piattaforma in quanto l'iscrizione è scaduta"/>
              </b-col>
            </b-row>              

            <hr />

            <div class="banner-containers text-left">
              <!-- Available banners (Green) -->
              <h4><span class="text-success">Disponbili</span> <small class="text-muted"> - {{banners.available.length}} pubblicità</small></h4>
              <ad-table 
                :is-busy="!banners.loaded_available" 
                :items="banners.available" 
                :fields="banners._fields"
                ref="availableTable"
                @ad-deleted="loadAvailableBanners(true)"
              />
              
              <!-- Inbound banners (Blue) -->
              <h4><span class="text-primary">Parcheggiati</span> <small class="text-muted"> - {{banners.inbound.length}} pubblicità</small></h4>
              <ad-table 
                :is-busy="!banners.loaded_inbound" 
                :items="banners.inbound" 
                :fields="banners._fields"
                ref="inboundTable"
                @ad-deleted="loadInboundBanners(true)"
              />

              <!-- Expired banners (Red) -->
              <h4><span class="text-danger">Scaduti</span> <small class="text-muted"> - {{banners.expired.length}} pubblicità</small></h4>
              <ad-table 
                :is-busy="!banners.loaded_expired" 
                :items="banners.expired" 
                :fields="banners._fields"
                ref="expiredTable"
                @ad-deleted="loadExpiredBanners(true)"
              />
            </div>
          </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>

<script>
/* Import components */
import Breadcumb from "@/components/Breadcumb";
import VueFilePond from 'vue-filepond';
import AdTable from '@/components/AdTable';

/* Setup filePond */

// Import FilePond styles
import 'filepond/dist/filepond.min.css';
// Import the plugin code
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
// Import the plugin styles + Import the plugin code
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Create FilePond component
const FilePond = VueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview)

/* Import libraries */
import moment from 'moment/src/moment'

/* Import services */
import AdvertisementService from '@/services/AdvertisementService'

export default {
  name: "AdvertisementManagement",
  components: {
    Breadcumb,
    FilePond,
    AdTable
  },
  metaInfo: {
    title: "ChiassoTV - Gestione pubblicità",
    meta: [
      {
        name: "description",
        content: `Gestione delle pubblicità presenti nella piattaforma ChiassoTV`,
      },
      { property: "og:title", content: "ChiassoTV - Gestione pubblicità" },
    ],
  },
  data() {
    return {
      add: {
        /* Social info */
        client_phoneNumber: null,
        client_name: null,
        client_surname: null,
				client_email: null,
				
        /* Banner related data */
        website_link: null,
        img: null,
        description: null,

        /* Date selection */
        start_date: moment().format('Y-M-D'),
        end_date: null,
      },
      subscription: {
        days: null,
        date_format: { year: 'numeric', month: '2-digit', day: '2-digit' }
      },
			banners: {
        /* Three types of banners (available, inbound, expired) */
        available: [],
        inbound: [],
        expired: [],

        /* Loading status tracking */
				loaded_available: false,
				loaded_inbound: false,
        loaded_expired: false,
        
        /* Data visualization */
        _fields: [
          {
            key: 'start_date',
            label: 'Data inizio',
            sortable: true
          },
          {
            key: 'end_date',
            label: 'Data fine',
            sortable: true
          },
          {
            key: 'actions',
            label: '',
            sortable: false
          }
        ] 
      },
      filePondOptions: {
        url: process.env.VUE_APP_SERVER_URL + 'api/ads/upload',
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
      moment: moment
    };
  },
  methods: {
    async loadAvailableBanners (refreshTable = false) {
      await AdvertisementService.getAvailable().then(ads => {
        // Save data
        this.banners.available = ads.data;

        if (refreshTable) {
          // Reload table
          this.$refs.availableTable.refresh();
        }
      }).catch(err => {
        // Show error
        this.$bvToast.toast(
          err.response ? err.response.data.error : err,
          {
            title: "Lettura banner disponibili",
            variant: "danger",
            autoHideDelay: 5000,
            appendToast: false
          }
        );
      })
    },
    async loadInboundBanners (refreshTable = false) {
      await AdvertisementService.getInbound().then(ads => {
        // Save data
        this.banners.inbound = ads.data;

        if (refreshTable) {
          // Reload table
          this.$refs.inboundTable.refresh();
        }
      }).catch(err => {
        // Show error
        this.$bvToast.toast(
          err.response ? err.response.data.error : err,
          {
            title: "Lettura banner parcheggiati",
            variant: "danger",
            autoHideDelay: 5000,
            appendToast: false
          }
        );
      })
    },
    async loadExpiredBanners (refreshTable = false) {
      await AdvertisementService.getExpired().then(ads => {
        // Save data
        this.banners.expired = ads.data;

        if (refreshTable) {
          // Reload table
          this.$refs.expiredTable.refresh();
        }
      }).catch(err => {
        // Show error
        this.$bvToast.toast(
          err.response ? err.response.data.error : err,
          {
            title: "Lettura banner scaduti",
            variant: "danger",
            autoHideDelay: 5000,
            appendToast: false
          }
        );
      })
    },
    addBanner(e) {
      // Prevent default Form event execution
      e.preventDefault();

      // Send data to APIs
      AdvertisementService.add(this.add).then(() => {
        // Ad successfully added
        this.$bvToast.toast(
          'Banner pubblicitario creato correttamente',
          {
            title: "Creazione banner pubblicitari",
            variant: "success",
            autoHideDelay: 2000,
            appendToast: false
          }
        );

        // Reload available + inbound banners
        this.loadAvailableBanners()
        this.loadInboundBanners();

        // Clear form
        this.clearForm();
      }).catch((err) => {
        console.warn(err)
        if (err.response) {
          this.$bvToast.toast(
            err.response.data.error,
            {
              title: "Creazione banner pubblicitari",
              variant: "danger",
              autoHideDelay: 5000,
              appendToast: false
            }
          );
        } else {
            this.$bvToast.toast(
              err,
              {
                title: "Creazione banner pubblicitari",
                variant: "danger",
                autoHideDelay: 5000,
                appendToast: false
              }
            );
        }
      });
    },
    clearForm(showNotification = false) {
      // Set default data
      this.add.client_phoneNumber = null;
      this.add.client_name = null;
      this.add.client_surname = null;
      this.add.client_email = null;
      this.add.website_link = null;
      this.add.img = null;
      this.add.description = null;
      this.add.start_date = null;
      this.add.end_date = null;

      // Remove file from filePond
      this.$refs.pond.removeFile()

      // Check if the user requested a notification
      if (showNotification) {
        // Show notification
        this.$bvToast.toast(
          'Modulo svuotato correttamente',
          {
            title: "Pulizia modulo",
            variant: "success",
            autoHideDelay: 2000,
            appendToast: false
          }
        );
      }
    },
    calculateEndDate() {
      if (this.subscription.days) {
        // Check if start_date is null
        if (!this.add.start_date) {
          // If it's null -> Generate new date
          this.add.start_date = moment().format('Y-M-D')
        }
        // Set new value
        this.add.end_date = moment(this.add.start_date, 'Y-M-D').add(this.subscription.days,'days').format("Y-M-D")
      } else {
        this.$bvToast.toast(
            'Prima devi selezionare un tipo di abbonamento!',
            {
              title: "Selezione abbonamento",
              variant: "danger",
              autoHideDelay: 5000,
              appendToast: false
            }
          );
      }
    },
    allDataSet() {
      return this.add.client_name && this.add.client_surname && this.start_date
        && this.end_date && this.add.img
    },
    processBanner (err, file) {
      if (err) {
        // Set default value
        this.add.img = null
      } else {
        // Set img name
        this.add.img = file.filename
      }
    },
    removeBanner (err) {
      if (err) {
        // Log errors
        alert(err)
      }
      this.add.img = null
    }
  },
  async created () {
    // Load available banners
    await this.loadAvailableBanners();
    this.banners.loaded_available = true;

    // Load inbound banners
    await this.loadInboundBanners();
    this.banners.loaded_inbound = true;

    // Load expired banners
    await this.loadExpiredBanners();
    this.banners.loaded_expired = true;
  }
};
</script>

<style scoped>
  .low-spacing-p p {
    margin-block-start: 0px !important;
    margin-block-start: 0px !important;
  }
  
</style>