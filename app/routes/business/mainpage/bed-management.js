import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'床位列表',
  bedTypeID:'',
  model() {
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={};
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {

          filter = $.extend({}, filter, {'name@$like@$or1':curController.get('queryCondition')});
          filter = $.extend({}, filter, {'[room][name@$like]@$or1':curController.get('queryCondition')});

        }
    }
    if(this.get('bedTypeID')){
      filter = $.extend({}, filter, {'[bedType][id]':this.get('bedTypeID')});
    }
    params.filter = filter;
    sort = {
        '[room][floor][building][createDateTime]': 'asc',
        '[room][floor][seq]': 'asc',
        '[room][name]': 'asc',
        // 'name':'asc'
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    var params=this.buildQueryParams();
    var bedList=this.findPaged('bed',params,function(bedList){});
    this.getCurrentController().set("bedList", bedList);
    this.getCurrentController().set("bedTypeID",'');
  },
  actions:{
    search:function(){
      this.doQuery();
    },


    bedSelect(bedSelect){
      if(bedSelect){
        this.set('bedTypeID',bedSelect.id);
      }else{
        this.set('bedTypeID','');
      }

      this.doQuery();
    }
  },

  setupController: function(controller,model){
    this.set('bedTypeID','');
    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);

    this._super(controller,model);

  }
});
