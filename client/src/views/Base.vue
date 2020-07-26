<template>
  <div>
    <!-- Page header -->
    <Header></Header>

    <!-- Other pages will be loaded inside the router-vie tag -->
    <router-view></router-view>
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
