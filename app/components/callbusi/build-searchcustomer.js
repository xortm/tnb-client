import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service("store"),
  dataLoader: Ember.inject.service("data-loader"),
  searchCustomer:true,//默认人名搜索

  customerObs:function(){
    var bedList = this.get('dataLoader.allBedList');
    var customerList = this.get('theCustomerList');
    if(!customerList){
      return;
    }
    var roomList = new Ember.A();
    var floorList = new Ember.A();
    var hasCusBedList = new Ember.A();
    bedList.forEach(function(bed){
      console.log('bedList bed:' + bed.get("id") + "and floor:" + bed.get('room.floor.id'));
    });
    // customerList.forEach(function(customerItem,index){
    //   var hasCusBed = bedList.findBy("id",customerItem.get("bed.id"));
    //   hasCusBed.set("customer",customerItem);
    //   console.log("seaech roomId",hasCusBed.get("room.id"),index);
    //   hasCusBedList.pushObject(hasCusBed);
    bedList.forEach(function(bed){
      if(!roomList.findBy('id',bed.get('room.id'))){
        roomList.pushObject(bed.get('room'));
      }
    });
    console.log("seaech roomList",roomList);
    roomList.forEach(function(room,index){
      let beds = bedList.filter(function(bed){
        return bed.get('room.id')==room.get('id');
      });
      // let customers = new Ember.A();
      // customerList.forEach(function(customer){
      //   if(beds.findBy('id',customer.get('bed.id'))){
      //     let bed = beds.findBy('id',customer.get('bed.id'));
      //     customer.set('curBed',bed);
      //     customers.pushObject(customer);
      //   }
      // });
      // room.set('customers',customers);
      if(!floorList.findBy('id',room.get('floor.id'))){
        floorList.pushObject(room.get('floor'));
      }
    });
    floorList.forEach(function(floor){
      let rooms = roomList.filter(function(room){
        return room.get('floor.id')==floor.get('id');
      });
      floor.set('currooms',rooms);
      let name = floor.get('building.name') + '-' + floor.get('name');
      floor.set('allname',name);
    });
    console.log("seaech floorList",floorList);
    this.set("buildList",floorList);
  }.observes("theCustomerList").on("init"),

  actions:{
    searchName(){
      this.set('searchCustomer',true);
    },
    searchRoom(){
      this.set('searchCustomer',false);
    },
    searchHide(){
      this.sendAction("searchHide");
    },
    queryAll(){
      this.sendAction("queryAll");
    },
    //power-select多选
    checkLength(text, select ) {
      if (select.searchText.length >= 3 && text.length < 3) {
        return '';
      } else {
        return text.length >= 3;
      }
    },
    //选择楼宇楼层
    selectBuild(buildFloor){
      this.set('curBuild',buildFloor);
    },
    //选择房间
    selectRoom(room){
      this.set('curRoom',room);
      this.set("SearchFlag",true);
    },
    //组件come方法 检索老人
    come(){
      var _self = this;
      var customers =  this.get('customers');
      var customerList = this.get("theCustomerList");
      console.log("customers",customers);
      var curRoom = this.get("curRoom");
      var curBuild = this.get("curBuild");
      var SearchFlag = this.get("SearchFlag");
      if(customers){
        this.sendAction("come",customers);
      }else if (curRoom) {
        let roomCustomers = customerList.filter(function(customer){
          return customer.get('bed.room.id')==curRoom.get('id');
        });
        console.log("customers11111111111 curRoom",roomCustomers);
        this.sendAction("come",roomCustomers);
      }else if (curBuild) {
        var beds = new Ember.A();
        var rooms = curBuild.get("rooms");
        let floorCustomers = customerList.filter(function(customer){
            return rooms.findBy("id",customer.get('bed.room.id'));
        });
        console.log("customers11111111111 curBuild",floorCustomers);
        this.sendAction("come",floorCustomers);
      }else {
        this.set("theMessage","请选择检索条件");
        setTimeout(function(){
          _self.set("theMessage","");
        },3000);
      }

    },


  },
});
