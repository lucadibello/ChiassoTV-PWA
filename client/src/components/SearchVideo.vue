<template>
	<b-modal v-if="Boolean(videos)" ref="search-modal" size="xl" title="Ricerca episodi">
		<h3>{{this.videos}}</h3>
	</b-modal>
</template>

<script>

export default {
	name: 'Ricerca',
	data() {
		return {
			videos: null
		}
	},
	methods: {
		searchVideos(keyword) {
			console.log('look for videos containing this keyword:', keyword)
		}
	}
}
</script>