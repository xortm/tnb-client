import Ember from 'ember';

export default Ember.Component.extend({
  init(){
    this._super(...arguments);
    var _self = this;
    Ember.run.schedule("afterRender",function() {
      var customerId = _self.get("customer.id");
      var heartId = "heart_"+customerId;
      var downloadId = "download_"+customerId;
      var warningId = "warning_"+customerId;
      // $("#"+downloadId).hover(
      //   function(){
      //     // $("#downloadHover_"+customerId).show();
      //     $("#downloadHover_"+customerId).addClass("animated slideInDown");
      //   },
      //   function(){
      //     // $("#downloadHover_"+customerId).hide();
      //     $("#downloadHover_"+customerId).removeClass("animated slideInUp");
      //   }
      // );

      // document.getElementById(warningId).onclick=function(){//jQuery 方法 测试用的 click事件
      //   $("#warning_"+customerId).addClass("icon-shine");
      //   setTimeout(function(){
      //     $("#warning_"+customerId).removeClass("icon-shine");
      //       $("#warningHover_"+customerId).slideDown();
      //     setTimeout(function(){
      //         $("#warningHover_"+customerId).slideUp();
      //     },2000);
      //   },2000);
      // };
      // document.getElementById(heartId).onclick=function(){//添加CSS样式方法 测试用的 click事件
      //   $("#heart_"+customerId+" img").addClass("icon-shine");
      // };

      $("#heart_"+customerId+" img").on("webkitAnimationEnd",function(){
        $(this).removeClass("icon-shine");
        $("#heartHover_"+customerId).addClass("slide");
      });
      $("#heartHover_"+customerId).on("webkitAnimationEnd",function(){
        console.log("webkitAnimationEnd heartHover_");
        $(this).removeClass("slide");
      });

      $("#download_"+customerId+" img").on("webkitAnimationEnd",function(){
        $(this).removeClass("icon-shine");
        $("#downloadHover_"+customerId).addClass("slide");
      });
      $("#downloadHover_"+customerId).on("webkitAnimationEnd",function(){
        console.log("webkitAnimationEnd downloadHover_");
        $(this).removeClass("slide");
      });

      $("#warning_"+customerId+" img").on("webkitAnimationEnd",function(){
        $(this).removeClass("icon-shine");
        $("#warningHover_"+customerId).addClass("slide");
      });
      $("#warningHover_"+customerId).on("webkitAnimationEnd",function(){
        console.log("webkitAnimationEnd warningHover_");
        $(this).removeClass("slide");
      });

    });
  },
  actions:{
    showelder(type){
      this.sendAction('showelder',type,this.get("customer.id"));
    },
  }
});
