import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Pagination from '../../routes/business/pagination';
export default BaseItem.extend(Pagination, {
    store: Ember.inject.service("store"),
    didInsertElement: function() {},
    actions: {

    }
});
