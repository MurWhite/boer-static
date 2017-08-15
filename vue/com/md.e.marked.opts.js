let marked = require('marked');
let renderer = new marked.Renderer();

renderer.heading = (text, level, raw) => {
  let escapedText = text.toLowerCase().replace(/[^\S]+/g, '-');

  return `<h1 id="${escapedText}"><a href="#${escapedText}"><span class="header-link"></span></a>${text}</h1>`
};

module.exports = {
  renderer,
  gfm: true,
  tables: true
};
