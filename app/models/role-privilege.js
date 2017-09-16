import DS from 'ember-data';
import Ember from 'ember';
/*权限菜单列表*/
var rolePrivilege = DS.Model.extend({
role:DS.belongsTo('role'),
privilege:DS.belongsTo('privilege'),
});
export default rolePrivilege;
