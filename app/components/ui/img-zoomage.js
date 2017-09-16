import Ember from 'ember';
import BaseItem from './base-ui-item';

export default BaseItem.extend({
  /*定义属性*/
  maxZoom: 3,//最大倍数
  minZoom: 0.1,//最小倍数
  imgSrc: null,//图片路径

  actions: {
    //点击显示弹出层
    showModalAction() {
      this.set('showModal', true);
    },
    imageOpened() {
      console.log("imageOpened in");
      var winwidth = $(window).width();
      var winHeight = $(window).height();
      var imgWidth = $(".imgClass").width();
      var imgHeight = $(".imgClass").height();
      var bodyHeight = winHeight-55;
      var showHeight = bodyHeight;
      var showWidth = bodyHeight/imgHeight*imgWidth;
      if(winwidth>showWidth){
        showHeight = winwidth/imgWidth*imgHeight;
        showWidth = winwidth;
      }
      console.log("padding:",$(".modal-body").css("padding"));
      console.log("winHight:",winHeight);
      $(".modal-body").css({"padding":"0px","height":bodyHeight+"px"});
      $(".modal-dialog").css({"margin":"0px","height":winHeight+"px"});
      $(".modal-content").css("borderWidth","0px");
      $("#showBigImg").width(showWidth);
      $("#showBigImg").height(showHeight);
      //手势放大功能
      var zoomage = new Zoomage({
          container: document.getElementById('showBigImg'),
          maxZoom: this.get("maxZoom"),
          minZoom: this.get("minZoom"),
          enableGestureRotate: false,
          enableDesktop: true,
          dbclickZoomThreshold: 1.5,
          onDrag: function(data) {
              console.log("[Drag Position X] " + data.x, "[Drag Position Y] " + data.y);
          },
          onZoom: function(data) {
              console.log("[Zoom Scale] " + data.zoom, "\n[Image Width] " + data.scale.width, "\n[Image Height] " + data.scale.height);
          },
          onRotate: function(data) {
              console.log("[Rotate Degree] " + data.rotate);
          }
      });
      zoomage.load(this.get("imgSrc"));
    },
    //弹出层取消显示
    invitation() {
      console.log("modal close in");
      this.set('showModal', false);
    },

  }


});
