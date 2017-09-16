import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title: "我的钱包",
  model() {
    return ;
  },
  doQuery(){//过滤条件框和搜索框复用复用//拼条件类似于paramsBuild
    console.log('in here two doquery');
    var curuser = this.get('global_curStatus').getUser();
    var filter = {
      payee:{id:curuser.get("id")},
      //businessType:{typecode:'bizTypeCsOnlinePay'},
      // businessType:{
      //     'status---1':{'typecode@$or1---1':Constants.taskStatus_begin},
      //     'status---2':{'typecode@$or1---2':Constants.taskStatus_isPassed},
      // }
    };
    var params = this.pagiParamsSet();
    var sort={createTime:'desc'};
    params.filter = filter;
    params.sort = sort;
    var controller = this.get("controller");
    var tradingRecord = controller.infiniteQuery('deal-flow',params);
    console.log("tradingRecord",tradingRecord);
    return tradingRecord;
    },

  getInvitetaskList(){
    console.log('in here getInvitetaskList');
    var curuser = this.get('global_curStatus').getUser();
    var filter= {//businessType:'withdrawCash',
    payer:{id:curuser.get("id")},};
    var params = this.pagiParamsSet();
    var sort={createTime:'desc'};
    params.filter = filter;
    params.sort = sort;
    var controller = this.get("controller");
    controller.infiniteQuery('deal-flow',params);
  },

  setupController:function(controller,model){
    this._super(controller,model);
    this.doQuery();
    console.log("controllermessage",controller);
  },
  actions:{
    saveRefresh: function() {
      console.log("1111111111111111111  can in  this function");
      this.refresh();
    },
    income(){//收入
      this.doQuery();
    },
    expenditure(){//支出
      this.getInvitetaskList();
    },
  }

});
