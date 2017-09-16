import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
export default BaseBusiness.extend(Pagination, {
    queryParams: {
        id: {
            refreshModel: true
        },
        editMode: {
            refreshModel: true
        },
    },
    feedBus: Ember.inject.service("feed-bus"),
    header_title: '评估问卷详情',
    model() {
        return {};
    },
    setupController: function(controller, model) {
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        if (editMode == 'edit') {
            this.store.findRecord('evaluatebatch', id).then(function(evaluate) {
                controller.set('evaluate', evaluate);
                controller.set('addMode', false);
                controller.set("flagEdit", true);
                controller.incrementProperty("changeFlag");
                controller.set('id',id);
            });
        } else {
            controller.set('evaluate', this.store.createRecord('evaluatebatch', {}));
            controller.set('addMode', true);
            controller.set("flagEdit", false);
            controller.incrementProperty("changeFlag");
            //接收选择的评估模板
            controller.useModelObs();
        }
        this.store.query('employee', {}).then(function(userList) {
            controller.set('userList', userList);
        });
        //定义allresultList
        controller.set("allresultList", new Ember.A());
        //定义 selectQuestionObj
        let selectQuestionObj={};
        controller.set("selectQuestionObj",selectQuestionObj);
    },
});
