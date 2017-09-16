import Ember from 'ember';
import Changeset from 'ember-changeset';
import CustomerbusinesstryValidations from '../../../validations/customerbusinesstry';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(CustomerbusinesstryValidations,{
  constants:Constants,
  store: Ember.inject.service('store'),
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  bedShow:false,

  customerbusinessflowModel:Ember.computed('customerbusinessflowInfo',function(){
    let model = this.get("customerbusinessflowInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(CustomerbusinesstryValidations), CustomerbusinesstryValidations);
  }),


  defaultStaff:Ember.computed('customerbusinessflowInfo.experienceStaff',function(){
      return this.get('customerbusinessflowInfo.experienceStaff');
  }),
  defaultBed:Ember.computed('customerbusinessflowInfo.orderBed','customerbusinessflowInfo.experienceBed',function(){
    if(this.get('customerbusinessflowInfo.experienceBed.id')){
      return this.get('customerbusinessflowInfo.experienceBed');
    }else{
      return this.get('customerbusinessflowInfo.orderBed');
    }
  }),
  referencePrice:Ember.computed('customerbusinessflowModel.@each.experienceBed','customerbusinessflowModel.diningStandard','project',function(){
    let bedPrice;
    let diningPrice;
    let projectPrice;
    let _self = this;
    if(_self.get('customerbusinessflowModel.experienceBed.price')){
      bedPrice = parseInt(_self.get('customerbusinessflowModel.experienceBed.price'));
    }else{
      bedPrice = parseInt(_self.get('customerbusinessflowModel.orderBed.price'));
    }
    if(_self.get('customerbusinessflowModel.diningStandard.typeValue')){
      diningPrice = parseInt(_self.get('customerbusinessflowModel.diningStandard.typeValue'));
    }else{
      diningPrice = 0;
    }
    if(_self.get('project.price')){
      projectPrice = parseInt(_self.get('project.price'));
    }else{
      projectPrice = 0;
    }
    let price = bedPrice+diningPrice+projectPrice;
    return price ;

  }),
  priceObs:function(){
    let _self = this;
    let bedPrice;
    let diningPrice;
    let projectPrice;
      if(_self.get('customerbusinessflowModel.experienceBed.price')){
        bedPrice = parseInt(_self.get('customerbusinessflowModel.experienceBed.price'));
      }else{
        bedPrice = parseInt(_self.get('customerbusinessflowModel.orderBed.price'));
      }
      if(_self.get('customerbusinessflowModel.diningStandard.typeValue')){
        diningPrice = parseInt(_self.get('customerbusinessflowModel.diningStandard.typeValue'));
      }else{
        diningPrice = 0;
      }
      if(_self.get('project.price')){
        projectPrice = parseInt(_self.get('project.price'));
      }else{
        projectPrice = 0;
      }
      let price = bedPrice+diningPrice+projectPrice;
      _self.set('referencePrice',price);


  }.observes('customerbusinessflowModel.diningStandard','customerbusinessflowModel.experienceBed','project','bedList'),

  actions:{
    invalid() {
        //alert("error");
    },
    toProject(project){
      let id = project.get("id");
      let mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('nursingproject-detail',{editMode:'edit',id:id});
    },
    //暂存
    stagingAction(){
      let customerbusinessflowInfo = this.get('customerbusinessflowInfo');
      let status = this.get("dataLoader").findDict("consultStatus4");
      let _self = this;
      if(!_self.get('customerbusinessflowInfo.experienceBed').content){
        customerbusinessflowInfo.set('experienceBed',_self.get('customerbusinessflowInfo.orderBed'));
      }

      customerbusinessflowInfo.set('tempFlag',1);
      customerbusinessflowInfo.save().then(function(){
        App.lookup('controller:business.mainpage').openPopTip("已暂存");
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('business-customer');
        App.lookup('controller:business.mainpage').showPopTip("已暂存");
      });
    },
    //保存
    detailSaveClick: function() {
      let editMode=this.get('editMode');
      let customerbusinessflowModel=this.get('customerbusinessflowModel');
      let customerbusinessflowInfo = this.get('customerbusinessflowInfo');
      let _self=this;
      let status = this.get("dataLoader").findDict("consultStatus4");
      if(!_self.get('customerbusinessflowInfo.experienceBed').content){
        customerbusinessflowInfo.set('experienceBed',_self.get('customerbusinessflowInfo.orderBed'));
      }
      if(this.get('project.price')){
        customerbusinessflowModel.validate().then(function(){
          let curBed = _self.get('store').peekRecord('bed',customerbusinessflowInfo.get('experienceBed.id'));
          let oldBed = _self.get('oldBed');//转试住前床位

          console.log("oldbed before",oldBed,";;;;curBed:",curBed);
            let curCustomer = _self.get('store').peekRecord('customer',customerbusinessflowInfo.get('customer.id'));
            let customerStatus = _self.get("dataLoader").findDict("customerStatusTry");
            curCustomer.set('customerStatus',customerStatus);
            console.log("-----------customerStatus:",customerStatus.get('typecode'));
            curCustomer.set('diningStandard',customerbusinessflowModel.get('diningStandard'));
            curCustomer.set('checkInDate',customerbusinessflowModel.get('experienceStartTime'));
            curCustomer.set('bed',curBed);
            curCustomer.set('referencePrice',_self.get('referencePrice'));
            curCustomer.set('actualPrice',customerbusinessflowModel.get('experiencePrice'));
            curCustomer.save().then(function(){
              if(curBed.get("id")!=oldBed.get("id")){
                let bedStatus = _self.get("dataLoader").findDict("bedStatusIdle");//设置为空闲
                console.log("oldBed tryHBS",oldBed);
                oldBed.set("status",bedStatus);
              }
              customerbusinessflowInfo.set('status',status);
              customerbusinessflowInfo.set('tempFlag',0);
              customerbusinessflowInfo.set('experienceRemark',_self.get('customerbusinessflowInfo.experienceRemark'));
              customerbusinessflowInfo.set('experienceEndTime',customerbusinessflowModel.get('experienceEndTime'));
              customerbusinessflowInfo.set('experienceStartTime',customerbusinessflowModel.get('experienceStartTime'));
              customerbusinessflowInfo.set('experienceDate',customerbusinessflowModel.get('experienceDate'));
              customerbusinessflowInfo.set('experiencePrice',customerbusinessflowModel.get('experiencePrice'));
              customerbusinessflowInfo.set('diningStandard',customerbusinessflowModel.get('diningStandard'));
              customerbusinessflowInfo.set('tryContractNO',customerbusinessflowModel.get('tryContractNO'));
              if(Number(customerbusinessflowModel.get("experienceEndTime"))<=Number(customerbusinessflowModel.get("experienceStartTime"))){
                customerbusinessflowModel.addError('experienceEndTime',['试住结束日期必须大于试住开始日期']);
              }
              if(customerbusinessflowModel.get('errors.length')===0){
                App.lookup('controller:business.mainpage').openPopTip("正在保存");
                customerbusinessflowInfo.save().then(function(){
                  let bedStatus = _self.get("dataLoader").findDict("bedStatusTryIn");//试住
                  curBed.set("status",bedStatus);// curBed.save();//  因为服务器做的处理 不需要save去保存
                  App.lookup('controller:business.mainpage').showPopTip("保存成功");
                  if(editMode=='add'){
                    let mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('business-customer');
                  }
            });
            }else{
              customerbusinessflowModel.set("validFlag",Math.random());
            }
            });

          });
      }else{
        App.lookup('controller:business.mainpage').showAlert("请先设置护理方案");
      }


    },
    toNursingproject(){
      let mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('nursingproject');
    },
    diningStandardSelect(diningStandard){
      this.set('customerbusinessflowModel.diningStandard',diningStandard);
      this.set('customerbusinessflowInfo.diningStandard',diningStandard);
    },
    //编辑按钮
    detailEditClick:function(){
      this.set('detailEdit',true);
    },
    //取消
    detailCancel:function(){
      let from = this.get('from');
      let id=this.get('id');
      let editMode=this.get('editMode');
      if(id&&editMode=='edit'){
        this.set('detailEdit',false);
        let mainpageController = App.lookup('controller:business.mainpage');
        if(from){
            mainpageController.switchMainPage('try-and-stay');
        }else{
            mainpageController.switchMainPage('business-customer');
        }
      }else{
        let mainpageController = App.lookup('controller:business.mainpage');
        if(from){
            mainpageController.switchMainPage('try-and-stay');
        }else{
            mainpageController.switchMainPage('try-and-stay');
        }
      }
    },
    //选择床位
    selectBed(Bed) {
        this.set('customerbusinessflowInfo.experienceBed',Bed);
        this.set('customerbusinessflowModel.experienceBed',Bed);
    },
    //选择办理人
    selectStaff(staff){
      this.set('customerbusinessflowInfo.experienceStaff',staff);
      this.set('customerbusinessflowModel.experienceStaff',staff);
    },
    selectBuild(build){
      this.set('chooseBuild',build);
    },
    //选择入院日期
    changeTryEndAction(date){
      //当前选择时间
      let stamp = this.get("dateService").timeStringToTimestamp(date);
      this.set("customerbusinessflowModel.experienceEndTime", stamp);
    },
    changeTryStartAction(date){
      //当前选择时间
      let stamp = this.get("dateService").timeStringToTimestamp(date);
      this.set("customerbusinessflowModel.experienceStartTime", stamp);
    },
    //选择试住办理日期
    changeTryAction(date){
      let stamp = this.get("dateService").timeStringToTimestamp(date);
      this.set("customerbusinessflowModel.experienceDate", stamp);
    },
    dpShowAction(){},

  }
});
