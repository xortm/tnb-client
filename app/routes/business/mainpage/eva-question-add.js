import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
    dataLoader:Ember.inject.service('data-loader'),
    queryParams: {
        id: {
            refreshModel: true
        },
        editMode: {
            refreshModel: true
        },
    },
    header_title: '新增评估问卷',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.set('customerName','');
        controller.set('customerNum','');
        controller.set('addCus',false);
        controller.set('showCus',true);
        controller.set('showBed',false);
        //构建评估批次（主表）
        controller.set('evaluate', this.store.createRecord('evaluatebatch', {}));
        this.store.query('customer', {
          filter:{
            '[customerStatus][typecode@$like]@$or1---1':'customerStatusIn',
            '[customerStatus][typecode@$like]@$or1---2':'customerStatusTry',
            '[customerStatus][typecode@$like]@$or1---3':'customerStatus0',
            'addRemark':'normal'
          },
        }).then(function(customerList) {
            customerList.forEach(function(customer) {
                //customer.set('namePinyin', pinyinUtil.getFirstLetter(customer.get("name")));
                customer.set('namePinyin', customer.get("name"));
            });
            controller.set('customerList', customerList);
            controller.set('customerListFirst', customerList.get('firstObject'));
        });
        //查询所有的床位
        this.store.query('bed', {}).then(function(bedList) {
            bedList.forEach(function(bed) {
                bed.set('bedPinyin', pinyinUtil.getFirstLetter(bed.get("name")));
            });
            controller.set('bedList', bedList);
        });
        //查询可用的模板规范类型
        // this.store.query('evaluatemodelsource',{}).then(function(sourceList){
        //   controller.set('modelSourceList',sourceList);
        //   controller.send('selectModelSource',sourceList.get('firstObject'));
        // });
        let modelSourceList = new Ember.A();
        this.get('dataLoader.modelSourceList').forEach(function(modelSource){
          modelSourceList.pushObject(modelSource.get('modelSource'));
        });
        controller.set('modelSourceList',modelSourceList);
        controller.send('selectModelSource',modelSourceList.get('firstObject'));
        //查询可用的评估模板列表
        this.store.query('evaluatemodel',{filter:{useFlag: 0,type:{'typecode':'evaluateType2'}}}).then(function(allModelList){
          controller.set('allModelList',allModelList);
        });

    }
});
