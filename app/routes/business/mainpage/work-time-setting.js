import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'班次设置列表',
  model() {
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={};
    var sort;

    params.filter = filter;
    sort = {
        remark: 'asc'
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    var _self=this;
    var params=this.buildQueryParams();
    var worktimesettingList=this.findPaged('worktimesetting',params,function(worktimesettingList){});
    this.getCurrentController().set("worktimesettingList", worktimesettingList);
  },
  actions:{
    search:function(){
      this.doQuery();
    },
  },
  setupController: function(controller,model){
    this.store.unloadAll('worktimesetting');
    this.doQuery();
    this._super(controller,model);
  }
});
