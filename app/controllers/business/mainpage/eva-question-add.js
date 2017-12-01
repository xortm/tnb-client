import Ember from 'ember';
import Changeset from 'ember-changeset';
import evaValidations from '../../../validations/eva';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Controller.extend(evaValidations, {
    constants: Constants,
    dateService: Ember.inject.service("date-service"),
    dataLader:Ember.inject.service('data-loader'),
    store: Ember.inject.service("store"),
    feedBus: Ember.inject.service("feed-bus"),
    showBed:false,
    showCus:true,
    //hasChoosed: "false",
    defaultBed: Ember.computed('evaluate.bed', function() {
        return this.get('evaluate.bed');
    }),
    evaObs: function() {
        var model = this.get("evaluate");
        console.log("model evaluate", model);
        if (!model) {
            return null;
        }
        var evaModel = new Changeset(model, lookupValidator(evaValidations), evaValidations);
        this.set("evaModel", evaModel);
    }.observes("evaluate"),
    actions: {
        invalid() {
            //alert("invalid");
        },
        selectBed(bed){
          var _self = this;
          this.get('evaluate').set('bed',bed);
          //通过条件bed查询customer
          if(bed){
            this.store.query('customer', {filter:{'[bed][id]':bed.get('id')}}).then(function(customerList) {
              var customerObj=customerList.get('firstObject');
               _self.set('evaModel.customer', customerObj);
               //this.set('chooseBed',customerObj.get('name'));
            });
          }else {
            _self.set('evaModel.customer', '');
          }
        },
        selectCustomer(customer) {
            this.get('evaModel').set("customer", customer);
        },
        nextClick() {
          var _self = this;
          var evaModel = this.get("evaModel");
            var mainpageController = App.lookup('controller:business.mainpage');
            //直接添加老人
            if(_self.get('addCus')){
              let newCustomer = _self.store.createRecord('customer',{});
              let customerStatus = _self.get('dataLader').findDict('customerStatusSubmit');
              newCustomer.set('customerStatus',customerStatus);
              newCustomer.set('phone',_self.get('customerNum'));
              newCustomer.set('name',_self.get('customerName'));
              newCustomer.set('addRemark','directCreate');
              newCustomer.save().then(function(customer){
                if(customer.get('name')){
                  _self.set('evaModel.customer',customer);
                }

                evaModel.validate().then(function() {
                  if (evaModel.get('errors.length') === 0){

                    //通过全局服务进行上下文传值
                    _self.get("feedBus").set("customerData", customer);
                    if(_self.get('modelSource.remark')=='beijing'){//如果选择固定规范，将该规范下所有模板统一组成问卷，直接进入问卷详情
                        let allModelList = _self.get('allModelList');
                        let list = new Ember.A();
                        //规范下的所有模板表，每种类型只取一个
                        // allModelList.filter(function(model){
                        //   return model.get('modelSource.remark') == 'beijing';
                        // });
                        allModelList.forEach(function(model){
                          if(model.get('modelSource.remark') == 'beijing'){
                            if(!list.findBy('modelType.code',model.get('modelType.code'))){
                              list.pushObject(model);
                            }
                          }
                        });
                        //模板数量不够时，弹出提示
                          if(list.get('length')<4){
                            App.lookup('controller:business.mainpage').showAlert('该规范类型模板数量不足，请将评估模板补充完整');
                          }else{
                            //新建批次，并保存
                            let batch = _self.store.createRecord('evaluatebatch', {});
                            //保存批次的模板列表
                            batch.set('customer',customer);
                            batch.set('remark',_self.get('modelSource.remark'));
                            batch.save().then(function(newBatch){
                              _self.set('feedBus.threadData',list);
                              mainpageController.switchMainPage('eva-detail', {
                                  editMode: "add",
                                  id: newBatch.get('id')
                              });
                            });
                          }

                    }else{//非固定规范，进入模板选择页面
                      _self.set('feedBus.evaCustomer',customer);
                      mainpageController.switchMainPage('eva-model-add', {
                          editMode: "add",
                          id: ""
                      });
                    }

                  }else {
                    evaModel.set("validFlag", Math.random());
                  }
                  });
              });
            }else{
              evaModel.validate().then(function() {
                if (evaModel.get('errors.length') === 0){

                  //通过全局服务进行上下文传值
                  _self.get("feedBus").set("customerData", _self.get('evaModel.customer'));
                  if(_self.get('modelSource.remark')=='beijing'){//如果选择固定规范，将该规范下所有模板统一组成问卷，直接进入问卷详情
                      let allModelList = _self.get('allModelList');
                      let list = new Ember.A();
                      //规范下的所有模板表，每种类型只取一个
                      // allModelList.filter(function(model){
                      //   return model.get('modelSource.remark') == 'beijing';
                      // });
                      allModelList.forEach(function(model){
                        if(model.get('modelSource.remark') == 'beijing'){
                          if(!list.findBy('modelType.code',model.get('modelType.code'))){
                            list.pushObject(model);
                          }
                        }
                      });
                      //模板数量不够时，弹出提示
                        if(list.get('length')<4){
                          App.lookup('controller:business.mainpage').showAlert('该规范类型模板数量不足，请将评估模板补充完整');
                        }else{
                          //新建批次，并保存
                          let batch = _self.store.createRecord('evaluatebatch', {});
                          batch.set('customer',evaModel.get('customer'));
                          batch.set('remark',_self.get('modelSource.remark'));
                          batch.save().then(function(newBatch){
                            mainpageController.switchMainPage('eva-detail', {
                                editMode: "add",
                                id: newBatch.get('id')
                            });
                          });
                        }

                  }else{//非固定规范，进入模板选择页面
                    _self.set('feedBus.evaCustomer',evaModel.get('customer'));
                    mainpageController.switchMainPage('eva-model-add', {
                        editMode: "add",
                        id: ""
                    });
                  }

                }else {
                  evaModel.set("validFlag", Math.random());
                }
                });
            }

        },
        selectBedShow(){
          this.set('showBed',true);
          this.set('showCus',false);
          this.set('addCus',false);
        },
        selectCus(){
          this.set('showBed',false);
          this.set('showCus',true);
          this.set('addCus',false);
        },
        addCus(){
          this.set('showBed',false);
          this.set('showCus',false);
          this.set('addCus',true);
        },
        selectModelSource(modelSource){
          this.set('modelSource',modelSource);

        },
    }
});
