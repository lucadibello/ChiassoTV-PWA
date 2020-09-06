<template>
	<b-container v-if="this.$parent.isOnline">
	<div class="mt-3 mb-5">
			<!-- List of all the available series -->
			<h1>Serie</h1>
			<p>Lista di tutte le serie presenti in <b>ChiassoTV</b></p>
			
			<!-- Ad carousel -->
			<div class="w-100 mb-3" v-if="this.banners.loaded">
				<ad-carousel :ads="banners.available"></ad-carousel>
			</div>
			
			<hr>
			
			<div v-if="loaded">
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

					<!-- Ad carousel 
					<div class="w-100 mt-5 mb-3" v-if="this.banners.loaded">
						<ad-carousel :ads="banners.available"></ad-carousel>
					</div> -->
				</div>
				<div v-else>
					<h4 class="text-danger">Al momento non ci sono serie disponibili</h4>
				</div>
			</div>
			<div v-else>
				<!-- Loading spinner -->
				<div class="d-flex justify-content-center mb-3 mt-5">
					<b-spinner label="Caricamento..."></b-spinner>
				</div>
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
import AdvertisementService from '@/services/AdvertisementService'
import FavoritesHelper from '@/helpers/FavoritesHelper'

// Import components
import OfflinePage from '@/components/OfflinePage'
import SeriesGallery from '@/components/SeriesGallery'
import AdCarousel from '@/components/AdCarousel'

export default {
	name: 'Serie',
	components: { OfflinePage, SeriesGallery, AdCarousel },
	data() {
		return {
				series: [],
				favorites: [],
				loaded: false,
				banners: {
					available: [],
					loaded: false
				}
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

			// Set loaded flag to true -> Show page content
			this.loaded = true
		}).catch(() => {
			// Show error to the user
			this.$bvToast.toast(
			"C'è stato un problema durante il caricamento delle serie",
			{
				title: "Caricamento dati",
				variant: "danger",
				autoHideDelay: 5000,
				appendToast: true
			}
			);
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
	async mounted() {
		this.loadSeries()

		// Load banners
		await this.loadBanners();
		this.banners.loaded = true;
	}
}
</script>