import DS from 'ember-data';
import BaseModel from './base-model';
export default BaseModel.extend({
  type:DS.belongsTo('devicetype'),
  item:DS.belongsTo('dicttype'),
  remark:DS.attr('string'),
  typeName:Ember.computed('type',function(){
    let code = this.get('type.codeInfo');
    switch (code) {
      case 'huami':
        return '呼叫及定位方案';
      case 'daerma':
        return '床垫方案';
      case 'yitikang':
        return '体检方案';
      default:
          return '无';
    }
  }),
});
