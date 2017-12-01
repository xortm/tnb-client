import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  staff:DS.belongsTo('employee'),
  remark:DS.attr('string'),
  createDateTime:DS.attr('number'),
  item:DS.belongsTo('dicttype'),
  createTimeStr: Ember.computed("createDateTime", function() {
      var createDate = this.get("createDateTime");
      return createDate?this.get("dateService").formatDate(createDate, "yyyy-MM-dd"):'';
  }),
});
