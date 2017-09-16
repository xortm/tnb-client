import Ember from 'ember';

export default Ember.Controller.extend({
  flag: 0,
  array:[],
  json:{"errcode":0,"code":"1103","business":"healthExamType3","num":0,"remark":"",
  "updateTime":0,"type":2,"content":"{\"employeeId\":\"78\",\"employeeName\":\"李方丁\",\"roomId\":773,\"type\":1,\"result\":\"63\"}",
  "url":"","detailType":0,"createTime":1495706040,"oneToManyFlag":0,"delStatus":0,"hasRead":0,"id":0,
  "businessType":null,"fromUser":{"id":"83","name":"皮特"}},
  service_notification:Ember.inject.service("notification"),
  init(){
    this._super(...arguments);
    var _self = this;
    Ember.run.schedule("afterRender",function() {
      _self.get("service_notification").registNoticePage(function(msgObj){
        if(msgObj.code=="1103"){
          _self.employeePosition(msgObj);
        }
      });
      // var employeeId = 15;//测试~~~~~~~~
      // var employeeName = "张三";//测试~~~~~~~~
      // var hbsRoomId = "room_"+107;
      // var divBegin = "<div id='employee_"+employeeId+"' class='pull-left padding-left-10'><div class='height20 center'><img class='height16 width13' src='assets/images/icon/download.png' alt=''></div><div class=''>";
      // $("#"+hbsRoomId).append(divBegin+employeeName+"</div></div>");
      // console.log("hbsRoomId111111",$("#"+hbsRoomId));
    });
  },
  floorsObs:function(){
    let floors = this.get('curbuilding.floors');
    if(!floors){return;}
    if(this.get('curbuilding.floors.length')==this.get('curbuilding.floorNum')){
      let sortfloors = floors.sortBy('seq').reverse();
      this.get('curbuilding').set('curfloors',sortfloors);
    }
    var _self = this;
    Ember.run.schedule("afterRender",function() {
      var dataList = _self.get("dataList");
      if(!dataList){return;}
      dataList.forEach(function(item){
        _self.employeePosition(item,'begin');

      });
    });
  }.observes('curbuilding.floors','flag',"dataList"),

  employeePosition(data,theType){
    var employeePositionObj = {},
        type ,
        employeeId ,
        employeeName ,
        roomId ,
        floorId ,
        hbsRoomId ,
        hbsFloorId ;
    if(theType=='begin'){
      type = 1;
      employeeId = data.get("employee.id");
      employeeName = data.get("employee.name");
      roomId = data.get("room.id");
      hbsRoomId = "room_"+roomId;
    }else {
      if(data){
        employeePositionObj = JSON.parse(data.content);
      }
      type = employeePositionObj.type;
      employeeId = employeePositionObj.employeeId;
      employeeName = employeePositionObj.employeeName;
      roomId = employeePositionObj.roomId;
      floorId = employeePositionObj.floorId;
      hbsRoomId = "room_"+roomId;
      hbsFloorId = "floor_"+floorId;
    }

    var cusIdArray = this.get("array");
    var divBegin1 = "<div id='employee_"+employeeId+"' class='pull-left padding-left-10 employee-icon'><div class='height20 center'><img class='height16 width13' src='assets/images/icon/download.png' alt=''></div><div class=''>";
    var divBegin2 = "<div id='employee_"+employeeId+"' class='pull-left padding-left-10 employee-icon'><div class='height20 center'><img class='height16 width13' src='assets/images/icon/download.png' alt=''></div><div class='color-white'>";
    console.log("employeeId",employeeId);
    console.log("employeePositionObj",employeePositionObj);
    console.log("cusIdArray",cusIdArray);
    console.log("cusIdArray.indexOf(employeeId)==-1",cusIdArray.indexOf(employeeId)==-1);
    if(cusIdArray.indexOf(employeeId)==-1){
      cusIdArray.push(employeeId);
      if(type==1){//type是1的就是在room里的
        console.log("hbsRoomId111",$("#"+hbsRoomId));
        $("#"+hbsRoomId).append(divBegin1+employeeName+"</div></div>");
        $("#employee_"+employeeId).addClass("icon-shine");
      }else {
        $("#"+hbsFloorId).append(divBegin2+employeeName+"</div></div>");
        $("#employee_"+employeeId).addClass("icon-shine");
      }
    }else {//如果当前数组里有 employeeId的话，先在页面上remove 一下，再添加到页面变了房间或楼层。
      var $room = $("#"+hbsRoomId);
      var $employee = $("#employee_"+employeeId);
      if($employee.parent().offset()){
        let fromX = $employee.parent().offset().left;
        let fromY = $employee.parent().offset().top;
        let toX = $("#"+hbsRoomId).offset().left;
        let toY = $("#"+hbsRoomId).offset().top;
        let moveX = toX - fromX;
        let moveY = toY - fromY;
        var custOffset = $employee.offset();
        var roomOffset = $room.offset();
        if(type==1){
          // $employee.removeClass("icon-shine");
          $employee.animate({left:moveX+'px',top:moveY+'px'},'slow',function(){
            $employee.remove();//
            $room.append(divBegin1+employeeName+"</div></div>");
            $employee.addClass("icon-shine");
          });
      }


      }else {
        $employee.remove();//
        $room.append(divBegin2+employeeName+"</div></div>");
        $employee.addClass("icon-shine");
      }
    }

  },

  actions:{

    changeDown(){
      var json = this.get("json");
      console.log("inAction changeDown",json);
      this.employeePosition(json);
    },
    selectBuild(build) {
      var _self = this;
      var curbuilding = this.get("curbuilding");
      if(curbuilding){
        if(curbuilding.get("id")==build.get("id")){console.log("点击切换楼宇还是当前楼宇就什么都不做"); return;}
      }
      this.set("array",[]);//每次切换楼宇set这个array为空
      this.set("dataList",'');//
      _self.store.query('locationinfo',{filter:{ebid:build.get("id")}}).then(function(dataList){
        console.log("data222221111",dataList);
        _self.set("dataList",dataList);
      });
      let process = function(data) {
        data.set("hasInit",true);
        let floors = data.get('floors');
        let sortFloors = floors.sortBy('seq');
        data.set('floors',sortFloors);
        _self.set('curbuilding', data);
        _self.incrementProperty('flag');
        if(!floors.get('length')){
          _self.set('curRoom',null);
        }
      };
      //暂停数据修补
      this.get("global_dataLoader").set("roomRebuild",true);
      this.get("global_dataLoader").set("floorRebuild",true);
        _self.store.findRecord("building",build.get("id")).then(function(data){
          _self.set('curRoom',null);
          process(data);
          //重启数据修补
          _self.get("global_dataLoader").set("roomRebuild",false);
          _self.get("global_dataLoader").set("floorRebuild",false);
        });
      let buildingList = this.get('buildingList');
      buildingList.forEach(function(build){
        build.set('hasChoosed',false);
      });
      build.set('hasChoosed',true);
    },
    selectRoom(room) {
      let _self = this;
      let employeeList = this.get('theEmployeeList');
      if(this.get('curRoom')){
        if(room.get('hasSelected')){
          room.set('hasSelected',false);
        }else{
          this.get('curRoom').set('hasSelected',false);
          this.set('curRoom',null);
          let floor = room.get('floor');
          let rooms = floor.get('rooms');
          room.set('hasSelected',true);
          this.set('curRoom',room);
        }
      }else{
          let floor = room.get('floor');
          let rooms = floor.get('rooms');
          room.set('hasSelected',true);
          this.set('curRoom',room);
        }
    },

    elderSeach(){
      this.set("seachCriteria",true);
    },
    searchHide(){
      this.set("seachCriteria",false);
    },

    //查看全部老人
    queryAll(){
      this.set('seachCriteria',false);//关闭检索
      this.set('queryScheduled',false);//关掉只显示预警老人
      this.get("theEmployeeList").forEach(function(item){//都清空
        $("#employee_"+item.get("id")).parent().removeClass(' bk-color-2FA7FD');
        $("#employee_"+item.get("id")).removeClass(' hasError');
      });
      this.set("employeeList",this.get("theEmployeeList"));
    },
    // searchStaff(){
    //   var _self = this;
    //   var employees =  this.get('employees');
    //   var employeeList = this.get("theEmployeeList");
    //   console.log("employees",employees);
    //   var curRoom = this.get("curRoom");
    //   var curBuild = this.get("curBuild");
    //   var SearchFlag = this.get("SearchFlag");
    //   if(employees){
    //     this.sendAction("come",employees);
    //   }else if (curRoom) {
    //     let roomEmployees = employeeList.filter(function(employee){
    //       return employee.get('bed.room.id')==curRoom.get('id');
    //     });
    //     console.log("employees11111111111 curRoom",roomEmployees);
    //     this.sendAction("come",roomEmployees);
    //   }else if (curBuild) {
    //     var beds = new Ember.A();
    //     var rooms = curBuild.get("rooms");
    //     let floorEmployees = employeeList.filter(function(employee){
    //         return rooms.findBy("id",employee.get('bed.room.id'));
    //     });
    //     console.log("employees11111111111 curBuild",floorEmployees);
    //     this.sendAction("come",floorEmployees);
    //   }else {
    //     this.set("theMessage","请选择检索条件");
    //     setTimeout(function(){
    //       _self.set("theMessage","");
    //     },3000);
    //   }
    //
    // },
    come(){
      let name = this.get('queryCondition');
      var theEmployeeList = this.get("theEmployeeList").filter(function(employee){

      });
      theEmployeeList.forEach(function(item){//先都清空
        $("#employee_"+item.get("id")).parent().removeClass(' bk-color-2FA7FD');
        $("#employee_"+item.get("id")).removeClass(' hasError');
      });
      param.forEach(function(item){//再渲染
        console.log("parentDom",$("#employee_"+item.get("id")).parent());
        $("#employee_"+item.get("id")).parent().addClass(' bk-color-2FA7FD');
        $("#employee_"+item.get("id")).addClass(' hasError');
      });
      this.set("seachCriteria",false);
    },


  }

});
