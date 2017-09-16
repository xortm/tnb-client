import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
export default BaseBusiness.extend(Pagination,{
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
      code: {
          refreshModel: true
      },
  },
  global_dataLoader: Ember.inject.service('data-loader'),
  detailEdit:true,
  header_title:'智能设备信息',
  //处理设备信息，放入绑定的老人，员工，房间
  setDeviceBind:function(deviceList){
    let customerList = this.getCurrentController().get('customerList');
    let employeeList = this.getCurrentController().get('employeeList');
    let allRoomList =this.getCurrentController().get('allRoomList');
    let allBedList = this.getCurrentController().get('allBedList');
    let publicRooms = this.getCurrentController().get('publicRooms');
    deviceList.forEach(function(device){
      if(publicRooms&&publicRooms.findBy('scanner.id',device.get('id'))){
        let room = publicRooms.findBy('scanner.id',device.get('id'));
        device.set('bindName',room.get('name'));
        room.set('bindPeople',false);
        let bindUser = '公共区域：' + room.get('name');
        device.set('bindUser',bindUser);
      }
      if(customerList.findBy('device.id',device.get('id'))){
        let customer = customerList.findBy('device.id',device.get('id'));
        device.set('bindType','老人');
        device.set('bindName',customer.get('customer.name'));
        device.set('bindPeople',true);
        let bindUser = '老人：' + customer.get('customer.name');
        device.set('bindUser',bindUser);
      }
      if(employeeList.findBy('bracelet.id',device.get('id'))){
        let employee = employeeList.findBy('bracelet.id',device.get('id'));
        device.set('bindType','护理员');
        device.set('bindName',employee.get('name'));
        device.set('bindPeople',true);
        let bindUser = '护理员：' + employee.get('name');
        device.set('bindUser',bindUser);
      }
      if(allRoomList&&allRoomList.findBy('scanner.id',device.get('id'))){
        let room = allRoomList.findBy('scanner.id',device.get('id'));
        device.set('bindName',room.get('allName'));
        device.set('bindPeople',false);
        let bindUser = '房间：' + room.get('allName');
        device.set('bindUser',bindUser);
      }
      if(allBedList&&allBedList.findBy('button.id',device.get('id'))){
        let bed = allBedList.findBy('button.id',device.get('id'));
        device.set('bindName',bed.get('allBedName'));
        device.set('bindPeople',false);
        let bindUser = '床位：' + bed.get('allBedName');
        device.set('bindUser',bindUser);
      }
      if(device.get('bindStatus.typecode')=='bindStatus2'){
        device.set('hasBind',false);
      }else if (device.get('bindStatus.typecode')=='bindStatus1'){
        device.set('hasBind',true);
      }
      device.set('unBindDevice',false);
      device.set('delDeviceMask',false);
      device.set('bindDeviceMask',false);
      device.set('resetMask',false);
      switch (device.get('deviceType.typecode')) {
        case 'deviceType2':
          device.set('isScanner',true);
          break;
        case 'deviceType3':
          device.set('isButton',true);
          break;
        case 'deviceType4':
          device.set('isBracelet',true);
          device.set('isBindCustomer',true);
          break;
        case 'deviceType5':
          device.set('isMattress',true);
          break;
        case 'deviceType6':
          device.set('isCard',true);
          break;
        default:
      }
    });
  },
  buildQueryParams:function(search){
    let params=this.pagiParamsSet();
    let curController = this.getCurrentController();
    let code = this.getCurrentController().get('code');
    let typecode;
    switch (code) {
      case code='01':
        typecode = "yitikang";
        break;
      case code='02':
        typecode = "huami";
        break;
      case code='03':
        typecode = "daerma";
        break;
    }
    let filter={type:{codeInfo:typecode}};
    if(curController&&search){
      if(curController.get('deviceTypeSearch')){
        //如果已选设备类型
        filter = $.extend({}, filter, {deviceType:{typecode:curController.get('deviceTypeSearch.item.typecode')}});
      }
      if(curController.get('deviceStatusSearch')){
        //如果已选设备状态
        filter = $.extend({}, filter, {deviceStatus:curController.get('deviceStatusSearch.code')});
      }
    }

    params.filter = filter;
    this.set('perPage',24);
    params.sort = {'bindStatus][typecode':'asc'};
    return params;
  },
  doQuery(search){
    let _self = this;
    let params=this.buildQueryParams(search);
    //取公共区域列表
    _self.store.query('room',{filter:{isPublicFlag:1}}).then(function(publicRooms){
      _self.getCurrentController().set('publicRooms',publicRooms);
      _self.findPaged('device',params,function(deviceList){

        _self.setDeviceBind(deviceList);
      }).then(function(deviceList){
        _self.getCurrentController().set('deviceList',deviceList);
        _self.getCurrentController().set('exportList',deviceList);
      },function(err){
        console.log('设备列表请求失败',err);
      });
    });

  },
  model(){
    return{};
  },
  setupController(controller, model){
    let _self = this;
    this._super(controller, model);
    let editMode=this.getCurrentController().get('editMode');
    let id=this.getCurrentController().get('id');
    let code = this.getCurrentController().get('code');
    let allRoomList =this.get('global_dataLoader').get('allRoomList');
    let allBedList = this.get('global_dataLoader').get('allBedList');
    controller.set('allRoomList',allRoomList);
    controller.set('allBedList',allBedList);
    controller.set('deviceList',null);
    let typecode;
    switch (code) {
      case '01':
        typecode = "yitikang";
        break;
      case '02':
        typecode = "huami";
        break;
      case '03':
        typecode = "daerma";
        break;
    }
    if(code){
      let deviceType;
      controller.set('newTem',true);
      this.store.query('customerdevice',{}).then(function(customerList){
        controller.set('customerList',customerList);
        _self.store.query('employee',{filter:{staffStatus:{typecode:'staffStatusIn'}}}).then(function(employeeList){
          controller.set('employeeList',employeeList);
          let allRoomList = _self.get('global_dataLoader.allRoomList');
          let allBedList = _self.get('global_dataLoader.allBedList');
          _self.doQuery();
          controller.set('deviceStatusSearch',null);
          controller.set('deviceTypeSearch',null);
        },function(err){
          console.log('员工列表请求失败',err);
        });
      });
      this.store.query('deviceTypeItem',{filter:{type:{codeInfo:typecode}}}).then(function(deviceTypeList){
        controller.set('deviceTypeList',deviceTypeList);
      });
      let filterCustomer;
      filterCustomer = $.extend({}, filterCustomer, {
          '[customerStatus][typecode@$like]@$or1---1': 'customerStatusIn'
      });
      filterCustomer = $.extend({}, filterCustomer, {
          '[customerStatus][typecode@$like]@$or1---2': 'customerStatusTry'
      });
      filterCustomer = $.extend({}, filterCustomer, {
          'addRemark@$not': 'directCreate'
      });
      this.store.query('customer',{filterCustomer}).then(function(customerList){
        controller.set('allCustomerList',customerList);
      });
    }
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('device',id).then(function(deviceInfo){
        controller.set('deviceInfo',deviceInfo);
      });
    }else{
      controller.set('deviceInfo',this.store.createRecord('device',{}));
      controller.set('detailEdit',true);
    }
    this.store.query('devicetype',{}).then(function(devicetypeList){
      devicetypeList.forEach(function(devicetype){
        devicetype.set('namePinyin',pinyinUtil.getFirstLetter(devicetype.get("deviceName")));
      });
      controller.set('devicetypeList',devicetypeList);
    });
  }
});
