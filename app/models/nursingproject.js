import DS from 'ember-data';
import BaseModel from './base-model';

var Nursingproject = BaseModel.extend({
    name: DS.attr('string'), //方案名称
    projectType: DS.belongsTo('dicttype'), //方案类型
    customer: DS.belongsTo('customer'), //客户
    createDateTime: DS.attr('number'), //创建时间
    createUser: DS.belongsTo('user'), //创建人
    lastUpdateDateTime: DS.attr('number'), //更新时间
    lastUpdateUser: DS.belongsTo('user'), //更新人
    remark: DS.attr('string'), //备注
    price: DS.attr('string'), //价格
    services: DS.hasMany('nursingprojectitem'), //护理项目
    level:DS.belongsTo('nursinglevel'),//对应的护理等级
    result:DS.belongsTo('evaluateresult'),//对应问卷
    updateFlag:DS.attr('string'),
    servicesName: Ember.computed('services', function() {
        var name = '';
        if (this.get('services')) {
            this.get('services').forEach(
                function(service) {
                    name += service.get('item.name') + '，';
                }
            );
            if (name.length === 0) {
                name = '无';
            } else {
                name = name.substring(0, name.length - 1);
            }
        }

        return name;
    }),
    createTime: Ember.computed('createDateTime', function() {
        var dateOri = this.get("createDateTime");
        var date = new Date(dateOri * 1000);
        if (date === 'Invalid Date') {
            date = '';
        } else {
            date = date.getFullYear() + "-" + this.toDbl(date.getMonth() + 1) + "-" + this.toDbl(date.getDate()) + " " + this.toDbl(date.getHours()) + ":" + this.toDbl(date.getMinutes());
        }
        return date;
    }),
    toDbl: function(value) {
        if (value < 10) {
            return '0' + value;
        } else {
            return '' + value;
        }
    }
});

export default Nursingproject;
