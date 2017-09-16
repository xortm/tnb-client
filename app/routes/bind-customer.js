import Ember from 'ember';

export default Ember.Route.extend({
    queryParams: {
        loginType: {
            refreshModel: true
        }
    },
    header_title: '绑定老人',
    model() {
        return {};
    },
    setupController: function(controller, model) {
      this._super(controller, model);
      var _self = this;
      console.log("location first in bind-customer:" + window.location.href);
      var href = window.location.href;
      console.log("cur href:",href);
      //用户类型，包括公众号C端用户，B端用户
      var code = CommonUtil.analysisParam(href,"code");
      console.log("code in params in bind-customer:"  + code);
      if(code&&code.indexOf("#")>0){
        code = code.substring(0,code.indexOf("#"));
        controller.set("code",code);
      }
      controller.set('deterDisabled', false);
      controller.set('responseInfo', '');
      controller.set('deterSDisabled', false);
      var nowYear = new Date().getFullYear();
      var beginDate = nowYear-80+"-06-15";
      controller.set('beginDate',beginDate);
      Ember.run.schedule("afterRender",this,function() {
        var theWidth = $("#bindCustomer").width();
        console.log("theWidth",theWidth);
        $("#FromDate").css("width",theWidth+'px');
      });
    },
});
