const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('underscore')

import Editor from './page/markdown.editor.jsx'
import Previewer from './page/markdown.previewer.jsx'

import './page/markdown.scss'

function Header(props) {
  return (
    <div className="markdown-header-wrap">
      <div className="btn-group">
        <a className={`btn btn-icon ${props.state.showEditor && !props.state.showPreview ? 'active' : ''}`}
           onClick={props.utils.showEditor}>E</a>
        <a className={`btn btn-icon ${props.state.showEditor && props.state.showPreview ? 'active' : ''}`}
           onClick={props.utils.showAll}>E&P</a>
        <a className={`btn btn-icon ${!props.state.showEditor && props.state.showPreview ? 'active' : ''}`}
           onClick={props.utils.showPreview}>P</a>
        <a className={`btn btn-icon`} onClick={props.utils.copy}>复制</a>
      </div>
    </div>
  )
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      markdownHtml: '',
      showPreview: true,
      showEditor: true,
      scroll: {
        from: 'editor',
        pos: 0,
        scrolling: false
      }
    };
    this.handleContentChange = this.handleContentChange.bind(this);
    this.utils = this.utils.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.endScroll = this.endScroll.bind(this);
  }

  handleContentChange(content) {
    this.setState({content});
  }

  utils() {
    let self = this;
    return {
      showPreview(ctx, e, isShow) {
        self.setState({showEditor: false, showPreview: true})
      },
      showEditor(ctx, e, isShow) {
        self.setState({showEditor: true, showPreview: false})
      },
      showAll() {
        self.setState({showEditor: true, showPreview: true})
      },
      copy() {
        setTimeout(() => {
          let html = `<style type=text/css>@import url('https://murwhite.github.io/boer-static/css/markdown.css');</style>`
            + self.state.markdownHtml;
          let input = self.copyInput;
          input.value = html;
          if (input && input.select) {
            input.select();
            try {
              document.execCommand('copy');
              input.blur();

            } catch (err) {
              alert('please press Ctrl/Cmd+C to copy');
            }
          }
        }, 200)
      }
    }
  }

  handleScroll() {
    let self = this;
    return _.debounce(({from, pos}) => {
      self.setState({
        scroll: {
          scrolling: true,
          from, pos
        }
      });
    }, 100)
  }

  endScroll() {
    this.setState({
      scroll: {scrolling: false}
    });
  }

  render() {
    return (
      <div className="wrapper">
        <Header utils={this.utils()} state={this.state}/>
        <Editor show={this.state.showEditor}
                scrollData={this.state.scroll}
                emitScroll={this.handleScroll()}
                endScroll={this.endScroll}
                change={this.handleContentChange}/>
        <Previewer show={this.state.showPreview}
                   scrollData={this.state.scroll}
                   emitScroll={this.handleScroll()}
                   endScroll={this.endScroll}
                   emitHtml={e => this.setState({markdownHtml: e})}
                   markdown={this.state.content}/>
        <input ref={ref => this.copyInput = ref} className="input-for-copy"/>
      </div>
    );
  }
}

ReactDOM.render(<Page/>,
  document.getElementById("root"));
