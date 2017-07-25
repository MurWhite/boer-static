const React = require('react');
const utils = require('../utils/index');

import '@rcoms/toast.jsx'

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveDraft = this.saveDraft.bind(this);
    this.getDraft = this.getDraft.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.getDraft();
  }

  componentWillReceiveProps(to) {
    if (to.scrollData.scrolling && to.scrollData.from === 'previewer') {
      let self = this;
      let ele = this.editorRef;
      let maxScroll = ele.scrollHeight - ele.clientHeight;
      utils.scrollTo(ele, maxScroll * to.scrollData.pos, 500, ()=>{
        self.props.endScroll()
      })
    }
    return true;
  }

  handleInputChange(e) {
    let content = '';
    if (e) {
      e.persist();
      content = e.target.value;
      this.setState({content});
    } else {
      content = this.state.content;
    }
    this.props.change(content);
  }

  saveDraft() {
    localStorage.setItem('editorDraft', this.state.content)
  }

  handleScroll(ctx, e) {
    if (this.props.scrollData.scrolling) return;
    let ele = this.editorRef;
    let scroll = ele.scrollTop,
      maxScroll = ele.scrollHeight - ele.clientHeight;
    let per = scroll / maxScroll;
    this.props.emitScroll({from: 'editor', pos: per});
  }

  getDraft() {
    let content = localStorage.getItem('editorDraft');
    this.setState({content})
    this.props.change(content)
  }

  render() {
    return (
      <div className="md-editor-wrap" style={{display: this.props.show ? 'block' : 'none'}}>
          <textarea ref={ref => this.editorRef = ref}
                    onScroll={this.handleScroll}
                    onChange={this.handleInputChange}
                    onBlur={this.saveDraft}
                    value={this.state.content}>
          </textarea>
      </div>
    );
  }
}
