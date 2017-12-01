import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  dataLoader:Ember.inject.service('data-loader'),
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
    //取所有已挂接班次的床位
    let settingBeds;
    this.store.query('bedworktimesetting',{}).then(function(settingBeds){
      let customers = _self.get('dataLoader.customerList');
      worktimesettingList.forEach(function(worktimesetting){
        let hasCustomers = new Ember.A();
        settingBeds.forEach(function(bed){
          if(bed.get('setting.id')==worktimesetting.get('id')){
            let customer = customers.findBy('bed.id',bed.get('bed.id'));
            if(customer){
              hasCustomers.pushObject(customer);
            }
          }
        });
        console.log('绑定的老人',hasCustomers);
        let nameStr = '';
        if(hasCustomers){
          hasCustomers.forEach(function(customer){
            if(customer.get('name')){
                nameStr += customer.get('name')+',';
            }
          });
        }
        console.log('customerName',nameStr);
        worktimesetting.set('customerName',nameStr.substring(0,nameStr.length-1));
      });
      _self.getCurrentController().set("worktimesettingList", worktimesettingList);
    });

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
