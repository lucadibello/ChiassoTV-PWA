// base64 keys
const SERIE_KEY = Buffer.from('serie_fav').toString('base64')
const EPISODE_KEY = Buffer.from('episode_fav').toString('base64')

module.exports = {
    getFavoriteSeries() {
        return localStorage.getItem(SERIE_KEY)
    },
    getFavoriteEpisodes() {
        return localStorage.getItem(EPISODE_KEY)
    },
    isEpisodeFavorite(serie, episode) {
        // Get episodes list (if undefined: empty array)
        const episodes = JSON.parse(localStorage.getItem(EPISODE_KEY)) || []
        
        // Check if it's saved 
        for (const favEpisode of episodes) {
            if (favEpisode.title === episode
                && favEpisode.serie === serie) {
                
                // Episode found
                return true
            }
        }

        return false
    },
    isSeriesFavorite(serie) {
        // Get series list 
        const series = JSON.parse(localStorage.getItem(SERIE_KEY)) || []
        
        // Check if it's saved
        for (const favSerie of series) {
            if (favSerie.name === serie) {
                return true
            }
        }

        return false
    },
    saveEpisode(serie, episode) {
        // Get current favorites
        const episodes = JSON.parse(localStorage.getItem(EPISODE_KEY)) || []

        // Add current episode
        episodes.push({
            serie: serie,
            title: episode
        })
        
        // Save favorites
        localStorage.setItem(EPISODE_KEY, JSON.stringify(episodes))
    },
    removeEpisode(serie, episode) {
        if (this.isEpisodeFavorite(serie, episode)) {
            // Remove episode from lsit
            const episodes = JSON.parse(localStorage.getItem(EPISODE_KEY))

            // Get value index
            var index = episodes.findIndex(favEpisode => favEpisode.serie === serie && favEpisode.title === episode)

            if (index !== -1) {
                // Remove element using Splice
                episodes.splice(index, 1);

                // Set new value
                localStorage.setItem(EPISODE_KEY, JSON.stringify(episodes))
            }
        }
    },
    saveSeries(serie) {
        // Check if series is already starred
        if (!this.isSeriesFavorite(serie)) {
            // Get current favorites
            const series = JSON.parse(localStorage.getItem(SERIE_KEY)) || []
                    
            // Add current episode
            series.push({
                name: serie
            })

            // Save favorites
            localStorage.setItem(SERIE_KEY, JSON.stringify(series))
        }
    },
    removeSeries(serie) {
        if (this.isSeriesFavorite(serie)) {
            // Remove episode from lsit
            const series = JSON.parse(localStorage.getItem(SERIE_KEY))

            // Get value index
            var index = series.findIndex(favSerie => favSerie.name === serie)

            if (index !== -1) {
                // Remove element using Splice
                series.splice(index, 1);

                // Set new value
                localStorage.setItem(SERIE_KEY, JSON.stringify(series))
            }
        }
    }
}