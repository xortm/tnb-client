import DS from 'ember-data';
import Ember from 'ember';
/*权限菜单列表*/
var Privilege = DS.Model.extend({
    code: DS.attr('string'),
    //  description: DS.attr('string'),
    remark: DS.attr('string'),
    showName: DS.attr('string'),
    mobileMenuName: DS.attr('string'), //移动端菜单名
    mobileIcon: DS.attr('string'), //移动端菜单图标
    type: DS.attr('number'), //权限类型，1：菜单 2：按钮 3：链接  11:移动端菜单 21:老人公众号菜单
    level: DS.attr('number'), //权限级别
    link: DS.attr('string'), //链接地址
    icon: DS.attr('string'),
    order: DS.attr('number'), //排序号
    systemType:DS.attr('number'),//权限类别: 1机构2居家 
    delStatus: DS.attr('number'), //删除状态 1已删除0未删除
    children: DS.hasMany('privilege', {
        inverse: 'parent'
    }),
    parent: DS.belongsTo('privilege', {
        inverse: 'children'
    }),
    childPrivleges: Ember.computed(function(){
      return new Ember.A();
    }),
    isMobile:Ember.computed('mobileMenuName',function(){
      if(Ember.isEmpty(this.get("mobileMenuName"))){
        return 0;
      }
      console.log("type is:" + this.get("type"));
      if(this.get("type")===11){
        return 1;
      }
      if(this.get("type")===21){
        return 2;
      }
    }),
    //页面属性
    page_hasSelected:false,//是否已选
});
export default Privilege;
