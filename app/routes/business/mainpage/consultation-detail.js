import Ember from 'ember';
import BaseBusiness from '../base-business';
const {consultChannelTel, consultSource6 , liveIntent1} = Constants;
export default BaseBusiness.extend({
    queryParams: {
        id: {
            refreshModel: true
        },
        editMode: {
            refreshModel: true
        },
    },
    detailEdit: true,
    header_title: '咨询信息',
    dataLoader: Ember.inject.service("data-loader"),
    dateService: Ember.inject.service("date-service"),
    model() {
        return {};
    },
    setupController(controller, model) {
        let _self = this;
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        //先生女士选择列表

        if (editMode == 'edit') {
            controller.set('detailEdit', false);
            controller.set("flagEdit", true);
            let consult = this.store.peekRecord('consultinfo', id);
            controller.set('consult', consult);
            this.store.query("backvist", {
                filter: {
                    '[consultInfo][id]': id
                }
            }).then(function(backvistList) {
                backvistList = backvistList.sortBy('createDateTime').reverse();
                controller.set("consult.backVistInfos", backvistList);
            });
        } else {
            let consult =  this.store.createRecord('consultinfo', {});
            consult.set('advDate',this.get('dataLoader').getNowTime());
            consult.set('advGender',this.get('dataLoader').findDict('sexTypeFemale'));
            controller.set("flagEdit", false);
            controller.set('detailEdit', true);
            controller.set('consult',consult);
            //设置几个字典选项的默认值
            //咨询人性别
            let woman = Ember.Object.create({});
            woman.set('name','女士');
            woman.set('sex',_self.get("dataLoader").findDict('sexTypeFemale'));
            controller.send('selectSex',woman);
            //默认接待人
            controller.send('selectStaff',this.get('global_curStatus').getUser().get('employee'));
            //默认咨询方式,电话
            controller.send('channelSelect',this.get("dataLoader").findDict(Constants.consultChannelTel));
            //默认了解渠道，网络媒体
            controller.send('sourceSelect',this.get("dataLoader").findDict(Constants.consultSource6));
            //默认咨询意向
            controller.send('liveIntentSelect',this.get('dataLoader').findDict(Constants.liveIntent1));
        }

        this.store.query("employee", {filter:{
          staffStatus:{'typecode@$not':Constants.staffStatusLeave}
        }}).then(function(employeeList) {
            employeeList.forEach(function(employee) {
                employee.set('receivePinyin', employee.get("name"));
            });
            controller.set("employeeList", employeeList);
            controller.set('staffListFirst', employeeList.get('firstObject'));
        });
    }
});
