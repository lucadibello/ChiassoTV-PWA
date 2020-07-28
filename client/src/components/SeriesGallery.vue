<template>
  <div class="serie-thumbnail-list">
    <div v-for="serie in series" :key="serie.encode" class="serie-thumbnail-panel">
			<!-- Series round image -->
			<div class="serie-thumbnail-panel-content">
				<router-link
					:to='"/serie/" + serie.encoded'
					v-slot="{ href, navigate}">
					<a :href="href" @click="navigate" rel="noreferrer"><b-img  :alt='serie.title + " thumbnail"' :src="buildBannerPath(serie.banner)" rounded="circle" class="serie-thumbnail-round"></b-img></a>
				</router-link>
				
				<h4 class="d-4 mt-3">{{ serie.name }}</h4>
				
				<p class="description-paragraph">
						{{ serie.description }}
				</p>
				<FavoriteButton :serie='serie.encoded' @element-saved='emitReload' @element-removed='emitReload'/>
			</div>
    </div>
	</div>
</template>

<script>
// Import components
import FavoriteButton from '@/components/FavoriteButton'

export default {
		name: 'SeriesGallery',
		components: {
			FavoriteButton
		},
		props: {
        series: Array,
		},
		methods: {
			buildBannerPath(filename) {
				// Build banner path
				return process.env.VUE_APP_SERVER_URL + 'series/' + filename
			},
			emitReload(data) {
				this.$emit('reload', data)
			}
		}
}
</script>

<style scoped>
	.serie-thumbnail-list {
		margin: 4px !important;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.serie-thumbnail-panel {
		box-sizing: border-box;
		width: 40%;
		transition: all .5s ease-in-out;
	}

	.serie-thumbnail-round {
		background: radial-gradient(closest-side, black 40%, white);
		object-fit: contain;
		text-align: center;
		height: 80%;
		width: 80%;
		transition: all .3s ease-in-out;
	}

	.description-paragraph {
		text-align: center;
		word-wrap: normal;
	}

	.serie-thumbnail-round:hover {
		box-shadow: rgba(31, 123, 228, 0.76) 0px 19px 43px;
		transform: translate3d(0px, -10px, 0px);
	}

	@media only screen and (max-width: 700px) {
		.serie-thumbnail-list {
			display: block
		}

		.serie-thumbnail-panel {
			display: inline-block;
			margin: 4px !important;
			width: 100%;
		}
		
		.serie-thumbnail-panel-content {
			margin-bottom: 5vh;
		}
	}
</style>