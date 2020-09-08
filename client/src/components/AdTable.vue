<template>
  <b-table ref='ad_table' 
		:items="items" :fields="fields" :busy="isBusy" 
		outlined hover responsive>

    <!-- Loading spinner -->
    <template v-slot:table-busy>
      <div class="text-center text-danger my-2">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Caricamento...</strong>
      </div>
    </template>

		<!-- Additional button -->
		<template v-slot:cell(actions)="{ item }">
			<b-btn @click="toggleActions(item)">
				Mostra azioni
			</b-btn>
		</template>

    <!-- Additional information -->
    <template v-slot:row-details="{ item }">
      <b-card class="text-left">
        <b-row>
          <b-col>
            <!-- Ad's banner -->
            <b-img-lazy :src="getAdBanner(item)" thumbnail fluid></b-img-lazy>
          </b-col>
          <b-col>
            <!-- Ad's MySQL record information -->
            <h4>
              <u>Informazioni aggiuntive</u>
            </h4>
            <div class="low-spacing-p">
              <p>Creato il: {{ moment(item.createdAt).format('DD.MM.Y HH:SS') }}</p>
              <p>Ultima modifica: {{ moment(item.updatedAt).format('DD.MM.Y HH:SS') }}</p>
            </div>
          </b-col>
        </b-row>

        <!-- Informazioni cliente -->
        <h4>
          <u>Informazioni cliente</u>
        </h4>
        <b-row>
          <!-- Name + Surname -->
          <b-col>
            <p>Nome: {{ item.client_name || ' - ' }}</p>
            <p>Cognome: {{ item.client_surname || ' - '}}</p>
          </b-col>
          <b-col>
            <!-- Email + Phone Number -->
            <p>
              E-Mail:
              <a :href="'mailto:' + item.client_email">{{ item.client_email || ' - ' }}</a>
            </p>
            <p>
              Numero di telefono:
              <a :href="'tel:' + item.client_phoneNumber">{{ item.client_phoneNumber || ' - '}}</a>
            </p>
          </b-col>
        </b-row>

        <!-- Informazioni aggiuntive -->
        <h4>
          <u>Informazioni aggiuntive</u>
        </h4>
				<div v-if="!Boolean(item.description)||item.description.length != 0" class="text-center">
					<!-- No description -> Show error message -->
					<small class="text-danger">Nessuna descrizione o nota disponibile</small>
				</div>
				<div v-else>
					<!-- Textarea -->
					<b-form-textarea size="md" rows="6" readonly no-resize v-model="item.description" />
				</div>

        <!-- Controls -->
        <div class="w-100 text-center mt-4">
          <!-- Delete + Edit buttons -->
          <b-btn-group>
            <b-btn variant="danger" @click="deleteAd(item)">Elimina</b-btn>
            <b-btn variant="warning" @click="editAd(item)">Modifica</b-btn>
          </b-btn-group>
        </div>
      </b-card>
    </template>
  </b-table>
</template>

<script>
/* Import external libraries */
import moment from 'moment/src/moment'

/* Import services */
import AdvertisementService from '@/services/AdvertisementService'
import Vue from 'vue'

export default {
  name: "AdTable",
  props: {
    items: Array,
		fields: Array,
		isBusy: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			moment: moment
		}
	},
	methods: {
		deleteAd (item) {
			// Confirm delete
			Vue.swal({
				icon: 'error',
				title: "Eliminazione pubblicità",
				text: "Eliminando la pubblicità essa sarà rimossa immediatamente dalla piattaforma e verrà eliminata dal server l'immagine assegnata. Vuoi continuare?",
				confirmButtonText: 'Conferma',
				cancelButtonText: 'Annulla',
				confirmButtonColor: "#DD6B55",
				showCancelButton: true
			}).then((result) => {
				if (result.isConfirmed) {
					/* Send delete request to API */
					AdvertisementService.delete(item.id).then(() => {	
						// Show notification
						this.$bvToast.toast(
							'Pubblicità eliminata correttamente',
							{
								title: "Eliminazione pubblicità",
								variant: "success",
								autoHideDelay: 5000,
								appendToast: false
							}
						);

						// Emit deleted
						this.$emit('ad-deleted', item);
					}).catch((err) => {
						// Show notification
						this.$bvToast.toast(
							err.response ? err.response.data.error : err,
							{
								title: "Eliminazione pubblicità",
								variant: "warning",
								autoHideDelay: 5000,
								appendToast: false
							}
						);
					});
				} 
			})
		},
		editAd () {
			// Show notification
			this.$bvToast.toast(
				'La funzionalità non è ancora disponibile.',
				{
					title: "Modifica pubblicità",
					variant: "warning",
					autoHideDelay: 5000,
					appendToast: false
				}
			);
		},
		refresh() {
			// Refresh table
			this.$refs.ad_table.refresh();
		},
		getAdBanner (item) {
      return `${process.env.VUE_APP_SERVER_URL}api/F3334AC9EF26166DEDEBD319A18F9CC7/${item.id}/banner`
		},
		toggleActions (item) {
      this.$set(item, '_showDetails', !item._showDetails)
    }
	}
};
</script>