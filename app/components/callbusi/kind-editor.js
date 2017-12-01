import Ember from 'ember';

export default Ember.Component.extend({
  imgHeight:50,
  imgWidth:50,
  pathConfiger: Ember.inject.service("path-configer"),
  dateService:Ember.inject.service('date-service'),
  didInsertElement: function() {
    let _self = this;
    let items = ['source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
      'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
      'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
      'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
      'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
      'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
      'media', 'insertfile', 'table', 'hr', '|','save'
    ];
    let editor = window.GLOBAL_K.create('#editor_id', {
      basePath:'kindeditor/',
      items: items,
      uploadJson:_self.get('pathConfiger.basePath') + '/kindeditor/fileUpload?businessType=media&contentType=media',
      fileManagerJson:_self.get('pathConfiger.basePath') + '/kindeditor/fileManager',
      allowFileManager: true,
      afterUpload : function(url, data, name) {
                        var iframe=$(".ke-edit-iframe")[0];
                        if(name=="image" || name=="multiimage"){ //单个和批量上传图片时
                            var img = new Image(); img.src = url;
                            _self.set('imgUrl',url);
                        }
                },
    });
    // editor.focus();
    let str = this.get('value');
    let base = new Base64();
    if(str){
      let htmlText = base.decode(str);
      if(str == _self.get('dateService').base64_encode(_self.get('dateService').base64_decode(str))) {//判断是否经过BASE64转码
         editor.html(htmlText);
       }else{
         editor.html(str);
       }
    }

     //base64处理函数
     function Base64() {
        // private property
        const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        // public method for encoding
        this.encode = function (input) {
         var output = "";
         var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
         var i = 0;
         input = _utf8_encode(input);
         while (i < input.length) {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;
          if (isNaN(chr2)) {
           enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
           enc4 = 64;
          }
          output = output +
          _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
          _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
         }
         return output;
        }

        // public method for decoding
        this.decode = function (input) {
         var output = "";
         var chr1, chr2, chr3;
         var enc1, enc2, enc3, enc4;
         var i = 0;
         input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
         while (i < input.length) {
          enc1 = _keyStr.indexOf(input.charAt(i++));
          enc2 = _keyStr.indexOf(input.charAt(i++));
          enc3 = _keyStr.indexOf(input.charAt(i++));
          enc4 = _keyStr.indexOf(input.charAt(i++));
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;
          output = output + String.fromCharCode(chr1);
          if (enc3 != 64) {
           output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
           output = output + String.fromCharCode(chr3);
          }
         }
         output = _utf8_decode(output);
         return output;
        }

        // private method for UTF-8 encoding
        var _utf8_encode = function (string) {
         string = string.replace(/\r\n/g,"\n");
         var utftext = "";
         for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
           utftext += String.fromCharCode(c);
          } else if((c > 127) && (c < 2048)) {
           utftext += String.fromCharCode((c >> 6) | 192);
           utftext += String.fromCharCode((c & 63) | 128);
          } else {
           utftext += String.fromCharCode((c >> 12) | 224);
           utftext += String.fromCharCode(((c >> 6) & 63) | 128);
           utftext += String.fromCharCode((c & 63) | 128);
          }

         }
         return utftext;
        }

        // private method for UTF-8 decoding
        var _utf8_decode = function (utftext) {
         var string = "";
         var i = 0;
         var c = 0;
         var c1 = 0;
         var c2 = 0;
         var c3;
         while ( i < utftext.length ) {
          c = utftext.charCodeAt(i);
          if (c < 128) {
           string += String.fromCharCode(c);
           i++;
          } else if((c > 191) && (c < 224)) {
           c2 = utftext.charCodeAt(i+1);
           string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
           i += 2;
          } else {
           c2 = utftext.charCodeAt(i+1);
           c3 = utftext.charCodeAt(i+2);
           string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
           i += 3;
          }
         }
         return string;
        }
      };
  },
});
