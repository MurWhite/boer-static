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
  title: 'Boer - by react',
  chunks: []
});
pager.push({
  type: 'react',
  entry: 'markdown.jsx',
  title: 'markdown书写',
  chunks: []
});
pager.push({
  type: 'vue',
  entry: 'page/markdown.js',
  title: 'MD - vue',
  module: 'md-vue',
  chunks: []
});

pager.map(page => {
  let entryPath = `./${page.type}/${page.entry}`,
    templatePath = '',
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
      chunks: [filename, 'manifest', ...page.chunks],
      chunksSortMode: 'dependency',
      minify: {
        minifyJS: true
      }
    })
  );
});

module.exports = {entry, plugins};
