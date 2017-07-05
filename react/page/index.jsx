/**
 * Created by B on 2017/6/6.
 */
const React = require('react');
const ReactDOM = require('react-dom');

import '../debris/reset.scss';
import '../debris/iconfont.scss'
import './index.scss'

import Pool from '../canvas/pool.jsx';

export default class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {refreshing: false};
    this.refreshPool = this.refreshPool.bind(this);
  }

  componentDidMount() {

  }

  refreshPool() {
    this.poolRef.refresh();
    this.setState({refreshing: true});
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 300)
  }

  handleBgLoaded(){

  }

  render() {
    return (
      <div className="index-wrap">
        <div className="pool-wrap">
          <img src={require("../assest/bg-big.png")}
               onLoad={this.handleBgLoaded.bind(this)}/>
          <Pool ref={ref => this.poolRef = ref}/>
          <i className={`iconfont icon-refresh ${this.state.refreshing ? 'refreshing' : ''}`}
             onClick={this.refreshPool}></i>
        </div>
        <div className="intro-wrap">
          <div className="intro">
            <h1>boer</h1>
          </div>
          <div className="contract-me">
            <a href="https://github.com/MurWhite">
              <i className="iconfont icon-github"> MurWhite</i>
            </a>
            <a href="https://t.cn/">
              <i className="iconfont icon-weibo"> holder</i>
            </a>
            <a href="https://twitter.com/">
              <i className="iconfont icon-twitter"> holder</i>
            </a>
          </div>
        </div>
      </div>
    )
  }
}
