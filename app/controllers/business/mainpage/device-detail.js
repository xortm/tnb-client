import Ember from 'ember';
import Changeset from 'ember-changeset';
import DeviceValidations from '../../../validations/device';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(DeviceValidations,{
  constants:Constants,//引入字典常量
  dataLoader: Ember.inject.service("data-loader"),
  count:false,
  deviceType:null,
  searchTypeName:true,
  exportAll:true,
  chooseDate:Ember.computed('searchTypeName','searchTypeSeq','nameSearch','seqSearch',function(){
    let searchTypeName = this.get('searchTypeName');
    let searchTypeSeq = this.get('searchTypeSeq');
    let name = this.get('nameSearch');
    let seq = this.get('seqSearch');
    if(searchTypeSeq&&seq){
      return '设备编号：' + seq ;
    }
    if(searchTypeName&&name){
      return '绑定名称：' + name;
    }
    return '按条件搜索';
  }),
  //构造设备状态搜索下拉列表
  deviceStatusList:Ember.computed(function(){
    //2种状态，可用，无法使用
    let list = new Ember.A();
    let item1 = Ember.Object.create({});
    item1.set('name','可用');
    item1.set('code',1);
    list.pushObject(item1);
    let item2 = Ember.Object.create({});
    item2.set('name','无法使用');
    item2.set('code',0);
    list.pushObject(item2);
    return list;
  }),
  deviceProList:Ember.computed(function(){
    let list = new Ember.A();
    let deviceTypeList = this.store.peekAll('devicetype',{});
      deviceTypeList.forEach(function(deviceType){
          let item = Ember.Object.create({});
          switch (deviceType.get('codeInfo')) {
            case 'daerma':
              item.set('typename','床垫');
              item.set('code','03');
              item.set('typecode','daerma');
              break;
            case 'yitikang':
              item.set('typename','体检');
              item.set('code','01');
              item.set('typecode','yitikang');
              break;
            case 'huami':
              item.set('typename','呼叫');
              item.set('code','02');
              item.set('typecode','huami');
              break;
          }
          if(!list.findBy('code',item.get('code'))){
            list.pushObject(item);
          }

      });
      return list;
  }),
  defaultDevPro:Ember.computed('code','deviceProList',function(){
    let code = this.get('code');
    let deviceProList = this.get('deviceProList');
    if(!deviceProList){
      return null;
    }
    let defaultDevPro = deviceProList.findBy('code',code);
    return defaultDevPro;
  }),
  deviceModel: Ember.computed("deviceInfo", function() {
      let model = this.get("deviceInfo");
      if (!model) {
          return null;
      }
      return new Changeset(model, lookupValidator(DeviceValidations), DeviceValidations);
  }),
  mainController: Ember.inject.controller('business.mainpage'),
  editModel: null,
  defaultDevicetype:Ember.computed('deviceModel.type',function(){
    return this.get('deviceModel.type');
  }),
  actions:{
    exportToAllExcel(){
      let _self = this;
      let name = this.get('nameSearch');
      let filter = {
        type:{codeInfo:_self.get('defaultDevPro.typecode')}
      };
      let params = App.lookup("route:business.mainpage.device-detail").pagiParamsSet();
      if(this.get('deviceTypeSearch')){
        //如果已选设备类型
        filter = $.extend({}, filter, {deviceType:{typecode:this.get('deviceTypeSearch.item.typecode')}});
      }
      if(this.get('deviceStatusSearch')){
        //如果已选设备状态
        filter = $.extend({}, filter, {deviceStatus:this.get('deviceStatusSearch.code')});
      }
      if(name&&name.length>0){
        filter = $.extend({}, filter, {queryType:'queryAll',queryData:name});
      }
      params.filter = filter;
      App.lookup("route:business.mainpage.device-detail").set('perPage',9999);
      App.lookup("route:business.mainpage.device-detail").findPaged('device',params,function(deviceList){
        App.lookup("route:business.mainpage.device-detail").setDeviceBind(deviceList);
      }).then(function(deviceList){
          _self.set('exportList',deviceList);
          Ember.run.schedule('afterRender',function(){
            $(".export-block").tableExport({type:'excel',escape:'false'});
          });

      });
    },
    showDate(){
      this.set('dateShow',true);
    },
    hideDate(){
      this.set('dateShow',false);
    },
    //选择搜索条件
    selectSearchType(type){
      if(type=='name'){
        this.set('searchTypeName',true);
        this.set('searchTypeSeq',false);
      }
      if(type=="seq"){
        this.set('searchTypeName',false);
        this.set('searchTypeSeq',true);
      }
    },
    //按编号搜索
    searchSeq(){
      let _self = this;
      let seq = this.get('seqSearch');
      let params = App.lookup('route:business.mainpage.device-detail').pagiParamsSet();
      let code = this.get('defaultDevPro.typecode');
      let filter = {type:{codeInfo:code}};//当前方案下搜索
      if(this.get('deviceTypeSearch')){
        //如果已选设备类型
        filter = $.extend({}, filter, {deviceType:{typecode:this.get('deviceTypeSearch.item.typecode')}});
      }
      if(this.get('deviceStatusSearch')){
        //如果已选设备状态
        filter = $.extend({}, filter, {deviceStatus:this.get('deviceStatusSearch.code')});
      }
      filter = $.extend({}, filter, {"seq@$like":seq});
      params.filter = filter;
      App.lookup('route:business.mainpage.device-detail').findPaged('device',params,function(deviceList){
        App.lookup('route:business.mainpage.device-detail').setDeviceBind(deviceList);
      }).then(function(deviceList){
        _self.set('deviceList',deviceList);

      });
      this.set('dateShow',false);
    },
    invalid() {
        //alert("error");
    },
    //搜索
    //选择方案
    deviceProSelect(device){
        let code = device.get('code');
        //变换其他的方案，将其他的搜索条件置为空
        if(this.get('code')!==code){
          this.set('deviceTypeSearch',null);
          this.set('deviceStatusSearch',null);
          this.set('nameSearch',null);
        }

        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('device-management');
        mainpageController.switchMainPage('device-detail',{code:code});
    },
    //选择设备类型
    deviceTypeSearchSelect(device){
      let _self = this;
      this.set('deviceTypeSearch',device);
      let params = App.lookup('route:business.mainpage.device-detail').pagiParamsSet();
      let code = this.get('defaultDevPro.typecode');
      let filter = {type:{codeInfo:code}};//默认在对应方案下搜索
      let name = this.get('nameSearch');
      if(this.get('deviceStatusSearch')){
        filter = $.extend({}, filter, {deviceStatus:this.get('deviceStatusSearch.code')});
      }
      if(name&&name.length>0){
        filter = $.extend({}, filter, {queryType:'queryAll',queryData:name});
      }
      params.sort = {'bindStatus][typecode':'asc'};
      if(!device){
        params.filter = filter;
        App.lookup('route:business.mainpage.device-detail').findPaged('device',params,function(deviceList){
          App.lookup('route:business.mainpage.device-detail').setDeviceBind(deviceList);
        }).then(function(deviceList){
          _self.set('deviceList',deviceList);
        });
      }else{
        filter = $.extend({}, filter, {deviceType:{typecode:device.get('item.typecode')}});
        params.filter = filter;
        App.lookup('route:business.mainpage.device-detail').findPaged('device',params,function(deviceList){
          App.lookup('route:business.mainpage.device-detail').setDeviceBind(deviceList);
        }).then(function(deviceList){
          _self.set('deviceList',deviceList);
        });
      }

    },
    //选择设备状态
    deviceStatusSelect(deviceStatus){
      let _self = this;
      let name = this.get('nameSearch');
      this.set('deviceStatusSearch',deviceStatus);
      let params = App.lookup('route:business.mainpage.device-detail').pagiParamsSet();
      let code = this.get('defaultDevPro.typecode');
      let filter = {type:{codeInfo:code}};//默认在对应方案下搜索
      //清空搜索条件
      if(this.get('deviceTypeSearch')){
        filter = $.extend({}, filter, {deviceType:{typecode:this.get('deviceTypeSearch.item.typecode')}});
      }
      if(name&&name.length>0){
        filter = $.extend({}, filter, {queryType:'queryAll',queryData:name});
      }
      params.sort = {'bindStatus][typecode':'asc'};
      if(!deviceStatus){
        params.filter = filter;
        App.lookup('route:business.mainpage.device-detail').findPaged('device',params,function(deviceList){
          App.lookup('route:business.mainpage.device-detail').setDeviceBind(deviceList);
        }).then(function(deviceList){
          _self.set('deviceList',deviceList);
        });
      }else{
        filter = $.extend({}, filter, {deviceStatus:this.get('deviceStatusSearch.code')});
        params.filter = filter;
        App.lookup('route:business.mainpage.device-detail').findPaged('device',params,function(deviceList){
          App.lookup('route:business.mainpage.device-detail').setDeviceBind(deviceList);
        }).then(function(deviceList){
          _self.set('deviceList',deviceList);
        });
      }
    },
    //按名称搜索
    //搜索名称方法参数拼接
    search(){
      let _self = this;
      let name = this.get('nameSearch');
      let params = App.lookup('route:business.mainpage.device-detail').pagiParamsSet();
      let code = this.get('defaultDevPro.typecode');
      let filter = {type:{codeInfo:code}};//当前方案下搜索
      if(this.get('deviceTypeSearch')){
        //如果已选设备类型
        filter = $.extend({}, filter, {deviceType:{typecode:this.get('deviceTypeSearch.item.typecode')}});
      }
      if(this.get('deviceStatusSearch')){
        //如果已选设备状态
        filter = $.extend({}, filter, {deviceStatus:this.get('deviceStatusSearch.code')});
      }
      if(name&&name.length>0){
        filter = $.extend({}, filter, {queryType:'queryAll',queryData:name});
      }

      params.filter = filter;
      params.sort = {'bindStatus][typecode':'asc'};
      App.lookup('route:business.mainpage.device-detail').findPaged('device',params,function(deviceList){
        App.lookup('route:business.mainpage.device-detail').setDeviceBind(deviceList);
      }).then(function(deviceList){
        _self.set('deviceList',deviceList);
      });
      this.set('dateShow',false);
    },
    //删除设备
    delDevice(device){
      device.set('delStatus',1);
      device.save().then(function(){
          App.lookup("route:business.mainpage.device-detail").doQuery('search');
      },function(err){
        let error = err.errors[0];
        if(error.code==="8"){
            App.lookup('controller:business.mainpage').showAlert("设备已绑定，无法删除");
        }
      });
    },
    //按键复位
    reset(device){
      //按键复位，将使用状态设为可用，有绑定床位时，业务状态设为使用中，无绑定时设为空闲
      // device.set('deviceStatus',1);
      let status ;
      if(device.hasBind){
        status = this.get('dataLoader').findDict('deviceStatus2');
      }else{
        status = this.get('dataLoader').findDict('deviceStatus1');
      }
      device.set('operateFlag','reset');
      device.set('status',status);
      device.save().then(function(){
          App.lookup("route:business.mainpage.device-detail").doQuery('search');
      });
    },
    //设备解绑
    unBind(device){
      let _self = this;
      let deviceInfo = this.store.peekRecord('device',device.get('id'));
      deviceInfo.set('operateFlag','removeBind');
      deviceInfo.save().then(function(){
        switch (device.get('deviceType.typecode')) {
          case 'deviceType2'://scanner 扫描器，绑定房间
            if(_self.get('publicRooms').findBy('scanner.id',device.get('id'))){
              _self.get('publicRooms').findBy('scanner.id',device.get('id')).set('scanner',null);
            }else{
              _self.get('allRoomList').findBy('scanner.id',device.get('id')).set('scanner',null);
            }

            break;
          case 'deviceType3'://button 按键，绑定床位
              _self.get('allBedList').findBy('button.id',device.get('id')).set('button',null);
            break;
          case 'deviceType4'://Bracelet 手环，绑定员工
            if(device.get('bindType')=='护理员'){
              _self.get('employeeList').findBy('bracelet.id',device.get('id')).set('bracelet',null);
            }else{
              _self.get('customerList').findBy('device.id',device.get('id')).set('device',null);
            }

            break;
          case 'deviceType5'://Mattress 床垫，绑定床位
              _self.get('customerList').findBy('device.id',device.get('id')).set('device',null);
            break;
          case 'deviceType6'://card 卡，绑定老人
              _self.get('customerList').findBy('device.id',device.get('id')).set('device',null);
            break;
        }

        App.lookup("route:business.mainpage.device-detail").doQuery('search');
      },function(err){
        console.log('设备解绑失败',err);
      });
    },
    //绑定设备
    bindUser(device){
      let _self = this;
      let deviceInfo = this.store.peekRecord('device',device.get('id'));
      deviceInfo.set('operateFlag','bind');
      let id = device.get('bindInfo.id');
      let bindInfo;//需要绑定的信息字符串
      //判断不同的设备类型，构造不同的绑定信息
      if(device.get('isBindCustomer')){
        //老人绑定手环
        bindInfo = 'customer:' + id;
      }else{
        switch (device.get('deviceType.typecode')) {
          case 'deviceType2'://scanner 扫描器，绑定房间
            bindInfo = 'room:' + id;
            break;
          case 'deviceType3'://button 按键，绑定床位
            bindInfo = 'bed:' + id;
            break;
          case 'deviceType4'://Bracelet 手环，绑定员工
            bindInfo = 'employee:' + id;
            break;
          case 'deviceType5'://Mattress 床垫，绑定老人
            bindInfo = 'customer:' + id;
            break;
          case 'deviceType6'://card 卡，绑定老人
            bindInfo = 'customer:' + id;
            break;
        }
      }
      deviceInfo.set('operateTarget',bindInfo);
      deviceInfo.save().then(function(){
        deviceInfo.set('operateFlag','');
        deviceInfo.set('operateTarget','');
        //重新请求数据刷新页面
        _self.store.query('customerdevice',{}).then(function(customerList){
          _self.set('customerList',customerList);
          _self.store.query('employee',{}).then(function(employeeList){
            _self.set('employeeList',employeeList);
            //维护全局的roomlist和bedlist
            switch (device.get('deviceType.typecode')) {
              case 'deviceType2'://scanner 扫描器，绑定房间
                _self.get('dataLoader.allRoomList').findBy('id',id).set('scanner',deviceInfo);
                break;
              case 'deviceType3'://button 按键，绑定床位
                _self.get('dataLoader.allBedList').findBy('id',id).set('button',deviceInfo);
                break;
            }
            App.lookup("route:business.mainpage.device-detail").doQuery('search');
          });
        });
      },function(err){
        let error = err.errors[0];
        if(error.code === '13'){
          App.lookup('controller:business.mainpage').showAlert('当前对象已绑定过同类设备！');
        }
      });

    },
    //新增设备弹层
    toAddDevice(){
      this.set('addDevicePop',true);
      this.set('devicePopName','新增设备');
      let deviceInfo = this.store.createRecord('device',{});
      this.set('deviceInfo',deviceInfo);
      this.set('detailEdit',true);
    },
    cancel(){
      this.set('deviceType',null);
      this.set('addDevicePop',false);
    },
    //保存新增的设备
    addDevice(){
      let _self=this;
      let deviceModel=this.get('deviceModel');
      deviceModel.set('deviceStatus',1);//设置设备的可用状态，可用
      let bindStatus = _self.get("dataLoader").findDict("bindStatus2");
      deviceModel.set('bindStatus',bindStatus);//设置设备的绑定状态，未绑定
      let status = _self.get("dataLoader").findDict("deviceStatus1");
      deviceModel.set('status',status);//设置设备为空闲状态
      deviceModel.validate().then(function(){
        if(deviceModel.get('errors.length')===0){


          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          deviceModel.save().then(function(){
            App.lookup("route:business.mainpage.device-detail").doQuery('search');
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            _self.set('addDevicePop',false);
            _self.set('deviceType',null);
        },function(err){
          let error = err.errors[0];
          if(error.code==="4"){
            deviceModel.validate().then(function(){
              deviceModel.addError('seq',['该编号已被占用']);
              deviceModel.set("validFlag",Math.random());
              App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
            });
          }
        });
      }else{
        deviceModel.set("validFlag",Math.random());
      }
    });
    },
    //编辑设备弹层
    editDevice(device){
      this.set('addDevicePop',true);
      this.set('devicePopName','编辑设备');
      this.set('detailEdit',false);
      let deviceInfo = this.store.peekRecord('device',device.get('id'));
      this.set('deviceInfo',deviceInfo);
    },
    //保存编辑后的设备
    saveDevice(){
      let _self=this;
      let deviceModel=this.get('deviceModel');

      deviceModel.validate().then(function(){
        if(deviceModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          deviceModel.save().then(function(){
            App.lookup("route:business.mainpage.device-detail").doQuery('search');
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            _self.set('addDevicePop',false);
            _self.set('deviceType',null);
        },function(err){
          let error = err.errors[0];
          if(error.code==="4"){
            deviceModel.validate().then(function(){
              deviceModel.addError('seq',['该编号已被占用']);
              deviceModel.set("validFlag",Math.random());
              App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
            });
          }
          if(error.code==="13"){

              App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
              App.lookup('controller:business.mainpage').showAlert("保存失败");
          }
        });
      }else{
        deviceModel.set("validFlag",Math.random());
      }
    });
    },
    //选择设备类型
    deviceTypeSelect(deviceType){
      this.set('deviceModel.deviceType',deviceType.get('item'));//设置设备的硬件类型
      this.set('deviceType',deviceType);
      this.set('deviceModel.type',deviceType.get('type'));//设置设备的方案类型
    },
  }
});
