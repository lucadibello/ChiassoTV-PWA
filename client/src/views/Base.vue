<template>
  <div>
    <!-- Page header -->
    <Header></Header>
      <!-- Fade transition -->
      <transition name="fade" mode="out-in">
        <!-- Other pages will be loaded inside the router-vie tag -->
        <router-view></router-view>
      </transition>
  </div>
</template>

<script>
// Import custom header
import Header from '@/components/Header'

export default {
  name: 'ChiassoTV',
  components: {
    Header
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
