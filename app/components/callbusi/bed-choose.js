import Ember from 'ember';

export default Ember.Component.extend({
  flag:0,
  dataLoader: Ember.inject.service("data-loader"),
  buildList:Ember.computed('bedList.length','defaultBed','bedShow',function(){
    let bedList = this.get('bedList');
    let list = new Ember.A();
    let count = 0;
    if(!bedList){
      return null;
    }
    let roomList = this.get('dataLoader.allRoomList');
    let floorList = this.get('dataLoader.allFloorList');
    let buildingList = this.get('dataLoader.allBuildingList');
    bedList.forEach(function(bed){
      if(bed.get('id')){
        let room = roomList.findBy('id',bed.get('roomId'));
        let floor = floorList.findBy('id',room.get('floorId'));
        let build = buildingList.findBy('id',floor.get('buildingId'));
        let item = Ember.Object.create({});
          let name = build.get('name') + '-' + floor.get('name');
          let seq = bed.get('room.floor.id');
          item.set('name',name);
          item.set('seq',seq);
          if(!list.findBy('seq',seq)){
            list.pushObject(item);
          }
      }
    });
    list.forEach(function(build){
      build.set('namePinyin',pinyinUtil.getFirstLetter(build.get("name")));
    });
      return list;

  }),
  chooseBed:Ember.computed('defaultBed','buildList.@each.seq','bedList','flag',function(){
    let chooseBuild = this.get('chooseBuild');
    let buildList = this.get('buildList');
    let bedList = this.get('bedList');
    let bed ;
    if(this.get('defaultBed')){
      bed = this.get('defaultBed');

    }else{
      bed = this.get('curBed');
    }

    if(chooseBuild && bed){
      if(bed.get('roomBedName')){
        return chooseBuild.get('name') + ':' + bed.get('roomBedName');
      }else{
        return '请选择床位';
      }

    }else if(bed&&bed.get('name')&&buildList&&bedList&&(buildList.get('length')!==0)&&(bedList.get('length')!==0)){
      let curBed = bedList.findBy('id',bed.get('id'));
      if(curBed){
        let build = buildList.findBy('seq',curBed.get('room.floor.id'));
        if(build){
          return build.get('name') + ':' + bed.get('room.name') + '-' + bed.get('name') ;
        }
      }else{
        return bed.get('room.floor.building.name') + '-' + bed.get('room.floor.name') + ':' + bed.get('room.name') + '-' + bed.get('name');
      }
    }else{
      return '请选择床位';
    }
  }),
  actions:{
    showDate(){
      this.set('bedShow',true);
    },
    hideDate(){
      this.set('bedShow',false);
    },
    selectBuild(build){
      this.set('chooseBuild',build);
      let bedList = this.get('bedList');
      let chooseList = bedList.filter(function(bed){
        return bed.get('room.floor.id') == build.get('seq');
      });
      chooseList.forEach(function(bed){
        bed.set('namePinyin',pinyinUtil.getFirstLetter(bed.get("roomBedName")));
      });
      chooseList = chooseList.sortBy("roomBedName");//排序一下 roomName为数字暂时没有问题.
      this.set('chooseList',chooseList);
     //每次选择楼宇的时候清除之前选择的床位，需要重新选择床位
      this.set('curBed',null);
    },
    selectBed(bed){
      this.set('curBed',bed);
    },
    submmit(){
      let bed = this.get('curBed');
      let build = this.get('chooseBuild');
      this.set('bedShow',false);
      this.incrementProperty('flag');
      this.sendAction('selectBed',bed);
      this.sendAction('selectBuild',build);
    }
  }
});
