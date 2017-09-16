import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  queryParams: {
      customerId: {
          refreshModel: true
      },
      toTemplateFlag: {
          refreshModel: true
      },
  },
  model() {
    return {};
  },
  queryNursingplanitem(customerId){
    var controller = this.getCurrentController();
    // var customerId = controller.get("customerId");
    this.store.query('nursingplanitem',{filter:{customer:{id:customerId}}}).then(function(nursingplanList){
      controller.set('nursingplanList',nursingplanList);//所有任务计划模板
    });
  },
  setupController: function(controller,model){
    this._super(controller, model);
    let allBedList = this.get('global_dataLoader.allBedList');
    controller.set("allBedList",allBedList);//打开加载图片
    controller.set("showLoadingImg",true);//打开加载图片
    var customerId = controller.get("customerId");
    var toTemplateFlag = controller.get("toTemplateFlag");
    // var projectList = this.store.peekAll('nursingproject');
    this.store.query('nursingproject',{filter:{//入住试住 同nursingproject.hbs
      // 'customer---1':{customerStatus:{'typecode@$or1---1':'customerStatusIn'}},
      // 'customer---2':{customerStatus:{'typecode@$or1---2':'customerStatusTry'}}
    }}).then(function(projectList){
      controller.set('projectList',projectList);
      let customerList = new Ember.A();
      projectList.forEach(function(project){
        if(!customerList.findBy('id',project.get('customer.id'))){
          customerList.pushObject(project.get('customer'));
        }
      });
      customerList.forEach(function(customer){
        customer.set('namePinyin',customer.get("name"));
      });
      controller.set('customerList',customerList);
      customerList.forEach(function(item){
        if(item.get("id")==customerId){
          controller.set("customer",item);
          // App.lookup('controller:business.mainpage.plan-template').confirm();
          controller.confirm();
        }
      });
      controller.set('projectFlag',true);
    });
    // this.store.query('nursingprojectitem',{filter:{item:{countType:{typecode:'countTypeByTime'}}}}).then(function(itemList){
    //   controller.set('allServiceList',itemList);
    // });
    // this.queryNursingplanitem(customerId);
    // Ember.run.schedule("afterRender",this,function() {
    //   $($("#daySelect").children("div").get(0)).trigger("click");//第一个子元素点击
    // });
  }
});
