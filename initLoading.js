const fs = require('fs');
function readImagesToArr() {
  return new Promise((res, rej) => {
    fs.readdir('images', 'utf8', (err, files) => {
      if (err) {
        console.log(err)
        throw err;
      }
      let filesArr = files;
      res(filesArr);
    })
  });
}
function addImagesDomToXml(filesArr) {
  return new Promise((res, rej) => {
    fs.open('es2015/loading.js', 'a+', (err, fd) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.error('myfile does not exist');
          return;
        }
        throw err;
      }
      let dom = 'new MyLoader([';
      for (let i = 0; i < filesArr.length; i++) {
        if (i === filesArr.length - 1) {
          dom += '"images/' + filesArr[i] + '"'
        } else {
          dom += '"images/' + filesArr[i] + '",'
        }
      }
      dom += '])';
      res({
        fd: fd,
        dom: dom
      });
    });
  })
}
function writeXML(fd, dom) {
  fs.write(fd, dom, 0, 'utf-8', (err, written, string) => {
    if (err) throw err;
    console.log('The file has been saved!');
  })
}
Promise
  .resolve()
  .then(() => {
    return readImagesToArr()
  })
  .then((filesArr) => {
    return addImagesDomToXml(filesArr)
  })
  .then((object) => {
    writeXML(object.fd, object.dom)
  })