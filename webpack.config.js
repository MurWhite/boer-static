/**
 * Created by B on 2017/6/1.
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
let FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const {entry, plugins} = require('./webpack.pager');

let mdFormateCss = new ExtractTextPlugin('');

module.exports = {
  entry: Object.assign({
    vue_index: ['babel-polyfill', './vue/page/index.js'],
    md_css: './react/page/markdown.scss',
    md_js: 'prismjs/prism.js'
  }, entry),
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
        exclude: [/node_modules/, 'prism.js'],
        use: "babel-loader"
      },
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader?minimize', 'postcss-loader', 'sass-loader']
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
    new ExtractTextPlugin({filename: 'css/[name].css'}),
    new FaviconsWebpackPlugin('./favicon.png'),
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
    ...plugins,
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      beautify: false,
      compress: {
        warnings: false,
        comparisons: false,
      },
      output: {
        comments: false,
      },
      sourceMap: true,
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, './docs/')
  },
  devtool: "source-map"
};
