<template>
    <div class="error-container text-center">
        <!-- Icon -->
        <div id="error-image">
            <b-img :src='require("@/assets/no-internet.webp")' alt='Offline icon'></b-img>
        </div>
        <div id="error-content" class="p-3">
            <h6 class="h-special">Ooops! Sembra che sei offline!</h6>
            <p class="mb-5">Questa pagina non può essere mostrata al momento. Riprova più tardi quando tornerà la connessione internet!</p>
            
            <b-button id="retry-button" pill variant="primary" @click="checkConnection">Riprova</b-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "OfflinePage",
    methods: {
        checkConnection() {
            if (navigator.onLine) {
                // Internet is back!
                this.$bvToast.toast(
                    "Sei tornato online!",
                    {
                        title: "Connessione internet",
                        variant: "success",
                        autoHideDelay: 5000,
                        appendToast: true
                    }
                );
            } else {
                // Show error message
                this.$bvToast.toast(
                    "Connessione internet mancante",
                    {
                        title: "Connessione internet",
                        variant: "danger",
                        autoHideDelay: 5000,
                        appendToast: true
                    }
                );
            }
        }
    }
}
</script>

<style>

</style>
<style scoped>
    .h-special {
        font-size: 2rem;
    }

    #retry-button {
       width: 30%
    }

</style>