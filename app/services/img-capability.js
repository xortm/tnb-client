import Ember from 'ember';

export default Ember.Service.extend({
  mode: "reader",


  getImgData: function (imgUrl) {
    //根据不同的模式来生成图片数据
    if (this.mode === "reader") {
      return getImgDataViaFilereader(imgUrl);
    }
  },
  //图片url转换为图片数据（base64字符串）
  getImgDataViaCanvas: function (imgUrl) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
  },
  //通过filereader获得图片数据
  getImgDataViaFilereader: function (imgUrl) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result);
        }
        reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.send();
    });
  },
});
