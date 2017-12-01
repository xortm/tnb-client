import Ember from 'ember';

/*
*  数据加载服务，一般用于首次连接，或者需要同步数据的时候
*/
export default Ember.Service.extend({
  store: Ember.inject.service('store'),
  global_curStatus: Ember.inject.service('current-status'),

  voiceList:[],
  //获取当前时间
  getNowTime: function () {
    let nowLocalTime = Math.floor(new Date().getTime()/1000);
    let sysTime = this.get('sysconfig.sysTime');
    console.log("sysTime:",sysTime);
    let firstLocalTime = this.get('firstLocalTime');
    let time = sysTime + (nowLocalTime - firstLocalTime);
    console.log("time in getNowTime:",time);
    return time;
  },
  statusService: Ember.inject.service("current-status"),
  terminalType:Ember.computed('statusService',function(){
    let curStatus = this.get('statusService');
    let type = 0;
    if(curStatus.get('isMobile')){
      type = 1;
    }
    if(curStatus.get('isConsumer')||curStatus.get('isJujia')){
      type = 2;
    }
    return type;
  }),
  init() {
    this._super(...arguments);
    var _self = this;
  },
  //加载首次连接的数据
  loadBaseData: function () {
    console.log("loadBaseData in");
    //初始化测试数据

  },
  getMobileMenu: function () {
    var _self = this;
    var menus = new Ember.A();
    return new Ember.RSVP.Promise(function (resolve, reject) {
      _self.get("store").query("tenantprivilege",{}).then(function(privileges){
        privileges.forEach(function(tprivilege){
          let privilege = tprivilege.get("privilege");
          console.log("privilege menu in",privilege);
          console.log("privilege isMobile:" + privilege.get("isMobile"));
          if(privilege.get("isMobile")===1&&!_self.get("statusService").get("isConsumer")){
            menus.pushObject(privilege);
          }
          //如果是公众号，返回公众号菜单
          if(privilege.get("isMobile")===2&&_self.get("statusService").get("isConsumer")){
            if(privilege.get("systemType")===2&&_self.get("statusService").get("isJujia")){
              menus.pushObject(privilege);
            }
            if(privilege.get("systemType")!==2&&!_self.get("statusService").get("isJujia")){
              menus.pushObject(privilege);
            }
          }
        });
        Ember.RSVP.all(menus).then(function (menuList) {
          menuList = menuList.sortBy("order");
          console.log("menuList get", menuList);
          resolve(menuList);
        });
      });
    });
  },

  //同步远程的字典数据
  syncDictData: function (callback) {
    console.log("do dict query");
    var _self = this;
    var params = {};
    var filter = {type:_self.get('terminalType')};
    if(_self.get('terminalType') == 2){
      filter = $.extend(filter, {
        groupCodes: "payType,foodTimeType"
      });
    }
    params.filter = filter;
    console.log("params in loader:",params);
    //然后同步添加
    this.get('store').query("common-init-constant",params).then(function(constants){
      let content = constants.get('firstObject');
      _self.set('dicttypes',content.get('dicttypes'));
      _self.set('dicttypestenant',content.get('dicttypeTenants'));
      _self.set('beds',content.get('beds'));
      _self.set('serviceFinishDefaultList',content.get('serviceFinishLevel'));
      _self.set('customerList',content.get('customers'));
      _self.set('employeeSelecter',content.get('employees'));
      _self.set('appraiseItemList',content.get('appraiseItems'));
      _self.set('privileges',content.get('tenantPrivileges'));
      _self.set('allprivileges',content.get('privileges'));
      _self.set('sysconfig',content.get('sysConfig'));
      _self.set('staffcustomer',content.get('staffCustomers'));
      _self.set('serviceLevelitemList',content.get('nursingLevelItems'));
      _self.set('confList',content.get('confs'));
      _self.set('staffList',content.get('employees'));
      // 获取多租户信息列表
      _self.set('tenantList',content.get('tenants'));
      console.log("tenantList in query:",content.get('tenants'));
      //护理等级列表
      let nursingLevelList = new Ember.A();
      content.get('nursingLevels').forEach(function(level){
        nursingLevelList.pushObject(level);
      });
      _self.set('serviceLevel',nursingLevelList);
      //租户规范列表
      _self.set('modelSourceList',content.get('tenantEvaModelSources'));
      let sourceList = content.get('tenantEvaModelSources');
      //判断当前用户能否自己添加护理等级和评估模版
      if(!sourceList.findBy('modelSource.remark','qita')){
        _self.set('couldAddModel',false);
      }else{
        _self.set('couldAddModel',true);
      }
      //获得服务器时间的同时，取得当前本地时间
      _self.set('firstLocalTime',Math.floor(new Date().getTime()/1000));
      let customerStatus = _self.findDict("customerStatusIn");
      // _self.get('store').query('employee',{filter:{staffStatus:{typecode:'staffStatusIn'}}}).then(function(staffList){
      //   _self.set('staffList',staffList);
      // });
      console.log('first load in data-loader for test');
      if(callback){
        callback();
      }
    });

  },
  //同步所有权限用于设置租户权限
  syncAllPrivilegeData: function () {
    console.log("do all Privilege query");
    var _self = this;
    this.get("store").findAll("privilege").then(function (privileges) {
      _self.set("allprivileges",privileges);
    });
  },
  //预置系统配置数据 通過code查询value数据
  findConf: function(code){
    let confList = this.get("confList");
    //此时可能还没有加载完毕，返回空
    if(!confList){
      return null;
    }
    let conf = confList.findBy("code",code);
    return conf.get("value");
  },
  //居家項目 通過customer查询user数据
  findStaff: function(customerId){
    let staffcustomerList = this.get("staffcustomerList");
    //此时可能还没有加载完毕，返回空
    if(!staffcustomerList){
      return null;
    }
    // console.log("staffcustomerList:",this.get("staffcustomerList"));
    return staffcustomerList.findBy("customer.id",customerId);
  },
  //查询某个字典数据 typecode
  findDict: function(typecode){
    let dicttypes = this.get("dicttypes");
    //此时可能还没有加载完毕，返回空
    if(!dicttypes){
      return null;
    }
    var dict = dicttypes.findBy("typecode",typecode);
    return dict;
  },
  //查询某个字典数组
  findDictList: function(typegroupCode){
    return this.get("dicttypes").filter(function(dicttype){
      return dicttype.get('typegroup.typegroupcode') == typegroupCode;
    });
  },
  //保存按钮禁止多次点击
  disableClick(){
    $("button").attr("disabled", true);
  },
  btnClick(){
    $("button").attr("disabled", false);
  },

  //数据预加载，使用promise的方式
  dataLoadPro(){
    let _self = this;
    /*预置数据处理,通过promise进行*/
    let promise = new Ember.RSVP.Promise(function(resolve/*, reject */){
      Ember.run.later(this,function(){
        //字典数据和配置数据
        _self.syncDictData(function(){
          //获得本租户的权限列表,pc端使用
          if(!_self.get("global_curStatus").get("isMobile")){
            // _self.syncPrivilegeData();
          }
          //获得所有权限，运营使用
          if(_self.get("global_curStatus.tenantId")==="111"){
            console.log("need all privileges");
            _self.syncAllPrivilegeData();
          }
          //为居家项目查找staffcustomer表
          if(_self.get("global_curStatus.isJujia")){
            _self.get('store').query("staffcustomer",{}).then(function(staffcustomerList){
              let Arr = new Ember.A();
              staffcustomerList.forEach(function(staffcustomer){
                Arr.pushObject(staffcustomer);
              });
              _self.set("staffcustomerList",Arr);
            });
          }
          if(_self.get("global_curStatus.isJujia")||_self.get("global_curStatus.isConsumer")){
            //通过user获得居家customerid
            let staffcustomer = _self.get("staffcustomer");
            console.log("staffcustomer in business:",staffcustomer);
            let curCustomer =  staffcustomer.get("firstObject");
            console.log("curCustomer in business:",curCustomer);
            _self.get("global_curStatus").setCustomer(curCustomer);
          }
          //房间床位相关
          _self.rebuildBuiding(function(){
            //当数据加载完毕后设置标志位供移动端使用
            console.log("commonInitHasCompleteFlag in business",_self.get("global_curStatus").get("commonInitHasCompleteFlag"));
            _self.get("global_curStatus").set("commonInitHasCompleteFlag",true);
            _self.get("global_curStatus").set("appHasCompleteFlag",true);
            resolve();
          });
        });
      },50);
    });
    return promise;
  },
  rebuildBuiding: function(callback){
    var _self = this;
    _self.set("roomRebuild",true);
    _self.set("floorRebuild",true);
    //默认导入所有床位信息
    //根据bed内的属性，逐级取得对应的楼宇楼层房间
    let beds = _self.get("beds");
    let roomList = beds.mapBy("room");
    if(!roomList){
      return ;
    }
    roomList.forEach(function(floor){
      console.log('room id ',floor.get('id'));
    });
    roomList = roomList.uniqBy("id");
    //单独记录楼层id以备后续改变时进行追述
    roomList.forEach(function(room){
      if(room.get('id')&&room.get('floor.id')){
        room.set("floorId",room.get("floor.id"));

      }else{
        console.log('errorRoom',room);
      }
    });
    console.log('rebuilding error block 1');
    _self.set("allRoomList",roomList);
    let floorList = roomList.mapBy("floor");
    if(!floorList){
      return ;
    }
    floorList.forEach(function(floor){
      console.log('floor id ',floor.get('id'));
    });
    floorList = floorList.uniqBy("id");
    _self.set("allFloorList",floorList);
    //单独记录楼宇id以备后续改变时进行追述
    floorList.forEach(function(floor){
      if(floor.get('id')&&floor.get('building.id')){
        floor.set("buildingId",floor.get("building.id"));
      }else{
        console.log('errorFloor',floor);
      }
    });
    console.log('rebuilding error block 2');

    let buildingList = floorList.mapBy("building");
    if(!buildingList){
      return ;
    }
    buildingList.forEach(function(floor){
      console.log('build id ',floor.get('id'));
    });
    buildingList = buildingList.uniqBy("id");
    _self.set("allBuildingList",buildingList);
    console.log('allBuildingList in dataLoader',buildingList);
    console.log('rebuilding error block 3');
    //把床位数组放入全局
    let bedList = new Ember.A();
    beds.forEach(function(bed){
      //生成冗余room编号，后续使用
      bed.set("roomId",bed.get("room.id"));
      bed.set('floorId',bed.get('room.floor.id'));
      bedList.pushObject(bed);
    });
    console.log('rebuilding error block 4');
    _self.set("allBedList",bedList);
    _self.set("roomRebuild",false);
    _self.set("floorRebuild",false);
    if(_self.get("global_curStatus").get("isMobile")){
      if(!_self.get("global_curStatus.isConsumer")){
        let customerList = _self.get("customerList");
        customerList.forEach(function(customer){
          let bedId = customer.belongsTo("bed").id();
          let bed = _self.get("allBedList").findBy("id",bedId);
          customer.set("bed",bed);
        });
        _self.set("customerSelecter",customerList);
        let customerListFilter = customerList.filterBy("listFilterRemark","OnSetting");
        console.log("customerListFilter:",customerListFilter);
        _self.set("customerSelecterFilter",customerListFilter);
        //预置服务老人对象
        if(_self.get("global_curStatus").get("serveCustomerId") != "all"){
          let customer = customerList.findBy("id",_self.get("global_curStatus").get("serveCustomerId"));
          _self.get("global_curStatus").set("serveCustomer",customer);
        }
        //从本地存储中取得选定的老人id,并放入全局变量
        let careChoice = localStorage.getItem(Constants.uickey_careChoice);
        if(careChoice&&careChoice==="service-care"){
          _self.get("global_curStatus").set("switchServiceFlag","service-care");
        }else {
          _self.get("global_curStatus").set("switchServiceFlag","service-nurse");
        }
        var serveCustomerId =localStorage.getItem("serveCustomerId");
        if(serveCustomerId){
          _self.get("global_curStatus").set("serveCustomerId",serveCustomerId);
        }else {
          _self.get("global_curStatus").set("serveCustomerId","nolocal");
        }
        if(_self.get("global_curStatus").get("serveCustomerId") == "nolocal"){
          if(callback){
            callback();
          }
          return;
        }
      }
    }
    if(callback){
      callback();
    }
    // });
  },

  floorListObs: function(){
    let _self = this;
    if(this.get("floorRebuild")){
      return;
    }
    let floorList = this.get("allFloorList");
    floorList.forEach(function(floor){
      //如果floor对应的building变为空的，需要找回来
      if(!floor.get("building")||!floor.get("building.id")){
        let building = _self.get("allBuildingList").findBy("id",floor.get("buildingId"));
        console.log("floor:" + floor.get("id") + " research and back,building:" + building.get("name"));
        _self.set("floorRebuild",true);
        floor.set("building",building);
        _self.set("floorRebuild",false);
      }
    });
  }.observes("allFloorList.@each.building")
});
