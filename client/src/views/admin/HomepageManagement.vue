<template>
  <b-container>
    <breadcumb></breadcumb>
    <hr />

    <!-- Add users -->
    <div class="d-block text-center mb-3 mt-1">
      <h3>Gestione vetrina</h3>
      <small>Tramite questa funzione è possibile scegliere i vari episodi da mostrare all'interno della vetrina posta nella homepage</small>

      <!-- FORM DI INSERIMENTO: <SELECT SERIE>: <SELECT EPISODIO> -->
      <div class="vertrina-selectors">
        <div v-if="options.loaded.serie">
          <div v-if="!options.empty.serie">
            <!-- Series selector -->
            <b-form-select
              class="mb-2"
              v-model="add.serie"
              :options="options.serie"
              @change="loadEpisode"
            ></b-form-select>

            <div v-if="Boolean(add.serie)">
              <div v-if="options.loaded.episode">
                <!-- Check if empty -->
                <div v-if="!options.empty.episode">
                  <!-- Epiosode selector -->
                  <b-form-select v-model="add.episode" :options="options.episode"></b-form-select>

                  <!-- TODO: Preview episodio -->

                  <transition name="fade">
                    <div v-if="Boolean(add.episode)">
                      <b-button
                        pill
                        variant="success"
                        class="mt-2"
                        @click="addEpisode"
                      >Aggiungi alla vetrina</b-button>
                    </div>
                  </transition>
                </div>
                <div v-else>
                  <h4 class="text-danger text-center">La serie non contiene episodi</h4>
                </div>
              </div>
              <div v-else>
                <!-- Loading spinner -->
                <div class="d-flex justify-content-center mb-3 mt-5">
                  <b-spinner label="Caricamento..."></b-spinner>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <h4 class="text-danger text-center">Non ci sono serie disponibili</h4>
          </div>
        </div>
        <div v-else>
          <!-- Loading spinner -->
          <div class="d-flex justify-content-center mb-3 mt-5">
            <b-spinner label="Caricamento..."></b-spinner>
          </div>
        </div>
      </div>

      <hr />

      <!-- LISTA DEGLI EPISODI (con ordine) -->
      <div class="vetrina-list">
        <h3>Lista vetrina</h3>
        <small>Nella tabella sottostante è presente la lista degli episodi presenti in vetrina.</small>

				<div v-if="table.items.length != 0">
					<!-- Episodes table -->
					<b-table
						id="showcase-table"
						class="mt-3"
						striped
						hover
						responsive
						:items="table.items"
						:fields="table.fields">
						
						<template v-slot:cell(actions)="{ item }">
							<b-btn @click="toggleActions(item)">
								Mostra azioni
							</b-btn>
						</template>
						<template v-slot:row-details="{ item }">
								<b-card class="text-left">
									<!-- Button group -->
									<b-button-group>
										<b-button variant="danger" @click="toggleDeleteModal(item)">Rimuovi episodio</b-button>
									</b-button-group>
								</b-card>
						</template>
					</b-table>
				</div>
				<div v-else>
					<h4 class="text-danger mt-4">La vetrina è vuota. Puoi aggiungere episodi usando il modulo sovrastante.</h4>
				</div>
      </div>
    </div>


		<!-- Delete confirmation modal-->
    <b-modal ref="delete-showcase" centered title="Rimuovi dalla vetrina" variant='danger' hide-footer>
      <div class="text-center">
        <b-icon-trash class="rounded-circle bg-danger p-2" variant="light" font-scale='5'></b-icon-trash>
        <p>Sei sicuro di voler rimuovere l'episodio dalla vetrina? </p>        
        
        <b-row class="mt-3">
          <b-col>
            <b-button variant="outline-danger" @click="deleteEpisode">Conferma eliminazione</b-button>
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
// Import services
import SeriesService from "@/services/SeriesService";
import EpisodeService from "@/services/EpisodeService";
import HomepageService from "@/services/HomepageService";

// Import components
import Breadcumb from "@/components/Breadcumb";

// Import libraries
import moment from "moment";

export default {
  name: "HomepageManagement",
  components: { Breadcumb },
  data() {
    return {
      add: {
        serie: null,
        episode: null
      },
      options: {
        loaded: {
          serie: false,
          episode: false
        },
        empty: {
          serie: false,
          episode: false
        },
        serie: [{ value: null, text: "Seleziona una serie" }],
        episode: []
      },
      table: {
        fields: [
          {
            key: "serie",
            label: "Serie",
            sortable: true
          },
          {
            key: "episode",
            label: "Episodio",
            sortable: true
          },
          {
            key: "createdAt",
            label: "Aggiunto il",
            sortable: true
          },
          {
            key: "actions",
            label: "",
            sortable: false
          }
        ],
        items: []
			},
			delete: {
				serie: null,
				episode: null
			},
      // Moment object
      moment: moment
    };
  },
  methods: {
    addEpisode() {
      if (Boolean(this.add.serie) && Boolean(this.add.episode)) {
        // All data set correctly
        HomepageService.add(this.add.serie, this.add.episode)
          .then(() => {
            // Empty form
            this.add.episode = null;
            this.add.serie = null;

            // Show error message
            this.$bvToast.toast(
              "L'episodio è stato aggiunto in vetrina correttamente",
              {
                title: "Aggiunta episodio",
                variant: "success",
                autoHideDelay: 5000,
                appendToast: true
              }
						);
						
						// Reload table
						this.loadShowcaseTable()
          })
          .catch(err => {
            // Show error message
            this.$bvToast.toast(err.response.data.error, {
              title: "Aggiunta episodio",
              variant: "danger",
              autoHideDelay: 5000,
              appendToast: true
            });
          });
      }
		},
		deleteEpisode () {
			if (Boolean(this.delete.serie) && Boolean(this.delete.episode)) {
				HomepageService.delete(this.delete.serie, this.delete.episode).then(() => {
					// Reload table
					this.loadShowcaseTable()
				}).catch(err => {
					// Toast with error
					this.$bvToast.toast(err.response.data.error, {
						title: "Rimozione episodio",
						variant: "danger",
						autoHideDelay: 5000,
						appendToast: true
					});
				})

				// Toggle modal
				this.toggleDeleteModal()
			}
		},
    loadEpisode() {
      // Selected series: add.episode
      if (this.add.serie !== null) {
        EpisodeService.get(this.add.serie)
          .then(episodes => {
            // Load episodes
            if (episodes.data.length != 0) {
              // Reset empty flag
              this.options.empty.episode = false;

              // Empty list
              this.options.episode = [];

              // Add default option
              this.options.episode.push({
                value: null,
                text: "Seleziona un episodio"
              });

              // Extract value and text keys for the selector options
              episodes.data.forEach(data => {
                this.options.episode.push({
                  value: data.encoded,
                  text: data.title
                });
              });
            } else {
              this.options.empty.episode = true;
            }

            // Set loaded flag
            this.options.loaded.episode = true;
          })
          .catch(err => {
            // Show error message
            this.$bvToast.toast(err.response.data.error, {
              title: "Lettura episodi",
              variant: "danger",
              autoHideDelay: 5000,
              appendToast: true
            });
          });
      }
    },
    loadSeries() {
      // Load series
      SeriesService.get()
        .then(series => {
          if (series.data.length != 0) {
            // Reset empty flag
            this.options.empty.serie = false;

            // Extract value and text keys for the selector options
            series.data.forEach(data => {
              this.options.serie.push({
                value: data.encoded,
                text: data.name
              });
            });
          } else {
            this.options.empty.serie = true;
          }

          // Set loaded flag
          this.options.loaded.serie = true;
        })
        .catch(err => {
          // Show error message
          this.$bvToast.toast(err.response.data.error, {
            title: "Recupero dati",
            variant: "danger",
            autoHideDelay: 5000,
            appendToast: true
          });
        });
    },
    loadShowcaseTable() {
      // Load showcase episodes using ShowcaseService
      HomepageService.get()
        .then(episodes => {
					// Format create date
					episodes.data.forEach((episode) => {
						episode.createdAt = moment(episode.createdAt).format('DD/MM/YYYY HH:mm')
					})
				
          // Set table items
					this.table.items = episodes.data;
        })
        .catch(() => {
          // Show error message
          this.$bvToast.toast(
            "C'è stato un problema durante la lettura degli episodi presenti in vetrina",
            {
              title: "Recupero vetrina",
              variant: "danger",
              autoHideDelay: 5000,
              appendToast: true
            }
          );
        });
		},
		// Table related function (non vital functions)
    toggleActions(item) {
      this.$set(item, "_showDetails", !item._showDetails);
		},
		toggleDeleteModal (item) {

			if (item) {
				this.delete.serie = item.serie;
				this.delete.episode = item.episode;
			} else {
				// Unset data
				this.delete.serie = null;
				this.delete.episode = null;
			}
			
			// Toggle edit modal
      this.$refs['delete-showcase'].toggle()
    },
  },
  mounted() {
    // Load series
    this.loadSeries();

    // Load showcase table
    this.loadShowcaseTable();
  }
};
</script>