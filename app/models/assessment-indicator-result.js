import DS from 'ember-data';
import BaseModel from './base-model';
export default BaseModel.extend({
  assessment:DS.belongsTo("assessment"),//所属考核
  assessmentIndicator:DS.belongsTo("assessment-indicator"),//对应考核项
  score:DS.attr("number"),//得分
});
