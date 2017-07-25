/**
 * Created by B on 2017/7/25
 */
const React = require('react');
const ReactDOM = require('react-dom');
import './toast.scss';

let toastWrap = document.createElement('div');
toastWrap.setAttribute('class', 'toast-wrap')
document.body.appendChild(toastWrap);

class Toast extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      text: '你好'
    };
    let self = this;
    React.$toast = function (text) {
      self.setState({text, show: true});
      setTimeout(() => {
        self.setState({show: false});
      }, 2000)
    };
  }

  render() {
    return (
      <div style={{display: this.state.show ? 'block' : 'none'}}
           className="toast">{this.state.text}</div>
    )
  }
}

ReactDOM.render(<Toast/>,
  toastWrap);

