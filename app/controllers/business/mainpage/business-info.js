import Ember from 'ember';
export default Ember.Controller.extend({
  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),

  constants:Constants,
  isDisabled: true,
  fileSize:"(<1M)",
  errorText:null,//错误提示
  color:false,
  hideButton:true,
  MustBeItem:false,
  uploadUrl: Ember.computed('property', function() {  return this.get("pathConfiger").get("uploadUrl");}),
  isMobile: Ember.computed(function () {return this.get("global_curStatus").get("isMobile");}),  //移动端

  name:Ember.computed(function(){return this.get("model.curUser").get('name');}),
  address:Ember.computed(function(){return this.get("model.curUser").get('address');}),
  phone:Ember.computed(function(){return this.get("model.curUser").get('phone');}),
  entName:Ember.computed(function(){return this.get("model.curUser").get('entName');}),
  weixin:Ember.computed(function(){return this.get("model.curUser").get('weixin');}),
  email:Ember.computed(function(){return this.get("model.curUser").get('email');}),
  desc:Ember.computed(function(){return this.get("model.curUser").get('desc');}),
  introduce:Ember.computed(function(){return this.get("model.curUser").get('introduce');}),
  idcardNum:Ember.computed(function(){return this.get("model.curUser.edinfo").get('idcardNum');}),
  legalname:Ember.computed(function(){return this.get("model.curUser.edinfo").get('legalname');}),
  entIdNumber:Ember.computed(function(){return this.get("model.curUser.edinfo").get('entIdNumber');}),
  legalTel:Ember.computed(function(){return this.get("model.curUser.edinfo").get('legalTel');}),
  entIdAddress:Ember.computed(function(){return this.get("model.curUser.edinfo").get('entIdAddress');}),

  phoneRegular: Ember.computed(function(){
    var num=this.get('phone');
    var Reg= /^1\d{10}/;
    return this.Regular(num,Reg);
  }).property('phone'),
  legalTelRegular:Ember.computed(function(){
    var num=this.get('legalTel');
    var Reg= /^((\(\d{3,4}\)|\d{3,4}-|\s)?\d{8})|(\d+$)/;
    return this.Regular(num,Reg);
  }).property('legalTel'),
  idcardNumRegular:Ember.computed(function(){
    var num=this.get('idcardNum');
    var Reg=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|x|X)$/;
    return this.Regular(num,Reg);
  }).property('idcardNum'),
  entIdNumberRegular:Ember.computed(function(){
    var num=this.get('entIdNumber');
    var Reg= /^\w+$/;
    return this.Regular(num,Reg);
  }).property('entIdNumber'),
  legalnameRegular:Ember.computed(function(){
    var num=this.get('legalname');
    var Reg= /^[a-zA-Z\u4e00-\u9fa5]{2,5}$/;
    return this.Regular(num,Reg);
  }).property('legalname'),
  nameRegular:Ember.computed(function(){
    var num=this.get('name');
    var Reg= /^[a-zA-Z\u4e00-\u9fa5]{2,5}$/;
    return this.Regular(num,Reg);
  }).property('name'),
  //获取正真的动态；
  Regular:function(num,Reg){
    if ( num && !(Reg.test(num))) {
      return false;
    }return true;
  },
  status:Ember.computed(function () {
    if (this.get('model.curUser').get('status') === 0){
      this.set('audit','');
      this.set('certificationAgain',false);
      this.set('model.curUser.verifyFailReason',"");
      return "禁用";
    }  else if (this.get('model.curUser').get('status') === 1) {
      this.set('model.curUser.verifyFailReason',"");
      this.set('audit','');
      this.set('certificationAgain',false);
      return "未认证";
    }  else if (this.get('model.curUser').get('status') === 2) {
      this.set('model.curUser.verifyFailReason',"");
      this.set('audit','请耐心等待平台运营人员审核');
      this.set('hideButton',false);
      this.set('certificationAgain',false);
      return "已申请认证";
    }  else if (this.get('model.curUser').get('status') === 3) {
      this.set('model.curUser.verifyFailReason',"");
      this.set('certificationAgain',false);
      this.set('hideButton',false);
      this.set('AuthenticationSuccess',true);
      this.set('audit','');
      return "认证成功";
    }  else if (this.get('model.curUser').get('status') === 4) {
      this.set('certificationAgain',true);
      this.set('audit','');
      return "认证失败";
    }
  }).property('model.curUser.status'),
  showButton:  Ember.computed(function() {
    console.log("this.get('model.curUser').get('status')",this.get('model.curUser').get('status'));
    if(this.get('model.curUser').get('status') === 4 ){
      return 1;
    }  if(this.get('model.curUser').get('status') === 3 ){
      return 1;
    }  if( this.get('model.curUser').get('status') === 2) {
      return 1;
    }  if(this.get('model.curUser').get('status') === 0){
      return 1;
    }  return 2;
  }).property('model.curUser.status'),

  trueOrFalse:Ember.computed(function(){
    if( this.get('model.curUser').get('status') === 2 || this.get('model.curUser').get('status') === 3 ) {
      return false;
    }else {
      return true;
    }
  }).property('model.curUser.status'),
  modification2:Ember.computed(function(){
    if(! this.get('editEnd')){
      this.set('modification',false);
      this.set('modification1',false);
      this.set('modification3',false);
      this.set('modification5',false);
      this.set('modification6',false);
      this.set('modification7',false);
      this.set('modification8',false);
    }
  }).property('editEnd'),
  //上传图片不变形
  deformation:function(){
                if($(".cccc >div img").width() >= $(".cccc >div img").height()){
                    $(".cccc >div ").addClass("intergration_normal");
                    $(".cccc >div img").css("height", "110px");
                    $(".cccc >div img").css("width", "auto");
                    console.log("this.widthcccccccccccccc==========",$(".cccc >div img").width());
                    console.log('==========cccccccccccccccintergration_normal_height',$(".cccc >div img").height(),$(".cccc >div img").width());

                }else {
                    $(".cccc >div ").addClass("intergration_normal");
                    $(".cccc >div img").css("width", "110px");
                    $(".cccc >div img").css("height", "auto");
                    console.log("this.heightccccc==========",$(".cccc >div img").height());
                    console.log('==========cccccccccccccccintergration_normal',$(".cccc >div img").height(),$(".cccc >div img").width());
                }
  },
  actions:{
    //VerifyFail 审核失败原因显示与影藏
    VerifyFail:function () {
      this.toggleProperty('color',true);
    },
    //申请审核
    cancelPassSubmit: function(){
      this.set("showAddContents",false);
    },//弹框‘取消’按钮
    changePassSubmit: function(){
      this.set("showAddContents",false);
      var _self = this;
      var curUser = this.get("global_curStatus").getUser();
      if(this.get('isDisabled')===false || !(curUser.get('edinfo').get('idPhoto')) || !(curUser.get('edinfo').get('idPhotoReverse')) || !(curUser.get('edinfo').get('businessLicense')) || !this.get('name') || !this.get('idcardNum') ||  !this.get('phone') || !this.get('entName') || !this.get('legalname') || !this.get('entIdNumber') || !this.get('legalTel') || !this.get('entIdAddress') || !this.get('address')){
        if(!this.get('name') ){
          this.set('MustBeItem',true);
        }else {
          this.set('MustBeItem',false);
        }
        if(!this.get('phone') ){
          this.set('MustBeItem1',true);
        }else {
          this.set('MustBeItem1',false);
        }
        if(!this.get('idcardNum') ){
          this.set('MustBeItem2',true);
        }else {
          this.set('MustBeItem2',false);
        }
        if(!this.get('entName') ){
          this.set('MustBeItem3',true);
        }else {
          this.set('MustBeItem3',false);
        }
        if(!this.get('legalname') ){
          this.set('MustBeItem4',true);
        }else {
          this.set('MustBeItem4',false);
        }
      if(!this.get('entIdNumber') ){
        this.set('MustBeItem5',true);
      }else {
        this.set('MustBeItem5',false);
      }
      if(!this.get('legalTel') ){
        this.set('MustBeItem6',true);
      }else {
        this.set('MustBeItem6',false);
      }
      if(!this.get('entIdAddress') ){
        this.set('MustBeItem7',true);
      }else {
        this.set('MustBeItem7',false);
      }
      if(!this.get('address') ){
        this.set('MustBeItem8',true);
      }else {
        this.set('MustBeItem8',false);
      }
        console.log('2233444');
        this.set('MustBeItem',true);
      }else {
      this.set('showButton',1);
      this.set('MustBeItem',false);
        this.store.findRecord("userPrivate",curUser.get("id")).then(function(userEnt){
          userEnt.set("status",2);
          _self.get('global_ajaxCall').set("action",'applyVerify');
          userEnt.save();
        });
      }
    },//弹框‘确认’按钮
    statusFun:function () {
        var curUser = this.get("global_curStatus").getUser();
          this.set("showAddContents",true);
          console.log("this.get('name idcardNum phone entName legalname entIdNumber legalTel  entIdAddress address')=============",this.get('name') ,this.get('entName') , this.get('idcardNum'), this.get('phone'),this.get('legalname'),this.get('entIdNumber'),this.get('legalTel'),this.get('entIdAddress'),this.get('address'));
          console.log("curUser.get('edinfo').get('idPhoto')======",curUser.get('edinfo').get('idPhoto'));
          if(this.get('isDisabled')===false  ){
            this.set('succeed','请您先保存');
          }
          // else if( !this.get('name') || !this.get('idcardNum') ||  !this.get('phone') || !this.get('entName') || !this.get('legalname') || !this.get('entIdNumber') || !this.get('legalTel') || !this.get('entIdAddress') || !this.get('address')){
          //   this.set('succeed','负责人姓名、手机号码、证件编码、企业名称、法人姓名、单位证件号、办公室电话、单位证件住所、单位通信地址必须填写');
          // }
          else if (!(curUser.get('edinfo').get('idPhoto')) || !(curUser.get('edinfo').get('idPhotoReverse')) || !(curUser.get('edinfo').get('businessLicense'))){
            this.set('succeed','证件照、营业执照没有上传哦');
          }else {
            this.set('succeed','认证成功后，信息将不能修改');
          }
    },
    uploadFailImg:function(failType){
      this.set('colorFailImg',true);
      if(failType===1){
        this.set("errorText1","文件大小超出限制");
      }else if(failType===2){
        this.set("errorText1","文件上传失败");
      }else{
        this.set("errorText1","文件加载失败");
      }
    },
    uploadFailIdCardImg:function(failType){
      this.set('colorIdCardImg',true);
      if(failType===1){
        this.set("errorText2","文件大小超出限制");
      }else if(failType===2){
        this.set("errorText2","文件上传失败");
      }else{
        this.set("errorText2","文件加载失败");
      }
    },
    uploadFailImgReverse:function(failType){
      this.set('color2',true);
      if(failType===1){
        this.set("errorText3","文件大小超出限制");
      }else if(failType===2){
        this.set("errorText3","文件上传失败");
      }else{
        this.set("errorText3","文件加载失败");
      }
    },
    uploadFailcompany:function(failType){
      this.set('color3',true);
      if(failType===1){
        this.set("errorText","文件大小超出限制");
      }else if(failType===2){
        this.set("errorText","文件上传失败");
      }else{
        this.set("errorText","文件加载失败");
      }
    },
    uploadFailLicense:function(failType){
      this.set('color4',true);
      if(failType===1){
        this.set("errorText4","文件大小超出限制");
      }else if(failType===2){
        this.set("errorText4","文件上传失败");
      }else{
        this.set("errorText4","文件加载失败");
      }
    },
    editInfo: function() {
      if( this.get('model.curUser').get('status') === 2 || this.get('model.curUser').get('status') === 3 ) {
        this.set('editEnd',false);
      }else {
        this.set('editEnd',true);
        this.set("isDisabled",false);
      }
    },
    saveInfo: function() {
      var _self = this;
      var curUser = this.get("global_curStatus").getUser();
      var edinfo= curUser.get("edinfo");
      if(!this.get('name') ){
      }else {
        this.set('MustBeItem',false);
      }
      if(!this.get('phone') ){
      }else {
        this.set('MustBeItem1',false);
      }
      if(!this.get('idcardNum') ){
      }else {
        this.set('MustBeItem2',false);
      }
      if(!this.get('entName') ){
      }else {
        this.set('MustBeItem3',false);
      }
      if(!this.get('legalname') ){
      }else {
        this.set('MustBeItem4',false);
      }
    if(!this.get('entIdNumber') ){
    }else {
      this.set('MustBeItem5',false);
    }
    if(!this.get('legalTel') ){
    }else {
      this.set('MustBeItem6',false);
    }
    if(!this.get('entIdAddress') ){
    }else {
      this.set('MustBeItem7',false);
    }
    if(!this.get('address') ){
    }else {
      this.set('MustBeItem8',false);
    }
      console.log('check Regular phoneRegular 、weixinRegular legalTelRegular idcardNumRegular entNameRegular  entIdNumberRegular legalnameRegular nameRegular is',this.get('phoneRegular'),this.get('weixinRegular'),this.get('weixinRegular') , this.get('idcardNumRegular') , this.get('entNameRegular') ,this.get('entIdNumberRegular'),this.get('legalnameRegular') ,this.get('nameRegular') );
      if(this.get('entIdNumberRegular') &&  this.get('phoneRegular') && this.get('legalTelRegular')  && this.get('idcardNumRegular')  && this.get('legalnameRegular') && this.get('nameRegular')){
        this.set('editEnd',false);
        this.set("isDisabled",true);
        this.store.findRecord("edinfo",edinfo.get("id")).then(function(userEnt){
          userEnt.set("idType",47);
          userEnt.set('entIdType',48);
          userEnt.set("legalTel",_self.get("legalTel"));
          userEnt.set("idcardNum",_self.get("idcardNum"));
          userEnt.set("entIdNumber",_self.get("entIdNumber"));
          userEnt.set("legalname",_self.get("legalname"));
          userEnt.set("entIdAddress",_self.get("entIdAddress"));
          userEnt.save();
        });
        this.store.findRecord("userPrivate",curUser.get("id")).then(function(userEnt){
          userEnt.set("phone",_self.get("phone"));
          userEnt.set("introduce",_self.get("introduce"));
          userEnt.set("weixin",_self.get("weixin"));
          userEnt.set("name",_self.get("name"));
          userEnt.set("address",_self.get("address"));
          userEnt.set("entName",_self.get("entName"));
          userEnt.save();
        });

      }else {
        if(this.get('entIdNumberRegular')===false){
          this.set('modification5',true);
        }else {
          this.set('modification5',false);
        }  if(this.get('legalTelRegular')===false){
          this.set('modification8',true);
        }else {
          this.set('modification8',false);
        } if(this.get('nameRegular')===false){
           this.set('modification7',true);
        }else {
          this.set('modification7',false);
        }  if(this.get('legalnameRegular')===false){
          this.set('modification6',true);
        }else {
          this.set('modification6',false);
        }  if(this.get('idcardNumRegular')===false){
          this.set('modification3',true);
        }else {
          this.set('modification3',false);
        }  if(this.get('phoneRegular')===false){
          this.set('modification',true);
        }else {
          this.set('modification',false);
        }
      }
    },//保存
    //上传营业执照
    uploadLicense: function(response) {
      var res=JSON.parse(response);
      console.log("get in uploadLicense res",res);
      this.store.findRecord("edinfo",this.get("model.curUser").get("edinfo").get("id")).then(function(userEnt){
        userEnt.set("businessLicense",res.relativePath);
        userEnt.save().then(function(userData){
        });
        console.log("res.relativePath",res.relativePath);
      });
      this.set('color4',false);
      this.set("errorText4","");
    },
    //上传企业logo照片
    uploadidcompany: function(response) {
      var res=JSON.parse(response);
      console.log("res",res);
      this.store.findRecord("edinfo",this.get("model.curUser").get("edinfo").get("id")).then(function(userEnt){
        userEnt.set("companyPhotos",res.relativePath);
        userEnt.save().then(function(userData){
        });
        console.log("res.relativePath",res.relativePath);
      });
      this.set('color3',false);
      this.set("errorText","");
    },
    //上传证件照反面
    uploadidcardImgReverse:function(response){
      var res=JSON.parse(response);
      this.store.findRecord("edinfo",this.get("model.curUser").get("edinfo").get("id")).then(function(userEnt){
        userEnt.set("idPhotoReverse",res.relativePath);
        userEnt.save();
        console.log("res.relativePath",res.relativePath);
      });
      this.set("errorText3","");
      this.set('color2',false);
    },
    //上传证件照
    uploadidcardImg: function(response) {
      var model = this.get('model');
      var res=JSON.parse(response);
      console.log("res",res);
      this.store.findRecord("edinfo",model.curUser.get('edinfo').get('id')).then(function(userEnt){
        userEnt.set("idPhoto",res.relativePath);
        userEnt.save();
        console.log("res.relativePath",res.relativePath);
      });
      this.set('colorIdCardImg',false);
      this.set("errorText2","");
    },
    //上传负责人头像
    uploadSucc: function(response) {
      this.deformation();
      var ponse=JSON.parse(response);
      console.log("ponse",ponse);
      this.store.findRecord("userPrivate",this.get("model.curUser").get("id")).then(function(userEnt){
        userEnt.set("avatar",ponse.relativePath);
        userEnt.save().then(function(userData){
        });
      });
      this.set('colorFailImg',false);
      this.set("errorText1"," ");
    },
  }
});
