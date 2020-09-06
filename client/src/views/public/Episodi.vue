<template>
	<b-container>
	<div class="mt-3">
		<!-- List of all the available series -->
		<h1>{{ this.serie.title }}</h1>
		<p>Episodi della serie <b>{{ this.serie.title }}</b></p>

		<!-- Show sideslide -->
		<b-button class='header-action' variant='outline-dark' v-b-toggle.sidebar-footer>Mostra informazioni serie</b-button>
		
		<!-- 
		<div class="float-right">
			<b-button class="text-right" :variant="filter.show ? 'outline-primary' : 'primary'" @click="filter.show = !filter.show">Mostra filtri 
				<b-icon-arrow-bar-down v-if="!filter.show"></b-icon-arrow-bar-down>
				<b-icon-arrow-bar-up v-else></b-icon-arrow-bar-up>
			</b-button>
		</div>

		<transition name="fade">
			<div v-if="filter.show" class="text-left">
				<b-form-select v-model="filter.type" :options="[
					{value: null, text: 'Seleziona un ordinamento'},
					{value: null, text: 'Ordine alfabetico'},
					{value: null, text: 'Ordinamento cronologico'}
				]" size="sm" class="mt-3"></b-form-select>

				<b-form-select v-model="filter.ordering" :options="[
					{value: null, text: 'Seleziona un ordinamento'},
					{value: null, text: 'Da'},
					{value: null, text: 'Per episodio'}
				]" size="sm" class="mt-3"></b-form-select>
			</div>
		</transition>
		-->
		
		<hr>

		<!-- Ad carousel -->
    <div class="w-100 mb-5" v-if="this.banners.loaded">
      <ad-carousel :ads="banners.available"></ad-carousel>
    </div>


		<div v-if="loaded">
			<div v-if="episodes.length !== 0">
			<!-- Single episode view -->
			<div class="episode">
				<div v-for="(episode, index) in episodes" :key="episode.encoded">
					<!-- Episode's card -->
					<b-card class="text-left mb-2 episode-card-block">
						<b-row>
							<b-col cols="4">
								<b-img-lazy fluid style="object-fit:cover;" :src="getEpisodeThumbnail(episode)" :alt="episode.title + '  thumbnail'" blank-src=""></b-img-lazy>
							</b-col>
							<b-col>
								<h4 data-v-05c11c53="" class="card-title">{{ episode.title }}</h4>
								<h6 data-v-05c11c53="" class="card-subtitle text-muted mb-2">{{ 'Episodio n. ' + (episodes.length - index) }}</h6>

								<b-card-text>
									{{ minify(episode.description) }}
								</b-card-text>
								
								<b-btn-group>
									<!-- Favorite button -->
									<FavoriteButton :serie="serie.encoded" :episode="episode.encoded"/>

									<!-- Watch video -->
									<router-link	
											:to="'/serie/' + serie.encoded + '/' + episode.encoded" 
											v-slot="{ href, navigate}">
											<b-button variant="success" @click='navigate' :href="href"><b-icon-play-fill></b-icon-play-fill> Guarda video</b-button>
									</router-link>
								</b-btn-group>
							</b-col>
						</b-row>
						
					</b-card>
				</div>
			</div>

			<!-- Ad carousel -->
			<div class="w-100 mb-5" v-if="this.banners.loaded">
				<ad-carousel :ads="banners.available"></ad-carousel>
			</div>
		</div>
		<div v-else>
			<h4 class="text-danger">La serie non possiede alcun episodio.</h4>
		</div>
		</div>
		<div v-else>
			<div class="d-flex justify-content-center mb-3">
				<b-spinner label="Loading..."></b-spinner>
			</div>
		</div>
		
		<!-- Sidebar -->
		<b-sidebar id="sidebar-footer" aria-label="Pannello informazioni serie" no-header shadow>
			<template v-slot:footer="{ hide }">
				<div class="d-flex bg-dark text-light align-items-center px-3 py-2">
					<strong class="mr-auto" v-if="loadedSerie">{{ serie.title }}</strong>
					<b-button size="sm" @click="hide">Chiudi</b-button>
				</div>
			</template>
			<div class="px-3 py-2">
				<h3>Informazioni serie</h3>
				
				<div v-if="loadedSerie">
					<!-- Series banner -->
					<div class="w-100">
						<b-img-lazy 
							class='mb-2' 
							v-if="Boolean(serie.banner)" 
							:src="seriesBase + serie.banner" 
							fluid thumbnail />
					</div>
					
					<!-- Series information -->
					<h4>Titolo</h4>
					<p>{{ serie.title }}</p>

					<h4>Descrizione</h4>
					<p> {{ serie.description }}</p>
				</div>
				<div v-else>
					<h4 class="mt-4 text-danger text-center">C'è stato un problema durante il caricamento delle informazioni relative alla serie. Riprova più tardi.</h4>
				</div>
				
			</div>
		</b-sidebar>
	</div>
	</b-container>
</template>

<script>
// Import services
import EpisodeService from '@/services/EpisodeService'
import SeriesService from '@/services/SeriesService'
import AdvertisementService from '@/services/AdvertisementService'

// Import components
import FavoriteButton from '@/components/FavoriteButton'
import AdCarousel from '@/components/AdCarousel'

export default {
	name: 'Episodi',
	components: {
		FavoriteButton, AdCarousel
	},
	data () {
		return {
			// Series img base
			seriesBase: process.env.VUE_APP_SERVER_URL + 'series/',
			// Episodes list
			episodes: [],
			loaded: false,
			loadedSerie: false,
			// Service variables
			serie: {
				title: '',
				description: '',
				banner: '',
				createdAt: '',
				encoded: ''
			},
			// Single-view properties
			singleProps: {
				center: true,
				fluidGrow: true,
				blank: true,
				blankColor: '#bbb',
				width: 600,
				height: 400,
				class: 'my-5'
			},
			// Filters properties
			filter: {
				show: false,
				type: null
			},
			banners: {
				available: [],
				loaded: false
			},
			// Description max length
			descriptionMaxWords: 20
		}
	},
	metaInfo() {
		return {
			title: "ChiassoTV - " + this.serie.title,
			meta: [
				{ name: 'description', content:  `Episodi della serie ${this.serie.title}, ordinati in senso cronologico`},
				{ property: 'og:title', content: "ChiassoTV - " + this.serie.title},
			],
		}
	},
	methods: {
		getEpisodes () {
			EpisodeService.get(this.$route.params.name).then((episodes) => {
				// Read episodes 
				this.episodes = episodes.data

				// Set flag
				this.loaded = true
			}).catch((err) => {
				if (err.response.data.error.includes('is not a valid serie')) {
					// Force user to 404 static route
					this.$router.push('/404')
				} else {
					// Show error to the user
					this.$bvToast.toast(
						"C'è stato un problema durante il caricamento degli episodi",
						{
							title: "Caricamento episodi",
							variant: "danger",
							autoHideDelay: 5000,
							appendToast: true
						}
					);
				}
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

				// Set loaded serie flag to true
				this.loadedSerie = true
			}).catch(() => {
				// Show error to the user
				this.$bvToast.toast(
					"C'è stato un problema durante il caricamento delle informazioni della serie",
					{
						title: "Caricamento informazioni serie",
						variant: "danger",
						autoHideDelay: 5000,
						appendToast: true
					}
				);

				// Set loaded serie flag to false -> show error in sidebar
				this.loadSerie = false
			})
		}, 
		minify (string) {
			// Get words
			const words = string.trim().split(' ')
			// Check length
			if (words.length > this.descriptionMaxWords) {
				// Truncate string
				return words.splice(0, this.descriptionMaxWords).join(' ') + '...'
			} else {
				return string
			}
		},
		getEpisodeThumbnail (item) {
			// Return local thumbnail
			return process.env.VUE_APP_SERVER_URL + `api/episodes/${this.$route.params.name}/${item.encoded}/thumbnail`
		},
		async loadBanners () {
      await AdvertisementService.getAvailable().then((result) => {
        // Loaded correctly
        this.banners.available = this.$parent.shuffle(result.data)
      }).catch((err) => {
				console.log(err)
        // Error
        this.$bvToast.toast(
          err.response ? err.response.data.error : err,
          {
            title: "Caricamento pubblicità",
            variant: "false",
            autoHideDelay: 5000,
            appendToast: false
          }
        );
      });
    }
	},
	async created () {
		// Read episodes
		this.loadSerie()
		this.getEpisodes()

		await this.loadBanners();
		this.banners.loaded = true;
	}
}
</script>

<style scoped>

.card-img-right {
	max-height: 20vw;
}

@media only screen and (max-width: 700px) {
	.header-action {
		width: 100%;
	}
	
	#header-action-container{
		display: block !important;
	}

	#header-action-container .col {
		margin-bottom: 2vh;
	}

	.episode-card-block .row {
		display: block;
	}

	.episode-card-block .col-4 {
		max-width: unset;
		width: 100%;
		display: block;
	}

	.episode-card-block img {
		margin-bottom: 2vh;
	}
}
</style>