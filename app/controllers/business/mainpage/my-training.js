import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  global_curStatus: Ember.inject.service("current-status"),
  dateService:Ember.inject.service('date-service'),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"MyTrainingContainer",
  preventInfinite:true,
  queryFlagInFlag: 1,

  init: function(){
    let _self = this;
    Ember.run.schedule('afterRender',function(){
      _self.set("hasRender",true);
    });
  },
  hasRenderObs:function(){
    let _self = this;
    let hasRender = this.get("hasRender");
    var id = this.get("id");
    _self._showLoading();
    if(!hasRender||!id){
      return;
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
      };

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
      };

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
      };

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
      };
    }
    console.log("shareDocument id",id);
    let itemId = "brief_"+id;
    let shareDocument = this.get('store').peekRecord('share-document',id);
    console.log('shareDocument in observeGotoWork:',shareDocument);
    this.set('shareDocument',shareDocument);
    let str = shareDocument.get('remark');
    console.log("str after:",str);
    let remark;
    if(!str){
      remark = "";
    }else{
      let remarkAfter;
      if(str == _self.get('dateService').base64_encode(_self.get('dateService').base64_decode(str))) {//判断是否经过base64转码
        console.log("run 11");
        let base = new Base64();
        remarkAfter = base.decode(str);
      }else{
        console.log("run 22");
        remarkAfter = str;
      }
      console.log("remarkAfter",remarkAfter);
      remark = remarkAfter.replace(/embed/,'video controls="controls"');
    }
    console.log("remark:",remark);
    console.log("id render:",$("#brief_"+shareDocument.get("id")));
    $("#MyTrainingContainer").find(".remarkContentClass").find(".remarkClass").remove();
    let remarkContent = "<div id='" + itemId + "' class='remarkClass' style='line-height:25px;font-size:14px;color:#666666;margin-bottom:10px;'>" + remark + "</div>";
    $("#MyTrainingContainer").find(".remarkContentClass").append(remarkContent);
    // $("#brief_"+shareDocument.get("id")).html(remark);
    $("#" + itemId).find('video').bind('play', function (e) {
      let videoObjGlobal = _self.get("global_curStatus").get("videoObj");
      if(videoObjGlobal){
        videoObjGlobal.pause();
        _self.get("global_curStatus").set("videoObj",null);
      }
      console.log("play yse!");
      console.log("video obj",$(this));
      let videoObj = $(this);
      _self.set("videoObj",videoObj);
      _self.get("global_curStatus").set("videoObj",videoObj);
    });
    _self.hideAllLoading();
    _self.directInitScoll(true);
    console.log("didInsertElement yes");
  }.observes('hasRender','id','queryFlagInFlag').on("init"),

  queryFlagIn(){
    this.incrementProperty("queryFlagInFlag");
  },

  actions:{
    switchShowAction(){
      console.log("yesdd");
      // this.incrementProperty("queryFlagInFlag");
    },

  },

});
