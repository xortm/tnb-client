import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
    queryParams: {
        id: {
            refreshModel: true
        },
        editMode: {
            refreshModel: true
        },
        customerFlag:{
          refreshModel:true
        },
        customerId:{
          refreshModel:true
        },
    },
    header_title: '套餐信息',
    model() {
        return {};
    },
    global_dataLoader: Ember.inject.service('data-loader'),
    setupController(controller, model) {
        let _self = this;
        this._super(controller, model);
        controller.set('haveClass',true);//设置class('jujiaservice')
        let editMode = this.getCurrentController().get('editMode');
        let id = this.getCurrentController().get('id');
        let customerId = this.getCurrentController().get('customerId');
        let serviceArray = new Ember.A();

        let serviceList = this.store.query('customerserviceitem', {}).then(function(services) {
            _self.getCurrentController().set("serviceList", services);
        });
        // this.store.query('nursinglevel', {}).then(function(levelList) {
        //     levelList.forEach(function(level) {
        //         level.set('namePinyin', level.get("name"));
        //     });
        //     controller.set('levelList', levelList);
        // });

        if(editMode=='edit'){
          if(this.get('customerFlag')){
            controller.set('nodetail',true);
          }
          controller.set('detailEdit',false);
          /*编辑已有护理方案流程
            1、根据ID，取得该护理方案，set到projectInfo
            2、根据得到的护理方案的信息，取得该护理方案对应的护理项目，set到hasServices
            3、根据得到的护理方案信息，取得该护理方案对应的护理等级，同时根据该护理等级，得到等级对应的护理项目，作为推荐项目
            4、根据ID，查询该方案中的护理项目哪些已经被护理计划安排，planServices
          */
          _self.store.findRecord('nursingproject',id).then(function(projectInfo){
            //1、根据ID，取得该护理方案，set到projectInfo
            controller.set('projectInfo',projectInfo);
            //2、根据得到的护理方案的信息，取得该护理方案对应的护理项目，set到hasServices
            _self.store.query('nursingprojectitem',{filter:{project:{id:id}}}).then(function(services){
              controller.set('hasServices',services);
            });
            //3、根据得到的护理方案信息，取得该护理方案对应的护理等级，同时根据该护理等级，得到等级对应的护理项目，作为推荐项目
            // _self.store.query('nursinglevelitem',{filter:{level:{id:projectInfo.get('level.id')}}}).then(function(services){
            //   controller.set('recommendServiceList',services);
            // });
            //4、根据ID，查询该方案中的护理项目哪些已经被护理计划安排，planServices
            // _self.store.query('nursingplandetail',{filter:{item:{project:{id:id}}}}).then(function(services){
            //   let planServices = new Ember.A();
            //   services.forEach(function(service){
            //     planServices.pushObject(service.get('item'));
            //   });
            //   controller.set('planServices',planServices);
            // });
          });
        }else{
          controller.set('detailEdit',true);
          _self.store.findRecord('nursingproject',id).then(function(projectInfo){
            controller.set('projectInfo',projectInfo);
            controller.set('hasServices',null);
          });
        }
    }
});
