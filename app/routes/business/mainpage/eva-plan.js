import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title: "评估模板列表",
  dataLoader:Ember.inject.service('data-loader'),
  model() {
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    //搜索功能后台接管
    var filter = {
        queryTenant: "tenant",
        'typecode': 'evaluateType2'
    };
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'titleLike':curController.get('queryCondition')});
        }
      }
    params.filter = filter;
    sort = {
        createDateTime:'desc'
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    var params=this.buildQueryParams();
    var evaList=this.findPaged('evaluatemodel',params,function(evaList){});
    this.getCurrentController().set("evaList", evaList);
  },
  actions:{
    search:function(){
      this.doQuery();
    },
  },
  setupController(controller, model){
    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    //取当前租户的规范列表
    let modelSourceList = this.get('dataLoader.modelSourceList');
    let list = new Ember.A();
    modelSourceList.forEach(function(model){
      list.pushObject(model.get('modelSource'));
    });
    controller.set('modelSourceList',list);
    //所有评估类型表
    this.store.query('evaluatemodeltype',{}).then(function(typeList){
      controller.set('allTypeList',typeList);
    });
    this._super(controller,model);

  },
});
