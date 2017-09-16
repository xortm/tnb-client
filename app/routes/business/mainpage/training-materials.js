import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'培训资料',
  model:function(){
    return {};
  },
  dateService: Ember.inject.service("date-service"),
  setupController: function(controller,model){
    this._super(controller,model);
    this.store.query('document-type',{}).then(function(typeList){
      controller.set('typeList',typeList);
    });
    this.store.query('share-document',{}).then(function(allDocList){
      controller.set('allDocList',allDocList);
    });
  }
});
