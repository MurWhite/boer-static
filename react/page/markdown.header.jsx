const React = require('react');

export default class extends React.Component {
  render() {
    return (
      <div className="markdown-header-wrap">
        <div className="markdown-header">
          <div className="btn" onClick={this.props.utils.toggleEditor}>仅显示预览</div>
        </div>
      </div>
    );
  }
}
