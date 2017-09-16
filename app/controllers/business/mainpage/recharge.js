import Ember from 'ember';

export default Ember.Controller.extend({
    dateService: Ember.inject.service("date-service"),
    constants: Constants,
    queryCondition: '',
    mainController: Ember.inject.controller('business.mainpage'),

    actions: {
        //跳转至编辑f服务页
        recharge: function() {
            var money = this.get('money');
            var payurl=""+money;//
            var _self = this;
            _self.store.query('wechatinfo', {
                    filter: {
                        payurl: 'http://api.tiannianbao.net.cn/wechat/wcPay?uid=2&fee=1'      //拼接URL 'http://api.tiannianbao.net.cn/wechat//wcPay'     ?uid=&fee=money
                    }
            }).then(function(dataList) {
                var data = dataList.get('firstObject');
                if (data) {
                    if (data.get('payUrlWithCode')) {
                        console.log('login Success');
                        console.log('userToken',data.get('payUrlWithCode'));
                       window.open(data.get('payUrlWithCode'));
                    }
                }
            });
        },


    }

});
