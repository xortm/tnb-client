import Ember from 'ember';
import Changeset from 'ember-changeset';
import FoodValidations from '../../../validations/food';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Controller.extend(FoodValidations,{
    constants: Constants,
    queryCondition:'',
    pathConfiger: Ember.inject.service("path-configer"),
    uploadUrl: Ember.computed('property', function() {
        return this.get("pathConfiger").get("uploadUrl");
    }),
    foodModel:Ember.computed("foodInfo",function(){
      var model = this.get("foodInfo");
      if (!model) {
        return null;
      }
      return new Changeset(model, lookupValidator(FoodValidations), FoodValidations);
    }),
    actions:{
      uploadSucc: function(response) {
          var res = JSON.parse(response);
          this.get("foodInfo").set("picture", res.relativePath);
      },
      addNewFood(food){
        this.set('showpopInvitePassModal',true);
        let foodInfo;
        if(food){
          foodInfo = food;
        }else{
          this.set('addDict',true);
          this.set('showData',true);
          this.set('detailModify',true);
          foodInfo = this.store.createRecord('food',{});
        }
        this.set('foodInfo',foodInfo);
      },
      invitation(){
        this.set('showpopInvitePassModal',false);
        this.set('showData',false);
        this.set('addDict',false);
        this.set('showData',false);
      },
      foodTypeSelect(type){
        this.set('foodModel.type',type);
      },
      saveClick(){
        let foodModel = this.get('foodModel');
        let _self = this;
        foodModel.validate().then(function(){
          if(foodModel.get('errors.length')===0){
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            foodModel.save().then(function(){
              _self.set('showpopInvitePassModal',false);
              _self.set('showData',false);
              _self.set('addDict',false);
              _self.set('showData',false);
              _self.set('detailModify',false);
              App.lookup('controller:business.mainpage').showPopTip("保存成功");
              App.lookup('route:business.mainpage.dishes-management').doQuery();
            },function(err){
              App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
            });
          }else{
            foodModel.set("validFlag",Math.random());
          }
        });
      },
      editClick(){
        this.set('showData',true);
        this.set('detailModify',true);
      },
      delateClick(){
        var _self = this;
        App.lookup('controller:business.mainpage').showConfirm("是否确定删除此菜品信息",function(){
            _self.send('cancelPassSubmit',_self.get('foodInfo'));
        });
      },
      cancelPassSubmit(foodInfo){
        let _self = this;
        App.lookup('controller:business.mainpage').openPopTip("正在删除");
        foodInfo.set('delStatus',1);
        foodInfo.save().then(function(){
          _self.set('showpopInvitePassModal',false);
          _self.set('showData',false);
          _self.set('addDict',false);
          _self.set('showData',false);
          _self.set('detailModify',false);
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          App.lookup('route:business.mainpage.dishes-management').doQuery();
        }, function(err) {
            let error = err.errors[0];
            if (error.code === "8") {
              App.lookup("controller:business.mainpage").showAlert("此菜品已经选入菜单，不能删除");
              App.lookup('controller:business.mainpage').showPopTip("删除失败",false);
            }
        });
      },
    }

});
