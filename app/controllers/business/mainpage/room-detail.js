import Ember from 'ember';
import Changeset from 'ember-changeset';
import RoomValidations from '../../../validations/room';
import BedValidations from '../../../validations/bed';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(RoomValidations,{
  global_dataLoader: Ember.inject.service('data-loader'),
  constants:Constants,
  isToilet:Ember.computed('roomInfo.toilet',function(){
    let a = this.get('roomInfo.toilet');
    if(a){
      return true;
    }
  }),
  noToilet:Ember.computed('roomInfo.toilet',function(){
    let a = this.get('roomInfo.toilet');
    if(!a){
      return true;
    }
  }),
  isBalcony:Ember.computed('roomInfo.balcony',function(){
    let a = this.get('roomInfo.balcony');
    if(a){
      return true;
    }
  }),
  noBalcony:Ember.computed('roomInfo.balcony',function(){
    let a = this.get('roomInfo.balcony');
    if(!a){
      return true;
    }
  }),
  addModel:false,
  //默认楼层
  defaultFloor:Ember.computed('roomInfo.floor',function(){
    return this.get('roomInfo.floor');
  }),
  defaultBuilding:Ember.computed('roomInfo.build',function(){
    if(this.get('roomInfo.build')){
      return this.get('roomInfo.build');
    }else{
      return this.get('roomInfo.floor.building');
    }
  }),
  delBedList:Ember.computed(function(){
    return new Ember.A();
  }),
  numList:Ember.computed(function(){
    let list = new Ember.A();
    for(let i=1;i<=5;i++){
      let item = Ember.Object.create({});
      item.set("seq",i);
      list.pushObject(item);
    }
    return list;

  }),
  roomModel:Ember.computed("roomInfo",function(){
    var model = this.get("roomInfo");
    if (!model) {
      return null;
    }
    return new Changeset(model, lookupValidator(RoomValidations), RoomValidations);
  }),
  //床位名称验证
  bedNameValidate(bed){
    let bedName = bed.get('name');
    if(!bedName||bedName.length===0){
      App.lookup('controller:business.mainpage').showAlert("床位名称不能为空");
      this.send("detailEditClick");
      return false;
    }else{
    }
    return true;
  },
  //床位价格验证
  bedPriceValidate(bed){
    let bedPrice = bed.get('price');
    if(!bedPrice||bedPrice.length===0){
      App.lookup('controller:business.mainpage').showAlert("床位价格不能为空");
      this.send("detailEditClick");
      return false;
    }
    return true;
  },
  //本地床位数据同步
  bedDataAdjust:function(callback){
    let _self = this;
    let busi = App.lookup("route:business");
    //通过刷新数据来同步
    busi.rebuildBuiding(function(){
      callback();
    });
  },
  actions:{
    invalid() {
      //alert("error");
    },
    selectNum(num){
      let bedList = new Ember.A();
      for(let i=0;i<num.seq;i++){
        let bedInfo = Ember.Object.create({});
        bedList.pushObject(bedInfo);
      }
      this.set('num',num);
      this.set('bedList',bedList);
    },
    //编辑按钮
    detailEditClick:function(){
      this.set('detailEdit',true);
    },
    //选择卫生间
    toiletChange(value){
      if(value=='是'){
        this.set('roomInfo.toilet',true);
      }
      if(value=='否'){
        this.set('roomInfo.toilet',null);
      }
    },
    //选择阳台
    balconyChange(value){
      if(value=='是'){
        this.set('roomInfo.balcony',true);
      }
      if(value=='否'){
        this.set('roomInfo.balcony',null);
      }
    },
    //华米扫描器
    selectScanner(scanner){
      console.log('scanner',scanner.get('seq'));
      this.set('roomInfo.scanner',scanner);
    },
    //取消按钮
    detailCancel:function(){
      var id=this.get('id');
      var editMode=this.get('editMode');
      if(id&&editMode=='edit'){
        this.set('detailEdit',false);
        var route=App.lookup('route:business.mainpage.room-detail');
        route.refresh();//刷新页面
      }else{
        this.set('roomInfo.floor','');
        this.set('detailEdit',false);
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('room-management');
      }
    },
    //保存房间
    saveRoom(){
      let roomInfo = this.get('roomInfo');
      let roomModel = this.get('roomModel');
      let roomArr = {};
      let room = {};
      let bedList = this.get('bedList');
      let beds = [];
      let minName = this.get('roomModel.name');
      let maxName = this.get('roomModel.maxName');
      //房间信息

      room.remark = roomInfo.get("remark")||'无';//备注
      room.area = roomInfo.get("area")||0;//面积
      room.roomType = 0;//房间类型
      room.orientation = roomModel.get("orientation.id")||0;//房间朝向
      room.build = roomInfo.get('build.id')?roomInfo.get('build.id'):roomInfo.get('floor.building.id');//所属楼宇
      room.floor = roomInfo.get('floor.id')||0;//所属楼层
      room.toilet = roomInfo.get('toilet')||false;//是否独立卫生间
      room.balcony = roomInfo.get('balcony')||false;//是否有阳台
      if(this.get('num')||this.get('bedList')){
        room.bedNum = this.get('num.seq')?this.get('num.seq'):bedList.get('length');//床位数量
      }

      //床位信息
      console.log('bedList isisisisiis',bedList);
      if(bedList){
        for(let i=0;i<bedList.get('length');i++){
          beds[i] = {};
          beds[i].name = bedList.objectAt(i).get('name');
          beds[i].bedType = bedList.objectAt(i).get('bedType.id')||0;
          console.log('bedList.objectAt(i):bedType',bedList.objectAt(i).get('bedType'));
          beds[i].price = bedList.objectAt(i).get('price');
          beds[i].remark = bedList.objectAt(i).get('remark');
          beds[i].delFlag = 0;
          beds[i].button = bedList.objectAt(i).get('button.id')||'0';//绑定按键
          console.log('bedList.objectAt(i):button',bedList.objectAt(i).get('button'));
        }
        if(bedList.get('length')==1){
          room.roomType = 'roomTypeSingle';
        }
        if(bedList.get('length')==2){
          room.roomType = 'roomTypeDouble';
        }
        if(bedList.get('length')==3){
          room.roomType = 'roomTypeThree';
        }
        if(bedList.get('length')==4){
          room.roomType = 'roomTypeFour';
        }
        if(bedList.get('length')>4){
          room.roomType = 'roomTypeSpecial';
        }
        if(bedList.get('length')===0){
          room.roomType = '0';
        }
      }

      //需要保存的roomArr
      roomArr.flag = 'add';
      roomArr.minSeq = minName;
      if(maxName){
        roomArr.maxSeq = maxName;
      }else{
        roomArr.maxSeq = minName;
      }

      roomArr.room = room;
      roomArr.beds = beds;
      if(maxName<minName){
        roomModel.addError('maxName',['房间的最大编号必须大于最小编号']);
      }

      //将房间和床位信息保存为json
      let roomJson = JSON.stringify(roomArr);
      let roomJsonModel = this.store.createRecord('jsonmodel',{});
      roomJsonModel.set('jsonData',roomJson);
      roomJsonModel.set('type','roombeds');
      roomModel.set('build',this.get('defaultBuilding'));

      var _self=this;
      var editMode=this.get('editMode');
      roomModel.validate().then(function(){
        if(roomModel.get('errors.length')===0){
          //床位信息验证
          if(beds.get('length')){
            let count = 0;
            bedList.forEach(function(bed){
              if(_self.bedNameValidate(bed)&&_self.bedPriceValidate(bed)){
                count++;
              }
            });
            if(count == beds.get('length')){

              App.lookup('controller:business.mainpage').openPopTip("正在保存");
              roomModel.set('isPublicFlag',0);
              roomJsonModel.save().then(function(){
                var mainpageController = App.lookup('controller:business.mainpage');
                _self.store.unloadAll('room');

                _self.store.query('bed',{}).then(function(list){
                  _self.set('global_dataLoader.beds',list);
                  _self.bedDataAdjust(function(){
                    mainpageController.switchMainPage('room-management');
                    App.lookup('controller:business.mainpage').showPopTip("保存成功");
                  });
                });
              },function(err){
                App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
                let code = err.errors[0].code;
                let startStr = code.substring(0,3);
                if(startStr == '14-'){
                  let num = code.substring(3,code.length);
                  let str = num + '号设备已绑定' ;
                  App.lookup('controller:business.mainpage').showAlert(str);
                }
              });
            }
          }else{
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            roomModel.set('isPublicFlag',0);
            roomJsonModel.save().then(function(){
              _self.store.unloadAll('room');
              App.lookup('controller:business.mainpage').showPopTip("保存成功");
              var mainpageController = App.lookup('controller:business.mainpage');
              _self.store.query('bed',{}).then(function(list){
                _self.set('global_dataLoader.beds',list);
                _self.bedDataAdjust(function(){
                  mainpageController.switchMainPage('room-management');
                });
              });


            },function(err){
              App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
              let code = err.errors[0].code;
              let startStr = code.substring(0,3);
              if(startStr == '14-'){
                let num = code.substring(3,code.length);
                let str = num + '号设备已绑定' ;
                App.lookup('controller:business.mainpage').showAlert(str);
              }
            });
          }
        }else{
          roomModel.set("validFlag",Math.random());
        }
      });
    },
    //删除按钮
    delById : function(room) {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此房间记录",function(){
        _self.send('cancelPassSubmit',_self.get('roomInfo'));
      });
    },
    //选择楼层
    selectFloor(floor) {
      this.set('roomInfo.floor', floor);
      this.set('roomModel.floor',floor);
    },
    //选择楼宇
    selectBuilding(building) {
      this.set('roomInfo.build',building);
      this.set('roomModel.build',building);

      this.set('roomInfo.floor', null);
      this.set('roomModel.floor',null);

      let _self=this;
      this.store.query('floor',{filter:{'[building][id]':building.get('id')}}).then(function(floorList){
        floorList.forEach(function(floor){
          floor.set('namePinyin',pinyinUtil.getFirstLetter(floor.get("name")));
        });
        _self.set('floorList',floorList);
      });
    },
    //选择房间类型
    roomSelect(roomType){
      this.set('roomInfo.roomType',roomType);
      this.set('roomModel.roomType',roomType);
    },
    //选择房间朝向
    orientationSelect(orientation){
      this.set('roomInfo.orientation',orientation);
      this.set('roomModel.orientation',orientation);
    },
    //新增床位
    addBed(bedList){
      let list = new Ember.A();
      if(bedList){
        bedList.forEach(function(bed){
          list.pushObject(bed);
        });
      }
      if(bedList.get('length')<10){
        let newBed = this.store.createRecord('bed',{});
        list.pushObject(newBed);
        this.set('bedList',list);
      }else{
        App.lookup('controller:business.mainpage').showAlert("最多只可有10个床位！");
      }

    },
    delBed(bed){
      let list = new Ember.A();
      let bedList = this.get('bedList');
      bedList.forEach(function(bed){
        list.pushObject(bed);
      });
      let delBedList = this.get('delBedList');
      if(bed.get('id')){
        delBedList.pushObject(bed);
      }
      console.log('要删除的床位：',delBedList.get('length'));
      list.removeObject(bed);
      this.set('bedList',list);
    },
    //修改房间保存
    editRoom(){
      let _self = this;
      let bedList = this.get('bedList');
      let delBedList = this.get('delBedList');
      let bedArr = new Ember.A();
      let roomInfo = this.get('roomInfo');
      let roomModel = this.get('roomModel');
      let roomArr = {};
      let room = {};
      let beds = [];
      let delBeds = [];
      let minName = this.get('roomModel.name');
      let maxName = this.get('roomModel.maxName');
      //房间信息

      room.roomId = roomInfo.get('id');
      room.delFlag = 0;
      room.remark = roomInfo.get("remark")||'无';//备注
      room.area = roomInfo.get("area")||0;//面积
      room.roomType = 0;//房间类型
      room.orientation = roomModel.get("orientation.id")||0;//房间朝向
      room.build = roomInfo.get('build.id')?roomInfo.get('build.id'):roomInfo.get('floor.building.id');//所属楼宇
      room.floor = roomInfo.get('floor.id')||0;//所属楼层
      room.toilet = roomInfo.get('toilet')||false;//是否独立卫生间
      room.balcony = roomInfo.get('balcony')||false;//是否有阳台
      room.scanner = roomInfo.get('scanner.id')||'0';//绑定扫描器
      if(this.get('num')||this.get('bedList')){
        room.bedNum = this.get('num.seq')?this.get('num.seq'):bedList.get('length');//床位数量
      }
      //床位信息
      if(bedList){
        for(let i=0;i<bedList.get('length');i++){
          beds[i] = {};
          if(bedList.objectAt(i).get('id')){
            beds[i].bedId = bedList.objectAt(i).get('id');
          }

          beds[i].name = bedList.objectAt(i).get('name');
          beds[i].bedType = bedList.objectAt(i).get('bedType.id')||0;
          beds[i].price = bedList.objectAt(i).get('price');
          beds[i].remark = bedList.objectAt(i).get('remark');
          beds[i].delFlag = 0;
          beds[i].button = bedList.objectAt(i).get('button.id')||'0';//绑定按键
        }
        if(bedList.get('length')==1){
          room.roomType = 'roomTypeSingle';
        }
        if(bedList.get('length')==2){
          room.roomType = 'roomTypeDouble';
        }
        if(bedList.get('length')==3){
          room.roomType = 'roomTypeThree';
        }
        if(bedList.get('length')==4){
          room.roomType = 'roomTypeFour';
        }
        if(bedList.get('length')>4){
          room.roomType = 'roomTypeSpecial';
        }
        if(bedList.get('length')===0){
          room.roomType = '0';
        }
      }
      if(delBedList){
        for(let i=0;i<delBedList.get('length');i++){
          delBeds[i] = {};
          delBeds[i].bedId = delBedList.objectAt(i).get('id');
          delBeds[i].name = delBedList.objectAt(i).get('name');
          delBeds[i].bedType = delBedList.objectAt(i).get('bedType.id')||0;
          delBeds[i].price = delBedList.objectAt(i).get('price');
          delBeds[i].remark = delBedList.objectAt(i).get('remark');
          delBeds[i].delFlag = 1;
        }
        beds = beds.concat(delBeds);
      }
      //需要保存的roomArr
      roomArr.flag = 'edit';
      roomArr.minSeq = minName;
      if(maxName){
        roomArr.maxSeq = maxName;
      }else{
        roomArr.maxSeq = minName;
      }

      roomArr.room = room;
      roomArr.beds = beds;
      if(maxName<minName){
        roomModel.addError('maxName',['房间的最大编号必须大于最小编号']);
      }

      //将房间和床位信息保存为json
      let roomJson = JSON.stringify(roomArr);
      let roomJsonModel = this.store.createRecord('jsonmodel',{});
      roomJsonModel.set('jsonData',roomJson);
      roomJsonModel.set('type','roombeds');
      roomModel.set('build',this.get('defaultBuilding'));
      console.log('jsonData:',roomJson);
      var editMode=this.get('editMode');
      roomModel.validate().then(function(){

        if(roomModel.get('errors.length')===0){

          //床位信息验证
          if(beds.get('length')){
            let count = 0;
            bedList.forEach(function(bed){
              if(_self.bedNameValidate(bed)&&_self.bedPriceValidate(bed)){
                count = count+1;
              }
            });
            count = count + delBedList.get('length');
            if(count == beds.get('length')){
              App.lookup('controller:business.mainpage').openPopTip("正在保存");
              roomModel.set('isPublicFlag',0);
              roomJsonModel.save().then(function(){

                var mainpageController = App.lookup('controller:business.mainpage');

                _self.set('roomInfo',roomInfo);
                var floor = _self.store.peekRecord('floor',roomInfo.get('floor.id'));

                _self.store.query('bed',{}).then(function(list){
                  _self.set('global_dataLoader.beds',list);

                  _self.bedDataAdjust(function(){
                    _self.set('roomInfo.floor',floor);
                    mainpageController.switchMainPage('room-detail');
                    App.lookup('controller:business.mainpage').showPopTip("保存成功");
                  });
                  _self.set('detailEdit',false);
                });


              },function(err){
                App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
                let code = err.errors[0].code;
                let startStr = code.substring(0,3);
                if(startStr == '14-'){
                  let num = code.substring(3,code.length);
                  let str = num + '号设备已绑定' ;
                  App.lookup('controller:business.mainpage').showAlert(str);
                }
              });
            }
          }else{
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            roomModel.set('isPublicFlag',0);
            roomJsonModel.save().then(function(newRoom){

              _self.set('roomInfo',roomInfo);
              var floor = _self.store.peekRecord('floor',roomInfo.get('floor.id'));
            
              var mainpageController = App.lookup('controller:business.mainpage');

              _self.store.query('bed',{}).then(function(list){
                _self.set('global_dataLoader.beds',list);
                _self.bedDataAdjust(function(){
                  mainpageController.switchMainPage('room-detail');
                  _self.set('roomInfo.floor',floor);
                  console.log('floor name:',floor.get('name'),floor.get('id'));
                  App.lookup('controller:business.mainpage').showPopTip("保存成功");
                });
                _self.set('detailEdit',false);
              });

            },function(err){
              App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
              let code = err.errors[0].code;
              let startStr = code.substring(0,3);
              console.log('code',code,startStr);
              if(startStr == '14-'){
                let num = code.substring(3,code.length);
                let str = num + '号设备已绑定' ;
                App.lookup('controller:business.mainpage').showAlert(str);
              }
            });
          }
        }else{
          roomModel.set("validFlag",Math.random());
        }
      });
      _self.set('detailEdit',false);
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(room,num){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
      this.set("showpopInvitePassModal",false);
      room.set("delStatus", 1);
      room.save().then(function() {
        App.lookup('controller:business.mainpage').showPopTip("删除成功");
        var mainpageController = App.lookup('controller:business.mainpage');
        if(num){
          var route = App.lookup('route:business.mainpage.room-detail');
          App.lookup('controller:business.mainpage').refreshPage(route);
        }else{
          mainpageController.switchMainPage('room-management');
        }
      });
    },
    batchAdd(){
      if(this.get('batch')){
        this.set('batch',false);
        this.set('roomModel.maxName',null);
      }else{
        this.set('batch',true);
      }

    },
    selectDevice(bed,dictButton){
      bed.set('button',dictButton);
    },
  }
});
