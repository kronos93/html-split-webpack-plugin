const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SplitHtmlWebpackPlugin = require('../../');
const webpack = require('webpack');

module.exports = (env, args) => {
  return {
    mode: 'development',
    context: __dirname,
    entry: './src/app.js',
    output: {
      path: resolve(__dirname, 'public'),
      publicPath: '/',
      filename: 'app.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
      }),
      new SplitHtmlWebpackPlugin(),
      // new webpack.NamedModulesPlugin(),
      // new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
      contentBase: resolve(__dirname, 'public'),
      publicPath: '/',
      compress: true,
      port: 9000,
      open: false,
      openPage: '',
      stats: "errors-only"
    },
    stats: "errors-only"
  };
}
