/**
 * Created by B on 2017/7/8.
 */

const HtmlWebpackPlugin = require('html-webpack-plugin');

let entry = {}, plugins = [], defaultOptions = {
  type: '',
  entry: '',
  title: '',
  module: '',
  chunks: []
};

let pager = [];

pager.push({
  type: 'react',
  entry: 'index.jsx',
  title: 'Boer - by react'
});
pager.push({
  type: 'react',
  entry: 'markdown.jsx',
  title: 'markdown书写'
});
pager.push({
  type: 'vue',
  entry: 'page/markdown.js',
  title: 'MD - vue',
  module: 'md-vue'
});
pager.push({
  type: 'vue',
  entry: 'page/game.puzzle.js',
  title: '拼图游戏',
  module: 'puzzle-vue'
});
pager.push({
  type: 'vue',
  entry: 'page/game.puzzle.canvas.js',
  title: '拼图游戏',
  module: 'puzzle-canvas'
});

pager.map(page => {
  let entryPath = `./${page.type}/${page.entry}`,
    templatePath = '', chunks = page.chunks || [],
    filename = page.module || page.entry.replace(/(.*\/)*([^.]+).*/ig, "$2");
  if (page.type === 'react') {
    templatePath = page.template || './react/index.ejs';
  } else {
    templatePath = page.template || './vue/index.ejs';
  }
  entry[filename] = ['babel-polyfill', entryPath];
  plugins.push(
    new HtmlWebpackPlugin({
      title: page.title || 'React页面',
      template: templatePath,
      inject: true,
      filename: `${filename}.html`,
      chunks: [filename, 'manifest', ...chunks],
      chunksSortMode: 'dependency',
      minify: {
        minifyJS: true
      }
    })
  );
});

module.exports = {entry, plugins};
