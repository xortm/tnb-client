import Ember from 'ember';
import Changeset from 'ember-changeset';
import NursegroupValidations from '../../../validations/nurseGroup';
import lookupValidator from 'ember-changeset-validations';
import Pagination from '../../../routes/business/pagination';

export default Ember.Controller.extend(NursegroupValidations,Pagination,{
  flag:0,
  chooseBeds:Ember.computed(function(){
    return new Ember.A();
  }),
  //所有可选护工的列表，包括护工组已有护工hasStaffs，未编组的护工allStaffs
  staffList:Ember.computed('hasStaffs','allStaffs',function(){
    let _self = this;
    let staffList = new Ember.A();
    let allStaffs = this.get('allStaffs');
    if(!allStaffs){
      return staffList;
    }
    //未编组护工，设置选择状态hasChoosed为false
    allStaffs.forEach(function(staff){
      let item = _self.store.createRecord('employeenursinggroup',{});
      item.set('staffId',staff.get('id'));
      item.set('name',staff.get('name'));
      item.set('employee',staff);
      item.set('hasChoosed',false);
      staffList.pushObject(item);
    });
    if(this.get('hasStaffs')){
      //护工组已有护工，设置选择状态hasChoosed为true
      staffList.forEach(function(staff){
        if(_self.get('hasStaffs').findBy('employee.id',staff.get('staffId'))){
          staff.set('hasChoosed',true);
        }
      });
    }
    return staffList;
  }),
  //右侧的房间床位树，bedList为所有的床位列表，selectedBeds为该护工组分配的床位
  treeList:Ember.computed('nurseGroupInfo','bedList','selectedBeds',function(){
    let _self = this;
    let nurseGroupInfo = this.get('nurseGroupInfo');
    let treeList = new Ember.A();
    //房间列表
    let roomList = new Ember.A();
    //楼层列表
    let floorList = new Ember.A();
    //楼宇列表
    let buildingList = new Ember.A();
    //床位列表
    let bedList = this.get('bedList');
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
              let bedtree = _self.store.createRecord('bednursegroup',{});
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

  nurseGroupModel:Ember.computed('nurseGroupInfo',function(){
    var model = this.get("nurseGroupInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(NursegroupValidations), NursegroupValidations);
  }),
  //未选成员列表
  staffNameList:Ember.computed('staffList.@each.hasChoosed',function(){
    var staff=this.get('staffList');
    return staff.filter(function(staff){
      return staff.hasChoosed===false;
    });
  }),
  //已选成员列表
  chooseStaff:Ember.computed('staffList.@each.hasChoosed',function(){
    var staff=this.get('staffList');
    return staff.filter(function(staff){
      return staff.hasChoosed===true;
    });
  }),
  //组长列表
  leaderList:Ember.computed('chooseStaff',function(){
    var leaderList=this.get('chooseStaff');
    leaderList.forEach(function(leader){
      leader.set('namePinyin',pinyinUtil.getFirstLetter(leader.get("employee.name")));
    });
    return leaderList;
  }),
  //默认组长
  defaultLeader:Ember.computed('nurseGroupInfo','leaderList','hasStaffs','chooseStaff',function(){
    let chooseStaff = this.get('chooseStaff');
    if(this.get("nurseGroupInfo.leader")){
      if(chooseStaff.findBy('employee.id',this.get("nurseGroupInfo.leader.id"))){
        return this.get("nurseGroupInfo.leader");
      }else{
        let id=this.get('leaderList').get('firstObject.staffId');
        let leader=this.store.peekRecord('employee',id);
        return leader;
      }

    }
    let id=this.get('leaderList').get('firstObject.staffId');
    let leader=this.store.peekRecord('employee',id);
    return leader;
  }),

  //老人数量
  customerNum:Ember.computed('chooseBeds.@each.hasSelected','flag',function(){
    let chooseBeds = this.get('chooseBeds');
    let count = 0;
    if(!chooseBeds){
      return 0;
    }
    chooseBeds.forEach(function(bed){
      if(bed.get('bed.status.typecode')){
        if((bed.get('bed.status.typecode')=='bedStatusTryIn')||(bed.get('bed.status.typecode')=='bedStatusCheckIn')){
          count++;
        }
      }
    });
    return count;
  }),
  actions:{
    invalid() {
        //alert("error");
    },
    //保存护工组
    saveNurseGroup(){
      App.lookup('controller:business.mainpage').openPopTip("正在保存");
      var nurseGroupInfo=this.get('nurseGroupInfo');
      nurseGroupInfo.set('leader',this.get('defaultLeader'));
      var nurseGroupModel=this.get('nurseGroupModel');
      var editMode=this.get('editMode');
      var _self=this;
      let staffs = new Ember.A();
      let beds = new Ember.A();
      this.get('chooseStaff').forEach(function(staff){
        staffs.pushObject(staff);
      });
      this.get('chooseBeds').forEach(function(bed){
        beds.pushObject(bed);
      });
      if(staffs.get('length')==this.get('chooseStaff.length')&&beds.get('length')==this.get('chooseBeds.length')){

        if(editMode=='add'){
          //验证是否通过
          nurseGroupModel.validate().then(function(){
            if(nurseGroupModel.get('errors.length')===0){

              nurseGroupModel.set('staffs',staffs);
              nurseGroupModel.set('beds',beds);
              nurseGroupModel.save().then(
                function(){
                  App.lookup('controller:business.mainpage').showPopTip("保存成功");
                  let mainpageController = App.lookup('controller:business.mainpage');
                  mainpageController.switchMainPage('nursing-worker-group-management');
                },function(err){
                  let error = err.errors[0];
                  if(error.code==="4"){
                    nurseGroupModel.validate().then(function(){
                      nurseGroupModel.addError('name',['该名称已被占用']);
                      nurseGroupModel.set("validFlag",Math.random());
                      App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
                    });
                  }else {
                    App.lookup("controller:business.mainpage").closePopTip();
                    App.lookup("controller:business.mainpage").showAlert("出现未知错误未能成功保存该条信息，请重试");
                  }
                }
              );
            }else{
              nurseGroupModel.set("validFlag",Math.random());
            }
          });
        }else{
        //验证是否通过
          nurseGroupModel.validate().then(function(){
            if(nurseGroupModel.get('errors.length')===0){
              nurseGroupModel.set('staffs',staffs);
              nurseGroupModel.set('beds',beds);
              //修改编辑已有护工组
              nurseGroupModel.save().then(
                function(newNurseGroupData){
                  if(newNurseGroupData.get('errcode')==4){
                    nurseGroupModel.validate().then(function(){
                      nurseGroupModel.addError('name',['该名称已被占用']);
                      nurseGroupModel.set("validFlag",Math.random());
                    });
                  }else{
                    _self.store.query('nursegroup',{filter:{id:newNurseGroupData.get('id')}}).then(function(list){
                      let record = list.get('firstObject');
                      let customers = record.get('customers');
                      console.log(customers.get('length'));
                      customers.forEach(function(customer){
                        console.log('老人姓名：',customer.get('name'));
                      });
                      App.lookup('route:business.mainpage.nursing-worker-group-management').getStaffByNurseGroup(record);
                      App.lookup('route:business.mainpage.nursing-worker-group-management').getCustomerByNurseGroup(record);
                      _self.set('nurseGroupInfo',record);
                      _self.set('detailEdit',false);
                      App.lookup('controller:business.mainpage').showPopTip("保存成功");
                      var route=App.lookup('route:business.mainpage.nursing-worker-group-detail');
                      App.lookup('controller:business.mainpage').refreshPage(route);//刷新页面

                    });

                  }

                }
              );
            }else{
              nurseGroupModel.set("validFlag",Math.random());
            }

          });

        }
      }else{
        App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
      }
    },
    //编辑按钮
    detailEditClick:function(floor){
      this.set('detailEdit',true);
    },
    //取消按钮
    detailCancel:function(){
      let _self = this;
      var id=this.get('id');
      var editMode=this.get('editMode');
      if(id&&editMode=='edit'){
        this.set('detailEdit',false);
        let params = this.pagiParamsSet();
        let filter = {id:id};
        params.filter = filter;
        this.findPaged('nursegroup',params).then(function(nursegroupList){
          let nurseGroupInfo = nursegroupList.get('firstObject');
          App.lookup('route:business.mainpage.nursing-worker-group-management').getStaffByNurseGroup(nurseGroupInfo);
          App.lookup('route:business.mainpage.nursing-worker-group-management').getCustomerByNurseGroup(nurseGroupInfo);
          _self.store.query('employeenursinggroup',{filter:{group:{id:id}}}).then(function(list){
            _self.set('hasStaffs',list);
          });
          _self.set('nurseGroupInfo',nurseGroupInfo);
        });
      }else{
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('nursing-worker-group-management');
      }
    },
    //选择组长
    selectLeader(leader) {
      var leaderStaff=this.store.peekRecord('employee',leader.get('staffId'));

        this.set('nurseGroupInfo.leader',leaderStaff);
        this.set('defaultLeader',leaderStaff);
    },
    //删除按钮
    delById : function() {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此护工组记录",function(){
        _self.send('cancelPassSubmit',_self.get('nurseGroupInfo'));
      });
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(nursegroup){
      var _self=this;
      let list = new Ember.A();
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
      this.set('showpopInvitePassModal',false);
      //将当前护工组设为删除状态
      nursegroup.set("delStatus", 1);
      //保存护工组状态
      nursegroup.save().then(function() {
          //将当前护工组下组员的状态设为未选
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('nursing-worker-group-management');
      },function(data){//网络错误容错
        App.lookup("controller:business.mainpage").closePopTip();
        App.lookup("controller:business.mainpage").showAlert("出现未知错误删除失败，请重试");
      });
		},
    //选中护工
    changeStaffType(itemCode){
      let item = this.get('staffNameList').findBy('staffId',itemCode);
      item.set('hasChoosed',true);
      if(this.get('chooseStaff.length')===0){
        this.set('defaultLeader',null);
      }
    },
    //取消选中护工
    changeStaffBack(itemCode){
      var item = this.get('chooseStaff').findBy('staffId',itemCode);
      item.set('hasChoosed',false);
      if(this.get('chooseStaff.length')===0){
        this.set('defaultLeader',null);
      }
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
