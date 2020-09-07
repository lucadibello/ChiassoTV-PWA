<template>
  <div v-if="this.$parent.isOnline">
    <!-- Vetrina -->
    <div class="slideshow" v-if="showcase.episodes.length > 0">
      <div id="slideshowHeader" class="text-white header-violet">
        <h1 class="display-4">Vetrina</h1>
      </div>
      <div id="slideshowContent" >
        <div class="w-100 p-5" id="slideshow-content-video">
          <transition name="fade" mode="out-in">
            <!-- Video container -->
            <div class="container-fluid" :key="showcase.index">
              <!-- Episode title -->
                <div class="d-block text-left" id="slideshow-content-header">
                  <h2>{{ showcase.episodes[showcase.index].episode_information.title }}</h2>
                  <!-- <small>{{ showcase.episodes[showcase.index].episode_information.serie }}</small> -->
                </div>

              <div id="video-core" v-if="showcase.episodes[showcase.index].episode_information.isFromYoutube">
                  <youtube @ended="showcaseVideoEnded" :video-id="this.$youtube.getIdFromURL(showcase.episodes[showcase.index].episode_information.link)" 
                    :player-vars="{ autoplay: 1, rel: 0, modestbranding: 1}" host="https://www.youtube-nocookie.com"/>
              </div>
              <div v-else> 
                <!-- VideoJS -->
                <video-player  class="video-player-box"
                      ref="videoPlayer"
                      :options="playerOptions" @ended="showcaseVideoEnded(true)">
                </video-player>
              </div>
            </div>
          </transition>

          <!-- Carousel controls -->
          <div class="text-center mt-4" v-if="showcase.episodes.length > 1">
            
            <!-- Video index -->
            <div class="w-100">
              <small>{{showcase.index + 1}} / {{showcase.episodes.length}}</small>
            </div> 

            <!-- Carousel controls -->
            <div class="w-100">
              <b-row id="slideshow-content-controls">
                <b-col id="slideshow-content-controls-previous">
                  <b-button @click="showcasePrevious" rounded variant="primary" v-bind:disabled="showcase.index <= 0">
                    <b-icon-arrow-left></b-icon-arrow-left> Video precedente
                  </b-button>
                </b-col>
                <b-col id="slideshow-content-controls-next">
                  <b-button @click="showcaseNext" rounded variant="primary" v-bind:disabled="showcase.index >= showcase.episodes.length - 1">
                    Video successivo <b-icon-arrow-right></b-icon-arrow-right>
                  </b-button>
                </b-col>
              </b-row>
            </div>
            
          </div>
        </div>
      </div>
    </div>

    <!-- Ad carousel -->
    <div class="w-100 mb-3" v-if="this.banners.loaded">
      <ad-carousel :ads="banners.available"></ad-carousel>
    </div>

    <div class='series mb-2 w-100'>
      <!-- Series header -->
      <div id="seriesHeader" class="text-white header-violet">
        <h1 class="display-4">Serie</h1>
        <!-- Animated button -->
        <b-button variant="primary" pill @click="isCollapsedSerie = !isCollapsedSerie" class="collapseButton mb-2" v-bind:class="{isCollapsed: !this.isCollapsedSerie}">{{ this.isCollapsedSerie ? "Nascondi serie" : 'Mostra serie' }}</b-button>
      </div>

      <!-- Load last updated series -->
      <div id="seriesContent">
        <!-- Collapse series -->
        <b-collapse v-model="isCollapsedSerie" id="collapse-series">
          <div v-for="serie in series" :key="serie.encoded" class="text-left">
            <div class="jumbotron jumbotron-fluid mb-3">
              <div class="container collapse-jumbotron">
                <b-row>
                  <!-- Series text -->
                  <b-col cols="4" class="series-thumbnail">
                    <b-img :src="getSerieThumbnail(serie.banner)" :alt="serie.title + ' thumbnail'" fluid rounded></b-img>
                  </b-col>
                  <b-col cols="8">
                    <h1 class="display-4">{{ serie.name }}</h1>
                    <p class="lead">{{ serie.description }}</p>

                    <!-- Buttons -->
                    <div class="d-block ml-2 series-buttons">
                      <FavoriteButton variant="primary" :serie="serie.encoded"></FavoriteButton>

                      <router-link
                        :to="'/serie/' + serie.encoded" 
                        v-slot="{ href, navigate}">

                        <b-button class="w-30" round variant="success" :href="href" @click="navigate">
                          <b-icon-collection-play-fill></b-icon-collection-play-fill> Vai alla serie</b-button>
                      </router-link>
                    </div>
                  </b-col>
                </b-row>
              </div>
            </div>
          </div>
        </b-collapse>
      </div>
    </div>

    <!-- Ad carousel -->
    <div class="w-100 mb-5" v-if="this.banners.loaded">
      <ad-carousel :ads="banners.available"></ad-carousel>
    </div>

    <!-- Film Fair Switzerland -->
    <div class="ffs-sponsor">
      <b-row>
        <b-col cols="8">
          <h1 class="text-white">
            Partner officiale di <a href="https://momohill.com/" target="_blank" rel="noreferrer">Momohill Film Fair Switzerland</a>
          </h1>
        </b-col>
        <b-col cols="4" id="ffs-sponsor-img">
          <b-img :src="require('@/assets/momohill-logo.webp')" fluid rounded alt="Momohill Film Fair Switzerland logo"></b-img>
        </b-col>
      </b-row>
    </div>

    <!-- Footer -->
    <Footer/>
  </div>  
  <div v-else>
    <OfflinePage></OfflinePage>
  </div>
</template>

<script>
// Import services
import SeriesService from '@/services/SeriesService'
import HomepageService from '@/services/HomepageService'
import AdvertisementService from '@/services/AdvertisementService'

// Import components
import VideoPlayer from '@/components/VideoPlayer'
import FavoriteButton from '@/components/FavoriteButton'
import OfflinePage from '@/components/OfflinePage'
import Footer from '@/components/Footer'
import AdCarousel from '@/components/AdCarousel'

// Import mime-type database library
import mimeType from 'mime-types'

export default {
  name: 'Home',
  components: {
    VideoPlayer, FavoriteButton, OfflinePage, Footer, AdCarousel
  },
  metaInfo: {
    title: "ChiassoTV - la web tv Ticinese",
    meta: [
      { name: 'description', content:  'ChiassoTV è una web tv Ticinese che punta a portare contenuti inediti ed originali relativi al territorio del Mendrisiotto.'},
      { property: 'og:title', content: "ChiassoTV - la web tv Ticinese"},
    ]
  },
  data () {
    return {
      series: [],
      maxSeries: 4,
      mimeTypeUtility: mimeType,
      isCollapsedSerie: true,
      // Swiper JS options
      showcase: {
        episodes: [],
        index: 0
      },
      // VideoJS options
      playerOptions: {
        muted: false,
        language: 'it',
        fill: true,
        playbackRates: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
        sources: []
      },
      // Banner options
      banners: {
        available: [],
        loaded: false
      }
    }
  },
  methods: {
    loadShowcase() {
      // Get all showcase episodes
      HomepageService.get().then(episodes => {
        if (episodes.data.length > 0) {
          // Set showcase episodes
          this.showcase.episodes = episodes.data
          // Set video source
          this.setVideoSource();
        }
      }).catch(() => {
        // Show error message
        this.$bvToast.toast(
          "C'è stato un problema durante il caricamento della vetrina",
          {
            title: "Caricamento dati",
            variant: "danger",
            autoHideDelay: 5000,
            appendToast: true
          }
        );
      })
    },
    loadSeries() {
      SeriesService.get().then(series => {
        // Check if slice is needed
        if (series.data.length > this.maxSeries) {
          // Slice array (length: this.maxSeries)
          this.series = series.data.slice(0, this.maxSeries - 1)
        } else {
          // Length < maxSeries --> No slice needed
          this.series = series.data
        }
      }).catch(() => {
        // Show error message
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
    getSerieThumbnail(banner) {
      return process.env.VUE_APP_SERVER_URL + 'series/' + banner
    },
    showcaseNext () {
      // Check index
      if (this.showcase.index < this.showcase.episodes.length - 1) {
        
        // Skip video (add 1 to current index)
        this.showcase.index += 1

        // Set video source (if it's local)
        this.setVideoSource()
      }
    },
    showcasePrevious () {
      // Check index
      if (this.showcase.index > 0) {
        // Skip video
        this.showcase.index -= 1
        
        // Set video source (if it's local)
        this.setVideoSource()
      }
    },
    setVideoSource () {
      // Get current video
      const video = this.showcase.episodes[this.showcase.index]

      // Check if the video is from youtube
      if (!video.episode_information.isFromYoutube) {

        // Set video source
        this.playerOptions.sources = [{
          src: this.getVideoURL(video.serie, video.episode),
          type: this.getMimeType(video.episode_information.link)
        }]
      }
    },
    getMimeType(filename) {
      return this.mimeTypeUtility.lookup(filename)
    },
    getVideoURL (serie, episode) {
      return process.env.VUE_APP_SERVER_URL + `api/episodes/${serie}/${episode}/episode`
    },
    async loadBanners () {
      await AdvertisementService.getAvailable().then((result) => {
        // Loaded correctly
        this.banners.available = this.$parent.shuffle(result.data)
      }).catch((err) => {
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
    },
    showcaseVideoEnded (setNewSource=false) {
      // Check if last video of the carousel
      if (this.showcase.index == this.showcase.episodes.length - 1) {
        // Reset index to 0 (restart carousel)
        this.showcase.index = 0

        // Only for VideoJS (local video streaming)
        if (setNewSource) {
          this.setVideoSource();
        }
      } else {
        // Proceed to next video
        this.showcaseNext();
      }
    }
  },
  async mounted () {
      // Load showcase
      this.loadShowcase()
      // Load series
      this.loadSeries()

      // Load banners
      await this.loadBanners();
      this.banners.loaded = true;
  }
}
</script>

<style scoped>

  .video-player-box {
    height: 50vh;
    width: auto;
  }

  .ffs-sponsor {
    display: flex;
    width: 100%;
    background-color: #023E8A;
    padding: 10px
  }

  .header-violet {
    background-color: #023E8A;
    width: 100%;
  }

  .ffs-sponsor .row{
    justify-content: center;
    align-items: center;
  }

  .ffs-sponsor a{
    background:
            linear-gradient(
                    to bottom, #ff9800 0%,
                    #ff9800 100%
            );
    background-position: 0 100%;
    background-repeat: repeat-x;
    background-size: 4px 4px;
    color: #fff3cd;
    text-decoration: none;
    transition: .2s;
  }

  .ffs-sponsor a:hover {
    text-decoration: none;
    transition: 0.5s;
    color: #000;
    background-size: 4px 50px;
  }

  .ffs-sponsor img {
    max-height: 20vh;
    width: auto;
  }

  #ffs-sponsor-img {
    padding-right: 0 !important;
    text-align: right;
  }

  .collapse-jumbotron {
    width: 100%;
  }

  .series-buttons button, .series-buttons a{
    margin-right: 5px;
  }


  /* Section collapsed */
  .isCollapsed {
    background-color: white;
    color: black;
  }

  #slideshow-content-header {
    text-align: center !important;
  }

  @media only screen and (max-width: 700px) {
    #slideshow-content-header {
      text-align: left;
    }
    
    .ffs-sponsor .row {
        text-align: center;
        display: block;
    }

    .ffs-sponsor .row [class*="col-"] {
      width: 100%;
      max-width: 100%;
    }

    #ffs-sponsor-img {
      padding-right: 0 !important;
      text-align: center;
    }

    .ffs-sponsor img {
      margin-top: 2vh;
      height: 30vh;
      width: auto;
    }
    
    .series-thumbnail {
      display: block;
      max-width: 100% !important;
      width: 100%;
      flex: unset !important;
      margin-bottom: 2vh;
      text-align: center;
    }

    .series-buttons button, .series-buttons a{
      display: block;
      width: 100%;
      margin-bottom: 5px;
      margin-right: unset !important;
    }

    #slideshow-content-video {
      padding: unset !important;
      margin-bottom: 3vh;
    }

    #slideshow-content-controls {
      padding: 5px;
    }
  }
</style>

<style>

  @media only screen and (max-width: 700px) {
    /* iframe global width */
    iframe {
      width: 100% !important;
      height: 100% !important;
    }
  }

  #app {
    overflow-x: hidden !important;
  }
</style>