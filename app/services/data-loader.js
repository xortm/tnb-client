import Ember from 'ember';
import _ from 'lodash/lodash';

/*
 *  数据加载服务，一般用于首次连接，或者需要同步数据的时候
 */
export default Ember.Service.extend({
  store: Ember.inject.service('store'),
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
          menuList = _.sortBy(menuList,function(item){
            return item.get("order");
          });
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
    //然后同步添加
    // this.get("store").query("dicttype",{}).then(function (dicttypes) {
      this.get('store').query("common-init-constant",{filter:{type:_self.get('terminalType')}}).then(function(constants){
        let content = constants.get('firstObject');
      _self.set('dicttypes',content.get('dicttypes'));
      _self.set('dicttypestenant',content.get('dicttypeTenants'));
      _self.set('beds',content.get('beds'));
      _self.set('serviceFinishDefaultList',content.get('serviceFinishLevel'));
      _self.set('customerList',content.get('customers'));
      _self.set('employeeSelecter',content.get('employees'));
      _self.set('appraiseItemList',content.get('appraiseItems'));
      console.log("appraiseItemList:",content.get('appraiseItems'));
      _self.set('privileges',content.get('tenantPrivileges'));
      _self.set('allprivileges',content.get('privileges'));
      _self.set('sysconfig',content.get('sysConfig'));
      _self.set('staffcustomerList',content.get('staffCustomers'));
      _self.set('serviceLevelitemList',content.get('nursingLevelItems'));
      _self.set('serviceLevel',content.get('nursingLevels'));
      _self.set('confList',content.get('confs'));
        //获得服务器时间的同时，取得当前本地时间
        _self.set('firstLocalTime',Math.floor(new Date().getTime()/1000));
      let customerStatus = _self.findDict("customerStatusIn");
      if(callback){
        callback();
      }
    });
  },
  //同步远程的权限数据
  syncPrivilegeData: function () {
    console.log("do Privilege query");
    // var _self = this;
    // //然后同步添加
    // let filter = {"privilege---1":{'type@$or1---1':1},"privilege---2":{'type@$or1---2':3},"privilege---3":{'type@$or1---4':0}};
    // this.get("store").query("tenantprivilege",{filter:filter}).then(function (tenantprivileges) {
    //   var arr = new Ember.A();
    //   tenantprivileges.forEach(function(tenantprivilege){
    //     arr.pushObject(tenantprivilege.get("privilege"));
    //   });
    //   _self.set("privileges",arr);
    // });
  },
  //同步所有权限用于设置租户权限
  syncAllPrivilegeData: function () {
    // console.log("do all Privilege query");
    // var _self = this;
    // this.get("store").findAll("privilege").then(function (privileges) {
    //   _self.set("allprivileges",privileges);
    // });
  },
  //同步远程的配置数据
  syncConfigData: function () {
    console.log("do config query");
    var _self = this;


    // this.set("sysconfig",Ember.Object.create({sysTime:1480497048}));
    // this.get("store").findAll("sysconfig").then(function (sysconfig) {
    //   _self.set("sysconfig",sysconfig.get("firstObject"));


    // });

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
  // bedListObs: function(){
  //   let _self = this;
  //   if(this.get("bedRebuild")){
  //     return;
  //   }
  //   let bedList = this.get("allBedList");
  //   console.log("allBedList change,size:"+ bedList.get("length"));
  //   bedList.forEach(function(bed){
  //     //如果bed对应的room变为空的，或者对应的room的floor是空的，需要找回来
  //     if(!bed.get("room")||!bed.get("room.id")||!bed.get("room.floor")||!bed.get("room.floor.id")){
  //       let room = _self.get("allRoomList").findBy("id",bed.get("roomId"));
  //       console.log("room bed:" + bed.get("id") + " research and back,room:" + room.get("name") + " and floor:" + room.get("floor.name"));
  //       _self.set("bedRebuild",true);
  //       bed.set("room",room);
  //       _self.set("bedRebuild",false);
  //     }
  //   });
  // }.observes("allBedList.@each.room"),
  // roomListObs: function(){
  //   let _self = this;
  //   if(this.get("roomRebuild")){
  //     return;
  //   }
  //   let roomList = this.get("allRoomList");
  //   roomList.forEach(function(room){
  //     //如果room对应的floor变为空的，需要找回来
  //     if(!room.get("floor")||!room.get("floor.id")){
  //       let floor = _self.get("allFloorList").findBy("id",room.get("floorId"));
  //       console.log("room:" + room.get("id") + " research and back,floor:" + floor.get("name"));
  //       _self.set("roomRebuild",true);
  //       // room.set("floor",floor);
  //       _self.set("roomRebuild",false);
  //     }
  //   });
  // }.observes("allRoomList.@each.floor"),
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
