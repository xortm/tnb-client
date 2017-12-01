import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'菜品列表',
  foodTypeID:'',
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

        }
    }
    if(this.get('typeID')){
      filter = $.extend({}, filter, {'[type][id]':this.get('typeID')});
    }
    params.filter = filter;
    sort = {
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    let _self = this;
    var params=this.buildQueryParams();
    var foodList=this.findPaged('food',params,function(foodList){

    });
    _self.getCurrentController().set("foodList", foodList);
    _self.getCurrentController().set("typeID",'');
  },
  actions:{
    search:function(){
      this.doQuery();
    },


    foodSelect(foodSelect){
      if(foodSelect){
        this.set('typeID',foodSelect.get('id'));
      }else{
        this.set('typeID','');
      }

      this.doQuery();
    }
  },

  setupController: function(controller,model){
    this.set('typeID','');
    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);

    this._super(controller,model);

  }
});
