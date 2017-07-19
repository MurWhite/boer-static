const React = require('react');

// import './md-editor.scss'

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveDraft = this.saveDraft.bind(this);
    this.getDraft = this.getDraft.bind(this);
  }

  componentDidMount() {
    this.getDraft();
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

  getDraft() {
    let content = localStorage.getItem('editorDraft');
    this.setState({content})
    this.props.change(content)
  }

  render() {
    return this.props.show ? (
      <div className="md-editor-wrap">
          <textarea onChange={this.handleInputChange}
                    onBlur={this.saveDraft}
                    value={this.state.content}>
          </textarea>
      </div>) : null;
  }
}
