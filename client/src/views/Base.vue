<template>
  <div>
    <!-- Page header -->
    <Header></Header>
      <!-- Fade transition
      <transition name="fade" mode="out-in">  -->
        <!-- Other pages will be loaded inside the router-vie tag -->
        <router-view></router-view>
      <!-- </transition> -->

  </div>
</template>

<script>
// Import custom header
import Header from '@/components/Header'

export default {
  name: 'ChiassoTV',
  components: {
    Header
  },
  data() {
    return {
      isOnline: navigator.onLine || true
    }
  },
  methods: {
    shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
  },
  mounted () {
    // Connection changed to online
    window.addEventListener('online', () => {
      this.isOnline = true
    });
    
    // Connection changed to offline
    window.addEventListener('offline', () => {
      this.isOnline = false
    });
  }
}
</script>

<style scoped>
/*
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.1s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
*/
</style>
