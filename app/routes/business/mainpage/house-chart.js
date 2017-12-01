import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },
  detailEdit:true,
  header_title:'房态图',
  dataLoader: Ember.inject.service("data-loader"),
  model(){
    return{};
  },
  think:function(){
    $(document).mouseup(function(e){
    var _con = $('');   // 设置目标区域
    if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1

    }
  });
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={};
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'name@$like':curController.get('queryCondition')});
        }
    }
    params.filter = filter;
    sort = {
         'name':'asc'
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    let _self = this;
    var params=this.buildQueryParams();
    this.store.query('bed',{}).then(function(beds){
      _self.set('global_dataLoader.beds',beds);
      _self.getCurrentController().set('bedReady',true);
      _self.findPaged('building',params).then(function(buildingList){
        _self.getCurrentController().set("buildingList", buildingList);
        _self.getCurrentController().send('selectBuild',buildingList.get('firstObject'));
        _self.getCurrentController().send('chooseTab','houseTab');
      });
    });

  },
  actions:{
    search:function(){
      this.doQuery();
    },
  },
  setupController(controller, model){
    this.doQuery();
    let _self = this;
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    this.store.query('customer',{}).then(function(customerList){
      controller.set('customerList',customerList);
    });
    this.store.query('charging-standard',{}).then(function(chargeList){
      chargeList.forEach(function(charge){
        charge.set('type','标准');
        charge.set('edited',false);
      });
      controller.set('chargeList',chargeList);
    })
    this.store.query('market-skill',{}).then(function(marketList){
      marketList.forEach(function(market){
        market.set('type','话术');
        market.set('edited',false);
      })
      controller.set('marketList',marketList);
    })
    controller.send('chooseTab','houseTab');
  }
});
