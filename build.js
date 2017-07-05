/**
 * Created by BaiBai on 2017/2/6.
 */
require('shelljs/global');
let path = require('path');
let webpack = require('webpack');

let webpackConfig = require('./webpack.config');

let assetsPath = path.resolve(__dirname, './docs');
rm('-rf', assetsPath);
mkdir('-p', assetsPath);

webpackConfig.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  })
);
webpackConfig.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    minimize: true
  }),
);

webpack(webpackConfig, function (err, stats) {
  if (err) throw err;
  console.log(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: true,
    chunkModules: false
  }));
});
