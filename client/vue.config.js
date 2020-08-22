// Inside vue.config.js
module.exports = {
    pwa: {
      name: 'ChiassoTV - la web tv Ticinese',
      short_name: "ChiassoTV",
      start_url: '.',
      display: "standalone",
      background_color: "#000000",
      theme_color: "#4DBA87",
      configureWebpack:{
        optimization: {
          splitChunks: {
            minSize: 10000,
            maxSize: 250000,
          }
        }
      },
      icons: [
        {
            src: "./img/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "./img/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "./img/icons/android-chrome-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "./img/icons/android-chrome-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
      ]
    }
  }

