const React = require('react');
const ReactDOM = require('react-dom');

import Header from './page/markdown.header.jsx'
import Editor from './page/markdown.editor.jsx'
import Previewer from './page/markdown.previewer.jsx'

import './page/markdown.scss'

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      showPreview: true,
      showEditor: true
    };
    this.handleContentChange = this.handleContentChange.bind(this);
    this.utils = this.utils.bind(this);
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

  render() {
    return (
      <div className="wrapper">
        <Header utils={this.utils()}/>
        <Editor show={this.state.showEditor} change={this.handleContentChange}/>
        <Previewer show={this.state.showPreview} markdown={this.state.content}/>
      </div>
    );
  }
}

ReactDOM.render(<Page/>,
  document.getElementById("root"));
