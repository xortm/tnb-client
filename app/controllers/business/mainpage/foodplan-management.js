import Ember from 'ember';
import Changeset from 'ember-changeset';
import FoodDayPlanValidations from '../../../validations/fooddayplan';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Controller.extend(FoodDayPlanValidations,{
    constants: Constants,
    curStatus:Ember.inject.service('current-status'),
    mainController: Ember.inject.controller('business.mainpage'),
    dateService: Ember.inject.service("date-service"),
    chooseDate:Ember.computed('showStartDate','showEndDate','dateQueryCondition',function(){
      if(this.get('dateQueryCondition')){
        let dateQueryCondition = this.get('dateQueryCondition');
        if(dateQueryCondition == 'today'){
          return '今天';
        }else if(dateQueryCondition == 'seven'){
          return '最近7天';
        }else if(dateQueryCondition == 'thirty'){
          return '最近30天';
        }else{
          if(this.get('showStartDate')&&this.get('showEndDate')){
            return this.get('showStartDate')+'至'+this.get('showEndDate');
          }else{
            return '选择日期';
          }
        }

      }else{
        return '选择日期';
      }
    }),
    actions: {
      invalid(){},
        invitation(){
          this.set('addFoodPlanModel',false);
        },
        dpShowAction(e) {
        },
        toDetailPage(recharge) {
          let id = recharge.get('id');

                this.get("mainController").switchMainPage('foodplan-detail', {
                    id: id
                });

        },
        search(flag){
          this.set("dateQueryCondition", flag);
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.foodplan-management").doQuery();
        },
        //时间选择器确定
        submmit(){
          this.set('dateShow', false);
          this.set("dateQueryCondition", 'flag');
          App.lookup("route:business.mainpage.foodplan-management").doQuery();
        },
        //清空时间
        emptied(){
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set("dateQueryCondition", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.foodplan-management").doQuery();
        },
        changeBeginDateAction(date) {
            var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
            this.set("beginDate",date);
            this.set('showStartDate',stamp);
        },
        changeEndDateAction(date) {
            var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
            this.set("endDate",date);
            this.set('showEndDate',stamp);
        },
        changeDiningDateAction(date){
          let stamp = this.get("dateService").timeToTimestamp(date);
          this.set("foodplanModel.diningDate", stamp);
        },
        toAddFoodPlan(){

          let foodplan = this.store.createRecord('customerdayfoodplan',{});
          let foodplanModel = new Changeset(foodplan, lookupValidator(FoodDayPlanValidations), FoodDayPlanValidations);
          this.set('foodplanModel',foodplanModel);
          this.set('addFoodPlanModel',true);
        },
        saveNewFoodPlan(){
          let _self = this;
          let foodplanModel = this.get('foodplanModel');
          let foodplanList = this.get('foodplanList');

          foodplanModel.validate().then(function(){
              if(foodplanModel.get('errors.length')===0){
                _self.set('addFoodPlanModel',false);
                if(foodplanList.findBy('diningDate',foodplanModel.get('diningDate'))){//如果当天已有订餐记录，则直接跳转该记录的详情页
                  let id = foodplanList.findBy('diningDate',foodplanModel.get('diningDate')).get('id');
                  App.lookup('controller:business.mainpage').showSimPop('当前日期已有订餐记录');
                  _self.get("mainController").switchMainPage('foodplan-detail', {
                      id: id,
                  });
                }else{
                  foodplanModel.save().then(function(food){
                    _self.get("mainController").switchMainPage('foodplan-detail', {
                        id: food.get('id')
                    });
                  });
                }
              }else{
                foodplanModel.set('validFlag',Math.random());
              }
          });
        }
    }
});
