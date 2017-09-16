import DS from 'ember-data';
import User from '../user';

export default User.extend({
  current: DS.attr('number'),//是否当前用户，1是0否
  token:DS.attr('string')
});
