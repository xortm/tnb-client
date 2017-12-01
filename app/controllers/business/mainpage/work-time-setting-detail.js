import Ember from 'ember';
import Changeset from 'ember-changeset';
import WorkValidations from '../../../validations/worktimesetting';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(WorkValidations,{
  constants:Constants,
  dateService: Ember.inject.service("date-service"),
  dataLoader:Ember.inject.service('data-loader'),
  store: Ember.inject.service("store"),
  workModel:Ember.computed('worktimesettingInfo',function(){
    var model = this.get("worktimesettingInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(WorkValidations), WorkValidations);
  }),
  //右侧的房间床位树，bedList为所有的床位列表，selectedBeds为该护工组分配的床位
  treeList:Ember.computed('nurseGroupInfo','bedList','selectedBeds',function(){
    let _self = this;
    //所有老人
    let customerList = this.get('dataLoader.customerList');
    let treeList = new Ember.A();
    //房间列表
    let roomList = new Ember.A();
    //楼层列表
    let floorList = new Ember.A();
    //楼宇列表
    let buildingList = new Ember.A();
    //床位列表
    let bedList = this.get('dataLoader.beds');
    //已选床位列表
    let selectedBeds = this.get('selectedBeds');
    //当前选择的床位
    let chooseBeds = new Ember.A();
    if(!bedList){
      return null;
    }
      //根据床位，得到所有的房间列表
      bedList.forEach(function(bed){
        if(!roomList.findBy('id',bed.get('room.id'))){
          roomList.pushObject(bed.get('room'));
        }
      });

      //根据房间，得到所有的楼层列表
      roomList.forEach(function(room){

        if(!floorList.findBy('id',room.get('floor.id'))){
          floorList.pushObject(room.get('floor'));
        }
      });

      //根据楼层，得到所有的楼宇列表
      floorList.forEach(function(floor){
        if(!buildingList.findBy('id',floor.get('building.id'))){

          buildingList.pushObject(floor.get('building'));
        }
      });
      //由最高级的楼宇开始，一层层生成树形结构
      buildingList.forEach(function(build){
        //tree树形第一层，楼宇对象
        let tree = Ember.Object.create({
          name:null,
          type:'building',
          parent:null,
          children:new Ember.A(),
          hasSelected:false,
          id:null,
        });
        tree.set('name',build.get('name'));
        tree.set('type','build');
        tree.set('hasSelected',false);
        tree.set('id',build.get('id'));
        //floors,得到该楼宇的所有楼层
        let floors = floorList.filter(function(floor){
          return floor.get('building.id')==parseInt(build.get('id'));
        });
        let list2 = new Ember.A();

        floors.forEach(function(floor){
          //树形第二层，楼层对象
          let floortree = Ember.Object.create({
            name:null,
            type:'floor',
            parent:null,
            children:new Ember.A(),
            hasSelected:false,
            id:null,
          });
          floortree.set('name',floor.get('name'));
          floortree.set('type','floor');
          floortree.set('hasSelected',false);
          floortree.set('id',floor.get('id'));
          floortree.set('parent',tree);
          //得到该楼层的所有房间
          let rooms = roomList.filter(function(room){
            return room.get('floor.id')==parseInt(floor.get('id'));
          });
          let list1 = new Ember.A();
          rooms.forEach(function(room){
            //树形第三层，房间对象
            let roomtree = Ember.Object.create({
              name:null,
              type:'room',
              parent:null,
              children:new Ember.A(),
              hasSelected:false,
              id:null,
            });
            roomtree.set('name',room.get('name'));
            roomtree.set('type','room');
            roomtree.set('hasSelected',false);
            roomtree.set('id',room.get('id'));
            roomtree.set('parent',floortree);
            //得到该房间的所有床位
            let beds = bedList.filter(function(bed){
              return bed.get('room.id')==parseInt(room.get('id'));
            });
            let list = new Ember.A();
            beds.forEach(function(bed){
              //树形第四层，床位对象
              let bedtree = _self.store.createRecord('bedworktimesetting',{});
              bedtree.set('bed',bed);
              bedtree.set('name',bed.get('name'));
              bedtree.set('type','bed');
              bedtree.set('order',bed.get('id'));
              bedtree.set('parent',roomtree);
              bedtree.set('hasSelected',false);
              //该护理组已有的床位，将其选择状态设为true，其父级选择状态设为true
              if(selectedBeds&&selectedBeds.findBy('bed.id',bed.get('id'))){
                bedtree.set('hasSelected',true);
                bedtree.set('parent.hasSelected',true);
                bedtree.set('parent.parent.hasSelected',true);
                bedtree.set('parent.parent.parent.hasSelected',true);
                //把已有床位放入当前选择床位的数组中
                chooseBeds.pushObject(bedtree);
              }else{
                bedtree.set('hasSelected',false);
              }
              //把属于同一个房间的床位放到一个数组中
              list.pushObject(bedtree);
            });
            //把床位数组放到父级房间的children里，把属于同一楼层的房间放到一个数组
            roomtree.set('children',list);
            list1.pushObject(roomtree);
          });

          //把房间数组放到父级楼层的children里，把属于同一楼宇的楼层放到一个数组
          floortree.set('children',list1);
          list2.pushObject(floortree);
        });
        //把楼层数组放到父级楼宇的children里，最后将楼宇对象放到树形列表
        tree.set('children',list2);
        treeList.pushObject(tree);
      });
      //设置当前已选择的床位
      this.set('chooseBeds',chooseBeds);
      return treeList;
  }),
  //老人数量
  customerNum:Ember.computed('chooseBeds.@each.hasSelected','flag','customerList',function(){
    let chooseBeds = this.get('chooseBeds');
    let treeList = this.get('treeList');
    let customerList = this.get('customerList');
    let count = 0;
    if(!chooseBeds){
      return 0;
    }
    if(!customerList){
      return 0;
    }
    chooseBeds.forEach(function(bed){
      if(bed.get('bed.status.typecode')){
        if((bed.get('bed.status.typecode')=='bedStatusTryIn')||(bed.get('bed.status.typecode')=='bedStatusCheckIn')){
          count++;
        }
      }
    });
    treeList.forEach(function(build){
      build.get('children').forEach(function(floor){
        floor.get('children').forEach(function(room){
          //选择床位后，将床位老人姓名，放入房间
          let cusNames = '';
          room.get('children').forEach(function(bed){
            // console.log('bedList',bed.get('id'));
            if(bed.get('hasSelected')){
              if(customerList.findBy('bed.id',bed.get('bed.id'))){
                let customer = customerList.findBy('bed.id',bed.get('bed.id'));
                cusNames += customer.get('name') + ",";
              }
            }
          });
          cusNames = cusNames.substring(0,cusNames.length-1);
          room.set('cusNames',cusNames);
        });
      });
    });
    return count;
  }),
  actions:{
    invalid() {
        //alert("error");
    },
    //选择颜色
    selectColor(color){
      let  _self = this;
      let colorList = this.get('colorList');
      let colorFlag = colorList.findBy('typecode',color);
      _self.set('worktimesettingInfo.colorFlag',colorFlag);
      _self.set('workModel.colorFlag',colorFlag);
      let name;
      switch (color) {
        case 'colorType1':
          name =  "work-color-1";
          break;
        case 'colorType2':
          name =  "work-color-2";
          break;
        case 'colorType3':
          name =  "work-color-3";
          break;
        case 'colorType4':
          name =  "work-color-4";
          break;
        case 'colorType5':
          name =  "work-color-5";
          break;
        case 'colorType6':
          name =  "work-color-6";
          break;
        case 'colorType7':
          name =  "work-color-7";
          break;
        case 'colorType8':
          name =  "work-color-8";
          break;
        case 'colorType9':
          name =  "work-color-9";
          break;
        default:
          name = "work-color-9";
          break;
      }
      this.set('workModel.colorName',name);

    },
    startTimeAction(date){
      var time ='';
      if(date){
        if(date.getMinutes()===0){
          time = date.getHours() +":00";
        }else {
          time = date.getHours() +":"+ date.getMinutes();
        }
      }

      let stamp = this.get("dateService").timeToTimestamp(date);
      this.set('workModel.startTimeInt',stamp);
      console.log(stamp);
      this.set("workModel.startTime", time);
      this.set("worktimesettingInfo.startTime", time);
    },
    endTimeAction(date){
      var time ='';
      if(date){
        if(date.getMinutes()===0){
          time = date.getHours() +":00";
        }else {
          time = date.getHours() +":"+ date.getMinutes();
        }
      }
      let stamp = this.get("dateService").timeToTimestamp(date);
      this.set('workModel.endTimeInt',stamp);
      console.log(stamp);
      this.set("workModel.endTime", time);
      this.set("worktimesettingInfo.endTime", time);
    },
    //编辑按钮
    detailEditClick:function(worktimesetting){
      this.set('detailEdit',true);
    },

    //取消按钮
    detailCancel:function(){
      var editMode=this.get('editMode');
      if(editMode=='edit'){
        this.set('detailEdit',false);
        let route = App.lookup('route:business.mainpage.work-time-setting-detail');
        App.lookup('controller:business.mainpage').refreshPage(route);
      }else{
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('work-time-setting');
      }
    },
    dpShowAction(e){

    },
    //保存
    saveWork(){
      var _self=this;
      var workModel=this.get('workModel');
      var editMode=this.get('editMode');
      let beds = new Ember.A();
      this.get('chooseBeds').forEach(function(bed){
        beds.pushObject(bed);
      });
      workModel.validate().then(function(){
        if(workModel.get('errors.length')===0){
          workModel.set('beds',beds);
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          workModel.save().then(function(){
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            if (editMode=='add') {
              var mainpageController = App.lookup('controller:business.mainpage');
              mainpageController.switchMainPage('work-time-setting');
            }else {
              _self.set('detailEdit',false);
              // _self.get('worktimesettingInfo').rollbackAttributes();
            }
          },function(err){
            let error = err.errors[0];
            console.log("111111111  err");
            if(error.code=="4"){
              console.log("111111111  jin if");
              workModel.validate().then(function() {
                  workModel.addError('name', ['班次名称不能相同']);
                  workModel.set("validFlag", Math.random());
                  App.lookup('controller:business.mainpage').showPopTip("保存失败", false);
              });
            }
          });
        }else{
          workModel.set("validFlag",Math.random());
        }
      });

    },
    // changeStartTimeAction(date) {
    //     var stamp = this.get("dateService").getLastSecondStampOfDay(date);
    //     this.set("workModel.startTime", stamp);
    // },
    // changeEndTimeAction(date) {
    //     var stamp = this.get("dateService").getLastSecondStampOfDay(date);
    //     this.set("workModel.endTime", stamp);
    // },
    //删除按钮
    delById : function(worktimesetting) {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此班次记录",function(){
          _self.send('cancelPassSubmit',_self.get('worktimesettingInfo'));
      });
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(worktimesetting){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      worktimesetting.set("delStatus", 1);
      worktimesetting.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('work-time-setting');

      });
		},
    //点击楼宇展开树形
    checkbuild(build){
      if(build.get('checked')){
        build.set('checked',false);
      }else{
        build.set('checked',true);
      }
    },
    //点击楼层展开
    checkfloor(floor){
      if(floor.get('checked')){
        floor.set('checked',false);
      }else{
        floor.set('checked',true);
      }
    },
    //点击房间展开
    checkroom(room){
      if(room.get('checked')){
        room.set('checked',false);
      }else{
        room.set('checked',true);
      }
    },
    //选择床位
    checkbed(bed){
      let chooseBeds = this.get('chooseBeds');
      if(bed.get('hasSelected')){
        //选择床位，通知父级房间，该床位已移除
        bed.set('hasSelected',false);
        chooseBeds.removeObject(bed);
        this.send('selectRoom',bed,false);
        let id = '#'+bed.get('order');
        $(id).removeClass('fa-check');
        $(id).addClass('fa-square-o');
        $(id).parent().removeClass('tree-selected');
      }else{
        //选择床位，通知父级房间，该床位已选
        bed.set('hasSelected',true);
        chooseBeds.pushObject(bed);
        this.send('selectRoom',bed,true);
        let id = '#'+bed.get('order');
        $(id).removeClass('fa-square-o');
        $(id).addClass('fa-check');
        $(id).parent().addClass('tree-selected');
      }
      this.incrementProperty('flag');
    },
    //床位状态改变时，房间状态改变
    selectRoom(bed,str){
      let room = bed.get('parent');
      if(str===true){
        //选择房间，通知父级楼层，该房间已选
        room.set('hasSelected',true);
        this.send('selectFloor',room,true);
      }else{
        let count = 0;
        //查询该房间里的所有未选床位的数量
        room.get('children').forEach(function(bed){
          if(!bed.get('hasSelected')){
            count++;
          }
        });
        //如果房间里所有床位均为未选状态，将房间设为未选，通知父级楼层，该房间未选
        if(count==room.get('children.length')){
          room.set('hasSelected',false);
          this.send('selectFloor',room,false);
        }
      }
    },
    //房间状态改变时，楼层状态改变
    selectFloor(room,str){
      let floor = room.get('parent');
      if(str===true){
        floor.set('hasSelected',true);
        this.send('selectBuild',floor,true);
      }else{
        let count = 0;
        floor.get('children').forEach(function(room){
          if(!room.get('hasSelected')){
            count++;
          }
        });
        if(count==floor.get('children.length')){
          floor.set('hasSelected',false);
          this.send('selectBuild',floor,false);
        }
      }
    },
    //楼层状态改变时，楼宇状态改变
    selectBuild(floor,str){
      let build = floor.get('parent');
      if(str===true){
        build.set('hasSelected',true);
      }else{
        let count = 0;
        build.get('children').forEach(function(floor){
          if(!floor.get('hasSelected')){
            count++;
          }
        });
        if(count==build.get('children.length')){
          build.set('hasSelected',false);
        }
      }
    },
    //选择房间，同时选择床位
    chooseroom(room,str){
      let chooseBeds = this.get('chooseBeds');
      if(str=='select'){
          room.get('children').forEach(function(bed){
            chooseBeds.pushObject(bed);
            bed.set('hasSelected',true);
          });
          room.set('hasSelected',true);
      }else if(str=='noselect'){
        room.get('children').forEach(function(bed){
          bed.set('hasSelected',false);
          chooseBeds.removeObject(bed);
        });
        room.set('hasSelected',false);
      }else{
        if(room.get('hasSelected')){
          room.get('children').forEach(function(bed){
            bed.set('hasSelected',false);
            chooseBeds.removeObject(bed);
          });
          room.set('hasSelected',false);
          this.send('selectFloor',room,false);
        }else{
          room.get('children').forEach(function(bed){
            bed.set('hasSelected',true);
            chooseBeds.pushObject(bed);
          });
          room.set('hasSelected',true);
          this.send('selectFloor',room,true);
        }
      }
    },
    //选择楼层，同时选择房间
    choosefloor(floor,str){
      let _self = this;
      if(str=='select'){
        floor.get('children').forEach(function(room){
          _self.send('chooseroom',room,'select');
        });
        floor.set('hasSelected',true);
      }else if(str=='noselect'){
        floor.get('children').forEach(function(room){
          _self.send('chooseroom',room,'noselect');
        });
        floor.set('hasSelected',false);
      }else{
        if(floor.get('hasSelected')){
          floor.get('children').forEach(function(room){
            _self.send('chooseroom',room,'noselect');
          });
          floor.set('hasSelected',false);
          this.send('selectBuild',floor,false);
        }else{
          floor.get('children').forEach(function(room){
            _self.send('chooseroom',room,'select');
          });
          floor.set('hasSelected',true);
          this.send('selectBuild',floor,true);
        }
      }
    },
    //选择楼宇，同时选择楼层
    choosebuild(build){
      let _self = this;
      if(build.get('hasSelected')){
        build.get('children').forEach(function(floor){
          _self.send('choosefloor',floor,'noselect');
        });
        build.set('hasSelected',false);
      }else{
        build.get('children').forEach(function(floor){
          _self.send('choosefloor',floor,'select');
        });
        build.set('hasSelected',true);
      }
    }
  }
});
