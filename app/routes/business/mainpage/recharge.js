import Ember from 'ember';

export default Ember.Route.extend({
    queryParams: {
        loginType: {
            refreshModel: true
        }
    },
    header_title: '充值',
    model() {
        return {};
    },
    setupController: function(controller, model) {
        var _self = this;
        controller.set('deterDisabled', false);
        controller.set('responseInfo', '');
        controller.set('deterSDisabled', false);

        this._super(controller, model);

        console.log("controller in", controller);
    },
});
