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
  },
  header_title:'护理计划信息',
  model(){
    return{};
  },

  setupController(controller, model){
    this._super(controller,model);
    var _self = this;
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('nursingplan',id).then(function(planInfo){
        controller.set('planInfo',planInfo);
        _self.store.query('nursingplanitem',{filter:{plan:{id:planInfo.get('id')}}}).then(function(service){
          controller.set('hasServices',service);
          console.log('services:',service);
        });
        _self.store.query('nursingproject',{filter:{customer:{id:planInfo.get('customer.id')}}}).then(function(plan){
          _self.store.query('nursingprojectitem',{filter:{project:{id:plan.get('firstObject.id')}}}).then(function(List){
            console.log('方案ID：',plan.get('firstObject.id'));
            controller.set('projectServices',List);
            Ember.run.schedule("afterRender",this,function() {
              //设置拖拽
              console.log("external-event",$.find("#event-box .external-event"));
              $.find("#event-box .external-event").forEach(function (target) {
                controller.initDrag($(target));
                console.log('target:',target);
              });
            });
          });
        });
      });
    }else{
      controller.set('detailEdit',true);
      this.store.findRecord('nursingplan',id).then(function(planInfo){
        controller.set('planInfo',planInfo);
        _self.store.query('nursingproject',{filter:{customer:{id:planInfo.get('customer.id')}}}).then(function(plan){
          _self.store.query('nursingprojectitem',{filter:{project:{id:plan.get('firstObject.id')}}}).then(function(List){
            controller.set('projectServices',List);
            Ember.run.schedule("afterRender",this,function() {
              //设置拖拽
              console.log("external-event",$.find("#event-box .external-event"));
              $.find("#event-box .external-event").forEach(function (target) {
                controller.initDrag($(target));
                console.log('target:',target);
              });
            });
          });
        });
        console.log('name:',planInfo.get('customer.name'));
      });

      Ember.run.schedule("afterRender",this,function() {
        //设置拖拽
        console.log("external-event",$.find("#event-box .external-event"));
        $.find("#event-box .external-event").forEach(function (target) {
          controller.initDrag($(target));
          console.log('target:',target);
        });
      });
    }
  }
});
