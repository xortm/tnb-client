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
    header_title: '新增评估问卷-二级页',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        //var editMode = this.getCurrentController().get('editMode');
        //var id = this.getCurrentController().get('id');
        //查询可用的评估模板
        this.store.query('evaluatemodel', {
            filter: {
                useFlag: 0
            }
        }).then(function(useModelList) {
            controller.set('useModelList', useModelList);
            useModelList.forEach(function(useModel) {              
              console.log('eva-model-add-route:useModel',useModel);
              useModel.set('hasChoosed',false);
              useModel.set('errorClass',false);
            });
        });
    }
});
