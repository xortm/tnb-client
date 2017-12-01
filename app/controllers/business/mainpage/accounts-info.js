import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  mainController: Ember.inject.controller('business.mainpage'),

  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"accountsInfoContainer",
  accountsInfoFlag: 0,
  stopScroll: true,//阻止下拉刷新的所有操作

  queryFlagIn:function(){
    this.incrementProperty("accountsInfoFlag");
  },
  changeObs: function() {
    console.log("accountsInfoFlag in obs:",this.get("accountsInfoFlag"));
      var _self = this;
      _self._showLoading();
      let customer = this.get("global_curStatus").getCustomer();
      console.log("customer in public",customer);
      console.log("customer bedid in public",customer.get("bed.id"));
      console.log("customer bedid allBedName in public",customer.get("bed.allBedName"));
      if(!customer||!customer.get("id")){
        return;
      }
      var customerId = customer.get("id");
      _self.store.query('nursingproject',{}).then(function(nursingprojectList){
        nursingprojectList.forEach(function(proItem){
          if(customerId==proItem.get("customer.id")){
            customer.set("projectLevelName",proItem.get("level.name"));//给customer-detail 的护理等级字段用
          }
        });
        _self.set("customer",customer);
      });
      //查询老人对应的护理组人员
      _self.store.query('bednursegroup', {
          filter:{group:{'delStatus@$not':1}},
          bed:{'id':customer.get("bed.id")},
      }).then(function(bednursegroupList) {
        let bednursegroup = bednursegroupList.get("firstObject");
        console.log("bednursegroup:",bednursegroup);
        console.log("bednursegroup group:",bednursegroup.get("group"));
        console.log("bednursegroup group name:",bednursegroup.get("group.name"));
        console.log("bednursegroup group staffs:",bednursegroup.get("group.staffs"));
        customer.set('groupsName', bednursegroup.get("group.name"));
        _self.get('store').query('employeenursinggroup', {}).then(function(employeenursinggroupList) {
          console.log('employeenursinggroupList is',employeenursinggroupList);
          var realemployeenursinggroupList = new Ember.A();
          let filemployeenursinggroupList = employeenursinggroupList.filter(function(employeenursinggroup) {
              var a = employeenursinggroup.get('group.id');
              console.log('a is',a);
              var b = bednursegroup.get('group.id');
              console.log('b is',b);
              return a == b;
          });
          console.log('filemployeenursinggroupList is', filemployeenursinggroupList);
          filemployeenursinggroupList.forEach(function(employee) {
              realemployeenursinggroupList.pushObject(employee);
          });
          var str = '';
          if (realemployeenursinggroupList.get('length') <= 0) {
              customer.set('employeesName', '无');
          } else {
              realemployeenursinggroupList.forEach(function(realemployeenursinggroup) {
                  if (realemployeenursinggroup) {
                      str += realemployeenursinggroup.get('employee.name') + ',';
                  }
              });
              str = str.substring(0, str.length - 1);
              customer.set('employeesName', str);
          }
        });
        _self.hideAllLoading();
        _self.directInitScoll(true);
      });
      //老人对应设备
      //修改版(查所有的设备类型和设备表，分出对应的数组)
/*      this.get('store').query('devicetype', {}).then(function(devicetypeList) { //所有的设备类型表
          _self.get('store').query('device', {
              filter: {
                  '[status][typecode]': 'deviceStatus1',
                  'deviceStatus': 1
              }
          }).then(function(alldeviceList) { //所有的设备表
              _self.get('store').query('customerdevice', { //客户设备对照表
                  filter: {
                      '[customer][id]': customer.get("id")
                  }
              }).then(function(customerdeviceList) {
                //查询device-type-item(过滤需要显示的方案devicetype)
                _self.get('store').query('device-type-item',{
                  filter:{
                    '[item][typecode@$like]@$or1---1': 'deviceType6',
                    '[item][typecode@$like]@$or1---2': 'deviceType5',
                    '[item][typecode@$like]@$or1---3': 'deviceType4'
                  }
                }).then(function(deviceItemList){
                  let realDevicetypeList = new Ember.A();
                  let number = -1;
                  console.log("devicetypeList:",devicetypeList);
                  console.log("alldeviceList:",alldeviceList);
                  console.log("customerdeviceList:",customerdeviceList);
                  console.log("deviceItemList:",deviceItemList);
                  devicetypeList.forEach(function(devicetype) {
                      number = ++number;
                      //let devicetypeObj={};
                      let codeInfo = devicetype.get('codeInfo');
                      //获取客户设备对照表数组
                      let filCustomerdeviceList = customerdeviceList.filter(function(customerdevice) {
                          return customerdevice.get('device.type.codeInfo') == devicetype.get('codeInfo');
                      });
                      let computeDeviceObj = null;
                      let computeCustomerDeviceObj = null;
                      if (filCustomerdeviceList.get('firstObject.id')) {
                          computeDeviceObj = filCustomerdeviceList.get('firstObject.device');
                          console.log('设备编号',computeDeviceObj.get('seq'));
                          computeCustomerDeviceObj = filCustomerdeviceList.get('firstObject');
                      }
                      //获取设备表数组
                      let filDeviceList = alldeviceList.filter(function(device) {
                          return device.get('type.codeInfo') == devicetype.get('codeInfo');
                      });
                      //过滤租户没有选择的方案
                      let filDeviceItemList=deviceItemList.filter(function(deviceItem){
                        return deviceItem.get('type.codeInfo') == devicetype.get('codeInfo');
                      });
                      let isShow = false;
                      if(filDeviceItemList.get('length')){
                        isShow=true;
                      }
                      let obj = Ember.Object.extend({
                          deviceName: devicetype.get('deviceName'),
                          deviceList: filDeviceList,
                          deviceCode: devicetype.get('codeInfo'),
                          deviceObj: computeDeviceObj,
                          customerDeviceObj: computeCustomerDeviceObj,
                          number: number % 2,
                          isShow:isShow
                      });
                      realDevicetypeList.push(obj.create());
                  });
                  console.log('realDevicetypeList:', realDevicetypeList);
                  _self.set('realDevicetypeList', realDevicetypeList);
                  _self.hideAllLoading();
                  _self.directInitScoll(true);
                  });
              });
          });
      });*/
  }.observes("accountsInfoFlag").on('init'),


  actions:{

  },
});
