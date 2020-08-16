module.exports = {
    apps : [
        {
          name: "ChiassoTV",
          script: "./server/src/app.js",
          watch: true,
          instances: 0,
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