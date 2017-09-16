import Ember from 'ember';

export default Ember.Controller.extend({
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  dateService:Ember.inject.service('date-service'),
  docList:Ember.computed('curDocType','allDocList',function(){
    let curDocType = this.get('curDocType');
    let allDocList = this.get('allDocList');
    if(!curDocType||!allDocList){
      return ;
    }
    return allDocList.filter(function(doc){
      doc.set('hasChoosed',false);
      doc.set('editModel',false);
      return doc.get('type.id') == curDocType.get('id');
    });
  }),
  uploadUrl: Ember.computed('property', function() {return this.get("pathConfiger").get("uploadUrl");}),
  saveKind(str){
    this.send('saveEditor',str);
  },
  actions:{
    //编辑器内容上传
    saveEditor(str){
      let _self = this;
      let curData = this.get('curData');
      let base = new Base64();
      let remark = base.encode(str);
      curData.set('remark',remark);

      curData.save().then(function(doc){
        _self.set('curData',doc);
        _self.get('docList').forEach(function(doc){
          doc.set('hasChoosed',false);
        });
        _self.set('curData.editModel',false);
        App.lookup('controller:business.mainpage').showSimPop('保存成功');
      });
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
    //资料名称鼠标移入,移出
    hoverName(doc){
      doc.set('chooseName',true);
    },
    leaveName(doc){
      doc.set('chooseName',false);
    },
    //保存标题
    saveName(doc){
      doc.save().then(function(){
        App.lookup('controller:business.mainpage').showSimPop('保存成功');
        doc.set('chooseName',false);
      });
    },
    chooseType(type){
      this.get('typeList').forEach(function(item){
        item.set('hasChoosed',false);
      });
      type.set('hasChoosed',true);
      this.set('curDocType',type);
    },
    chooseDoc(doc){
      let _self = this;
      doc.set('editModel',false);
      if(doc.get('hasChoosed')){
        doc.set('hasChoosed',false);

      }else{
        this.get('docList').forEach(function(item){
          item.set('hasChoosed',false);
        });
        doc.set('hasChoosed',true);
        Ember.run.schedule('afterRender',function(){
          let str = doc.get('remark');
          let base = new Base64();
          let remark = base.decode(str);
          if(str == _self.get('dateService').base64_encode(_self.get('dateService').base64_decode(str))) {//判断是否经过base64转码
             $('#'+doc.get('id')).append(remark);
           }else{
             $('#'+doc.get('id')).append(str);
           }
        });
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
    invitation(){
      this.set('addModel',false);
      this.set('addNewModel',false);
    },
    add(){
      this.set('addNewModel',true);
      let data = this.store.createRecord('share-document',{});
      this.set('newData',data);
      this.set('addName','新增');
    },

    saveNewData(){
      let _self = this;
      let data = this.get('newData');
      data.set('type',this.get('curDocType'));
      if(data.get('name')){
        data.save().then(function(item){
          _self.set('addNewModel',false);
          _self.send('editDoc',item);
          var route = App.lookup('route:business.mainpage.training-materials');
          App.lookup('controller:business.mainpage').refreshPage(route);
        });
      }else{
        App.lookup('controller:business.mainpage').showAlert('请填写资料名称');
      }
    },
    editDoc(doc){
      // doc.set('hasChoosed',false);
      // this.set('addModel',true);
      this.set('curData',doc);
      // this.set('addName','编辑');
      doc.set('editModel',true);
    },
    save(str){
      let _self = this;
      let curData = this.get('curData');
      curData.set('type',_self.get('curDocType'));
      if(curData.get('name')){
        curData.save().then(function(data){
          _self.set('addModel',false);
          App.lookup('controller:business.mainpage').showPopTip('保存成功');
          var route = App.lookup('route:business.mainpage.training-materials');
          App.lookup('controller:business.mainpage').refreshPage(route);
        });
      }else{
        App.lookup('controller:business.mainpage').showAlert('请填写资料名称');
      }

    },
    delById(doc){
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此记录",function(){
        _self.send('cancelPassSubmit',doc);
      });
    },
    cancelPassSubmit(doc){
      doc.set('delStatus',1);
      doc.save().then(function(){
        App.lookup('controller:business.mainpage').showPopTip('删除成功');
        var route = App.lookup('route:business.mainpage.training-materials');
        App.lookup('controller:business.mainpage').refreshPage(route);
      });
    },
    hoverDoc(doc){
      doc.set('hover',true);
    },
    leaveDoc(doc){
      doc.set('hover',false);
    },
    toUpLoad(){
      let _self = this;
      this.set('fileUpLoad',true)
    },
    //文件上传
    uploadFile: function (file) {
      var _self = this;
      if(file.get('name')) {
        console.log("file get",file);
        let filenameOri = file.get('name');
        let extfix = filenameOri.substring(filenameOri.lastIndexOf('.')+1);
        let filename = CommonUtil.Common_GenerateGuid() + "." + extfix;
        console.log("upload file:" + filename);
        var uploadParams = {"data":{
          businessType:'documentFile',
          "Content-Type":'share-document'
        },
        accepts:["*/*"],
        headers:{
          Accept: "*/*"
        }
      };
      file.upload(_self.get("uploadUrl"),uploadParams).then(function (response) {
        console.log("upload suc,response",response);
        var responseMessage = JSON.parse(response.body);
        file.destroy();
        _self.set('rarUrl',responseMessage.relativePath);
        let str = 'http://resource.tnb99.net/files/documentFile/' + responseMessage.relativePath;
        let newFile = _self.store.createRecord('share-document-file',{});
        newFile.set('path',str);
        _self.set('newFile',newFile);
        _self.set('upDone',true);
        _self.set('upFalse',false);
        _self.set('needExplicitNum',true);
        _self.set("showUpError",false);
        _self.set("showUpSucc",true);
        _self.send('toUpLoad');
      }, function (event) {
        console.log("upload fail,event",event.file.status);
        _self.set('upFalse',true);
        if(event.file.status==2){
          App.lookup('controller:business.mainpage').showAlert('文件太大，无法上传');
        }


        file.destroy();
        _self.set('needExplicitNum',false);
        _self.set("showUpError",true);
        _self.set("showUpSucc",false);
      });
    }
    else {
      _self.set('needExplicitNum',false);
      this.set("showUpError",true);
      this.set("showUpSucc",false);
    }
  },
  saveNewFile(){
    let file = this.get('newFile');
    let _self = this;
    file.set('document',this.get('curData'));
    if(!file.get('name')){
      App.lookup('controller:business.mainpage').showAlert('请输入附件描述');
      return ;
    }
    if(!this.get('upDone')){
      App.lookup('controller:business.mainpage').showAlert('请上传附件');
      return ;
    }
    file.save().then(function(){
      _self.set('fileUpLoad',false);
    });
  },
  exit(){
    this.set('fileUpLoad',false);
    this.set('changeImg',false);
  },
  delFile(file){
    var _self = this;
    console.log('删除附件');
    App.lookup('controller:business.mainpage').showConfirm("是否确定删除此附件",function(){
      file.set('delStatus',1);
      file.save();
    });
  },
  }
});
