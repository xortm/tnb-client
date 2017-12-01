import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
    statusService: Ember.inject.service("current-status"),
    queryParams: {
        id: {
            refreshModel: true
        },
        editMode: {
            refreshModel: true
        },
    },
    header_title: '评估模板选择',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        let tenantId = this.get('statusService').get('tenantId');
        //查询可用的评估模板
        this.store.query('evaluatemodel', {
            filter: {
                useFlag: 0,
                type:{'typecode':'evaluateType2'},
                modelSource:{'remark@$not':'beijing'},
                tenant:{id:tenantId}
            }
        }).then(function(useModelList) {
            controller.set('useModelList', useModelList);
            useModelList.forEach(function(useModel) {
              useModel.set('hasChoosed',false);
              useModel.set('errorClass',false);
            });
        });
    }
});
