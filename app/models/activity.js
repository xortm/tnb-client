import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
export default BaseModel.extend({
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    title: DS.attr('string'), //标题
    contents: DS.attr('string'), //内容
    pic: DS.attr('string'), //图片
    tenant: DS.belongsTo('tenant'), //对应租户
    type: DS.belongsTo('dicttype'), //类型
    //根据规则拼出完整的url
    picUrl: Ember.computed('pic', function() {
        var pic = this.get("pic");
        if (!pic) {
            pic = "upload-img1.png";
            return this.get("pathConfiger").getJujiaLocalPath(pic);
        }
        console.log("this.pathConfiger", this.get("pathConfiger"));
        return this.get("pathConfiger").getJujiaRemotePath(pic);
    }),


});
