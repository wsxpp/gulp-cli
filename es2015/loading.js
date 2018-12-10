class MyLoader {
  constructor(arr) {
    this.imagesArr = arr;
    this.imagesArrLength = arr.length;
    this.readyImagesNum = 0;
    this.init();
    this.checkIfAllImagesComplete()
  }

  init() {
    for (let i = 0; i < this.imagesArrLength; i++) {
      this.loadImage(this.imagesArr[i])
    }
  }

  loadImage(src) {
    let imgObj = new Image();
    imgObj.src = src;
    imgObj.onload = () => {
      this.readyImagesNum++;
    }
  }

  checkIfAllImagesComplete() {
    this.timer = setInterval(() => {
      if (this.readyImagesNum === this.imagesArrLength) {
        clearInterval(this.timer)
        setTimeout(loadingComplete, 500)
      }
    }, 20)
  }
}

var loadingComplete = () => {
  $('.loading-container').hide()
  $('.index-container').show()
}
