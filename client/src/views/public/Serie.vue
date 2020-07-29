<template>
	<b-container v-if="this.$parent.isOnline">
	<div class="mt-3">
			<!-- List of all the available series -->
			<h1>Serie</h1>
			<p>Lista di tutte le serie presenti in <b>ChiassoTV</b></p>
			<hr>

			<div v-if="this.series.length !== 0 || this.favorites.length !== 0">
				<!-- Favorites series -->
				<div v-if="this.favorites.length !== 0">
					<h2 class="text-left">Serie preferite</h2>
					<SeriesGallery :series="favorites" @reload="reloadFavorites"></SeriesGallery>
					<hr>
				</div>

				<!-- Normal series -->
				<div v-if="this.series.length !== 0">
					<h2 class="text-left">Tutte le serie</h2>
					<SeriesGallery :series="series" @reload="reloadFavorites"></SeriesGallery>
				</div>
			</div>
			<div v-else>
				<h4 class="text-danger">Al momento non ci sono serie disponibili</h4>
			</div>
	</div>
	</b-container>
	<div v-else>
		<OfflinePage></OfflinePage>
	</div>
</template>

<script>
// Import Serie service + Img grid
import SeriesService from '@/services/SeriesService'
import FavoritesHelper from '@/helpers/FavoritesHelper'

// Import components
import OfflinePage from '@/components/OfflinePage'
import SeriesGallery from '@/components/SeriesGallery'

export default {
	name: 'Serie',
	components: { OfflinePage, SeriesGallery },
	data() {
		return {
				series: [],
				favorites: []
		}
  },
	metaInfo: {
    title: "ChiassoTV - Serie",
    meta: [
        { name: 'description', content:  'Le nostre serie dedicate alla cultura, al territorio e alla gastronomia locale di qualità'},
        { property: 'og:title', content: "ChiassoTV - Serie"},
    ],
  },
  methods: {
    async loadSeries() {
			SeriesService.get().then((series) => {
				// Load data using the one fetched from the APIs
				series.data.forEach(serie => {
					if (FavoritesHelper.isSeriesFavorite(serie.encoded)) {
						// Add serie to the favourites list
						this.favorites.push(serie)
					} else {
						// Add serie to the normal list
						this.series.push(serie)
					}
				})
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
		// Event handler
		reloadFavorites (data) {
			// Find index
			if (data.action === 'save') {
				// Find index inside series array
				let index = this.series.findIndex(serie => serie.encoded === data.serie)
				
				// Save element inside temp variable
				const tempSerie = this.series[index]

				// Remove element from array
				this.series.splice(index, 1)

				// Add element inside favorites array
				this.favorites.push(tempSerie)
			} else if (data.action === 'remove') {
				// Find index inside favorites array
				let index = this.favorites.findIndex(favSerie => favSerie.encoded === data.serie)
				
				// Save element inside temp variable
				const tempSerie = this.favorites[index]

				// Remove element from array
				this.favorites.splice(index, 1)

				// Add element inside favorites array
				this.series.push(tempSerie)
			}
		}
	},
	created() {
		this.loadSeries()
	}
}
</script>