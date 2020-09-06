<template>
    <b-button round :variant="variant" @click="saveElement" v-if="!isStarred" >
        <b-icon-star></b-icon-star> Salva nei preferiti</b-button>
        
    <b-button round :variant="undoVariant" v-else @click="removeElement">
        <b-icon-star-fill></b-icon-star-fill> Rimuovi dai preferiti</b-button>
</template>

<script>
// Import favorites helper
import FavoritesHelper from '@/helpers/FavoritesHelper'

export default {
    name: 'FavoriteButton',
    props: {
        serie: String,
        episode: {
            type: String,
            default: null
        },
        variant: {
            type: String,
            default: 'primary'
        },
        undoVariant: {
            type: String,
            default: 'danger'
        }
    },
    data() {
        return {
            isStarred: false
        }
    },
    methods: {
        saveElement() {
            if (this.serie) {
                if (this.episode) {
                    // Save episode
                    FavoritesHelper.saveEpisode(this.serie, this.episode)
                } else {
                    // Save series
                    FavoritesHelper.saveSeries(this.serie)
                }
                this.isStarred = true

                // Emit save event
                this.$emit('element-saved', {serie: this.serie, episode: this.episode, action: 'save'})
            }
        },
        removeElement() {
            if (this.serie) {
                if (this.episode) {
                    FavoritesHelper.removeEpisode(this.serie, this.episode)
                } else {
                    FavoritesHelper.removeSeries(this.serie)
                }

                this.isStarred = false

                // Emit remove event
                this.$emit('element-removed', {serie: this.serie, episode: this.episode, action: 'remove'})
            }
        }
    },
    mounted() {
        if (this.serie) {
            if (this.episode) {
                // It's an episode
                this.isStarred = FavoritesHelper.isEpisodeFavorite(this.serie, this.episode)
            } else {
                // It's a serie
                this.isStarred = FavoritesHelper.isSeriesFavorite(this.serie)
            }
        } else {
            // Default value: null
            return false
        }
    }
}
</script>