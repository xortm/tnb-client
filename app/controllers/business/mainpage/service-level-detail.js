import Ember from 'ember';
import Changeset from 'ember-changeset';
import ServiceLevelValidations from '../../../validations/serviceLevel';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(ServiceLevelValidations,{
  statusService: Ember.inject.service("current-status"),
  global_dataLoader: Ember.inject.service('data-loader'),
  constants: Constants,
  queryCondition:'',
  flags:0,
  //判断是否为基本租户
  isBaseTenant:Ember.computed('statusService',function(){
    let statusService = this.get('statusService');
    let tenantId = statusService.get('tenantId');
    if(tenantId == '111'){
      return true;
    }else{
      return false;
    }
  }),
  //判断是否属于规范类等级
  isStandardModel:Ember.computed('serviceLevelInfo',function(){
    let serviceLevelInfo = this.get('serviceLevelInfo');
    if(!serviceLevelInfo){return ;}
    let sourceRemark = serviceLevelInfo.get('modelSource.remark');
    if(!sourceRemark||sourceRemark == 'qita'){
      return false;
    }else{
      return true;
    }
  }),
  //已选项目列表
  chooseList:Ember.computed('hasServices',function(){
    return new Ember.A();
  }),
  //已选项目
  chooseService:Ember.computed('hasServices','flags',function(){
    let serviceList=this.get('hasServices');
    let name='';
    if(serviceList){
      serviceList=serviceList.sortBy('id');
      serviceList.forEach(function(service){
          name += service.get('item.name')+"，";
      });
      name=name.substring(0,name.length-1);
      return name;
    }else{
      return '无';
    }
  }),
  //所有项目
  allServiceList:Ember.computed('serviceList','hasServices','flags',function(){
    let _self = this;
    let allServiceList = new Ember.A();
    let serviceList=this.get('serviceList');
    let chooseList = this.get('chooseList');
    if(!serviceList){
      return allServiceList;
    }
    let services=this.get('hasServices');
    serviceList.forEach(function(service){
      let hasIn = false;
      if(services){
        services.forEach(function(serv){
          if(service.get("id")==serv.get("item.id")){
            serv.set("hasChoosed",true);
            serv.set("editService",true);
            serv.set('ent',service);
            if(serv.get('item.countType.typecode')=='countTypeByTime'){

              serv.set('count',true);
              serv.set('period',serv.get('period'));
              serv.set('frequency',serv.get('frequency'));
            }
            allServiceList.pushObject(serv);
            chooseList.pushObject(serv);
            hasIn = true;
          }
        });
      }
      if(!hasIn){
        let newObj = _self.store.createRecord('nursinglevelitem',{
          serviceId:service.get('id'),
          ent:service,
          item:service,
          hasChoosed:false,
        });
        allServiceList.pushObject(newObj);
      }
    });
    allServiceList = allServiceList.sortBy('hasChoosed').reverse();
    return allServiceList;
  }),
  serviceLevelModel:Ember.computed('serviceLevelInfo',function(){
    let model = this.get("serviceLevelInfo");
    if (!model) {
        return null;
    }

    return new Changeset(model, lookupValidator(ServiceLevelValidations), ServiceLevelValidations);
  }),
  editService:false,
  detailEdit:false,
  actions:{
    selectModelSource(modelSource){
      this.set('serviceLevelInfo.modelSource',modelSource);
    },
    cancel(){
      this.set('serviceInfo',false);
    },
    checkService(service){
      let _self = this;
      this.store.query('servicefinishlevel',{filter:{item:{id:service.get('ent.id')}}}).then(function(resultList){
          _self.set('curService',service.get('ent'));
          _self.set('curService.resultList',resultList);
          _self.store.query('servicemerch',{filter:{item:{id:service.get('ent.id')}}}).then(function(merchs){
            _self.set('curService.merchList',merchs);
            _self.set('serviceInfo',true);
          });
      });
    },
    levelSelect(level){
      this.set('serviceLevelInfo.selfCareLevel',level);
      this.set('serviceLevelModel.selfCareLevel',level);
      console.log('level:',level);
    },
    //选择项目
    chooseService(service){
      service = service.get('ent');
      let _self=this;
      let serviceArr = this.get('chooseList');
      let arr = this.get('hasServices');
      //寻找项目记录
      let findService = function(id){
        let item;
        if(arr){
          arr.forEach(function(service){
            if(service.get('item.id')==id){
              item=service;
            }
          });
          return item;
        }

      };
      if(service.get('hasChoosed')){
        //将已选项目变为未选状态
        service.set('hasChoosed',false);
        service.set('editService',false);
        let serviceItem = findService(service.get('ent.id'));
        serviceArr.removeObject(serviceItem);
      }else {
        //选择项目，并加入到项目数组
        let frequency ;
        if(service.get('ent.frequency')){
          frequency = service.get('ent.frequency');
        }else{
          frequency = service.get('frequency');
        }
        let levelItem=this.store.createRecord('nursinglevelitem',{
          serviceId:service.get('ent.id'),
          level:_self.get('serviceLevelInfo'),
          item:service.get('ent'),
          period:service.get('ent.period'),
          frequency:frequency
        });
        if(service.get('ent.countType.typecode')=='countTypeByTime'){
          service.set('count',true);
        }
        service.set('hasChoosed',true);
        service.set('editService',true);
        serviceArr.pushObject(levelItem);
      }
      this.set('chooseList',serviceArr);
    },
    //保存
    detailSaveClick(){
      let _self=this;
      let editMode=this.get('editMode');
      let serviceLevelModel=this.get('serviceLevelModel');
      console.log('等级列表：',_self.get('dataLader.serviceLevel'));
      let serviceArr = new Ember.A();
      let count = 0;
      let allServiceList = this.get('allServiceList');
      allServiceList.forEach(function(newObj){
        if(newObj.get('hasChoosed')){
          serviceArr.pushObject(newObj);
        }
        count++;
      });
      let list = new Ember.A();
      let selfCareLevel = this.get('serviceLevelModel.selfCareLevel');
      selfCareLevel.forEach(function(level){
        list.pushObject(level);
      });
      serviceLevelModel.set('selfCareLevel',list);
      if(count==allServiceList.get('length')){
        serviceLevelModel.set('services',serviceArr);
        serviceLevelModel.validate().then(function(){
          if(serviceLevelModel.get('errors.length')===0){
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            serviceLevelModel.save().then(function(level){
              App.lookup('controller:business.mainpage').showPopTip("保存成功");
              if(editMode=='add'){
                _self.set('detailEdit',false);

                _self.get('global_dataLoader.serviceLevel').pushObject(level);
                let mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('service-level-set');
              }else{
                _self.incrementProperty('flags');
                App.lookup('controller:business.mainpage').showPopTip("保存成功");
                _self.set('detailEdit',false);
                let route=App.lookup('route:business.mainpage.service-level-detail');
                App.lookup('controller:business.mainpage').refreshPage(route);//刷新页面
              }
            },function(err){
              let error = err.errors[0];
              if(error.code==="4"){
                serviceLevelModel.validate().then(function(){
                  serviceLevelModel.addError('name',['该名称已被占用']);
                  serviceLevelModel.set("validFlag",Math.random());
                  App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
                });
              }
            });
          }else{
            serviceLevelModel.set("validFlag",Math.random());
          }
        });
      }

    },
    invalid(){},
    detailEditClick:function(){
      this.set('detailEdit',true);
      let serviceLevelModel = this.get('serviceLevelModel');

    },//编辑按钮
    detailCancel:function(){
      let id=this.get('id');
      let editMode=this.get('editMode');
      if(id&&editMode=='edit'){
        this.set('detailEdit',false);
        this.get('serviceLevelInfo').rollbackAttributes();
        let route=App.lookup('route:business.mainpage.room-detail');
        App.lookup('controller:business.mainpage').refreshPage(route);//刷新页面
      }else{
        this.get('serviceLevelInfo').rollbackAttributes();
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('service-level-set');
      }
    },//取消按钮
    //删除按钮
    delById(){
      let _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此记录",function(){
        _self.send('cancelPassSubmit',_self.get('serviceLevelInfo'));
      });
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //删除记录
    cancelPassSubmit(serviceLevelInfo){

			this.set("showpopInvitePassModal",false);
      serviceLevelInfo.set("delStatus", 1);
      serviceLevelInfo.save().then(function() {
        App.lookup('controller:business.mainpage').openPopTip("正在删除");
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          let mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('service-level-set');
      },function(err){
        let error = err.errors[0];
        if(error.code==="8"){
            App.lookup('controller:business.mainpage').showAlert("等级已占用，无法删除");
        }
      });
    }
  }
});
