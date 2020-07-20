<template>
  <div>
    <!-- Page header -->
    <Header></Header>

    <!-- Page container -->
    <b-container>
        <!-- Other pages will be loaded inside the router-vie tag -->
        <router-view></router-view>
    </b-container>
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
