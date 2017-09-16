import Ember from 'ember';
import BaseController from './base-controller';

export default BaseController.extend({
    constants: Constants,
    mainController: Ember.inject.controller('business.mainpage'),
    dateService: Ember.inject.service("date-service"),
    chooseDate: Ember.computed('showStartDate', 'showEndDate', 'queryCondition', function() {
        if (this.get('queryCondition')) {
            let queryCondition = this.get('queryCondition');
            if (queryCondition == 'today') {
                return '今天';
            } else if (queryCondition == 'seven') {
                return '最近7天';
            } else if (queryCondition == 'thirty') {
                return '最近30天';
            } else {
                if (this.get('showStartDate') && this.get('showEndDate')) {
                    return this.get('showStartDate') + '至' + this.get('showEndDate');
                } else {
                    return '选择日期';
                }
            }

        } else {
            return '选择日期';
        }
    }),
    actions: {
        dpShowAction(e) {},
        toDetailPage(holdInfo) {
            if (holdInfo) {
                let id = holdInfo.get('id');
                console.log("++++++++id++++++++++++++++**********", id);
                this.get("mainController").switchMainPage('activity-list-detail', {
                    id: id,
                    editMode: "edit"
                });
            } else {
                this.get("mainController").switchMainPage('activity-list-detail', {
                    editMode: "add",
                    id: ""
                });
            }
        },
        search(flag) {
            this.set("queryCondition", flag);
            this.set("beginDate", null);
            this.set("endDate", null);
            this.set('dateShow', false);
            App.lookup("route:business.mainpage.activity-list ").doQuery();
        },
        //时间选择器确定
        submmit() {
            this.set('dateShow', false);
            this.set("queryCondition", 'flag');
            App.lookup("route:business.mainpage.activity-list").doQuery();
        },
        //清空时间
        emptied() {
            this.set("beginDate", null);
            this.set("endDate", null);
            this.set("queryCondition", null);
            this.set('dateShow', false);
            App.lookup("route:business.mainpage.activity-list").doQuery();
        },
        changeBeginDateAction(date) {
            var stamp = this.get("dateService").dateFormat(date, "yyyy-MM-dd");
            this.set("beginDate", date);
            this.set('showStartDate', stamp);
        },
        changeEndDateAction(date) {
            var stamp = this.get("dateService").dateFormat(date, "yyyy-MM-dd");
            this.set("endDate", date);
            this.set('showEndDate', stamp);
        },
    }
});
