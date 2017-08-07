const React = require('react');
const showdown = require('showdown');
const {Prism} = require('./markdown.plugins');
const inlineresources = require('inlineresources');
const utils = require('../utils/index');
import './markdown.previewer.scss'
let codeNodeCollection = [];

showdown.setFlavor('github');
const codeRegex = /<pre><code( class="[\s\S]*?")?>([\s\S]*?)<\/code><\/pre>/g;
const codeGetLang = /\blang(?:uage)?-([\s\S+]*?)">/i;
const classNameGetLang = /\blang(?:uage)?-([\S+]*?)\s/i;
const hrefRegex = /<a[\s\S]*?href="([\s\S]*?)">/g;
const hrefTestOuter = /http(s)?:\/\//g;
// 处理代码模块，添加高亮等
let codeExt = {
  type: 'output',
  regex: codeRegex,
  replace: function (text) {
    // 创建一个dom节点来生成实际的dom节点供 prismjs 使用
    codeGetLang.lastIndex = 0;
    // 修正语言类型
    if (codeGetLang.test(text)) {
      let lang = RegExp.$1;
      let formated = lang.trim();
      if (lang.length !== formated.length) {
        lang = formated;
        if (!lang) {
          lang = 'markup';
        }
      }
      if (lang.indexOf('`') > -1) {
        lang = 'markup'
      }
      text = text.replace(/<code( class="[\s\S]*?")?>/i, `<code class="${lang} language-${lang}">`);
    } else {
      text = text.replace("<code>", '<code class="language-markup">')
    }
    let wrapNode = document.createElement('DIV');
    wrapNode.innerHTML = text;
    Prism.highlightElement(wrapNode.firstChild.firstChild, false);
    // 生成一个随机标识
    let randomCode = (Math.random() / +new Date()).toString(36).replace(/\d/g, '').slice(1);
    codeNodeCollection.push({rc: randomCode, node: wrapNode.firstChild});
    return `<pre data-rc="${randomCode}"></pre>`;
  }
};
// 处理a链接，跳转方式设置
let hrefExt = {
  type: 'output',
  regex: hrefRegex,
  replace: function (text) {
    hrefRegex.lastIndex = 0;
    if (hrefRegex.exec(text)) {
      let href = RegExp.$1;
      hrefTestOuter.lastIndex = 0;
      if (!hrefTestOuter.test(href)) {
        text = `<a target="_self" ${text.substring(2)}`
      }
    }
    return text;
  }
};

showdown.extension('myExt', [codeExt, hrefExt]);
const mdConverter = new showdown.Converter({
  ghCompatibleHeaderId: true,
  parseImgDimensions: true,
  simplifiedAutoLink: true,
  excludeTrailingPunctuationFromURLs: true,
  extensions: ['myExt']
});
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.handleMarkdownChange = this.handleMarkdownChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.handleMarkdownChange(this.props.markdown);
  }

  componentWillReceiveProps(to) {
    if (to.markdown !== this.props.markdown) {
      this.handleMarkdownChange(to.markdown);
    }
    if (to.scrollData.scrolling && to.scrollData.from === 'editor') {
      let self = this;
      let previewer = this.mdPerRef;
      let maxScroll = previewer.scrollHeight - previewer.clientHeight;
      utils.scrollTo(previewer, maxScroll * to.scrollData.pos, 500, () => {
        self.props.endScroll()
      })
    }
    return true;
  }

  // 处理原markdown标记语言的变化
  handleMarkdownChange(content) {
    let html = mdConverter.makeHtml(content);
    let wrapNode = document.createElement('DIV');
    wrapNode.innerHTML = html;
    while (codeNodeCollection.length !== 0) {
      let cn = codeNodeCollection.shift();
      let tarNode = wrapNode.querySelector(`pre[data-rc="${cn.rc}"]`);
      let langClass = cn.node.className;
      classNameGetLang.lastIndex = 0;
      if (classNameGetLang.exec(langClass)) {
        let lang = RegExp.$1;
        cn.node.setAttribute('data-lang', lang);
      }
      wrapNode.replaceChild(cn.node, tarNode);
    }
    wrapNode.id = 'previewer';
    if (this.mdPerRef.firstChild) {
      this.mdPerRef.replaceChild(wrapNode, this.mdPerRef.firstChild);
    } else {
      this.mdPerRef.appendChild(wrapNode);
    }
    this.props.emitHtml(wrapNode.outerHTML);
  }

  handleScroll(ctx, e) {
    if (this.props.scrollData.scrolling) return;
    let ele = this.mdPerRef;
    let scroll = ele.scrollTop,
      maxScroll = ele.scrollHeight - ele.clientHeight;
    let per = scroll / maxScroll;
    this.props.emitScroll({from: 'previewer', pos: per});
  }

  render() {
    return (
      <div className="previewer-wrap" style={{display: this.props.show ? 'block' : 'none'}}
           onScroll={this.handleScroll} ref={ref => this.mdPerRef = ref}>
      </div>
    );
  }
}
