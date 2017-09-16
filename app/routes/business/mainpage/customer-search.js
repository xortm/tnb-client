import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    header_title: "",
    model() {
        return {};
    },
    setupController: function(controller, model) {
        this._super(controller, model);
    },
});
