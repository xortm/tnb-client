import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'设备列表',
  model:function(){
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={};
    if(curController){
      if(curController.get('devicetype')){
        filter = $.extend({},filter,{'[type][deviceName]':curController.get('devicetype.deviceName')});
      }
      if(curController.get('deviceStatus')){
        filter = $.extend({},filter,{'[status][typecode]':curController.get('deviceStatus.typecode')});
      }
      if (curController.get('queryCondition')) {
            filter = $.extend({}, filter, {'seq@$like':curController.get('queryCondition')});
          }
    }
    params.filter = filter;
    params.sort = {'seq':'asc'};
    return params;
  },
  doQuery:function(){
    let _self = this;
    var params=this.buildQueryParams();
    this.findPaged('device',params).then(function(deviceList){
      let filter = {};
      _self.store.query('customerdevice',{}).then(function(customerdeviceList){//把旧的数据delStatus变为0了
        deviceList.forEach(function(device){
          let customers = new Ember.A();
          let customerName = '';
          customerdeviceList.forEach(function(customerdevice){
            if(customerdevice.get('device.id')==device.get('id')){
              if(!customers.findBy('customer.id',customerdevice.get('customer.id'))){
                customerName = customerdevice.get('customer.name') + ',';
              }
            }
          });
          if(customerName){
            device.set('customerName',customerName.substring(0,customerName.length-1));
          }else{
            device.set('customerName','无');
          }
        });
      },function(err){
        console.log('老人设备表请求失败',err);
      });
      _self.getCurrentController().set("deviceList", deviceList);
    });
  },
  setupController: function(controller,model){
    var _self=this;
    // this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
    this.store.query('devicetype',{}).then(function(devicetypeList){
      devicetypeList.forEach(function(devicetype){
        devicetype.set('namePinyin',pinyinUtil.getFirstLetter(devicetype.get("deviceName")));
      });
      let list = new Ember.A();
      controller.set('devicetypeList',devicetypeList);
      devicetypeList.forEach(function(type){
        let item = Ember.Object.create({});
        switch(type.get('codeInfo')){
          case 'yitikang':
            item.set('code','01');
            item.set('imgUrl','assets/images/icon/physical.png');
            item.set('name','体检');
            item.set('class','physical-card');
            break;
          case 'daerma':
            item.set('code','03');
            item.set('imgUrl','assets/images/icon/mattress.png');
            item.set('name','床垫');
            item.set('class','mattress-card');
            break;
          case 'huami':
            item.set('code','02');
            item.set('imgUrl','assets/images/icon/call.png');
            item.set('name','呼叫');
            item.set('class','call-card');
            break;
        }
        if(!list.findBy('code',item.get('code'))){
          list.pushObject(item);
        }

        controller.set('typeList',list);
      });
    },function(err){
      console.log('方案列表请求失败',err);
    });
  }
});
