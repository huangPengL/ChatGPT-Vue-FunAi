const { defineConfig } = require('@vue/cli-service')

const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  devServer: {
    hot: true,//自动保存
    port: 80,
    // https: true,
    client: {
      webSocketURL: 'ws://0.0.0.0:80/ws',
    },
    allowedHosts: [
      'funai.space', // 允许访问的域名地址，即花生壳内网穿透的地址
      '.funai.space',// .是二级域名的通配符   
      'funai.vip',
      '.funai.vip'
    ],
  },
  configureWebpack: config => {
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }));
      // config.plugins.push(new webpack.optimize.LimitChunkCountPlugin({
      //   maxChunks: 5, 
      //   minChunkSize: 100
      // }));
      
      config.devtool = false;
    },
  chainWebpack: config => {
    config.plugins.delete("prefetch");
    // 移除 preload 插件
    config.plugins.delete('preload');
    // 压缩代码
    config.optimization.minimize(true)
  },
})