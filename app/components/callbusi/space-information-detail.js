import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';

export default Ember.Component.extend({
    addDict:false,
    showData:false,
    constants: Constants,
    statusService: Ember.inject.service("current-status"),
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    roomGroup:Ember.computed("group",function(){
      var groupcode=this.get("group.typegroupcode");
      console.log("groupcode one is",groupcode);
      if(groupcode=="roomType"){
        return true;
      }else {
        return false;
      }
    }),
    bedGroup:Ember.computed("group",function(){
      var groupcode=this.get("group.typegroupcode");
      console.log("groupcode two is",groupcode);
      if(groupcode=="bedType"){
        return true;
      }else {
        return false;
      }
    }),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.space-information-management');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    actions: {
        //编辑
        editClick:function(){
          this.set("showData",true);
        },
        //删除
        delateClick:function(information){
              var _self = this;
              App.lookup('controller:business.mainpage').showConfirm("是否确定删除此基本信息", function() {
                  App.lookup('controller:business.mainpage').openPopTip("正在删除");
                  information.set("delStatus", 1);
                  information.save().then(function() {
                      App.lookup('controller:business.mainpage').showPopTip("删除成功");
                      _self.set('showpopInvitePassModal', false);
                      var mainpageController = App.lookup('controller:business.mainpage');
                      mainpageController.switchMainPage('space-information-management');
                  });
              });
        },
        //进入详情
        toDetailPage:function(information){
          var _self = this;
          this.set('showpopInvitePassModal', true);
          this.set("information",information);
          this.set("addDict",false);
          this.set("showData",false);
          console.log("toDetailPage addDict is",this.get("addDict"));
        },
        //添加按钮
        addData: function() {
            var _self = this;
            this.set('showpopInvitePassModal', true);
            let information = this.get("store").createRecord('dicttypetenant', {});
            this.set('information', information);
            this.set("addDict",true);
            this.set("showData",true);
            console.log("addData addDict is",this.get("addDict"));
        },
        //弹窗取消
        invitation() {
            this.set('showpopInvitePassModal', false);
        },
        //保存按钮
        saveClick: function() {
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            //alert("保存");
            //this.doQuery();
            this.set("showpopInvitePassModal", false);
            var _self = this;
            var mainpageController = App.lookup('controller:business.mainpage');
            var information=this.get("information");
             if(this.get("addDict")){
               //let information = this.get("store").createRecord('dicttypetenant', {});
               information.set('typename', this.get("information.typename"));
               information.set('remark', this.get("information.remark"));
               information.set('typecode',pinyinUtil.getFirstLetter(this.get("information.typename")));
               console.log("typecode is",pinyinUtil.getFirstLetter(this.get("information.typename")));
             }
               information.set('typegroupTenant',this.get("group"));
               information.save().then(function() {
                //alert("跳转");
                App.lookup('controller:business.mainpage').showPopTip("保存成功");
                var spaceRoute = App.lookup('route:business.mainpage.space-information-management');
                spaceRoute.saveRefresh();
            });
        },
    }
});
