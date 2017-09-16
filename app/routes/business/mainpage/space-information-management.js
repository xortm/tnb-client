import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataService: Ember.inject.service("date-service"),
    header_title: '基础信息维护',
    model() {
        return {};
    },
   doQuery:function(firstFlag){
     console.log("firstFlag is",firstFlag);
      var _self = this;
      var filter = {};
      var flag = this.get("flag");
      this.getCurrentController().set("flag", flag);
      if (flag) {
        console.log("flag is what",flag);
          filter = $.extend({}, filter, {
            typegroupTenant:{
              'typegroupcode': flag
            }
          });
      }else{
        flag=firstFlag;
        filter = $.extend({}, filter, {
          typegroupTenant:{
            'typegroupcode': flag
          }
        });
      }
      this.get("store").query('dicttypetenant', {
          filter: filter,
      }).then(function(informationList) {
        _self.getCurrentController().set("informationList", informationList);
        console.log("informationList is",informationList);
        });
        //set ID
        this.get("store").query("typegrouptenant",{
        filter:{
          'typegroupcode': flag
        }
      }).then(function(groupList){
        groupList.forEach(function(group){
          //_self.getCurrentController().set("groupId", group.get("id"));
          _self.getCurrentController().set("group", group);
          console.log("group id",group.get("id"));
        });
      });
    },
    saveRefresh: function() {
      console.log("saveRefresh11111");
        this.refresh();
    },
    actions: {
      chooseGroup:function(flag){
        //alert("chooseGroup");
        this.set("flag",flag);
        console.log("flag",flag);
        this.doQuery();
      },
    },
    setupController: function(controller, model) {
        this._super(controller, model);
        this.doQuery("roomType");
    }
});
