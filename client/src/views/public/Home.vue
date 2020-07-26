<template>
  <div>
    <!-- Vetrina -->
    <div class="slideshow">
      <div id="slideshowHeader" class="text-white header-violet">
        <h1 class="display-4">Vetrina</h1>
      </div>
      <div id="slideshowContent">
        <!-- Swiper.js Slideshow -->
        <swiper ref="mySwiper" :options="swiperOptions">
          <swiper-slide v-for="showcaseEpisode in showcase" :key="showcaseEpisode.episode">
            <!-- Video player container -->
            <div class="w-100 p-5">
              <!-- VideoJS -->
              <video-player  class="video-player-box"
                    ref="videoPlayer"
                    :options="playerOptions">
              </video-player>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </div>

    <div class='series mb-2'>
      <!-- Series header -->
      <div id="seriesHeader" class="text-white header-violet">
        <h1 class="display-4">Serie</h1>
        <!-- Animated button -->
        <b-button variant="success" pill @click="isCollapsedSerie = !isCollapsedSerie" class="collapseButton" v-bind:class="{isCollapsed: !this.isCollapsedSerie}">{{ this.isCollapsedSerie ? "Nascondi serie" : 'Mostra serie' }}</b-button>
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
                    <b-img :src="getSerieThumbnail(serie.banner)" fluid rounded></b-img>
                  </b-col>
                  <b-col cols="8">
                    <h1 class="display-4">{{ serie.name }}</h1>
                    <p class="lead">{{ serie.description }}</p>

                    <!-- Buttons -->
                    <div class="d-block ml-2 series-buttons">
                      <b-button class='w-30' round variant="primary">
                        <b-icon-star></b-icon-star> Salva nei preferiti</b-button>

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

    <!-- Film Fair Switzerland -->
    <div class="ffs-sponsor shadow-lg">
      <b-row>
        <b-col cols="8">
          <h1 class="text-white">
            Partner officiale di <a href="https://momohill.com/" target="_blank" rel="noreferrer">Momohill Film Fair Switzerland</a>
          </h1>
        </b-col>
        <b-col cols="4">
          <b-img :src="require('@/assets/momohill-logo.jpg')" fluid rounded></b-img>
        </b-col>
      </b-row>
    </div>

  </div>
</template>

<script>
// Import services
import SeriesService from '@/services/SeriesService'
import HomepageService from '@/services/HomepageService'

// Import Swiper.JS (Vue Version)
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css';

// Import VideoPlayer component
import VideoPlayer from '@/components/VideoPlayer'

export default {
  name: 'Home',
  components: {
    Swiper,
    SwiperSlide,
    VideoPlayer
  },
  data () {
    return {
      series: [],
      showcase: [],
      maxSeries: 4,
      isCollapsedSerie: true,
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination'
        },
        // Some Swiper option/callback...
      },
      playerOptions: {
        // videojs options
        muted: true,
        language: 'it',
        fill: true,
        playbackRates: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
        sources: [{
          type: 'application/x-mpegurl',
          src: "http://localhost:5000/hls/output.m3u8"
        }]
      },
    }
  },
  methods: {
    loadShowcase() {
      // Get all showcase episodes
      HomepageService.get().then(episodes => {
        this.showcase = episodes.data
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
    }
  },
  mounted () {
    // Load showcase
    this.loadShowcase()
    // Load series
    this.loadSeries()
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    }
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
    background-color: #5252d4;
    padding: 10px
  }

  .header-violet {
    background-color: #5252d4;
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

  .collapse-jumbotron {
    width: 100%;
  }

  /* Section shown */
  .collapseButton {

  }

  .series-buttons button, .series-buttons a{
    margin-right: 5px;
  }

  /* Collapse button color change animation */
  @keyframes collapseAnimation {
    0%   {background-color: red;}
    25%  {background-color: yellow;}
    50%  {background-color: blue;}
    100% {background-color: green;}
  }

  /* Section collapsed */
  .isCollapsed {
    background-color: red;
    animation-name: collapseAnimation;
    animation-duration: 2s;
  }

  @media only screen and (max-width: 700px) {
    .ffs-sponsor .row {
        text-align: center;
        display: block;
    }

    .ffs-sponsor .row [class*="col-"] {
      width: 100%;
      max-width: 100%;
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
    }

    .series-buttons button, .series-buttons a{
      display: block;
      width: 100%;
      margin-bottom: 5px;
      margin-right: unset !important;
    }
  }
</style>
