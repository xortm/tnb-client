import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const {bizTypeWithdra_wash} = Constants;
// import RouteMixin from 'ember-cli-3pagination/remote/route-mixin';

export default BaseBusiness.extend(Pagination,{
  header_title:'老人',
  queryParams: {
      queryType: {
          refreshModel: true
      },
      queryValue:{
        refreshModel: true
      }
  },
  model(){
    return {};
  },
  setupController(controller,model){
    this._super(controller,model);
    controller.set("params",{});
    //先查询了所有护理方案 再查老人 会显得很慢
    this.store.query('nursingproject',{}).then(function(nursingprojectList){
      //查询下所有的护理方案 给detail 的护理等级字段用
      controller.set("nursingprojectList",nursingprojectList);
      controller.customerListObs();
    });
  },
});
