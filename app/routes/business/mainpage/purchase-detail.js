import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
    queryParams: {
        id: {
            refreshModel: true
        },
        editMode: {
            refreshModel: true
        },
    },
    detailEdit: true,
    header_title: '采购信息',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        //物品列表下拉框
        this.store.query('cargo',{}).then(function(goodsList){
          let list = new Ember.A();
          goodsList.forEach(function(goods){
            goods.set('namePinyin',pinyinUtil.getFirstLetter(goods.get("name")));
            list.pushObject(goods);
          });
          controller.set('goodsList',list);
        });
        if(editMode == 'edit'){
          let purchasegoodsInfo = this.store.peekRecord('purchasegood',id);
          controller.set('purchasegoodsInfo',purchasegoodsInfo);
          controller.set('detailEdit',false);
        }else if(editMode == 'add'){
          let purchasegoodsInfo = this.store.createRecord('purchasegood',{});
          controller.set('purchasegoodsInfo',purchasegoodsInfo);
          controller.purchaseModelObs();
          controller.set('detailEdit',true);
        }
    }
});
