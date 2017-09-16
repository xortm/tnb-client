import Ember from 'ember';
const {uploadBusinessType_phoneNumAuth,uploadFileType_zipPackage} = Constants;
export default Ember.Controller.extend({
  nosex: Ember.computed('task.sexPreference',function() {
    if(this.get('task.sexPreference') === 0) {
      return true;
    }
    return false;
  }),
  sex1: Ember.computed('task.sexPreference',function() {
    if(this.get('task.sexPreference') === 1) {
      return true;
    }
    return false;
  }),
  sex2: Ember.computed('task.sexPreference',function() {
    if(this.get('task.sexPreference') === 2) {
      return true;
    }
    return false;
  }),
  settleAccountWay0: Ember.computed('task.settleAccountWay',function() {
    if(this.get('task.settleAccountWay') === 0) {
      return true;
    }
    return false;
  }),
  settleAccountWay1: Ember.computed('task.settleAccountWay',function() {
    if(this.get('task.settleAccountWay') === 1) {
      return true;
    }
    return false;
  }),
  pathConfiger: Ember.inject.service("path-configer"),
  uploadUrl: Ember.computed('property', function() {return this.get("pathConfiger").get("uploadUrl");}),
  constants:Constants,
  statementUrl: Ember.computed('property', function() {
    var url = this.get("pathConfiger").get("templateUrl") + "/声明书.docx";
    return url;
  }),
  // documentationUrl: Ember.computed('property', function() {
  //   var url = this.get("pathConfiger").get("templateUrl") + "/外显号码材料说明文档.doc";
  //   return url;
  // }),

  taskDurType:function() {
    var beginTime = this.get('task.beginDateComp');
    var endTime = this.get('task.endDateComp');
    if(beginTime&&(!endTime||(endTime=='待定'))) {
      this.set('durType','长期');
    }
    else if (beginTime&&endTime&&(endTime!='待定')) {
      this.set('durType','短期');
    }
    else {
      this.set('durType','');
    }
  },

  actions: {
    closeConfirm: function(){
			this.set("confirmIdModal",false);
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('business-task');
		},
		switchStatus: function(){
			this.set("confirmIdModal",false);
			var mainpageController = App.lookup('controller:business.mainpage');
			mainpageController.switchMainPage('business-info');
		},
    sexSelect:function(value) {
      this.get('task').set('sexPreference',value);
    },
    // settleAccountWaySelect:function(value) {
    //   this.get('task').set('settleAccountWay',value);
    // },
    // durTypeSelect:function(value) {
    //   this.get('task').set('durType',value);
    // },
    choosetime:function() {
      this.taskDurType();
    },
    //上传logo
    uploadSucc: function(response) {
      var res=JSON.parse(response);
      console.log('upload response',response);
      this.set('logoUrl',res.relativePath);
      this.set('uploadError',false);
      this.set("errorText","");
    },
    uploadFailImg:function(failType){
      this.set('uploadError',true);
      if(failType===1){
        this.set("errorText","文件大小超出限制");
      }else if(failType===2){
        this.set("errorText","文件上传失败");
      }else{
        this.set("errorText","文件加载失败");
      }
    },

    uploadFile: function (file) {
      var _self = this;
      if(file.get('name')) {
        console.log("file get",file);
        let filenameOri = file.get('name');
        let extfix = filenameOri.substring(filenameOri.lastIndexOf('.')+1);
        let filename = CommonUtil.Common_GenerateGuid() + "." + extfix;
        console.log("upload file:" + filename);
        var uploadParams = {"data":{
          businessType:uploadBusinessType_phoneNumAuth,
          "Content-Type":uploadFileType_zipPackage
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
        console.log('upload response',responseMessage);
        _self.set('rarUrl',responseMessage.relativePath);
        console.log('upload suc,rarUrl',responseMessage.relativePath);
        _self.set('needExplicitNum',true);
        _self.set("showUpError",false);
        _self.set("showUpSucc",true);
      }, function (event) {
        console.log("upload fail,event",event);
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

}
});
