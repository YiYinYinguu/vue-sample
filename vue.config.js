const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
});

module.exports = {
  devServer: {
    port: 8080,
    open: true,

  },
  lintOnSave: false,
  chainWebpack: (config) => {
    config.module.rules.delete("svg");
  },
  configureWebpack: {
    module: {
      rules: [{
        test: /\.svg$/,
        use: [
          'vue-svg-loader',
        ],
      },
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
  }
}