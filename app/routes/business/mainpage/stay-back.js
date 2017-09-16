import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const {leaveStatus1,leaveStatus2,leaveStatus3,leaveStatus4,leaveStatus5,consultStatus6,consultStatus7} = Constants;

export default BaseBusiness.extend(Pagination, {
    header_title: '退住管理',
    model() {
        return {};
    },
    doQuery: function() {//所有退住老人
        var _self = this;
        var params = this.buildQueryParams();
        var customerflowList = this.findPaged('customerbusinessflow', params, function(orgList) {});
        this.getCurrentController().set("customerflowList", customerflowList);
        console.log('doQuery1 orgList', customerflowList);
    },
    buildQueryParams: function(str) {
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        let filter;
        if(str=='all'){
          filter = {
            'leaveStatus---1':{'typecode@$or1---1':Constants.leaveStatus1},
            'leaveStatus---2':{'typecode@$or1---2':Constants.leaveStatus2},
            'leaveStatus---3':{'typecode@$or1---3':Constants.leaveStatus3},
            'leaveStatus---4':{'typecode@$or1---4':Constants.leaveStatus4},
            'leaveStatus---5':{'typecode@$or1---5':Constants.leaveStatus5},//没了 直接delStatus
            // status:{typecode:Constants.consultStatus6}
          };
        }else{
          filter = {leaveStatus:{typecode:Constants.leaveStatus1}};
          curController.set("queryAll",false);
          curController.set("queryScheduled",true);
        }
        if (curController) {
            if (curController.get('queryStayBack')) {
              filter = {};
              curController.set("queryScheduled",false);
              curController.set("queryAll",true);
                filter = $.extend({}, filter, {
                    '[customer][name@$like]@$or1': curController.get('queryStayBack')
                });
                filter = $.extend({}, filter, {
                    '[customer][bed][name@$like]@$or1':curController.get('queryStayBack')
                });
            }
        }
        params.filter = filter;
        var sort = {
          'createDateTime': 'desc',
          // '[leaveStatus][typecode]': 'asc'
        };
        params.sort = sort;
        console.log("params is:", params);
        return params;
    },
    doQueryAll(){
      let _self = this;
      var params=this.buildQueryParams('all');
      let customerflowList = this.findPaged('customerbusinessflow',params,function(customerflowList){

      });
      this.getCurrentController().set("customerflowList", customerflowList);
    },
    saveRefresh: function() {
        this.refresh();
    },
    actions:{
      searchStaff:function(){
        this.doQuery();
      },
      queryScheduled(){
        this.doQuery();
        this.getCurrentController().set('queryScheduled',true);
        this.getCurrentController().set('queryAll',false);
      },

    },
    setupController:function(controller,model){
      this._super(controller,model);
      console.log(controller.get('queryScheduled'),controller.get('queryAll'));
      if(controller.get('queryAll')){
        controller.send('queryAll');
      }else{
        this.doQuery();
      }

    },


});
