import Ember from 'ember';
import Changeset from 'ember-changeset';
import DrugValidations from '../../../validations/drug';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(DrugValidations,{
  constants:Constants,//引入字典常量
  count:false,
  drugModel: Ember.computed("drugInfo", function() {
      var model = this.get("drugInfo");
      if (!model) {
          return null;
      }
      return new Changeset(model, lookupValidator(DrugValidations), DrugValidations);
  }),
  unitList:Ember.computed(function(){
    let list = new Ember.A();
    let arr = ['μg','mg','g','ml','单位'];
    for(let i=0;i<arr.length;i++){
      let item = Ember.Object.create({});
      item.set('name',arr[i]);
      item.set('seq',i);
      list.pushObject(item);
    }
    return list;
  }),
  defaultUnit:Ember.computed('drugInfo',function(){
    let drugInfo = this.get('drugInfo');
    let unitList = this.get('unitList');
    if(drugInfo){
      return unitList.findBy('name',drugInfo.get('unit'));
    }else{
      return null;
    }
  }),
  printList:Ember.computed(function(){
    let list = new Ember.A();
    let item1 = Ember.Object.create({
      value:0,
      name:'普通'
    });
    list.pushObject(item1);
    let item2 = Ember.Object.create({
      value:1,
      name:'特殊'
    });
    list.pushObject(item2);
    return list;
  }),
  pathConfiger: Ember.inject.service("path-configer"),
  mainController: Ember.inject.controller('business.mainpage'),
  editModel: null,
  test:true,
  uploadUrl: Ember.computed('property', function() {
      return this.get("pathConfiger").get("uploadUrl");
  }),
  actions:{
    selectPrint(printType){
      this.set('drugModel.printTypeValue',printType);
      this.set('drugInfo.printType',printType.get('value'));
      this.set('drugModel.printType',printType.get('value'))
    },
    invalid() {
        //alert("error");
    },
    selectUnit(unit){
      this.set('drugInfo.unit',unit.get('name'));
      // this.set('drugModel.unit',unit.get('name'));
      this.set('defaultUnit',unit);
    },
    uploadSucc: function(response) {
        var model = this.get('model');
        var res = JSON.parse(response);
        this.get("drugModel").set("headImg", res.relativePath);
    },
    //编辑按钮
    detailEditClick:function(){
      this.set('detailEdit',true);
      let unitList = this.get('unitList');
      let drugInfo = this.get('drugInfo');
      let unit = unitList.findBy('name',drugInfo.get('name'));
      this.set('defaultUnit',unit);
      let printList = this.get('printList');
      let print = printList.findBy('value',drugInfo.get('printType'));
      this.set('drugModel.printTypeValue',print);
    },
    //取消按钮
    detailCancel:function(){
      var id=this.get('id');
      var editMode=this.get('editMode');
      this.pageDestory();
      if(id&&editMode=='edit'){
        this.set('detailEdit',false);
        this.get('drugInfo').rollbackAttributes();
        console.log(this.get('drugInfo'));
        var route=App.lookup('route:business.mainpage.drug-detail');
        route.refresh();//刷新页面
      }else{
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('drug-dictionary');
      }
    },
    //保存护理项目
    saveDrug(){
      var _self=this;
      var editMode=this.get('editMode');
      var drugModel=this.get('drugModel');

      drugModel.validate().then(function(){
        if(drugModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          drugModel.save().then(function(){
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            _self.pageDestory();
            if(editMode=='add'){
              var mainpageController = App.lookup('controller:business.mainpage');
              mainpageController.switchMainPage('drug-dictionary');
            }else{
                _self.set('detailEdit',false);
            }
        },function(err){
          let error = err.errors[0];
          if(error.code==="4"){
            drugModel.validate().then(function(){
              drugModel.addError('name',['该药品名称已被占用']);
              drugModel.set("validFlag",Math.random());
              App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
            });
          }
        });
      }else {
          drugModel.set("validFlag", Math.random());
      }
    });
    },
    //删除按钮
    delById : function() {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此药品记录",function(){
        _self.send('cancelPassSubmit',_self.get('drugInfo'));
      });
    },
    drugTypeSelect(drugType){
      this.set('drugModel.drugType',drugType);
      this.set('drugInfo.drugType',drugType);
    },
    drugSpecSelect(drugSpec){
      this.set('drugModel.drugSpec',drugSpec);
      this.set('drugInfo.drugSpec',drugSpec);
    },
    drugFormSelect(drugForm){
      this.set('drugModel.drugForm',drugForm);
      this.set('drugInfo.drugForm',drugForm);
    },

    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(drug){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      drug.set("delStatus", 1);
      drug.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('drug-dictionary');

      },function(err){
          App.lookup('controller:business.mainpage').showPopTip("删除失败",false);
        let error = err.errors[0];
        if (error.code == 0) {
          setTimeout(function(){
              App.lookup('controller:business.mainpage').showAlert("该药品尚在使用中,不能删除");
          },500);
        }
      });
		},
    drugFormTypeSelect(drugFormType) {
      var level=drugFormType.get('level');
      var choseLevel=this.get("choseLevel");
      // if (level<choseLevel) {//重新选择更上级
      this.set("choseLevel",level);
      // }
      this.set("drugFormType"+(level-1),drugFormType);
      if (level<3) {
        this.getNextSelect(drugFormType.get('id'),level);
      }
   }
 },
 getNextSelect:function(parentId,index){
   var self=this;
   self.store.query("drugFormType", {filter:{"parentId":parentId}}).then(function(drugFormTypeList) {
       self.set("drugFormTypeList"+index, drugFormTypeList);
       self.set("formStatus"+index,drugFormTypeList.content.length>0);
       if (drugFormTypeList.content.length==0) {
         for (var i = index; i < 3; i++) {
          self.set("formStatus"+i,false);
         }
       }
       for (var j=index; j < 3;j++) {  //重新选择更上级时重置低级下拉框的数据
          self.set("drugFormType"+j,{});
       }
   });
 },
 pageDestory:function(){
   this.set("drugFormType0",null);
   this.set("drugFormType1",null);
   this.set("drugFormType2",null);
 },
 drugFormTypeList0:[], //剂型下拉框list
 drugFormTypeList1:[],
 drugFormTypeList2:[],
 formStatus0:false,       //是否显示剂型下拉框
 formStatus1:false,
 formStatus2:false,
 drugFormType0:null,   //下拉框选择值
 drugFormType1:null,
 drugFormType2:null,
 choseLevel:0
});
