<template>
  <section class="al-404">
        <div class="container-fluid">
            <div class="row">
                <div class="col d-table">
                    <div class="text-center d-table-cell align-middle wow slideInDown vh-100">
                        <b-img :src="require('@/assets/404.webp')" alt="404 isometric image"></b-img>
                        <h1 class="font-weight-bold mb-4 h1-responsive text-dark">Oops!</h1>
                        <h4 class="h4-responsive text-dark">la pagina che stai cercando non esiste su <b>ChiassoTV</b>...</h4>
                        
                        <router-link
                            to="/"
                            v-slot="{ href, navigate}">

                            <b-button :href="href" @click="navigate" class='btn btn-primary mt-4 text-uppercase'>
                                torna alla homepage
                            </b-button>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
	export default{
		title: 'Error404',
		metaInfo: {
			title: "ChiassoTV - Pagina non trovata",
			meta: [
				{ name: 'description', content:  'Errore 404: è stato impossibile trovare la risorsa richiesta'},
				{ property: 'og:title', content: "ChiassoTV - Pagina non trovata"},
			],
		}
	}
</script>
<style scoped>
    .al-404 {
        font-family: 'Poppins', sans-serif;
        height: 100vh;
    }
    .al-404 h2 {
        color: #fff;
        font-size: 80px;
    }
    .al-404 p {
        color: #dcdcdc;
        font-size: 18px;
    }
    .al-404 img {
        height: 40vh;
        width: auto;
    }
</style>