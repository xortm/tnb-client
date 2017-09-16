import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
    title: DS.attr('string'), //名称
    remark: DS.attr('string'), //备注
    remarkString: Ember.computed("remark", function() {
        var remark = this.get("remark");
        if (remark) {
            if (remark.length > 10) {
                return remark.substring(0, 9) + "...";
            } else {
                return remark;
            }
        } else {
            return null;
        }
    }),
    titleString: Ember.computed("title", function() {
        var title = this.get("title");
        if (title) {
            if (title.length > 10) {
                return remark.substring(0, 9) + "...";
            } else {
                return title;
            }
        } else {
            return null;
        }
    }),
});
