import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  feedBus: Ember.inject.service("feed-bus"),
  pathConfiger: Ember.inject.service("path-configer"),
  dateService: Ember.inject.service("date-service"),
  statusService: Ember.inject.service("current-status"),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"customerOrderingDetailContainer",
  scrollPrevent: true,
  constants:Constants,
  lookFlag:true,

  //初始化数据
  serviceItemObs:function(){
    var _self = this;
    this._showLoading();
    let itemIdFlag = this.get("itemIdFlag");
    if(!itemIdFlag){return;}
    //从全局上下文服务里拿到外层传递的数据
    let itemData = _self.get("feedBus").get("customerOrderingData");
    console.log("itemData computed:",itemData);
    let itemDataId = itemData.get("id");
    console.log('itemDataId',itemDataId);
    let customerFoodPlanList;
    if(itemDataId==_self.get("itemId")){
      _self.set("customerdayfoodplan",itemData);
      let dateStr = itemData.get("diningDateFirstStr");
      let diningDateStr = itemData.get("diningDateStr");
      console.log("diningDate22",dateStr);
      _self.set("diningDate",dateStr);
      _self.set("diningDateStr",diningDateStr);
      customerFoodPlanList = itemData.get("plans");
    }else{
      customerFoodPlanList = null;
    }
    let source = _self.get("source");
    if(source == "add"){
      // let diningDate = this.get("diningDate");
      // console.log("diningDate add:",diningDate);
      // let diningDateStr = _self.get("dateService").formatDate(Number(diningDate),"yyyy-MM-dd");
      // console.log("diningDateStr add:",diningDateStr);
      // _self.set("diningDateStr",diningDateStr);
      // _self.set("diningDate",diningDate);
      _self.set("lookFlag",false);
    }else if(source == "edit"){
      _self.set("lookFlag",false);
    }else if(source == "look"){
      _self.set("lookFlag",true);
    }
    let foodList = this.get("dataLoader").get("foodList");
    let foodListSort = foodList.sortBy("typeId");
    console.log("foodListSort",foodListSort);
    let foodTimeTypelist = this.get("dataLoader").findDictList(Constants.foodTimeType);

    let allList = new Ember.A();
    foodTimeTypelist.forEach(function(foodTimeTypeItem){
      let timeObj = Ember.Object.create({
        foodTimeType:foodTimeTypeItem,
        foodTimeTypeName:foodTimeTypeItem.get("typename"),
        foodTimeTypeCode:foodTimeTypeItem.get("typecode"),
        foodTypelist:new Ember.A(),
      });
      let foodTypeObj = null;
      foodListSort.forEach(function(foodItem){
        if(!foodTypeObj||foodTypeObj.get("foodLoopId")!=foodItem.get("typeId")){
          foodTypeObj = Ember.Object.create({
            foodLoopId:foodItem.get("typeId"),
            // foodlistLength:foodItem.get("typeId"),
            foodType:foodItem.get("type"),
            foodTypeName:foodItem.get("type.typename"),
            foodTypeCode:foodItem.get("type.typecode"),
            foodlist:new Ember.A(),
          });
          timeObj.get("foodTypelist").pushObject(foodTypeObj);
        }
        let source = _self.get("source");
        console.log("source:",source);
        let foodObj = null;
        let key = foodTimeTypeItem.get("id") + "_" + foodItem.get("id");
        if(source == "edit"||source == "look"){
          let exitFood = customerFoodPlanList.findBy("foodDayPlan",key);
          if(exitFood){
            foodObj = Ember.Object.create({
              item:foodItem,
              selected:true,
              loadingFlag:false,
              exitFood:exitFood,
              key:key,
            });
          }else{
            foodObj = Ember.Object.create({
              item:foodItem,
              selected:false,
              loadingFlag:false,
              key:key,
            });
          }
        }else{
          foodObj = Ember.Object.create({
            item:foodItem,
            selected:false,
            loadingFlag:false,
            key:key,
          });
        }
        foodTypeObj.get("foodlist").pushObject(foodObj);
      });
      allList.pushObject(timeObj);
    });
    let allListAfter = new Ember.A();
    allList.forEach(function(allListItem){
      allListItem.get("foodTypelist").forEach(function(foodTypelistItem){
        let selectLength = 0;
        foodTypelistItem.get("foodlist").forEach(function(foodlistItem){
          if(foodlistItem.get("selected")){
            selectLength++;
          }
          allListAfter.pushObject(foodlistItem);
        });
        foodTypelistItem.set("selectLength",selectLength);
      });
    });

    _self.set("allList",allList);
    _self.set("allListAfter",allListAfter);
    _self.hideAllLoading();
    _self.directInitScoll(true);

  }.observes("itemIdFlag"),

  actions: {
    tapIten(foodObj,foodType,foodTimeType){
      var _self = this;
      let curUser = this.get("statusService").getUser();
      let foodplan = this.get('customerdayfoodplan');
      console.log("foodObj tap:",foodObj);
      console.log("foodType tap:",foodType);
      console.log("foodTimeType tap:",foodTimeType);
      let allListAfter = _self.get("allListAfter");
      let key = foodTimeType.get("id") + "_" + foodObj.get("item.id");
      let foodSelectObj = allListAfter.findBy("key",key);
      if(foodSelectObj.get("loadingFlag")){
        return ;
      }else{
        if(foodObj.get("selected")){
          console.log("foodSelectObj11:",foodSelectObj);
          if(foodSelectObj){
            foodSelectObj.set("selected",false);
            foodSelectObj.set("loadingFlag",true);
            // this.get('store').findRecord('customer-food-plan', foodSelectObj.get("exitFood.id")).then(function(art) {
            //     art.destroyRecord();
            //     foodSelectObj.set("exitFood",null);
            //     foodSelectObj.set("loadingFlag",false);
            // });
            foodSelectObj.get("exitFood").destroyRecord().then(function(food){
              foodSelectObj.set("exitFood",null);
              foodSelectObj.set("loadingFlag",false);
            });
          }
        }else{
          let item = _self.get('store').createRecord('customer-food-plan',{});
          item.set('diningDate',_self.get("diningDate"));
          item.set('diningTime',foodTimeType);
          item.set('food',foodObj.get("item"));
          item.set('dayPlan',foodplan);
          item.set('createUser',curUser);
          console.log("foodSelectObj22:",foodSelectObj);
          if(foodSelectObj){
            foodSelectObj.set("selected",true);
            foodSelectObj.set("loadingFlag",true);
            _self.get("global_ajaxCall").set("dur-noprevent","yes");
            item.save().then(function(food){
              foodSelectObj.set("exitFood",food);
              foodSelectObj.set("loadingFlag",false);
            });
          }
        }

      }

    },
    editCustomerOrder(){
      var _self = this;
      var itemId = "editCustomerOrderBut";
      $("." + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("." + itemId).removeClass("tapped");
        Ember.run.later(function(){
          _self.set("lookFlag",false);
        },100);
      },200);
    },


  },

});
