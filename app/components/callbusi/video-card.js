import Ember from 'ember';

export default Ember.Component.extend({
  //可以绑定的床位列表
  bindBedList:Ember.computed('allBedList','flag',function(){
    let allBedList = this.get('allBedList');
    let device = this.get('device');
    if(!allBedList){
      return null;
    }
    let list = new Ember.A();
    if(device.get('isVideo')){
      console.log('video床位个数：',allBedList.get('length'));
      return allBedList;
    }else{
      allBedList.forEach(function(bed){
        if(!bed.get('button.id')){

          list.pushObject(bed);
        }
      });
      console.log('床位个数：',list.get('length'));
      return list;
    }

  }),
  //可以绑定的房间列表
  bindRoomList:Ember.computed('allRoomList',function(){
    let allRoomList = this.get('allRoomList');
    let device = this.get('device');
    if(!allRoomList){

      return null;
    }
    let list = new Ember.A();
    if(device.get('isVideo')){
      console.log('video房间个数：',allRoomList.get('length'));
      return allRoomList;
    }else{
      allRoomList.forEach(function(room){
        if(!room.get('scanner.id')){
          list.pushObject(room);
        }
      });
      return list;
    }

  }),

  //楼宇楼层列表
  buildList:Ember.computed('bindRoomList','bindBedList','device','flag',function(){
    let device = this.get('device');
    let bindRoomList = this.get('bindRoomList');
    let bindBedList = this.get('bindBedList');
    let list = new Ember.A();
    if(device.get('isVideo')){
      //视频楼宇列表
      bindBedList.forEach(function(bed){
        console.log(bed.get('buildingFloorName'),bed.get('id'));
        let item = Ember.Object.create({});
        if(bed.get('buildingFloorName')){
          let name = bed.get('buildingFloorName');
          let seq = bed.get('room.floor.id')?bed.get('room.floor.id'):bed.get('floor.id');
          item.set('name',name);
          item.set('seq',seq);
          console.log('floorId seq ',seq);
          if(!list.findBy('seq',seq)){
            list.pushObject(item);
          }
        }
      });
    }
    list.forEach(function(build){
      build.set('namePinyin',pinyinUtil.getFirstLetter(build.get("name")));
    });
    return list;
  }),
  //当前可选的房间或床位列表
  chooseList:Ember.computed('chooseBuild','bindRoomList','bindBedList','device','flag',function(){
    let chooseBuild = this.get('chooseBuild');
    let bindRoomList = this.get('bindRoomList');
    let bindBedList = this.get('bindBedList');
    let device = this.get('device');
    let list;
    if(!chooseBuild){
      return null;
    }
      if(device.get('isBindRoom')){
        //房间列表
        list = bindRoomList.filter(function(room){
          return room.get('floorId') == chooseBuild.get('seq');
        });
        list.forEach(function(room){
          room.set('namePinyin',pinyinUtil.getFirstLetter(room.get("name")));
        });
        list = list.uniqBy('name');
        list = list.sortBy("name");
      }else{
        console.log('绑定的床位个数1：',bindBedList.get('length'));
        list = bindBedList.filter(function(bed){
          console.log('可绑定的床位详情',bed.get('id'),bed.get('room.id'),bed.get('roomId'));
          return bed.get('floorId') == chooseBuild.get('seq');
        });
        console.log('绑定的床位个数2：',list.get('length'));
        list.forEach(function(bed){
          bed.set('namePinyin',pinyinUtil.getFirstLetter(bed.get('roomBedName')));
        });
        list = list.sortBy('roomBedName');
      }
    return list;
  }),
  actions:{
    //鼠标悬浮事件
    deviceChoose(device){
      if(device.get('unBindDevice')||device.get('delDeviceMask')||device.get("bindDeviceMask")||device.get('resetMask')){

      }else{
        device.set('choosed',true);
        let dom = this.$().find(".box-body");
        dom.addClass('video-color-hover');
        dom.removeClass('video-color');
      }

    },
    deviceNoChoose(device){

      if(device.get('unBindDevice')||device.get('delDeviceMask')||device.get("bindDeviceMask")){

      }else{
        device.set('choosed',false);
        let dom = this.$().find(".box-body");
        dom.addClass('video-color');
        dom.removeClass('video-color-hover');
      }
    },
    //选择楼宇楼层
    selectBuild(build){
      this.set('chooseBuild',build);
    },
    //选择绑定老人
    selectBindCustomer(customer){
      this.set('bindCustomer',customer);
      this.set('bindInfo',customer);
    },
    //选择绑定员工
    selectBindEmployee(employee){
      this.set('bindEmployee',employee);
      this.set('bindInfo',employee);
    },
    //绑定房间
    selectBindRoom(room){
      this.set('bindRoom',room);
      this.set('bindInfo',room);
    },
    //绑定床位
    selectBindBed(bed){
      this.set('bindBed',bed);
      this.set('bindInfo',bed);
    },
    deviceHover(device){
      device.set('hover',true);
    },
    deviceLeave(device){
      device.set('hover',false);
    },
    //解绑遮罩层
    unBindMask(device){
      device.set('unBindDevice',true);
    },
    openLive(device){
      device.set('liveMask',true);
    },
    undo(device){
      device.set('liveMask',false);
      device.set('unBindDevice',false);
      device.set('delDeviceMask',false);
      device.set('bindDeviceMask',false);
      this.set('bindInfo',null);
      this.set('bindRoom',null);
      this.set('bindBed',null);
      this.set('chooseBuild',null);
      this.preventDefault();
			this.stopPropagation();
    },
    delById(){
      this.set('device.delDeviceMask',true);
      this.preventDefault();
			this.stopPropagation();
    },
    unBind(device){
      device.set('unBindDevice',false);
      this.sendAction('unBind',device);
      this.preventDefault();
			this.stopPropagation();
    },
    delDevice(device){
      device.set('delDeviceMask',false);
      this.sendAction('delDevice',device);
      this.preventDefault();
			this.stopPropagation();
    },
    //绑定遮罩层，判断类型，显示不同
    bindDeviceMask(device){
      device.set('bindDeviceMask',true);
      device.set('isVideo',true);
      device.set('isBindRoom',true);
      device.set('isBindBed',false);
      this.incrementProperty('flag');
    },
    bindUser(device){
      device.set('bindDeviceMask',false);
      device.set('bindInfo',this.get('bindInfo'));
      this.sendAction('bindUser',device);
      this.set('bindInfo',null);
      this.set('bindRoom',null);
      this.set('bindBed',null);
      this.set('chooseBuild',null);
      this.preventDefault();
			this.stopPropagation();
    },
    isBindCustomer(){
      this.set('device.isBindCustomer',true);
    },
    isBindEmployee(){
      this.set('device.isBindCustomer',false);
    },
    isBindRoom(){
      this.set('device.isBindRoom',true);
      this.set('device.isBindBed',false);
      this.set('chooseBuild',null);
    },
    isBindBed(){
      this.set('device.isBindBed',true);
      this.set('device.isBindRoom',false);
      this.set('chooseBuild',null);
    },
    //开通直播
    startLive(device){
      device.set('liveMask',false);
      device.set('operateFlag','startLive');
      device.save().then(function(){
        console.log('直播开通成功');
      },function(err){
        let error = err.errors[0];
        if(error.code === '14'){
          App.lookup('controller:business.mainpage').showAlert('开通失败');
        }

      });
      this.preventDefault();
      this.stopPropagation();
    },
    clickBtn(){},
  }

});
