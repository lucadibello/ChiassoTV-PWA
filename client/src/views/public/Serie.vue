<template>
	<div class="mt-3">
			<!-- List of all the available series -->
			<h1>Serie</h1>
			<p>Lista di tutte le serie presenti in <b>ChiassoTV</b></p>
			<hr>

			<!-- Card gallery -->
			<div class="gallery" v-if="this.series.length !== 0">
				<div class="gallery-card" v-for="(serie, index) in series" :key="serie.encoded">
					<div v-if="index%2==0">
						<b-card :img-src="buildBannerPath(serie.banner)" img-alt="Card image" img-left class="mb-3">
							<b-card-text>
								<h4>{{ serie.name }}</h4>
								<p>{{ serie.description }}</p>
							</b-card-text>

							<b-card-footer>
								<router-link :to="'/serie/' + serie.encoded">
									<b-button class="mt-2" variant='primary'>Vai alla serie</b-button>
								</router-link>
							</b-card-footer>
						</b-card>
					</div>
					<div v-else>
						<b-card :img-src="buildBannerPath(serie.banner)" img-alt="Card image" img-right class="mb-3">
							<b-card-text>
								<h4>{{ serie.name }}</h4>
								<p>{{ serie.description }}</p>
							</b-card-text>

							<b-card-footer>
								<router-link :to="'/serie/' + serie.encoded">
									<b-button class="mt-2" variant='primary'>Vai alla serie</b-button>
								</router-link>
							</b-card-footer>
						</b-card>
					</div>
				</div>
			</div>
			<div v-else>
				<h4 class="text-danger">Al momento non ci sono serie disponibili</h4>
			</div>
	</div>
</template>

<script>
// Import Serie service + Img grid
import SeriesService from '@/services/SeriesService'

export default {
	name: 'Serie',
	data() {
    return {
			series: []	
    }
  },
  methods: {
    async loadSeries() {
			SeriesService.get().then((series) => {
				// Load data using the one fetched from the APIs
				this.series = series.data
			}).catch((err) => {
				// Error
				alert(err)
			})
		},
		buildBannerPath(filename) {
			// Build banner path
			return process.env.VUE_APP_SERVER_URL + 'series/' + filename
		},
		triggerCollapse(serie) {
			// Set selected episode
			this.$root.$emit('bv::toggle::collapse', 'collapse-' + serie)
		},
		triggerClick() {
			console.log('Img clicked')
      // Some code here...
    }
	},
	created() {
		this.loadSeries()
	}
}
</script>

<style scoped>
	.gallery-card img {
		min-height: 10vw;
		max-height: 20vw;
		min-width: 10vw;
		max-width: 20vw;
		object-fit: contain;
		border-radius: 0.75rem;
		margin: 10px;
	}
	
	.card-footer {
		background-color: transparent;
	}

	@media only screen and (max-width: 700px) {
		.card {
			display: block !important;
			text-align: center;
		}

		.gallery-card img {
			width: 100%;
			max-width: 100%;
		}
	}
</style>
