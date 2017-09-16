import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
export default BaseModel.extend({
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    title: DS.attr('string'), //标题
    discription: DS.attr('string'), //描述
    picPath1: DS.attr('string'), //图片路径1
    picPath2: DS.attr('string'), //图片路径2
    picPath3: DS.attr('string'), //图片路径3
    picPath4: DS.attr('string'), //图片路径1
    picPath5: DS.attr('string'), //图片路径5
    tenant: DS.belongsTo('tenant'), //对应租户
    holdTime: DS.attr('number'), //举办时间
    url: DS.attr('string'), //对应网页
    activityPlan: DS.belongsTo('activity-plan'), //对应活动计划
    holdTimeDate: Ember.computed("holdTime", function() {
        var holdTime = this.get("holdTime");
        if(!holdTime){
          return null;
        }
        return this.get("dateService").timestampToTime(holdTime);
    }),
    holdTimeString: Ember.computed("holdTime", function() {
        var holdTime = this.get("holdTime");
        if(!holdTime){
          return '';
        }
        return this.get("dateService").formatDate(holdTime, "yyyy-MM-dd hh:mm:ss");

    }),
    //图片路径处理
    picPath1Url: Ember.computed('picPath1', function() {
        var picPath1 = this.get("picPath1");
        if (!picPath1) {
            picPath1 = "upload-img1.png";
            return this.get("pathConfiger").getJujiaLocalPath(picPath1);
        }
        return this.get("pathConfiger").getJujiaRemotePath(picPath1);
    }),
    picPath2Url: Ember.computed('picPath2', function() {
        var picPath2 = this.get("picPath2");
        if (!picPath2) {
            picPath2 = "upload-img1.png";
            return this.get("pathConfiger").getJujiaLocalPath(picPath2);
        }
        return this.get("pathConfiger").getJujiaRemotePath(picPath2);
    }),
    picPath3Url: Ember.computed('picPath3', function() {
        var picPath3 = this.get("picPath3");
        if (!picPath3) {
            picPath3 = "upload-img1.png";
            return this.get("pathConfiger").getJujiaLocalPath(picPath3);
        }
        return this.get("pathConfiger").getJujiaRemotePath(picPath3);
    }),
    picPath4Url: Ember.computed('picPath4', function() {
        var picPath4 = this.get("picPath4");
        if (!picPath4) {
            picPath4 = "upload-img1.png";
            return this.get("pathConfiger").getJujiaLocalPath(picPath4);
        }
        return this.get("pathConfiger").getJujiaRemotePath(picPath4);
    }),
    picPath5Url: Ember.computed('picPath5', function() {
        var picPath5 = this.get("picPath5");
        if (!picPath5) {
            picPath5 = "upload-img1.png";
            return this.get("pathConfiger").getJujiaLocalPath(picPath5);
        }
        return this.get("pathConfiger").getJujiaRemotePath(picPath5);
    }),
});
