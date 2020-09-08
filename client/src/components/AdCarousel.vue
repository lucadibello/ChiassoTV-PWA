<template>
  <carousel :scrollPerPage="true" :autoplay="true" :navigationEnabled="true" 					:paginationEnabled="false" :loop="true" :perPage="4" :perPageCustom="[[0, 1], [768, 1], [800, 2], [950, 3]]">
		<slide v-for="ad in ads" :key="ad.id" :data-index="ad.id">
			<div v-if="Boolean(ad.website_link)">
				<!-- Image with link -->
				<a :href="ad.website_link" target="_blank" rel="sponsored">
					<b-img class="slide-img" :src="getAdBanner(ad)"/>
				</a>
			</div>
			<div v-else>
				<!-- Image (without link) -->
				<b-img class="slide-img" :src="getAdBanner(ad)"/>
			</div>
		</slide>

  </carousel>
</template>

<script>
/* Import components */
import { Carousel, Slide } from "vue-carousel";

export default {
  name: "AdCarousel",
  components: {
    Carousel,
    Slide,
	},
	props: {
		ads: Array,
	},
	methods : {
		getAdBanner(item) {
			return `${process.env.VUE_APP_SERVER_URL}api/F3334AC9EF26166DEDEBD319A18F9CC7/${item.id}/banner`
		}
	}
};
</script>

<style scoped>
.slide-img {
	width: 300px !important; 
	max-width: 100% !important;
}
</style>