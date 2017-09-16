import Ember from 'ember';
import Changeset from 'ember-changeset';
import WorkValidations from '../../../validations/worktimesetting';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(WorkValidations,{
  constants:Constants,
  dateService: Ember.inject.service("date-service"),
  store: Ember.inject.service("store"),
  workModel:Ember.computed('worktimesettingInfo',function(){
    var model = this.get("worktimesettingInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(WorkValidations), WorkValidations);
  }),
  actions:{
    invalid() {
        //alert("error");
    },
    //选择颜色
    selectColor(color){
      let  _self = this;
      let colorList = this.get('colorList');
      let colorFlag = colorList.findBy('typecode',color);
      _self.set('worktimesettingInfo.colorFlag',colorFlag);
      _self.set('workModel.colorFlag',colorFlag);
      let name;
      switch (color) {
        case 'colorType1':
          name =  "work-color-1";
          break;
        case 'colorType2':
          name =  "work-color-2";
          break;
        case 'colorType3':
          name =  "work-color-3";
          break;
        case 'colorType4':
          name =  "work-color-4";
          break;
        case 'colorType5':
          name =  "work-color-5";
          break;
        case 'colorType6':
          name =  "work-color-6";
          break;
        case 'colorType7':
          name =  "work-color-7";
          break;
        case 'colorType8':
          name =  "work-color-8";
          break;
        case 'colorType9':
          name =  "work-color-9";
          break;
        default:
          name = "work-color-9";
          break;
      }
      this.set('workModel.colorName',name);

    },
    startTimeAction(date){
      var time ='';
      if(date){
        if(date.getMinutes()===0){
          time = date.getHours() +":00";
        }else {
          time = date.getHours() +":"+ date.getMinutes();
        }
      }

      let stamp = this.get("dateService").timeStringToTimestamp(date);
      this.set('workModel.startTimeInt',stamp);
      console.log(stamp);
      this.set("workModel.startTime", time);
      this.set("worktimesettingInfo.startTime", time);
    },
    endTimeAction(date){
      var time ='';
      if(date){
        if(date.getMinutes()===0){
          time = date.getHours() +":00";
        }else {
          time = date.getHours() +":"+ date.getMinutes();
        }
      }
      let stamp = this.get("dateService").timeStringToTimestamp(date);
      this.set('workModel.endTimeInt',stamp);
      console.log(stamp);
      this.set("workModel.endTime", time);
      this.set("worktimesettingInfo.endTime", time);
    },
    //编辑按钮
    detailEditClick:function(worktimesetting){
      this.set('detailEdit',true);
    },

    //取消按钮
    detailCancel:function(){
      var editMode=this.get('editMode');
      if(editMode=='edit'){
        this.set('detailEdit',false);
      }else{
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('work-time-setting');
      }
    },
    dpShowAction(e){

    },
    //保存
    saveWork(){
      var _self=this;
      var workModel=this.get('workModel');
      var editMode=this.get('editMode');
      workModel.validate().then(function(){
        if(workModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          workModel.save().then(function(){
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            if (editMode=='add') {
              var mainpageController = App.lookup('controller:business.mainpage');
              mainpageController.switchMainPage('work-time-setting');
            }else {
              _self.set('detailEdit',false);
              // _self.get('worktimesettingInfo').rollbackAttributes();
            }
          },function(err){
            let error = err.errors[0];
            console.log("111111111  err");
            if(error.code=="4"){
              console.log("111111111  jin if");
              workModel.validate().then(function() {
                  workModel.addError('name', ['班次名称不能相同']);
                  workModel.set("validFlag", Math.random());
                  App.lookup('controller:business.mainpage').showPopTip("保存失败", false);
              });
            }
          });
        }else{
          workModel.set("validFlag",Math.random());
        }
      });

    },
    // changeStartTimeAction(date) {
    //     var stamp = this.get("dateService").getLastSecondStampOfDay(date);
    //     this.set("workModel.startTime", stamp);
    // },
    // changeEndTimeAction(date) {
    //     var stamp = this.get("dateService").getLastSecondStampOfDay(date);
    //     this.set("workModel.endTime", stamp);
    // },
    //删除按钮
    delById : function(worktimesetting) {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此班次记录",function(){
          _self.send('cancelPassSubmit',_self.get('worktimesettingInfo'));
      });
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(worktimesetting){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      worktimesetting.set("delStatus", 1);
      worktimesetting.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('work-time-setting');

      });
		},
  }
});
