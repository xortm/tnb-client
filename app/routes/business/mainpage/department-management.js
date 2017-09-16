import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'部门列表',
  model:function(){
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={};

    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'name@$like':curController.get('queryCondition')});
        }
    }
    params.filter = filter;
    params.sort = {'code':'asc'};
    return params;
  },
  doQuery:function(){
    var params = this.buildQueryParams();
    var _self = this;
    this.findPaged('department',params).then(function(depList){
      var str = "";
      _self.store.query('employee',{filter:{leaderFlag:1}}).then(function(leaderList){
        console.log("leaderList111",leaderList.get("length"));
        console.log("leaderList111",depList.get("length"));
        console.log("leaderList111",depList);
        // if(leaderList.get("length")===0){return;} //这句话的原因 会让 depList set不了
        depList.forEach(function(depItem){
          var str = "";
          leaderList.forEach(function(leaderItem){
            if(leaderItem.get("department.id")==depItem.get("id")){
              str += leaderItem.get("name")+"，";
            }
          });
          console.log("leaderList111 str",str);
          str = str.substring(0,str.length-1);
          depItem.set("leaders",str);
        });
        _self.getCurrentController().set("depList", depList);

      });
    });



  },
  setupController: function(controller,model){
    var _self=this;
    this.doQuery();
    var queryCondition = controller.get('input');//input 这样获取到输入的值？
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
    controller.reopen({
      actions:{
        search(){
          _self.doQuery();
        },
      }
    });

  }
});
