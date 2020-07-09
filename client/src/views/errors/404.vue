<template>
  <section class="al-404">
        <div class="container-fluid">
            <div class="row">
                <div class="col d-table">
                    <div class="text-center d-table-cell align-middle wow slideInDown vh-100">
                        <h1 class="font-weight-bold mb-4 h1-responsive text-white">Oops!</h1>
                        <h4 class="h4-responsive text-white">la pagina che stai cercando non esiste...</h4>
                        <a class="btn btn-danger mt-4 text-uppercase" href="/">torna alla homepage</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.al-404 {
            background-attachment: fixed;
            background-image: linear-gradient( rgba(22, 0, 10, .2), rgba(252, 68, 69, .3)), url('../../assets/404.jpg');
            background-position: center bottom;
            background-size: cover;
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
</style>