import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  pathConfiger:Ember.inject.service("path-configer"),
  name:DS.attr('string'),//菜品名称
  price:DS.attr('string'),//价格
  type:DS.belongsTo('dicttype'),//所属类型：主食、菜、汤
  picture:DS.attr('string'),//图片
  avatarUrl: Ember.computed('picture', function() {
    if(!this.get("name")){
      return null;
    }
    var avatar = this.get('picture');
    if (!avatar) {
        avatar = "drug-img.png";
        return this.get("pathConfiger").getAvatarLocalPath(avatar);
    }
    console.log('picture',this.get("pathConfiger").getAvatarRemotePath(avatar));
    return this.get("pathConfiger").getAvatarRemotePath(avatar);
  }),
  typeId:Ember.computed("type", function() {
      var type = this.get("type");
      return type.get("id");
  }),
});
