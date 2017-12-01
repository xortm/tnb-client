import Ember from 'ember';
import Changeset from 'ember-changeset';
import PurchasegoodsValidations from '../../../validations/purchasegoods';
import GoodsValidations from '../../../validations/goods';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(PurchasegoodsValidations,GoodsValidations, {
    constants: Constants,
    detailEdit: false,
    delFlag: true,
    dateService: Ember.inject.service("date-service"),
    dataLoader:Ember.inject.service('data-loader'),
    store: Ember.inject.service("store"),
    purchaseModel:Ember.computed("purchasegoodsInfo",function(){
      var model = this.get("purchasegoodsInfo");
      if (!model) {
        return null;
      }
      return new Changeset(model, lookupValidator(PurchasegoodsValidations), PurchasegoodsValidations);
    }),
    purchaseModelObs:function(){
      var model = this.get("purchasegoodsInfo");
      if (!model) {
        return null;
      }
      let purchaseModel = new Changeset(model, lookupValidator(PurchasegoodsValidations), PurchasegoodsValidations);
      this.set('purchaseModel',purchaseModel);
    },
    actions: {
        invalid() {
            //alert("invalid");
        },
        invitation(){
          this.set('addNewGoodsModel',false);
        },
        //编辑
        detailEditClick(){
          this.set('detailEdit',true);
          this.purchaseModelObs();
        },
        //删除
        delById(){
          var _self = this;
          App.lookup('controller:business.mainpage').showConfirm("是否确定删除此采购记录",function(){
            _self.send('cancelPassSubmit',_self.get('purchaseModel'));
          });
        },
        cancelPassSubmit(purchase){
          App.lookup('controller:business.mainpage').openPopTip("正在删除");
          this.set("showpopInvitePassModal",false);
          purchase.set("delStatus", 1);
          purchase.save().then(function() {
            App.lookup('controller:business.mainpage').showPopTip("删除成功");
            var mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('purchase-management');
          });
        },
        //选择物品
        selectGoods(goods){
          this.set('purchaseModel.goods',goods);
        },
        //选择采购类型
        purchaseTypeSelect(purchaseType){
          this.set('purchaseModel.purchaseType',purchaseType);
        },
        //选择采购时间
        changePurchaseAction(date){
          let stamp = this.get("dateService").timeToTimestamp(date);
          this.set("purchaseModel.purchaseTime", stamp);
        },
        //保存采购信息
        savePurchase(){
          let _self = this;
          let purchaseModel = this.get('purchaseModel');
          let editMode = this.get('editMode');
          purchaseModel.validate().then(function(){
            if(purchaseModel.get('errors.length')===0){
              App.lookup('controller:business.mainpage').openPopTip("正在保存");
              purchaseModel.save().then(function(){
                App.lookup('controller:business.mainpage').showPopTip("保存成功");
                if(editMode == 'edit'){
                  _self.set('detailEdit',false);
                  var route=App.lookup('route:business.mainpage.purchase-detail');
                  route.refresh();//刷新页面
                }else if(editMode == 'add'){
                  var mainpageController = App.lookup('controller:business.mainpage');
                  mainpageController.switchMainPage('purchase-management');
                }
              },function(err){
                App.lookup('controller:business.mainpage').showPopTip("保存失败");
              });
            }else{
              purchaseModel.set("validFlag",Math.random());
            }
          });
        },
        //取消
        detailCancel(){
          let editMode = this.get('editMode');
          if(editMode == 'edit'){
            this.get('purchasegoodsInfo').rollbackAttributes();
            this.set('detailEdit',false);
            var route=App.lookup('route:business.mainpage.purchase-detail');
            route.refresh();//刷新页面
          }else if(editMode == 'add'){
            var mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('purchase-management');
          }
        },
        //新增物品弹层
        toAddGoods(){
          this.set('addNewGoodsModel',true);
          let goodsInfo = this.store.createRecord('cargo',{});
          let goodsModel = new Changeset(goodsInfo, lookupValidator(GoodsValidations), GoodsValidations);
          this.set('goodsModel',goodsModel);
        },
        //选择物品类型
        goodsTypeSelect(goodsType){
          this.set('goodsModel.goodsType',goodsType);
        },
        //保存新物品
        saveNewGoods(){
          let _self = this;
          let goodsModel = this.get('goodsModel');
          goodsModel.validate().then(function(){
            if(goodsModel.get('errors.length')===0){
              App.lookup('controller:business.mainpage').openPopTip("正在保存");
              goodsModel.save().then(function(goods){
                App.lookup('controller:business.mainpage').showPopTip("保存成功");
                _self.send('selectGoods',goods);
                _self.set('addNewGoodsModel',false);
              },function(err){
                App.lookup('controller:business.mainpage').showPopTip("保存失败");
              });
            }else{
              goodsModel.set('validFlag',Math.random());
            }
          });
        }
    }
});
