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
    header_title: '护理方案信息',
    dateService: Ember.inject.service("date-service"),
    model() {
        return {};
    },
    global_dataLoader: Ember.inject.service('data-loader'),
    setupController(controller, model) {
        let _self = this;
        this._super(controller, model);
        let editMode = this.getCurrentController().get('editMode');
        let id = this.getCurrentController().get('id');
        let customerId = this.getCurrentController().get('customerId');
        let serviceArray = new Ember.A();
        let serviceList = this.store.query('customerserviceitem', {}).then(function(services) {
            _self.getCurrentController().set("serviceList", services);
        });
        this.store.query('nursinglevel', {}).then(function(levelList) {
            levelList.forEach(function(level) {
                level.set('namePinyin', level.get("name"));
            });
            controller.set('levelList', levelList);
        });
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
            _self.store.query('nursinglevelitem',{filter:{level:{id:projectInfo.get('level.id')}}}).then(function(services){
              controller.set('recommendServiceList',services);
            });

            // let weekIndex = _self.get("dateService").theWeek();//第几周
            // let year = new Date().getYear();//年
            // if(year<1000){
            //   year = year + 1900;
            // }
            // let weekTab = new Date().getDay();//周几
            // console.log('年、周、日',year,weekIndex,weekTab);
            // let filter ={item:{project:{id:id}},'yearTab@$gte':year};
            // filter = $.extend({}, filter, {'weekIndex@$gte@$or1':weekIndex});
            // // filter = $.extend({}, filter, {'weekIndex@$or2----1':weekIndex});
            // // filter = $.extend({}, filter, {'weekTab@$gte@$or2----2':weekTab});
            // // filter = $.extend({}, filter, {item:{id:728}});
            // //4、根据ID，查询该方案中的护理项目哪些已经被护理计划安排，planServices
            // _self.store.query('nursingplandetail',{filter}).then(function(services){
            //   let planServices = new Ember.A();
            //   services.forEach(function(service){
            //     if(!planServices.findBy('id',service.get('item.id'))){
            //       planServices.pushObject(service.get('item'));
            //     }
            //   });
            //   controller.set('planServices',planServices);
            //   controller.incrementProperty('planDone');
            // });
            //请求已安排护理计划的项目，即无法编辑的项目
            _self.get("global_ajaxCall").set("action","query_fromDetail");
            _self.store.query('nursingprojectitem',{filter:{cid:customerId}}).then(function(services){
              _self.get("global_ajaxCall").set("action",'');
              console.log('ajax请求action:',_self.get("global_ajaxCall.action"));
              controller.set('planServices',services);
              controller.incrementProperty('planDone');

            });

          });
        }else{
          controller.set('detailEdit',true);
          _self.store.findRecord('nursingproject',id).then(function(projectInfo){
            controller.set('projectInfo',projectInfo);
            controller.set('hasServices',null);
            controller.set('recommendServiceList',null);
          });
        }
        /*取得老人最近批次的评估问卷
        1、根据护理方案，找到所属老人，取得最近批次的问卷
        2、加工取得的问卷数组，生成问卷列表(问卷对应的护理等级)
        */
        this.store.findRecord('nursingproject',id).then(function(project){
            controller.set('levelCheck',false);
            _self.store.query('evaluateresult',{filter:{customer:{id:customerId}},sort:{'[evaluateBatch][id]':'desc'}}).then(function(resultList){
              let list = new Ember.A();
              if(resultList.get("length")===0){controller.set('resultList',"");}else {
                //问卷取最近批次
                let batch = resultList.get('firstObject').get('evaluateBatch.id');
                resultList.forEach(function(result){
                  if(result.get('id')==project.get('result.id')){
                    result.set('resultCheck',true);
                  }
                  // 取最近批次的问卷，放入列表
                    if(result.get('evaluateBatch.id')==batch){
                      list.pushObject(result);
                    }
                });
              controller.set('resultList',list);
              }
            });
        });
    }
});
