import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
  header_title: '考核指标',
  model:function() {
      return {};
  },
  buildQueryParams:function(){
          var params = this.pagiParamsSet();
          let filter = {level:0};
          params.filter = filter;
          return params;
  },
  doQuery:function(){
    var params = this.buildQueryParams();
    var indicatorList = this.findPaged('assessment-indicator', params, function(indicatorList) {});
    this.getCurrentController().set("assessmentList", indicatorList);
  },
  setupController: function(controller, model) {
      this.doQuery();
      this._super(controller, model);
      this.store.query('assessment-indicator',{}).then(function(indicatorList){
        controller.set('allAssessmentList',indicatorList);
      });
  }
});
