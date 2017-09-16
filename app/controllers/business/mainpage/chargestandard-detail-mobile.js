import Ember from 'ember';
import finishService from '../../../controllers/finish-service';

export default Ember.Controller.extend(finishService, {
    refreshFlag: 0,
    dateService: Ember.inject.service("date-service"),
    feedService: Ember.inject.service('feed-bus'),
    dataLoader: Ember.inject.service("data-loader"),
    dataId: Ember.computed("itemId", "itemIdFlag", "source", function() {
        var _self = this;
        if (this.get("source") === 'add') {
        //     this.get("feedBus").set("consultationData", null); //重置feedbus数据
        //     let consultinfo = this.get('store').createRecord('consultinfo', {
        //         advDate:_self.get("dataLoader").getNowTime(),
        //         consultStatus: _self.get('dataLoader').findDict('consultStatus1'),
        //         delStatus: 0
        //     });
        //     consultinfo.save().then(function(data) {
        //       alert("add "+ data.get('id'));
        // return data.get('id');
        //     });
        return -1;
        } else {
            // //从全局上下文服务里拿到外层传递的数据
            // let consultinfoItem = this.get("feedBus").get("consultationData");
            // console.log("customerwarningItemThe computed:", consultinfoItem);
            // this.get("feedBus").set("consultationData", null); //重置feedbus数据
            // //与传参进行比较，一致才设置
            // if (consultinfoItem.get("id") === this.get("itemId")) {
            //     return consultinfoItem.get('id');
            // }

            return this.get("itemId");
        }
    }),


    actions: {
        switchShowAction() {
            this.incrementProperty("directInitScollFlag");
        },

    },
});
