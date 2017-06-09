/**
 * Created by B on 2017/6/7.
 */
import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import tool from '../utils/index'

export default class Pool extends Component {
  static defaultProps = {
    canvasRef: undefined,
    maskColor: 'rgba(255,255,255,0.5)',
    waveColor: '#FEDFE1',
    waveWidth: 5
  };

  constructor(props) {
    super(props);
    this.state = {
      lastWave: {},
      pageSize: {w: document.body.clientWidth, h: document.body.clientHeight},
      waveGap: 100
    };
    this.drawWave = this.drawWave.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this)
  }

  componentDidMount() {
    this.canvas = findDOMNode(this.canvasRef);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.beginPath();
    this.ctx.fillStyle = this.props.maskColor;
    this.ctx.fillRect(0, 0, document.body.clientWidth, document.body.clientHeight);

    window.onresize = tool.throttle((e) => {
      this.setState({pageSize: {w: document.body.clientWidth, h: document.body.clientHeight}})
      this.refresh();
    }, 300, 1000)
  }

  drawWave(x, y, radius, initR, wColor) {
    // 重置全局复合操作
    this.ctx.globalCompositeOperation = 'source-over';
    if (radius > 70) {
      // 去掉所有的波纹
      this.ctx.beginPath();
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.lineWidth = this.props.waveWidth + 2;
      this.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      this.ctx.stroke();
      return;
    }
    let waveColor = wColor;
    if (!waveColor) {
      let r0 = radius - this.props.waveWidth / 2;
      let r1 = radius + this.props.waveWidth / 2;
      r0 = r0 < 0 ? 0 : r0;
      waveColor = this.ctx.createRadialGradient(x, y, r0, x, y, r1);
      waveColor.addColorStop(0, 'rgba(255,255,255,0.5)');
      waveColor.addColorStop(0.5, '#81C7D4');
      waveColor.addColorStop(1, 'rgba(255,255,255,0.5)');
    }
    // 画一个波纹
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    this.ctx.strokeStyle = waveColor;
    this.ctx.lineWidth = this.props.waveWidth;
    this.ctx.stroke();
    // 去掉上一个波纹
    this.ctx.beginPath();
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.arc(x, y, initR || radius, 0, Math.PI * 2, true);
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = this.props.waveWidth;
    this.ctx.stroke();

    // 画下一个波纹
    window.requestAnimationFrame(() => {
      this.drawWave(x, y, radius + this.props.waveWidth / 2, radius)
    })
  }

  onMouseDown(e) {
    e.persist();
    this.drawWave(e.clientX, e.clientY, 1)
  }

  onMouseMove(e) {
    e.persist();
    if (this.state.lastWave.x) {
      if (Math.abs(this.state.lastWave.x - e.clientX) > this.state.waveGap || Math.abs(this.state.lastWave.y - e.clientY) > this.state.waveGap) {
        this.drawWave(e.clientX, e.clientY, 1);
        this.setState({lastWave: {x: e.clientX, y: e.clientY}});
      }
    } else {
      this.setState({lastWave: {x: e.clientX, y: e.clientY}});
    }
  }

  refresh() {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.beginPath();
    this.ctx.clearRect(0, 0, document.body.clientWidth, document.body.clientHeight);
    this.ctx.beginPath();
    this.ctx.fillStyle = this.props.maskColor;
    this.ctx.fillRect(0, 0, document.body.clientWidth, document.body.clientHeight);
  }

  render() {
    return <canvas
      ref={(ref) => {
        this.canvasRef = ref
      }}
      onMouseDown={this.onMouseDown}
      onMouseMove={this.onMouseMove}
      width={this.state.pageSize.w}
      height={this.state.pageSize.h}
    ></canvas>
  }
}
