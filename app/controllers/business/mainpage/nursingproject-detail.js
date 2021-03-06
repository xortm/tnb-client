import Ember from 'ember';
import Changeset from 'ember-changeset';
import ProjectValidations from '../../../validations/project';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(ProjectValidations, {
    mainController: Ember.inject.controller('business.mainpage'),
    global_dataLoader: Ember.inject.service('data-loader'),
    constants: Constants,
    queryCondition: '',
    flags: 0,
    levelCheck: false,
    level:Ember.computed('projectInfo.@each.level','projectModel.@each.level','flags',function(){
      if(this.get('projectModel')){
        return this.get('projectModel.level');
      }else{
        return this.get('projectInfo.level');
      }
    }),
    //已选项目
    chooseService: Ember.computed('projectInfo.services', function() {
        let serviceList = this.get('projectInfo.services');
        let name = '';
        if (serviceList) {
            serviceList = serviceList.sortBy('id');
            serviceList.forEach(function(service) {
                name += service.get('item.name') + "，";
            });
            name = name.substring(0, name.length - 1);
            return name;
        } else {
            return '无';
        }
    }),
    allServiceList:Ember.computed('serviceList','planServices','planDone','hasServices','recommendServiceList','flags',function(){
        /*护理项目列表生成
          1、取得所有的护理项目
          2、取得已有的护理项目
          3、取得推荐的护理项目
          4、已有的护理项目，设置状态haschoosed
          5、推荐的护理项目，设置状态recommend
          6、生成最终的项目列表
        */
        //1、取得所有的护理项目
        let serviceList = this.get('serviceList');
        //2、取得已有的护理项目
        let hasServices = this.get('hasServices');
        //3、取得推荐的护理项目
        let recommendServiceList = this.get('recommendServiceList');
        //4、已安排护理计划的护理项目
        let planServices = this.get('planServices');
        //新建数组，最后承载项目列表
        let list = new Ember.A();
        let _self = this;
        if(!serviceList){
          return list;
        }
        //已有的护理项目，设置状态haschoosed
        serviceList.forEach(function(service){
          let hasIn = false;
          if(hasServices){
            hasServices.forEach(function(serv){
              if(service.get("id")==serv.get("item.id")){
                serv.set("hasChoosed",true);
                serv.set("recommend",false);
                serv.set("editService",true);
                serv.set('ent',service);
                if(serv.get('item.countType.typecode')=='countTypeByTime'){
                  serv.set('count',true);
                  serv.set('period',serv.get('period'));
                  serv.set('frequency',serv.get('frequency'));
                }
                list.pushObject(serv);
                hasIn = true;
              }
            });
          }
          if(!hasIn){
            let newObj = _self.store.createRecord('nursingprojectitem',{
              serviceId:service.get('id'),
              period:service.get('period'),
              frequency:service.get('frequency'),
              ent:service,
              item:service,
              hasChoosed:false,
              recommend:false
            });

            list.pushObject(newObj);
        }
      });
      //推荐的护理项目，设置状态recommend

        if(recommendServiceList){
        list.forEach(function(service) {
              recommendServiceList.forEach(function(serv) {
                      if (service.get("ent.id") == serv.get("item.id")) {
                          service.set('recommend', true);
                          if(_self.get('editMode')=='add'){
                          service.set('hasChoosed',true);
                        }
                      }
              });
            });
          }


      //护理计划已安排的项目，设置状态
      if(planServices){
        // list.forEach(function(service){
        //   planServices.forEach(function(serv){
        //
        //     if (service.get("id") == serv.get("id")) {
        //         service.set('hasPlan', true);
        //     }
        //   });
        // });
        planServices.forEach(function(serv){
          if(list.findBy('id',serv.get('id'))){
            list.findBy('id',serv.get('id')).set('hasPlan',true);
          }
        });
      }
      list.forEach(function(serv){
        if(serv.get('hasChoosed')){
          serv.set('hasPlan',true);
        }

        if(planServices){
          if(!planServices.findBy('id',serv.get('id'))){
            serv.set('hasPlan',false);
          }
        }
      });
      list = list.sortBy('hasChoosed','recommend').reverse();
      return list;
    }),
    projectModel: Ember.computed('projectInfo', function() {
        let model = this.get("projectInfo");
        if (!model) {
            return null;
        }
        return new Changeset(model, lookupValidator(ProjectValidations), ProjectValidations);
    }),
    editService: false,
    detailEdit: false,
    actions: {
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
        //选择护理等级
        selectLevel(level) {
            this.incrementProperty('flags');
            this.set('projectModel.level', level);
            this.set('projectInfo.level',level);
            let serviceLevelitemList = this.get('global_dataLoader.serviceLevelitemList');
            serviceLevelitemList = serviceLevelitemList.filter(function(service){
              return service.get('level.id') == level.get('id');
            });
            this.incrementProperty('flags');
            this.set('recommendServiceList',serviceLevelitemList);
        },
        //按问卷评级
        levelCheck() {
          if(this.get('detailEdit')){
            if (this.get('levelCheck')) {
                this.set('levelCheck', false);
            } else {
                this.set('levelCheck', true);
            }
          }

        },
        //选择问卷
        resultCheck(result){
          let _self = this;
          let resultList = this.get('resultList');
          if(this.get('detailEdit')){
            if(result.get('resultCheck')){
              result.set('resultCheck',false);
            }else{
              resultList.forEach(function(result){
                result.set('resultCheck',false);
              });
              result.set('resultCheck',true);
              this.set('projectModel.result',result);
              this.send('selectLevel',result.get('level'));
            }
          }

        },
        //选择项目
        chooseService(service) {
            let _self = this;
            let arr = this.get('projectModel.services');
            let serviceArr = new Ember.A();
            if (arr) {
                arr.forEach(function(service) {
                    serviceArr.pushObject(service);
                });
            }

            //寻找项目记录
            let findService = function(id) {
                let item;
                arr.forEach(function(service) {
                    if (service.get('item.id') == id) {
                        item = service;
                    }
                });
                return item;
            };
            if (service.hasChoosed) {
                //将已选项目变为未选状态
                service.set('hasChoosed', false);
                let serviceItem = findService(service.get('ent.id'));
                let serviceitem = this.get('allServiceList').findBy('ent.id',service.get('ent.id'));
                serviceitem.set('hasChoosed',false);
                serviceArr.removeObject(serviceItem);
            } else {

                //选择项目，并加入到项目数组
                let levelItem = this.store.createRecord('nursingprojectitem', {
                    serviceId: service.get('ent.id'),
                    project: _self.get('projectInfo'),
                    item: service.get('ent')
                });
                if (service.get('ent.countType.typecode') == 'countTypeByTime') {
                    service.set('count', true);
                }
                service.set('hasChoosed', true);
                serviceArr.pushObject(levelItem);
            }

        },
        //保存
        detailSaveClick() {
            let _self = this;
            let editMode = this.get('editMode');
            let projectModel = this.get('projectModel');
            let count = 0;
            let serviceArr = new Ember.A();
            //循环存储services的每一项，然后在存储整个servicelevel
            let allServiceList = this.get('allServiceList');
            allServiceList.forEach(function(newObj) {
                if (newObj.get('hasChoosed')) {
                    serviceArr.pushObject(newObj);
                }
                count++;
            });
            let hasServices = this.get('hasServices');

            if (count == allServiceList.get('length')) {
                  projectModel.set('services', serviceArr);
                  let delList = new Ember.A();
                  let str = '' ;
                  hasServices.forEach(function(serv){
                    if(!serviceArr.findBy('id',serv.get('id'))){
                      str += serv.get('id') + ',' ;
                      _self.set('delStr',str.substring(0,str.length-1));
                    }

                  });

                  projectModel.set('updateFlag',_self.get('delStr'));

                  projectModel.validate().then(function() {
                      if (projectModel.get('errors.length') === 0) {
                          App.lookup('controller:business.mainpage').openPopTip("正在保存");
                          if (editMode == 'add') {
                              projectModel.set('delStatus', 0);
                              projectModel.save().then(function() {
                                  _self.set('detailEdit', false);
                                  App.lookup('controller:business.mainpage').showPopTip("保存成功");
                                  let mainpageController = App.lookup('controller:business.mainpage');
                                  mainpageController.switchMainPage('nursingproject');
                              },function(err){
                                App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
                                let error = err.errors[0];
                                if(error.code ==='8'){
                                  App.lookup('controller:business.mainpage').showAlert("无法删除已安排护理计划的项目");
                                }
                              });
                          } else {
                              projectModel.save().then(function() {
                                  _self.incrementProperty('flags');
                                  App.lookup('controller:business.mainpage').showPopTip("保存成功");
                                  console.log('删除的项目：',_self.get('delStr'));
                                  _self.set('detailEdit', false);
                                  _self.set('levelCheck', false);
                                  let route = App.lookup('route:business.mainpage.nursingproject-detail');
                                  App.lookup('controller:business.mainpage').refreshPage(route); //刷新页面
                              },function(err){
                                App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
                                let error = err.errors[0];
                                if(error.code ==='8'){
                                  App.lookup('controller:business.mainpage').showAlert("无法删除已安排护理计划的项目");
                                }
                              });
                          }
                      } else {
                          projectModel.set("validFlag", Math.random());
                      }
                  });


            }
        },
        invalid() {},
        detailEditClick() {
            this.set('detailEdit', true);
            let serviceArray = new Ember.A();
            let projectInfo = this.get('projectInfo');
            let _self = this;
            //根据老人ID，取得老人最近批次问卷
            _self.store.query('evaluatebatch', {
                filter: {
                    customer: {
                        id: projectInfo.get('customer.id')
                    }
                }
            }).then(function(questionnaireList) {
                _self.set('questionnaireList', questionnaireList);
                if(questionnaireList.get('length')===0){_self.set('resultList','');}
                else{
                  let recentResult = _self.get('questionnaireList.lastObject');
                  _self.store.query('evaluateresult',{filter:{evaluateBatch:{id:recentResult.get('id')}}}).then(function(resultList){
                    _self.set('resultList',resultList);
                  });
                }
            });
            let serviceList = this.store.query('customerserviceitem', {}).then(function(services) {
                _self.set("serviceList", services);
            });
        }, //编辑按钮
        detailCancel: function() {
            let id = this.get('id');
            let editMode = this.get('editMode');
            if (id && editMode == 'edit') {
                // this.set('levelCheck', false);
                this.set('detailEdit', false);
                this.get('projectInfo').rollbackAttributes();
                let route = App.lookup('route:business.mainpage.room-detail');
                App.lookup('controller:business.mainpage').refreshPage(route); //刷新页面
            } else {
                let mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('nursingproject');
            }
        }, //取消按钮
        //删除按钮
        delById() {
            let _self = this;
            let projectInfo = this.get('projectInfo');
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此记录", function() {
                _self.send('cancelPassSubmit', _self.get('projectInfo'));
            });
        },
        //弹窗取消
        invitation() {
            this.set('showpopInvitePassModal', false);
        },
        close() {
            this.set('editService', false);
        },
        //删除记录
        cancelPassSubmit(projectInfo) {
            App.lookup('controller:business.mainpage').openPopTip("正在删除");
            this.set("showpopInvitePassModal", false);
            projectInfo.set("delStatus", 1);
            projectInfo.save().then(function() {
                App.lookup('controller:business.mainpage').showPopTip("删除成功");
                let mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('nursingproject');
            },function(err){
              App.lookup('controller:business.mainpage').showPopTip("删除失败",false);
              let error = err.errors[0];
              if(error.code==='8'){
                App.lookup('controller:business.mainpage').showAlert("已安排护理计划的方案无法删除！");
              }
            });
        }
    }
});
