/**
 * Created by B on 2017/6/7.
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');

let pageList = [
];

function pageFactory (title, filename, prefix) {
  let entryName = `${prefix}_${filename}`;
  let pageEntry = {};
  pageEntry[entryName] = ['babel-polyfill', `./${prefix}/page/${filename}.jsx`];
  let htmlPlugin = new HtmlWebpackPlugin({
    title: title,
    template: './react/index.ejs',
    inject: true,
    filename: entryName + '.html',
    chunks: [ entryName, 'manifest'],
    chunksSortMode: 'dependency'
  });
  return {htmlPlugin, pageEntry}
}

module.exports = {
  entry: {
    react_index: ['babel-polyfill', './react/page/index.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '这是React首页',
      template: './react/index.ejs',
      inject: true,
      filename: 'react_index.html',
      chunks: ['react_index', 'manifest'],
      chunksSortMode: 'dependency'
    })
  ]
};
