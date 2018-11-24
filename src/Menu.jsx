import React, { Component } from 'react';
import FileReaderInput from 'react-file-reader-input';
import RcMenu, {MenuItem} from 'rc-menu';

import {
  FileUploadIcon,
  LightIcon,
  DarkIcon
} from './Icons';

function transformLighteness(dx, dy, ligitRate, imageData) {
  const {width, height} = imageData;
  for (let i = 0, len = imageData.data.length; i < len; i += 4 ){
    // 当前点坐标
    let x = i % (width * 4) / 4;
    let y = Math.ceil(i / (width * 4));
    const RANGE = 50;
    // 计算当前点与触摸点距离
    const distance = Math.sqrt(Math.pow(x - dx, 2) + Math.pow(y - dy, 2));
    if(distance < RANGE) {
      const distanceRate = (RANGE - distance) / RANGE;
      const rate = (ligitRate - 1) * distanceRate + 1;
      imageData.data[i + 0] *= rate;  // R value
      imageData.data[i + 1] *= rate;  // G value
      imageData.data[i + 2] *= rate;  // B value
      // imageData.data[i + 3] = 255; // A value
    }
  }
  return imageData;
}

class Menu extends Component {
  listener = null;
  state = {
  };

  componentDidMount() {
  }

  handleLoadImage = (e, results) => {
    results.forEach(result => {
      const [e, file] = result;
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        this.props.loadImage(img);
      }
    });
  }

  reRenderImage = () => {
    
  }

  handleMenuClick = e => {
    const key = e.key;
    const canvasDOM = document.getElementById('canvas');
    canvasDOM.removeEventListener('touchstart', this.listener);
    this.listener = e => {
      const {clientX, clientY} = e.touches[0];
      let fn = () => {};
      switch(key) {
        case 'light':
          fn = transformLighteness.bind(undefined, clientX, clientY, 1.1);
          break;
        case 'dark':
          fn = transformLighteness.bind(undefined, clientX, clientY, 0.9);
          break;
        default:
          break;
      }
      this.props.reRenderImage(fn);
    };
    canvasDOM.addEventListener('touchstart', this.listener);
  }

  render() {
    return (
			<div className="menu">
        <FileReaderInput id="my-file-input"
          onChange={this.handleLoadImage}>
            <span className="rc-menu-item" style={{marginTop: 7}}>
              <FileUploadIcon /><div className="menu-label">图片上传</div>
            </span>
        </FileReaderInput>
        <RcMenu>
          <MenuItem key="light" onClick={this.handleMenuClick}>
            <LightIcon /><div className="menu-label">局部高亮</div>
          </MenuItem>
          <MenuItem key="dark" onClick={this.handleMenuClick}>
            <DarkIcon /><div className="menu-label">局部阴影</div>
          </MenuItem>
        </RcMenu>
			</div>
    );
  }
}

export default Menu;
