const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('underscore')

import Header from './page/markdown.header.jsx'
import Editor from './page/markdown.editor.jsx'
import Previewer from './page/markdown.previewer.jsx'

import './page/markdown.scss'

class Page extends React.Component {
  constructor(props) {
    super(props);
    let self = this;
    let scrollThrottled = _.throttle((scroll) => {
      self.setState({scroll});
      console.log('????', scroll)
    }, 100)

    this.state = {
      content: '',
      showPreview: true,
      showEditor: true,
      scroll: {
        from: 'editor',
        pos: 0,
        scrolling: false
      },
      scrollHandler: scrollThrottled
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
      togglePreview(isShow){
        let tar = true;
        if (isShow === undefined) {
          tar = !self.state.showPreview;
        } else {
          tar = isShow;
        }
        self.setState({showPreview: tar})
      },
      toggleEditor(ctx, e, isShow){
        console.log('toggle', isShow)
        let tar = true;
        if (isShow === undefined) {
          tar = !self.state.showEditor;
        } else {
          tar = isShow;
        }
        self.setState({showEditor: tar})
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

  endScroll(){
    this.setState({
      scroll: {scrolling: false}
    });
  }

  render() {
    return (
      <div className="wrapper">
        <Header utils={this.utils()}/>
        <Editor show={this.state.showEditor}
                scrollData={this.state.scroll}
                emitScroll={this.handleScroll()}
                endScroll={this.endScroll}
                change={this.handleContentChange}/>
        <Previewer show={this.state.showPreview}
                   scrollData={this.state.scroll}
                   emitScroll={this.handleScroll()}
                   endScroll={this.endScroll}
                   markdown={this.state.content}/>
      </div>
    );
  }
}

ReactDOM.render(<Page/>,
  document.getElementById("root"));
