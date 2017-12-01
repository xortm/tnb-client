import Ember from 'ember';

export default Ember.Controller.extend({
  flag: 0,
  array:[],
  service_notification:Ember.inject.service("notification"),
  init(){
    this._super(...arguments);
    let _self = this;
    Ember.run.schedule("afterRender",function() {
      _self.get("service_notification").registNoticePage(function(msgObj){
        if(msgObj.code=="1103"){
          _self.customerPosition(msgObj);

        }
      });
    });
  },
  floorsObs:function(){
    let floors = this.get('curbuilding.floors');
    if(!floors){return;}
    if(this.get('curbuilding.floors.length')==this.get('curbuilding.floorNum')){
      let sortfloors = floors.sortBy('seq').reverse();
      this.get('curbuilding').set('curfloors',sortfloors);
    }
    let _self = this;
    Ember.run.schedule("afterRender",function() {
      let dataList = _self.get("dataList");
      if(!dataList){return;}
      dataList.forEach(function(item){
        _self.customerPosition(item,'begin');
      });
    });
  }.observes('curbuilding.floors','flag',"dataList"),

  customerPosition(data,theType){
    let customerPositionObj = {},
        type ,
        customerId ,
        customerName ,
        roomId ,
        floorId ,
        hbsRoomId ,
        hbsFloorId ;
    if(theType=='begin'){
      type = 1;
      customerId = data.get("customer.id");
      customerName = data.get("customer.name");
      roomId = data.get("room.id");
      hbsRoomId = "room_"+roomId;
    }else {
      if(data){
        customerPositionObj = JSON.parse(data.content);
      }
      type = customerPositionObj.type;
      customerId = customerPositionObj.customerId;
      customerName = customerPositionObj.customerName;
      roomId = customerPositionObj.roomId;
      floorId = customerPositionObj.floorId;
      hbsRoomId = "room_"+roomId;
      hbsFloorId = "floor_"+floorId;
    }
    let customerSearchList = this.get('customerSearchList');//搜索老人列表
    //当搜索老人列表不为空时，页面只显示搜索老人
    if(customerSearchList&&customerSearchList.get('length')>0){
      if(customerSearchList.findBy('id',customerId)){
        var cusIdArray = this.get("array");
        var divBegin1 = "<div id='customer_"+customerId+"' class='pull-left padding-left-10 customer-icon'><div class='height20 center'><img class='height16 width13' src='assets/images/icon/download.png' alt=''></div><div class=''>";
        var divBegin2 = "<div id='customer_"+customerId+"' class='pull-left padding-left-10 customer-icon'><div class='height20 center'><img class='height16 width13' src='assets/images/icon/download.png' alt=''></div><div class='color-white'>";
        if(cusIdArray.indexOf(customerId)==-1){
          cusIdArray.push(customerId);
          if(type==1){//type是1的就是在room里的
            $("#"+hbsRoomId).append(divBegin1+customerName+"</div></div>");
            $("#customer_"+customerId).addClass("icon-shine");
          }else {
            $("#"+hbsFloorId).append(divBegin2+customerName+"</div></div>");
            $("#customer_"+customerId).addClass("icon-shine");
          }
        }else {//如果当前数组里有 customerId的话，先在页面上remove 一下，再添加到页面变了房间或楼层。
          var $room = $("#"+hbsRoomId);
          var $customer = $("#customer_"+customerId);
          if($customer.parent().offset()){
            let fromX = $customer.parent().offset().left||0;
            let fromY = $customer.parent().offset().top;
            let toX = $("#"+hbsRoomId).offset().left||0;
            let toY = $("#"+hbsRoomId).offset().top;
            let moveX = toX - fromX;
            let moveY = toY - fromY;
            var custOffset = $customer.offset();
            var roomOffset = $room.offset();
            if(type==1){
              // $customer.removeClass("icon-shine");
              $customer.animate({left:moveX+'px',top:moveY+'px'},'slow',function(){
                $customer.remove();//
                $room.append(divBegin1+customerName+"</div></div>");
                $customer.addClass("icon-shine");
              });
          }


          }else {
            $customer.remove();//
            $room.append(divBegin2+customerName+"</div></div>");
            $customer.addClass("icon-shine");
          }
        }
      }else{

      }
    }else{
      let cusIdArray = this.get("array");
      let divBegin1 = "<div id='customer_"+customerId+"' class='pull-left padding-left-10 customer-icon'><div class='height20 center'><img class='height16 width13' src='assets/images/icon/download.png' alt=''></div><div class=''>";
      let divBegin2 = "<div id='customer_"+customerId+"' class='pull-left padding-left-10 customer-icon'><div class='height20 center'><img class='height16 width13' src='assets/images/icon/download.png' alt=''></div><div class='color-white'>";
      if(cusIdArray.indexOf(customerId)==-1){
        cusIdArray.push(customerId);
        if(type==1){//type是1的就是在room里的
          $("#"+hbsRoomId).append(divBegin1+customerName+"</div></div>");
          $("#customer_"+customerId).addClass("icon-shine");
        }else {
          $("#"+hbsFloorId).append(divBegin2+customerName+"</div></div>");
          $("#customer_"+customerId).addClass("icon-shine");
        }
      }else {//如果当前数组里有 customerId的话，先在页面上remove 一下，再添加到页面变了房间或楼层。
        let $room = $("#"+hbsRoomId);
        let $customer = $("#customer_"+customerId);
        if($customer.parent().offset()){
          let fromX = $customer.parent().offset().left||0;
          let fromY = $customer.parent().offset().top;
          let toX = $("#"+hbsRoomId).offset().left||0;
          let toY = $("#"+hbsRoomId).offset().top;
          let moveX = toX - fromX;
          let moveY = toY - fromY;
          let custOffset = $customer.offset();
          let roomOffset = $room.offset();
          if(type==1){
            // $customer.removeClass("icon-shine");
            $customer.animate({left:moveX+'px',top:moveY+'px'},'slow',function(){
              $customer.remove();//
              $room.append(divBegin1+customerName+"</div></div>");
              $customer.addClass("icon-shine");
            });
        }


        }else {
          $customer.remove();//
          $room.append(divBegin2+customerName+"</div></div>");
          $customer.addClass("icon-shine");
        }
      }
    }


  },

  actions:{
    changeDown(){
      let json = this.get("json");
      console.log("inAction changeDown",json);
      this.customerPosition(json);
    },
    chooseRoom(floor,room){
      floor.get('rooms').forEach(function(room){
        room.set('choosed',false);
      });
      room.set('choosed',true);
      let customersName ='';
      let id = '#room_' + room.get('id');
      let customers = $(id).find('.customer-icon');
      customers.each(function(){
        customersName += $(this).text() + ',';
      });
      if(customersName.length===0){
        room.set('customersName','暂无老人');
      }else{
        room.set('customersName',customersName.substring(0,customersName.length-1));
      }


    },
    noChooseRoom(floor,room){
      floor.get('rooms').forEach(function(room){
        room.set('choosed',false);
      });
    },
    selectBuild(build) {
      let _self = this;
      let curbuilding = this.get("curbuilding");
      if(curbuilding){
        if(curbuilding.get("id")==build.get("id")){console.log("点击切换楼宇还是当前楼宇就什么都不做"); return;}
      }
      this.set("array",[]);//每次切换楼宇set这个array为空
      this.set("dataList",'');//
      _self.store.query('locationinfo',{filter:{bid:build.get("id")}}).then(function(dataList){
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
      let customerList = this.get('theCustomerList');
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
      this.get("theCustomerList").forEach(function(item){//都清空
        $("#customer_"+item.get("id")).removeClass(' hasError');
        $("#customer_"+item.get("id")).removeClass('hide');
      });
      this.set("customerList",this.get("theCustomerList"));
    },
    //组件come方法 检索老人
    come(param,buildSearch){
      this.set('queryScheduled',false);//关掉只显示预警老人
      let _self = this;
      this.set('customerSearchList',param);
      let theCustomerList = this.get("theCustomerList");
      theCustomerList.forEach(function(item){//先都清空
        $("#customer_"+item.get("id")).addClass('hide');
      });
      param.forEach(function(item){//再渲染
        console.log("parentDom",$("#customer_"+item.get("id")).parent());
        $("#customer_"+item.get("id")).removeClass('hide');
      });


      this.set("seachCriteria",false);
    },

    queryScheduled(){//只查看预警老人

    },

  }

});
