import Ember from 'ember';

export default Ember.Controller.extend({
  constants: Constants,
  dataLoader:Ember.inject.service('data-loader'),
  foodPlanInfo:Ember.computed('allFoodList','hasFoodList','foodplan',function(){
    let _self = this;
    let diningDate = this.get('foodplan.diningDate');
    let foodplan = this.get('foodplan');
    let allFoodList = this.get('allFoodList');
    let hasFoodList = this.get('hasFoodList');
    let foodTimeList = this.get('foodTimeList');
    let foodTypeList = this.get('foodTypeList');
    let showFoodlist = new Ember.A();
    let breakfastType = this.get('dataLoader').findDict('foodTimeType1');
    let lunchType = this.get('dataLoader').findDict('foodTimeType5');
    let dinnerType = this.get('dataLoader').findDict('foodTimeType9');
    let breakfastplans = new Ember.A();
    let lunchplans = new Ember.A();
    let dinnerplans = new Ember.A();
    let hasBreakfastPlans = new Ember.A();//已有早餐食物
    let hasLunchPlans = new Ember.A();//已有午餐食物
    let hasDinnerPlans = new Ember.A();//已有晚餐食物
    if(!allFoodList){
      return ;
    }
    foodTimeList.forEach(function(foodTime){//用餐时间，早餐、午餐、晚餐
      let item = Ember.Object.create({});
      item.set('foodTime',foodTime);
      console.log('用餐时间：',foodTime.get('typename'));
      showFoodlist.pushObject(item);
    });
    showFoodlist.forEach(function(showFood){
      //该餐已有的食物
      if(hasFoodList){
        var foodList = hasFoodList.filter(function(hasfood){
          return hasfood.get('diningTime.typecode') == showFood.get('foodTime.typecode');
        });
      }

      let itemList = new Ember.A();
      //每餐的食物种类
      foodTypeList.forEach(function(foodType){
        let item = Ember.Object.create({});
        item.set('foodType',foodType);
        let list = new Ember.A();
        //该类已有的食物
        if(foodList){
          var typeList = foodList.filter(function(hasfood){
            return hasfood.get('food.type.typecode') == foodType.get('typecode');
          });
        }
        let typeFoodList = allFoodList.filter(function(food){//该种类的所有食物
          return food.get('type.typecode') == foodType.get('typecode');
        });
        typeFoodList.forEach(function(typeFood){
          let food ;
          if(typeList&&typeList.findBy('food.id',typeFood.get('id'))){//已有食物，设为已选
            food = typeList.findBy('food.id',typeFood.get('id'));
            food.set('hasChoosed',true);
          }else{//没有的食物，新建并设置未选
            food = _self.store.createRecord('customer-food-plan',{});
            food.set('diningDate',diningDate);
            food.set('food',typeFood);
            food.set('diningTime',showFood.get('foodTime'));
            food.set('dayPlan',foodplan);
            food.set('hasChoosed',false);
          }
          list.pushObject(food);
        });
        item.set('list',list);
        itemList.pushObject(item);
      });
      showFood.set('list',itemList);
    });
    return showFoodlist;
  }),
  actions:{
    invalid() {
        //alert("error");
    },
    choosed(plan){
      if(plan.get('hasChoosed')){
        plan.set('hasChoosed',false);
        plan.set('delStatus',1);
      }else{
        plan.set('hasChoosed',true);
      }
      plan.save().then(function(){

      },function(err){
        App.lookup('controller:business.mainpage').showSimPop('保存失败');
      });
    }
  }
});
