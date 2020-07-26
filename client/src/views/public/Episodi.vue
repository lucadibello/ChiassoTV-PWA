<template>
	<b-container>
	<div class="mt-3">
		<!-- List of all the available series -->
		<h1>{{ this.serie.title }}</h1>
		<p>Episodi della serie <b>{{ this.serie.title }}</b></p>

		<!-- View type switch -->
		<b-row align-h="end" id="header-action-container">
			<b-col>
				<b-button class='header-action' variant='outline-dark' v-b-toggle.sidebar-footer>Mostra informazioni serie</b-button>
			</b-col>
			<b-col>
				<div id="galleryViewButton">
					<b-form-checkbox class="header-action" v-model="galleryView" switch size="lg">Formato galleria</b-form-checkbox>
				</div>
			</b-col>
		</b-row>

		<hr>

		<div v-if="loaded">
			<div v-if="episodes.length !== 0">
			<!-- Single episode view -->
			<div class="episode" v-if="!galleryView">
				<b-carousel
					id="carousel-fade"
					style="text-shadow: 0px 0px 2px #000"
					class="mb-5"
					fade
					controls
					img-width="1024"
					img-height="480"
				>
					<!-- Add every episode -->
					<div v-for="episode in episodes" :key="episode.encoded">
						<!-- Slide with blank fluid image to maintain slide aspect ratio -->
						<b-carousel-slide>
							<!-- Background image -->
							<template v-slot:img>
								<img
									class="d-block img-fluid w-100 blurred-image"
									width="1024"
									height="480"
									:src="getEpisodeThumbnail(episode)"
									:alt="episode.title + ' alt'"
								>
							</template>
							
							<h1 class="display-5">{{ episode.title }}</h1>
							<p class="lead">
								{{ minify(episode.description) }}
							</p>

							<hr class="my-4">

							<b-button class='mr-3' variant="primary" href="#">Salva nei preferiti (WIP) </b-button>

							<router-link
								:to="'/serie/' + serie.encoded + '/' + episode.encoded" 
								v-slot="{ href, navigate}">

								<b-button variant="success" @click='navigate' :href="href">Guarda video</b-button>
							</router-link>
							
							<div class="mb-3"></div>
						</b-carousel-slide>
					</div>
				</b-carousel>
			</div>
			<!-- Gallery view -->
			<div v-else>
				<b-card-group deck>
					<div v-for="episode in episodes" :key="episode.encoded" class="gallery-panel">
						<b-card
							class="m-2 gallery-card"
							:title="episode.title"
							:img-src="getEpisodeThumbnail(episode)"
							:img-alt="episode.title + ' banner'"
							img-top
							tag="article">

							<b-card-text>
								{{ minify(episode.description) }}
							</b-card-text>

							<router-link
								:to="'/serie/' + serie.encoded + '/' + episode.encoded" 
								v-slot="{ href, navigate}">

								<b-button variant="success" @click='navigate' :href="href">Guarda video</b-button>
							</router-link>
						</b-card>
					</div>
				</b-card-group>
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
		<b-sidebar id="sidebar-footer" aria-label="Sidebar with custom footer" no-header shadow>
			<template v-slot:footer="{ hide }">
				<div class="d-flex bg-dark text-light align-items-center px-3 py-2">
					<strong class="mr-auto">{{ serie.title }}</strong>
					<b-button size="sm" @click="hide">Chiudi</b-button>
				</div>
			</template>
			<div class="px-3 py-2">
				<h3>Informazioni serie</h3>

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
		</b-sidebar>
	</div>
	</b-container>
</template>

<script>
import EpisodeService from '@/services/EpisodeService'
import SeriesService from '@/services/SeriesService'

export default {
	name: 'Episodi',
	data () {
		return {
			// episode view type
			galleryView: window.innerWidth <= 700,
			// Series img base
			seriesBase: process.env.VUE_APP_SERVER_URL + 'series/',
			// Episodes list
			episodes: [],
			loaded: false,
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
			// Description max length
			descriptionMaxWords: 20
		}
	},
	methods: {
		getEpisodes () {
			EpisodeService.get(this.$route.params.name).then((episodes) => {
				// Read episodes 
				this.episodes = episodes.data
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
		}
	},
	created () {
		// Read episodes
		this.loadSerie()
		this.getEpisodes()
		// Set flag
		this.loaded = true
	}
}
</script>

<style scoped>
.gallery-card {
  width: 100%;
  display: inline-block !important;
  vertical-align: top;
}

.gallery-card img {
	height: 20vh;
	object-fit: scale-down;
}

.gallery-panel {
	margin: 4px !important;
	width: 30%;
	display: inline-block;
}

.blurred-image {
	filter: blur(4px);
	max-height: 50vh;
	object-fit: scale-down;
}

@media only screen and (max-width: 700px) {
	.gallery-panel {
		width: 100%;
	}

	.gallery-panel img {
		margin-top: 5vh;
	}
	
	#galleryViewButton {
		display: none;
	}

	.header-action {
		width: 100%;
	}
	
	#header-action-container{
		display: block !important;
	}

	#header-action-container .col {
		margin-bottom: 2vh;
	}
}
</style>

<style>
/* Black arrows */
.carousel-control-prev-icon, .carousel-control-next-icon  {
	transition: 1s;
    border-radius: 50% !important;
	background-color: black;
    box-shadow: 0 0 0 5px black !important;
}

.carousel-control-prev-icon:hover, .carousel-control-next-icon:hover {
	transition: 1s;
    box-shadow: 0 0 0 6px grey !important;
}
</style>