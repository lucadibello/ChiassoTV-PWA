<template>
  <b-container>
  <div class="mt-3">
    <!-- List of all the available series -->
    <h1>{{ episode.title }}</h1>
    <hr>

    <div v-if="loaded">
      <!-- Video box -->
      <div class="w-100 p-5">
        <!-- Video -->
        <div v-if="episode.isFromYoutube">
          <!-- VideoJS + YouTube embedded -->
          <video-player  class="video-player-box"
                 ref="videoPlayer"
                 :options="playerOptions">
          </video-player>
        </div>
        <div v-else>
          <!-- VideoJS with local video -->
          WIP
        </div>

        <!-- Info box -->
        <b-tabs content-class="mt-3" class="mt-3 text-left">

          <!-- Description -->
          <b-tab title="Descrizione" active>
            <p>{{ this.episode.description }}</p>
          </b-tab>

          <!-- Episode information box -->
          <b-tab title="Informazioni">
            <p>
              <b-row>
                <b-col>
                  <h6>Anteprima </h6>
                  <b-img-lazy :src="getEpisodeThumbnail(this.$route.params.episode)" fluid thumbnail></b-img-lazy>
                </b-col>
                <b-col>
                  <p><b>Data di caricamento:</b> {{ moment(this.episode.createdAt).format('DD/MM/YYYY HH:mm') }}</p>
                  <p><b>Serie:</b> {{ this.serie.title }}</p>
                  
                  <router-link
                    :to="'/serie/' + this.$route.params.name"
                    v-slot="{ href, navigate}">
                    <b-button class="w-100" pill variant="success" :href="href" @click="navigate">
                      <b-icon-collection-play-fill></b-icon-collection-play-fill> Vai alla serie</b-button>
                  </router-link>
                </b-col>
              </b-row>
            </p>
          </b-tab>

          <b-tab title="Video correlati" lazy @click="loadRelatedVideos()">
            <!-- Load videos -->
            <transition name="fade">
              <div v-if="related.done">
                <!-- Load related episodes cards -->
                <div v-for="episode in related.episodes" :key="episode.encoded" class="gallery-card">
                    
                  <!-- Related episode card -->
                  <b-card :img-src="getEpisodeThumbnail(episode.encoded)" img-alt="Card image" img-left class="mb-3">
                    <b-card-text>
                      <h4>{{ episode.title }}</h4>
                      <p> {{ minify(episode.description) }}</p>
                    </b-card-text>

                    <b-card-footer>
                      
                      <router-link
                        :to="`/serie/${episode.serie}/${episode.encoded}`"
                        v-slot="{ href, navigate}">

                        <b-button class="mt-2" variant='success' :href="href" @click="navigate">
                          <b-icon-play-fill></b-icon-play-fill> Guarda l'episodio
                        </b-button>
                      </router-link>
                    </b-card-footer>
                  </b-card>

                </div>
              </div>
              <div v-else>
                <!-- Loading spinner -->
                <div class="d-flex justify-content-center mb-3">
                  <b-spinner label="Caricamento..."></b-spinner>
                </div>
              </div>
            </transition>
          </b-tab>
        </b-tabs>
      </div>
    </div>
    <div v-else>
      <!-- Loading spinner -->
      <div class="d-flex justify-content-center mb-3">
        <b-spinner label="Caricamento..."></b-spinner>
      </div>
    </div>
  </div>
  </b-container>
</template>

<script>
// Services
import EpisodeService from "@/services/EpisodeService";
import SeriesService from "@/services/SeriesService";

// Video component
import videoPlayer from '@/components/VideoPlayer'
import moment from 'moment'

export default {
  name: "EpisodeViewer",
  components: {
    videoPlayer
  },
  data() {
    return {
      // Service variables
      serie: {
        title: "",
        description: "",
        banner: "",
        createdAt: "",
        encoded: ""
      },
      episode: {
        createdAt: "",
        description: "",
        isFromYoutube: false,
        link: "",
        thumbnail: "",
        title: ""
      },
      playerOptions: {
        // videojs options
        muted: true,
        language: 'it',
        fluid: true,
        responsive: true,
        playbackRates: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
        sources: [{
          type: 'application/x-mpegurl',
          src: "http://localhost:5000/hls/output.m3u8"
        }],
        poster: this.getEpisodeThumbnail()
      },
      related: {
        episodes: [],
        done: false
      },
      maxRelatedVideos: 10,
      descriptionMaxWords: 50,
      loaded: false,
      moment: moment
    };
  },
  methods: {
    loadSerie() {
      SeriesService.getSerie(this.$route.params.name)
        .then(serie => {
          // Save data inside this.serie parameter
          this.serie.title = serie.data.name;
          this.serie.encoded = serie.data.encoded;
          this.serie.description = serie.data.description;
          this.serie.banner = serie.data.banner;
          this.serie.createdAt = serie.data.createdAt;
        })
        .catch(err => {
          alert(err);
        });
    },
    loadEpisode(series = this.$route.params.name, episode = this.$route.params.episode) {
      EpisodeService.getEpisode(
        series,
        episode
      )
        .then(episode => {
          // Save data inside this.serie parameters
          this.episode.createdAt = episode.data.createdAt;
          this.episode.description = episode.data.description;
          this.episode.isFromYoutube = episode.data.isFromYoutube;
          this.episode.link = episode.data.link;
          this.episode.title = episode.data.title;

          if (!this.episode.isFromYoutube) {
            this.episode.thumbnail = episode.data.thumbnail;
          }
        })
        .catch(err => {
          alert(err);
        });
    },
    loadRelatedVideos() {
      const BreakException = {}

      // Check if related videos have been already loaded
      if (!this.related.done) {
        // Read all series episodes
        EpisodeService.get(
        this.$route.params.name
      ).then(episodes => {
          // Select first 10 videos
          try {
            // Empty related episodes array
            this.related.episodes = []

            episodes.data.forEach((episode, index) => {
              // Check if is the same video
              if (episode.encoded === this.$route.params.episode) {
                // Same video, skip iteration
                return
              } else {
                // Break with dummy exception
                if (index >= this.maxRelatedVideos) throw BreakException
                // Add episode to array
                this.related.episodes.push(episode)
              }
            })
          } catch {
            // Break exception handler
          } finally {
            // Related videos already loaded
            // setTimeout(() => {  this.related.done = true }, 1000);
            this.related.done = true
          }
        })
        .catch(err => {
          alert(err);
        });
      }
    },
    getEpisodeThumbnail(episodeName) {
      // Return youtube thumbnail
      return process.env.VUE_APP_SERVER_URL +
          `api/episodes/${this.$route.params.name}/${episodeName}/thumbnail`
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
  },
  mounted() {
    // Load episode information
    this.loadEpisode();
    // Set to loaded flag to 'true'
    this.loaded = true;
    // Load serie information
    this.loadSerie();
  },
  beforeRouteUpdate(to, from, next) {
    // Set load flag to false
    this.loaded = false
    // Load episode information
    this.loadEpisode(to.params.name, to.params.episode)
    // Change page URL
    next()
    // Set related video flag to False
    this.related.done = false
    // Reload related videos
    this.loadRelatedVideos() 
    // All data loaded: set loaded flag to True
    this.loaded = true
  }
};
</script>

<style scoped>
  .gallery-card img {
		min-height: 10vw;
		max-height: 50vw;
		min-width: 10vw;
		max-width: 30vw;
		object-fit: contain;
		border-radius: 0.75rem;
		margin: 10px;
  }
  
  .card-footer {
		background-color: transparent;
	}

	@media only screen and (max-width: 700px) {
		.card {
      padding: 5%;
			display: block !important;
			text-align: center;
		}

		.gallery-card img {
			width: 100%;
			max-width: 100%;
		}
	}
</style>