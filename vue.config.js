const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  filenameHashing: false,
  productionSourceMap: false,

  configureWebpack: config => {
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ascii_only: true,
            compress: true,
            mangle: true,
          },
        }),
      ],
    }
  },

  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
};
