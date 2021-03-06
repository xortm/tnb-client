import Ember from 'ember';

export default Ember.Controller.extend({
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  exportDef:{
    "model":"user",
    "export":{
      "title":"用户列表",
      "cols":[{"name":"name","title":"用户姓名"},
              {"name":"role.name","title":"系统角色"},
              {"name":"staffStatus.typename","title":"状态"},
              {"name":"employee.name","title":"对应员工"}],
      },
  },

  uploadUrl: Ember.computed('property', function() {
      return this.get("pathConfiger").get("uploadUrl");
  }),
  actions:{
    addUser:function(){
      var params ={
        editMode:"add",
      };
      this.get("mainController").switchMainPage('user-set-detail',params);
    },
    toDetail:function(userId){
      var params ={
        editMode:"edit",
        id:userId
      };
      this.get("mainController").switchMainPage('user-set-detail',params);
    },

  },
});
