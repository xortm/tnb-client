import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataService: Ember.inject.service("date-service"),
    header_title: '餐饮等级设置',
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
        //_self.getCurrentController().set("group", informationList.get('firstObject.typegroupTenant'));
        var mainpageController = App.lookup('controller:business.mainpage');
        if(_self.get("tableSelector")){
          mainpageController.removeTableLoading($(_self.get("tableSelector")));
        }
        });
        //新租户的话informationList可能为空，所以需要单查typegrouptenant
        this.get("store").query("typegrouptenant",{
        filter:{
          'typegroupcode': flag
        }
      }).then(function(groupList){
          _self.getCurrentController().set("group", groupList.get('firstObject'));
      });
    },
    actions: {
      chooseGroup:function(flag){
        this.set("flag",flag);
        console.log("flag",flag);
        this.doQuery();
      },

    },
    setupController: function(controller, model) {
        this._super(controller, model);
        this.doQuery("diningStandard");//传参：默认的flag
    }
});
