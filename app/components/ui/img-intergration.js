import Ember from 'ember';
import BaseItem from './base-ui-item';
import CommonUtil from '../../utils/common';

/*
 * 图片组件，集成了图片展示，以及图片上传
 */
export default BaseItem.extend({
    /*定义属性*/
    isMobile: false, //是否移动端模式
    imgSrc: null, //图片路径
    imgMode: 0, //图片模式，0--文件,1--BASE64字符串
    circleMode: true, //是否圆形图片
    hasUploader: false, //是否包含上传功能
    showBigImg: false, //是否可以点击显示大图弹出层功能
    bigImg: false, //是否直接显示大图功能
    uploadUrl: null, //上传地址
    uploadLimitSize: 5120000, //上传文件大小限制，默认5M
    errorText: "", //加载失败提示语
    businessType: null, //上传业务类型
    uploadParams: [], //上传参数
    /*元素属性*/
    concatenatedProperties: ['class'],
    classNameBindings: ['lazy-image-container'],
    class: ['lazy-image'],
    /*私有属性*/
    upBarShow: false, //是否显示图片上传点击条
    upClickerId: null, //上传点击id
    uploaderSetup: null, //pluploader对象
    progressValue: 0, //进度值
    showBigImageModal: false, //大图弹出层默认是否显示
    defaultSrc: "./assets/images/avatars/anonymous.png",
    // width:'100px',
    // height:'100px',
    //  showProgress:false,
    /*内部方法*/
    _classJoin: Ember.on('init', function() {
        const classArray = Ember.get(this, 'class');
        Ember.set(this, 'class', classArray.join(' '));
    }),
    _setupAttributes() {
        const img = this.$('img');
        const component = this;
        const keys = Object.keys || Ember.keys;
        keys(component).forEach((key) => {
            if (key.substr(0, 5) === 'data-' && !key.match(/Binding$/)) {
                img.attr(key, component.get(key));
            }
        });
    },
    // 弹出框要显示大图
    imgSrcBig: Ember.computed("imgSrcChange", "imgSrc", function() {
        if (this.get("imgSrcChange")) {
            return this.get("imgSrcChange");
        }
        if (this.get("imgSrc")) {
            return this.get("imgSrc");
        }
    }),
    // 默认显示小图,拼接小图的路径
    // imgSrcReal: Ember.computed("imgSrcChange", "imgSrc", function() {
    //     if (this.get("imgSrcChange")) {
    //         return this.get("imgSrcChange");
    //     }
    //     // 如果显示大图,url不用处理
    //     if (this.get("bigImg") && this.get("imgSrc")) {
    //         return this.get("imgSrc");
    //     }
    //     // 如果按默认显示小图,url要经过处理,如果没有小图,还是会显示大图
    //     if (this.get("imgSrc")) {
    //         let imgSrc = this.get("imgSrc");
    //         let index = imgSrc.lastIndexOf(".");
    //         let src = imgSrc.substring(0, index) + "_small" + imgSrc.substring(index);
    //         return src;
    //     }
    // }),
    didInsertElement() {
        var _self = this;
        this._super(...arguments);
        //直接在dom上设置宽度
        // this.$().css('width', this.get("width"));
        this.$(".img-container").css('width', this.get("width"));
        //图像加载出错时的处理
        this.set("hasDidInsert", true);
        this.$("img").error(function() {
          Ember.run.next(function(){
            if(_self.get("imgChange")){
              let normalImgName = _self.get("imgSrc");
              _self.set("imgChange",false);
              _self.set("imgSrcReal",normalImgName);
              return;
            }
            _self.set("imgSrcReal",_self.get("defaultSrc"));
          });
        });
    },
    imgErrObs: function() {
        var imgSrc = this.get("imgSrc");
        if(!imgSrc){return;}
        if (this.get("bigImg")) {
          this.set("imgChange",false);
          this.set("imgSrcReal",imgSrc);
          return;
        }
        this.set("imgChange",true);
        let index = imgSrc.lastIndexOf(".");
        let smallImgName = imgSrc.substring(0, index) + "_small" + imgSrc.substring(index);
        // this.set("smallImg",smallImgName);
        this.set("imgSrcReal",smallImgName);
    }.observes("hasDidInsert", "imgSrc"),
    /*外部方法*/
    useDimensionsAttrs: Ember.computed('width', 'height', function() {
        return !this.get('width') || !this.get('height') ? false : true;
    }),

    /*dom事件处理*/
    mouseEnter: function() {
        this.set("upBarShow", true);
    },
    mouseLeave: function() {
        this.set("upBarShow", false);
    },
    //处理图片数据，imgData参数为图片数据base64值
    processImgData: function(imgData, filename) {
        let targetDomId = "img-interg-" + this.get("name");
        //显示图片
        this.set("imgSrcReal", imgData);
        this.set("imgSrcChange", imgData);
        console.log("imgSrcChange:", imgData);
        //进行上传
        let blob = CommonUtil.b64toBlob(imgData);
        let blobUrl = URL.createObjectURL(blob);
        console.log('blobUrl is', blobUrl);
        this.send("uploadImageWithForm", blob, filename);
    },
    /*事件处理*/
    actions: {
        avatarUpload: function() {
            let _self = this;
            //调用mainpage的modal上传窗口，把回调函数传给mainpage，以便后续获取图片数据
            App.lookup("controller:business.mainpage").popImageCropper(function(imgData, filename) {
                console.log("callback in,imgData", imgData);
                console.log("callback in,filename", filename);
                _self.processImgData(imgData, filename);
            });
        },
        //图片上传功能
        uploadImage: function(file) {
            console.log("uploadImage in,name:" + this.get("name"));
            console.log("file get", file);
            var _self = this;
            let filenameOri = file.get('name');
            let size = file.get("size");
            var uploadFailAct = function(failType) {
                file.destroy();
                _self.set("showProgress", false);
                //去掉遮罩
                _self.$(".img-container").removeClass("mask-background");
                if (failType === 1) {
                    _self.set("showProgress", false);
                    console.log("errorText:文件大小超出限制");
                    _self.set("errorText", "文件大小超出限制");
                } else if (failType === 2) {
                    console.log('errorText==文件上传失败');
                    _self.set("errorText", "文件上传失败");
                } else {
                    _self.set("errorText", "文件加载失败");
                }
                //上传图片大小大于1M
                _self.sendAction("uploadFail", failType);
            };
            if (size >= this.get("uploadLimitSize")) {
                uploadFailAct(1);
                _self.set("showProgress", false);
            }
            let extfix = filenameOri.substring(filenameOri.lastIndexOf('.') + 1);
            let filename = CommonUtil.Common_GenerateGuid() + "." + extfix;
            console.log("upload file:" + filename);
            file.read().then(function(url) {
                _self.set('imgSrc', url);
                console.log('imgSrc:', url);
            }, function() {});
            console.log("do upload,url:" + _self.get("uploadUrl"));
            var uploadParams = {
                "data": {
                    businessType: _self.businessType,
                    "Content-Type": "image"
                },
                accepts: ["*/*"],
                headers: {
                    Accept: "*/*"
                }
            };
            //显示进度条
            this.set("showProgress", false);
            //遮罩
            this.$(".img-container").addClass("mask-background");
            // console.log("file.settings.headers.Accept:" + file.settings.headers.Accept);
            file.upload(_self.get("uploadUrl"), uploadParams).then(function(response) {
                console.log("upload suc,response", response);
                // set(image, 'url', response.headers.Location);
                _self.set("showProgress", false);
                //去掉遮罩
                _self.$().removeClass("mask-background");
                _self.set("errorText", " ");
                _self.$(".barInBottom").css("width", _self.get("width") + "px");
                //上传成功后通知调用者
                _self.sendAction("uploadSucc", response.body, _self.businessType);
            }, function(event) {
                console.log("upload fail,event", event);
                uploadFailAct(2);
                _self.set("showProgress", false);
            });
        },
        //图片上传功能
        uploadImageWithForm: function(imgBlobData, filename) {
            var _self = this;
            let size = imgBlobData.size;
            var uploadFailAct = function(failType) {
                _self.set("showProgress", false);
                //去掉遮罩
                _self.$().removeClass("mask-background");
                if (failType === 1) {
                    _self.set("showProgress", false);
                    console.log("errorText:文件大小超出限制");
                    _self.set("errorText", "文件大小超出限制");
                } else if (failType === 2) {
                    console.log('errorText==文件上传失败');
                    _self.set("errorText", "文件上传失败");
                } else {
                    _self.set("errorText", "文件加载失败");
                }
                //上传图片大小大于1M
                _self.sendAction("uploadFail", failType);
            };
            if (size >= this.get("uploadLimitSize")) {
                uploadFailAct(1);
                _self.set("showProgress", false);
            }
            let extfix = filename.substring(filename.lastIndexOf('.') + 1);
            let contentType = "image/" + extfix;
            var formData = new FormData();
            formData.append('Content-Type', contentType);
            formData.append('file', imgBlobData);
            formData.append('name', filename);
            formData.append('businessType', _self.businessType);
            console.log("do upload,contentType:" + contentType);
            //显示进度条
            this.set("showProgress", false);
            //遮罩
            this.$().addClass("mask-background");
            var xhr = new XMLHttpRequest();
            xhr.open('POST', _self.get("uploadUrl"), true);
            xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    var percentComplete = (e.loaded / e.total) * 100;
                    console.log(percentComplete + '% uploaded');
                }
            };
            xhr.onload = function() {
                if (this.status == 200) {
                    console.log("upload suc,response", this.response);
                    _self.set("showProgress", false);
                    //去掉遮罩
                    _self.$().removeClass("mask-background");
                    console.log("barInBottom set css", _self.$(".barInBottom"));
                    let r = Math.random();
                    //使用动态内容，解决功能条错位
                    let hackarea = "<div class='hidden'>" + r + "</div>";
                    _self.$(".barInBottom").html("上传新图片" + hackarea);
                    //上传成功后通知调用者
                    _self.sendAction("uploadSucc", this.response, _self.businessType);
                }
            };
            xhr.onerror = function() {
                uploadFailAct(2);
                _self.set("showProgress", false);
            };
            xhr.send(formData);
        },
        //uploader初始化
        onInitOfUploader: function(pluploader) {
            var _self = this;
            //设置上传进度条
            this.uploaderSetup = pluploader;
            pluploader.bind('UploadProgress', function(up, file) {
                console.log("percent in:" + file.percent);
                _self.set("progressValue", file.percent);
            });
        },
        //点击显示大图弹出层
        showBigImgAction() {
            if (this.get("showBigImg")) {
                this.set('showBigImageModal', true);
            }
        },
        //大图弹出层取消显示
        invitation() {
            this.set('showBigImageModal', false);
        },
        // 打印图片
        printImg() {
            //当前页面打印
            var _self = this;
            var idNumber = this.get('idNumber');
            console.log('before idNumber',idNumber);
            idNumber=idNumber+1;
            console.log('idNumber',idNumber);
            this.set('idNumber',idNumber);
            var printId = 'printf' + idNumber;
            $("<iframe id=" + printId + " name=" + printId + "> <html><body>ttt</body></html></iframe>")
                .hide().appendTo("body");
            console.log(document.getElementById(printId));
            $('#'+printId+'').contents().find('body').html('<img class="width100B" src=' + _self.get("imgSrcBig") + '>');
            document.getElementById(printId).contentWindow.print();
        },
    }
});
