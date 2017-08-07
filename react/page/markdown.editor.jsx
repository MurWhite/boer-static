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
    this.getDateTime = this.getDateTime.bind(this);
    this.saveDraft = this.saveDraft.bind(this);
    this.getDraft = this.getDraft.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.getDraft();
    setInterval(() => {
      this.saveDraft('list')
    }, 10000)
  }

  componentWillReceiveProps(to) {
    if (to.scrollData.scrolling && to.scrollData.from === 'previewer') {
      let self = this;
      let ele = this.editorRef;
      let maxScroll = ele.scrollHeight - ele.clientHeight;
      utils.scrollTo(ele, maxScroll * to.scrollData.pos, 500, () => {
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

  saveDraft(type) {
    if (type && type === 'list') {
      let draftName = `draft_${this.getDateTime()}`, readyToRemove = undefined;

      let draftList = localStorage.getItem('draftList') || "";
      draftList = draftList.split(',');
      if (draftList.length > 10) {
        readyToRemove = draftList;
        draftList = readyToRemove.splice(-9);
      }

      // 保存最新的草稿
      let draft = this.state.content;
      if (draft === localStorage.getItem(draftList[draftList.length - 1])) {
        return;
      }
      localStorage.setItem(draftName, this.state.content);

      // 删除旧的索引，保存最新的草稿索引
      console.log(readyToRemove)
      draftList.push(draftName);
      localStorage.setItem('draftList', draftList.join(','))

      // 删除超出限制的草稿数量
      while (readyToRemove && readyToRemove.length > 0) {
        localStorage.removeItem(readyToRemove.shift());
      }
    } else {
      localStorage.setItem('editorDraft', this.state.content)
    }
  }

  getDateTime() {
    function fix(num) {
      return num < 10 ? `0${num}` : num
    }

    let time = new Date(),
      month = fix(time.getMonth() + 1),
      date = fix(time.getDate()),
      h = fix(time.getHours()),
      m = fix(time.getMinutes()),
      s = fix(time.getSeconds());
    return `${time.getFullYear()}/${month}/${date}-${h}:${m}:${s}`
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
    this.setState({content});
    this.props.change(content);
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
