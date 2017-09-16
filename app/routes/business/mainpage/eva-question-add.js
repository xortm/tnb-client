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
    header_title: '新增评估问卷',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        //var editMode = this.getCurrentController().get('editMode');
        //var id = this.getCurrentController().get('id');s
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
        //查询可用的评估模板
        // this.store.query('evaluatemodel', {
        //     filter: {
        //         useFlag: 0
        //     }
        // }).then(function(useModelList) {
        //     controller.set('useModelList', useModelList);
        //     useModelList.forEach(function(useModel) {
        //       useModel.set('hasChoosed',false);
        //       useModel.set('errorClass',false);
        //     });
        // });
    }
});
