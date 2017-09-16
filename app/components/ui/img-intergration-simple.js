import Ember from 'ember';
import BaseItem from './base-ui-item';
import ImageLoadMixin from 'ember-lazy-image/mixins/image-load';
import LazyImageMixin  from 'ember-lazy-image/mixins/lazy-image';
import InViewportMixin from 'ember-in-viewport';
import CommonUtil from '../../utils/common';
import GesturesMixin from 'ember-gestures/mixins/recognizers';

/*
 * 图片组件，集成了图片展示，以及图片上传
 */
export default BaseItem.extend(InViewportMixin, ImageLoadMixin, LazyImageMixin,GesturesMixin,{
  recognizers: 'pinch tap',
  /*定义属性*/
  isMobile: false,//是否移动端模式
  imgSrc: null,//图片路径
  imgMode: 0,//图片模式，0--文件,1--BASE64字符串
  hasUploader: false,//是否包含上传功能
  uploadUrl:null,//上传地址
  uploadLimitSize:5120000,//上传文件大小限制，默认5M
  errorText:"",//加载失败提示语
  businessType:null,//上传业务类型
  uploadParams:[],//上传参数
  /*元素属性*/
  concatenatedProperties: ['class'],
  classNameBindings: ['lazy-image-container'],
  class: ['lazy-image'],
  /*私有属性*/
  isResizeImage:false,//是否让图片压缩
  resizeNumber: 600,//图片压缩的最大宽高值
  upBarShow: true,//是否显示图片上传点击条
  upClickerId:null,//上传点击id
  uploaderSetup: null,//pluploader对象
  progressValue: 0,//进度值
  showBigImageModal: false, //大图弹出层默认是否显示
  // width:'100px',
  // height:'100px',
  //  showProgress:false,
  tap(e) {
   console.log("tap in img:",e);
  },
  init:function(){
    var _self = this;
    _self._super(...arguments);
    Ember.run.schedule("afterRender",this,function() {
      var uploadId = "#uploader-" + _self.get("name");
      console.log("uploadId",uploadId);
      $(uploadId).change(function(event){
        var file = event.target.files[0];
        // console.log("file::::",file);
        _self.$(".img-container").addClass("mask-background");
        var reader = new FileReader();
        // reader onload start
        reader.onload = function(readerEvent){
          _self.resizeImage(readerEvent,function(fileImg){
            console.log("file::2 len:",fileImg.length);
            _self.set('imgSrc',readerEvent.target.result);
            let filenameOri = file.name;
            let size = fileImg.size;
            console.log("upload filenameOri:" + filenameOri);
            console.log("upload size:" + size);
            if(size>=_self.get("uploadLimitSize")){
              _self.uploadFailAct(1);
              _self.set("showProgress",false);
            }
            let extfix = filenameOri.substring(filenameOri.lastIndexOf('.')+1);
            let filename = CommonUtil.Common_GenerateGuid() + "." + extfix;
            console.log("upload file:" + filename);
            //显示进度条
            _self.set("showProgress",false);
            //遮罩
            var formdata = new FormData();
            if(_self.get("isResizeImage")){
              formdata.append("file",fileImg);
            }else{
              formdata.append("file",file);
            }
            formdata.append("businessType",_self.get("businessType"));
            formdata.append("Content-Type","image/jpeg");
            formdata.append("name",filenameOri);
            $.ajax({
              url         : _self.get("uploadUrl"),
              data        : formdata,
              cache       : false,
              contentType : false,
              processData : false,
              type        : 'POST',
              success     : function(data, textStatus, jqXHR){
                console.log("upload suc,data",data);
                // set(image, 'url', data.headers.Location);
                // file.destroy();
                _self.set("showProgress",false);
                //去掉遮罩
                _self.$(".img-container").removeClass("mask-background");
                _self.set("errorText"," ");
                //上传成功后调用外
                _self.sendAction("uploadSucc",data,_self.get("businessType"));
              },
              error     : function(XMLHttpRequest, textStatus, errorThrown){
                _self.uploadFailAct(2);
                _self.set("showProgress",false);
                // alert("上传失败，请检查网络后重试");
                // Callback code
              },
            });

          });
        };
        reader.readAsDataURL(file);
      });
    });
  },
  resizeImage(readerEvent,callback) {
    var _self = this;
    var image = new Image();
    image.onload = function (imageEvent) {
        // Resize the image
        var canvas = document.createElement('canvas'),
            max_size = _self.get("resizeNumber"),// TODO : pull max size from a site config
            width = image.width,
            height = image.height;
        if (width > height) {
            if (width > max_size) {
                height *= max_size / width;
                width = max_size;
            }
        } else {
            if (height > max_size) {
                width *= max_size / height;
                height = max_size;
            }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        var dataUrl = canvas.toDataURL('image/jpeg');
        var resizedImage = _self.dataURLToBlob(dataUrl);
        console.log("resizedImage",resizedImage);
        callback(resizedImage);
    };
    image.src = readerEvent.target.result;
  },
    /* Utility function to convert a canvas to a BLOB */
  dataURLToBlob(dataURL) {
      var BASE64_MARKER = ';base64,';
      if (dataURL.indexOf(BASE64_MARKER) == -1) {
          var parts = dataURL.split(',');
          var contentType = parts[0].split(':')[1];
          var raw = parts[1];

          return new Blob([raw], {type: contentType});
      }

      var parts = dataURL.split(BASE64_MARKER);
      var contentType = parts[0].split(':')[1];
      var raw = window.atob(parts[1]);
      var rawLength = raw.length;

      var uInt8Array = new Uint8Array(rawLength);

      for (var i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
      }

      return new Blob([uInt8Array], {type: contentType});
  },
  uploadFailAct(failType){
    var _self = this;
    // file.destroy();
    _self.set("showProgress",false);
    //去掉遮罩
    _self.$(".img-container").removeClass("mask-background");
    if(failType===1){
      _self.set("showProgress",false);
      console.log("errorText:文件大小超出限制");
      _self.set("errorText","文件大小超出限制");
    }else if(failType===2){
      console.log('errorText==文件上传失败');
      _self.set("errorText","文件上传失败");
    }
    else{
      _self.set("errorText","文件加载失败");
    }
    console.log("errorText:",_self.get("errorText"));
    //上传图片错误信息传递给上层
    _self.sendAction("uploadFail",_self.get("errorText"));
  },

/* End Utility function to convert a canvas to a BLOB      */
  /*内部方法*/
  _classJoin: Ember.on('init', function() {
    const classArray = Ember.get(this, 'class');
    Ember.set(this, 'class', classArray.join(' '));
  }),
  _setupAttributes() {
    const img  = this.$('img');
    const component = this;
    const keys = Object.keys || Ember.keys;
    keys(component).forEach((key) => {
      if (key.substr(0, 5) === 'data-' && !key.match(/Binding$/)) {
        img.attr(key, component.get(key));
      }
    });
  },
  didInsertElement() {
    this._super(...arguments);
    //直接在dom上设置宽度130
    this.$().css('width', this.get("width"));
  },
  /*外部方法*/
  useDimensionsAttrs: Ember.computed('width', 'height', function() {
    return !this.get('width') || !this.get('height') ? false : true;
  }),

  /*dom事件处理*/
  // mouseEnter:function(){
  //   this.set("upBarShow",true);
  // },
  // mouseLeave:function(){
  //   this.set("upBarShow",false);
  // },
  /*事件处理*/
  actions: {
    // tapUpload: function(){
    //   let uploadId = '#uploader-' + this.get("name");
    //   console.log("uploadId:",uploadId);
    //   $(uploadId).click();
    // },
    //点击显示大图弹出层
    showBigImgAction: function() {
      console.log("tap run in");
      this.set('showBigImageModal',true);
    },
    //大图弹出层取消显示
    invitation: function() {
      this.set('showBigImageModal',false);
    },
    imageOpened() {
      console.log("imageOpened in");
      var winwidth = this.$(window).width();
      var winHeight = this.$(window).height();
      console.log("imageOpened in winwidth",winwidth);
      console.log("imageOpened in winHeight",winHeight);
      var imgWidth = this.$(".imgOutClass").width();
      var imgHeight = this.$(".imgOutClass").height();
      console.log("imageOpened in imgWidth",imgWidth);
      console.log("imageOpened in imgHeight",imgHeight);
      var maxHeight = winHeight-140;
      var maxWidth = winwidth-40;
      console.log("imageOpened in maxHeight",maxHeight);
      console.log("imageOpened in maxWidth",maxWidth);
      var imgProportion = imgHeight/imgWidth;
      var maxProportion = maxHeight/maxWidth;
      console.log("imageOpened in imgProportion",imgProportion);
      console.log("imageOpened in maxProportion",maxProportion);
      if(imgProportion>maxProportion){
        var curWidth = maxHeight/imgProportion;
        console.log("imageOpened in curWidth",curWidth);
        $(".bigImgSrcClass").height(maxHeight);
        $(".bigImgSrcClass").width(curWidth);
        $(".uploadBut").width(curWidth);
        // this.$(".imgWrapperInner").css("height",maxHeight+"px");
        // this.$(".imgWrapperInner").css("width",curWidth+"px");
      }else{
        $(".bigImgSrcClass").width(maxWidth);
        $(".uploadBut").width(maxWidth);
      }
    },
    //图片上传功能
    uploadImage: function (file) {
      // var img = new Image();        //
      // if($(".cccc >div img").width() >= $(".cccc >div img").height()){
      //     $(".cccc >div ").addClass("intergration_normal");
      //     $(".cccc >div img").css("height", "110px");
      //     $(".cccc >div img").css("width", "auto");
      //     console.log("this.width==========",$(".cccc >div img").width());
      //     console.log('==========intergration_normal_height',$(".cccc >div img").height(),$(".cccc >div img").width());
      //
      // }else {
      //     $(".cccc >div ").addClass("intergration_normal");
      //     $(".cccc >div img").css("width", "110px");
      //     $(".cccc >div img").css("height", "auto");
      //     console.log("this.height==========",$(".cccc >div img").height());
      //     console.log('==========intergration_normal',$(".cccc >div img").height(),$(".cccc >div img").width());
      // }
      console.log("uploadImage in,name:" + this.get("name"));
      console.log("file get",file);
      var _self = this;
      let filenameOri = file.get('name');
      let size = file.get("size");
      console.log("upload filenameOri:" + filenameOri);
      console.log("upload size:" + size);
      var uploadFailAct = function(failType){
        file.destroy();
        _self.set("showProgress",false);
        //去掉遮罩
        _self.$().removeClass("mask-background");
        if(failType===1){
          _self.set("showProgress",false);
          console.log("errorText:文件大小超出限制");
          _self.set("errorText","文件大小超出限制");
        }else if(failType===2){
          console.log('errorText==文件上传失败');
          _self.set("errorText","文件上传失败");
        }
        else{
          _self.set("errorText","文件加载失败");
        }
        //上传图片大小大于1M
        _self.sendAction("uploadFail",failType);
      };
      if(size>=this.get("uploadLimitSize")){
        uploadFailAct(1);
        _self.set("showProgress",false);
      }
      let extfix = filenameOri.substring(filenameOri.lastIndexOf('.')+1);
      let filename = CommonUtil.Common_GenerateGuid() + "." + extfix;
      console.log("upload file:" + filename);
      file.read().then(function (url) {
        var idcard = Ember.Object.create({
          filename: filename,
          imgSrc: url
        });
        _self.set('imgSrc',url);
      }, function () {});
      console.log("do upload,url:" + _self.get("uploadUrl"));
      var uploadParams = {"data":{
          businessType:_self.businessType,
          "Content-Type":"image"
        },
        accepts:["*/*"],
        headers:{
          Accept: "*/*"
        }
      };
      //显示进度条
      this.set("showProgress",false);
      //遮罩
      this.$().addClass("mask-background");
      // console.log("file.settings.headers.Accept:" + file.settings.headers.Accept);
      file.upload(_self.get("uploadUrl"),uploadParams).then(function (response) {
        console.log("upload suc,response",response);
        // set(image, 'url', response.headers.Location);
        file.destroy();
        _self.set("showProgress",false);
        //去掉遮罩
        _self.$().removeClass("mask-background");
        _self.set("errorText"," ");
        //上传成功后调用外
        _self.sendAction("uploadSucc",response.body,_self.businessType);
      }, function (event) {
        console.log("upload fail,event",event);
        uploadFailAct(2);
        _self.set("showProgress",false);
      });
    },
    //uploader初始化
    onInitOfUploader: function(pluploader){
      var _self = this;
      //设置上传进度条
      this.uploaderSetup = pluploader;
      pluploader.bind('UploadProgress', function(up, file) {
        console.log("percent in:" + file.percent);
        _self.set("progressValue",file.percent);
      });
    },
  }
});
