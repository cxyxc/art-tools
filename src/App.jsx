import React, { Component } from 'react';
import Menu from './Menu';

class App extends Component {
  canvas = null; // canvas DOM 引用
  canvasWidth = 0;
  canvasHeight = 0;

	componentDidMount() {
		this.ctx = this.canvas.getContext('2d');
  }

  getDrawImageRange = (imageWidth, imageHeight) => {
    // 实现图像缩放居中显示
    const {canvasWidth, canvasHeight} = this;
    const widthRate = imageWidth / canvasWidth;
    const heightRate = imageHeight / canvasHeight;
    const rate = widthRate > heightRate ? widthRate : heightRate;
    const dWidth = imageWidth / rate;
    const dHeight = imageHeight / rate;
    const dx = (canvasWidth - dWidth) / 2;
    const dy = (canvasHeight - dHeight) / 2;
    return [dx, dy, dWidth, dHeight];
  }

  // 加载图片
  loadImage = image => {
    const {ctx} = this;
    const [dx, dy, dWidth, dHeight] = this.getDrawImageRange(image.width, image.height);
    ctx.drawImage(image, dx, dy, dWidth, dHeight);
  }
  
  // 重绘图像（执行像素级操作）
  reRenderImage = fn => {
    const {canvasWidth, canvasHeight, ctx} = this;
    const newImageData = fn(ctx.getImageData(0, 0, canvasWidth, canvasHeight));
    ctx.putImageData(newImageData, 0, 0);
  }

  render() {
    const {innerWidth: width, innerHeight: height} = window;
    this.canvasWidth = width;
    this.canvasHeight = height - 100;
    return (
      <div className="app">
        <div className="canvas">
          <canvas id="canvas" width={`${this.canvasWidth}px`} height={`${this.canvasHeight}px`} ref={canvas => (this.canvas = canvas)} />
        </div>
        <Menu loadImage={this.loadImage} reRenderImage={this.reRenderImage} />
      </div>
    );
  }
}

export default App;
