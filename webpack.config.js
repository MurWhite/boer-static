/**
 * Created by B on 2017/6/1.
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    vue_index: ['babel-polyfill', './vue/page/index.js'],
    react_index: ['babel-polyfill', './react/index.jsx']
  },
  output: {
    path: path.join(__dirname, './docs/'),
    filename: 'js/[name].js',
    chunkFilename: '[name].[chunkhash:4].js'
  },
  resolve: {
    alias: {}
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'sass': 'vue-style-loader!css-loader!postcss-loader!sass-loader?indentedSyntax',
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        })
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["react", "es2015", "stage-2"]
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|eot|ttf|woff)(\?.*)?$/,
        use: 'url-loader?limit=10000&name=images/[name].[ext]'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({filename: 'style.css'}),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context && module.context.indexOf('node)modules') !== -1;
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    new HtmlWebpackPlugin({
      title: '这是Vue首页',
      template: './vue/index.ejs',
      inject: true,
      filename: 'vue_index.html',
      chunks: ['vue_index', 'manifest'],
      chunksSortMode: 'dependency'
    }),
    new HtmlWebpackPlugin({
      title: 'Boer - by react',
      template: './react/index.ejs',
      inject: true,
      filename: 'index.html',
      chunks: ['react_index', 'manifest'],
      chunksSortMode: 'dependency'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, './dist/')
  },
  devtool: "cheap-eval-source-map"
};
