import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    loginType: {
      refreshModel: true
    }
  },
  setupController: function(controller,model){
    var _self = this;
    controller.getJujia();
    controller.set('deterDisabled',false);
    controller.set('responseInfo','');
    controller.set('deterSDisabled',false);

    this._super(controller, model);
    console.log("controller in",controller);
    Ember.run.schedule('afterRender',function(){
      $('section').parent().css('height','100%');
      //判断浏览器版本
      let browser = navigator.userAgent;
      console.log('浏览器版本',browser);
      if(browser.indexOf('QQBrowser')!==-1){
        Ember.run.schedule('afterRender',function(){
          var selectors = document.getElementsByTagName("input");
          console.log(selectors);
            for(var i=0;i<selectors.length;i++){
              if(selectors[i].id!=='userLoginBtn'){
                selectors[i].value = "";
              }
            }
        });
      }
    });

  },
});
