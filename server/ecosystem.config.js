module.exports = {
    apps : [
        {
          name: "ChiassoTV",
          script: "./src/app.js",
          watch: true,
          instances: 5,
          exec_mode: "cluster",
          env: {
              "PORT": 5000,
              "NODE_ENV": "development"
          },
          env_production: {
              "PORT": 5000,
              "NODE_ENV": "production",
          }
        }
    ]
  }