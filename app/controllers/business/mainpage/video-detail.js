import Ember from 'ember';
import Changeset from 'ember-changeset';
import CameraValidations from '../../../validations/camera';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(CameraValidations,{
  constants:Constants,//引入字典常量
  dataLoader: Ember.inject.service("data-loader"),
  count:false,
  deviceType:null,
  searchTypeName:true,
  service_notification:Ember.inject.service("notification"),
  testData:{
    'cameraId':1,
    'cameraStatus':0,
    'localStatus':true,
    'liveStatus':1,
    'audienceNum':3
  },
  init(){
    this._super(...arguments);
    let _self = this;
    Ember.run.schedule("afterRender",function() {
      _self.get("service_notification").registNoticePage(function(msgObj){
        if(msgObj.code=="1110"){
          _self.videoStatus(msgObj);

        }
      });
    });
  },
  videoStatus:function(data){
    let cameraData;
    if(data){
      cameraData = JSON.parse(data.content);
    }else{
      cameraData = this.get('testData');
    }
    let deviceList = this.get('deviceList');
    console.log(cameraData);
    console.log(deviceList);
    let device;
    if(!deviceList){
      return ;
    }
    deviceList.forEach(function(item){
      if(item.get('id')==cameraData.cameraId){
        device = item;
      }
    });
    device.set('status',cameraData.localStatus);//设备状态，1 已连接 ，0 未连接
    device.set('liveStatus',cameraData.liveStatus);//直播拉流状态：1 远程拉流已开启 0 未开启
    device.set('audienceNum',cameraData.audienceNum);//直播观看人数
    this.set('deviceList',deviceList);
  },
  chooseDate:Ember.computed('searchTypeName','searchTypeSeq','nameSearch','seqSearch',function(){
    let searchTypeName = this.get('searchTypeName');
    let searchTypeSeq = this.get('searchTypeSeq');
    let name = this.get('nameSearch');
    let seq = this.get('seqSearch');
    if(searchTypeSeq&&seq){
      return '设备序列号：' + seq ;
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
  //构造直播状态搜索下拉列表
  liveStatusList:Ember.computed(function(){
    //2种状态，可用，无法使用
    let list = new Ember.A();
    let item1 = Ember.Object.create({});
    item1.set('name','正在播放');
    item1.set('code',1);
    list.pushObject(item1);
    let item2 = Ember.Object.create({});
    item2.set('name','暂无播放');
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
            case 'video':
              item.set('typename','视频');
              item.set('code','04');
              item.set('typecode','video');
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
      return new Changeset(model, lookupValidator(CameraValidations), CameraValidations);
  }),
  mainController: Ember.inject.controller('business.mainpage'),
  editModel: null,
  defaultDevicetype:Ember.computed('deviceModel.type',function(){
    return this.get('deviceModel.type');
  }),
  actions:{
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
    //按序列号搜索
    searchSeq(){
      let _self = this;
      let code = this.get('codeSearch');
      let params = App.lookup('route:business.mainpage.video-detail').pagiParamsSet();
      let filter = {};
      if(this.get('deviceStatusSearch')){
        //如果已选设备状态
        filter = $.extend({}, filter, {deviceStatus:this.get('deviceStatusSearch.code')});
      }
      filter = $.extend({}, filter, {"code@$like":code});
      params.filter = filter;
      App.lookup('route:business.mainpage.video-detail').findPaged('camera',params,function(deviceList){
        App.lookup('route:business.mainpage.video-detail').setDeviceBind(deviceList);
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
    //选择设备状态
    deviceStatusSelect(deviceStatus){
      let _self = this;
      let name = this.get('nameSearch');
      this.set('deviceStatusSearch',deviceStatus);
      let params = App.lookup('route:business.mainpage.video-detail').pagiParamsSet();
      let code = this.get('defaultDevPro.typecode');
      let filter = {};//默认在对应方案下搜索
      //清空搜索条件
      if(this.get('liveStatusSearch')){//直播状态搜索
        filter = $.extend({}, filter, {liveStatus:this.get('liveStatusSearch.code')});
      }
      if(name&&name.length>0){
        filter = $.extend({}, filter, {queryType:'queryAll',queryData:name});
      }
      if(!deviceStatus){
        params.filter = filter;
        App.lookup('route:business.mainpage.video-detail').findPaged('camera',params,function(deviceList){
          App.lookup('route:business.mainpage.video-detail').setDeviceBind(deviceList);
        }).then(function(deviceList){
          _self.set('deviceList',deviceList);
        });
      }else{
        filter = $.extend({}, filter, {status:this.get('deviceStatusSearch.code')});
        params.filter = filter;
        App.lookup('route:business.mainpage.video-detail').findPaged('camera',params,function(deviceList){
          App.lookup('route:business.mainpage.video-detail').setDeviceBind(deviceList);
        }).then(function(deviceList){
          _self.set('deviceList',deviceList);
        });
      }
    },
    //直播状态搜索
    liveStatusSelect(liveStatus){
      let _self = this;
      let name = this.get('nameSearch');
      this.set('liveStatusSearch',liveStatus);
      let params = App.lookup('route:business.mainpage.video-detail').pagiParamsSet();
      let code = this.get('defaultDevPro.typecode');
      let filter = {};//默认在对应方案下搜索
      //清空搜索条件
      if(this.get('deviceStatusSearch')){//直播状态搜索
        filter = $.extend({}, filter, {status:this.get('deviceStatusSearch.code')});
      }
      if(name&&name.length>0){
        filter = $.extend({}, filter, {queryType:'queryAll',queryData:name});
      }
      if(!liveStatus){
        params.filter = filter;
        App.lookup('route:business.mainpage.video-detail').findPaged('camera',params,function(deviceList){
          App.lookup('route:business.mainpage.video-detail').setDeviceBind(deviceList);
        }).then(function(deviceList){
          _self.set('deviceList',deviceList);
        });
      }else{
        filter = $.extend({}, filter, {liveStatus:this.get('liveStatusSearch.code')});
        params.filter = filter;
        App.lookup('route:business.mainpage.video-detail').findPaged('camera',params,function(deviceList){
          App.lookup('route:business.mainpage.video-detail').setDeviceBind(deviceList);
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
      let params = App.lookup('route:business.mainpage.video-detail').pagiParamsSet();
      let filter = {};//当前方案下搜索
      if(this.get('deviceStatusSearch')){
        //如果已选设备状态
        filter = $.extend({}, filter, {deviceStatus:this.get('deviceStatusSearch.code')});
      }
      if(name&&name.length>0){
        filter = $.extend({}, filter, {queryType:'queryAll',queryData:name});
      }

      params.filter = filter;
      App.lookup('route:business.mainpage.video-detail').findPaged('camera',params,function(deviceList){
        App.lookup('route:business.mainpage.video-detail').setDeviceBind(deviceList);
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
    //设备解绑
    unBind(device){
      let _self = this;
      let deviceInfo = this.store.peekRecord('camera',device.get('id'));
      deviceInfo.set('operateFlag','removeBind');
      deviceInfo.save().then(function(){
        App.lookup('controller:business.mainpage').showPopTip("解绑成功");
        // switch (device.get('deviceType.typecode')) {
        //   case 'deviceTypeVideo'://video 视频
        //     _self.get('videoBindList').findBy('camera.id',device.get('id')).set('camera',null);
        //     break;
        // }
        var route=App.lookup('route:business.mainpage.video-detail');
        App.lookup('controller:business.mainpage').refreshPage(route);
        // App.lookup("route:business.mainpage.video-detail").doQuery('search');
      },function(err){
        console.log('设备解绑失败',err);
      });
    },
    //绑定设备
    bindUser(device){
      let _self = this;
      let deviceInfo = this.store.peekRecord('camera',device.get('id'));
      deviceInfo.set('operateFlag','bind');
      let id = device.get('bindInfo.id');
      let bindInfo;//需要绑定的信息字符串
      //判断不同的设备类型，构造不同的绑定信息
        if(device.get('isBindRoom')){
          bindInfo = 'roomId:' + id;
        }else if(device.get('isBindBed')){
          bindInfo = 'bedId:' + id;
        }
      deviceInfo.set('operateTarget',bindInfo);
      deviceInfo.save().then(function(){
        App.lookup('controller:business.mainpage').showPopTip('绑定成功');
        deviceInfo.set('operateFlag','');
        deviceInfo.set('operateTarget','');
        //重新请求数据刷新页面
        if(device.get('isVideo')){
          _self.store.query('devicebindmore',{}).then(function(videoBindList){
            _self.set('videoBindList',videoBindList);
            App.lookup("route:business.mainpage.video-detail").doQuery('search');
          });
        }
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
      let deviceInfo = this.store.createRecord('camera',{});
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
      let bindStatus = _self.get("dataLoader").findDict("bindStatus2");
      deviceModel.set('bindStatus',bindStatus);//设置设备的绑定状态，未绑定
      deviceModel.validate().then(function(){
        if(deviceModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          deviceModel.save().then(function(){
            App.lookup("route:business.mainpage.video-detail").doQuery('search');
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            _self.set('addDevicePop',false);
            _self.set('deviceType',null);
        },function(err){
          let error = err.errors[0];
          if(error.code==="4"){
            deviceModel.validate().then(function(){
              deviceModel.addError('code',['该序列号已被占用']);
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
      let deviceInfo = this.store.peekRecord('camera',device.get('id'));
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
            App.lookup("route:business.mainpage.video-detail").doQuery('search');
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            _self.set('addDevicePop',false);
            _self.set('deviceType',null);
        },function(err){
          let error = err.errors[0];
          if(error.code==="4"){
            deviceModel.validate().then(function(){
              deviceModel.addError('seq',['该序列号已被占用']);
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
    //开通直播
    startLive(device){
      device.set('operateFlag','startLive');
      device.save().then(function(){
        console.log('直播开通成功');
      },function(err){
        let error = err.errors[0];
        if(error.code === '0'){
          App.lookup('controller:business.mainpage').showAlert('开通失败');
        }
      });
    }
  }
});
