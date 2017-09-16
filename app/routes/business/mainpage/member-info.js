import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataLoader: Ember.inject.service("data-loader"),
    header_title: '会员信息',
    queryParams: {
        id: {
            refreshModel: true
        }
    },
    model() {
        return {};
    },
    buildQueryParams() {
        var _self = this;
        var params = this.pagiParamsSet();
        var filter = {};
        var curController = this.getCurrentController();
        params.filter = filter;
        return params;
    },
    doQuery: function() {
        var _self = this;
        var params = this.buildQueryParams(); //拼查询条件
    },
    actions: {
        saveRefresh: function() {
            this.refresh();
        },
    },
    setupController: function(controller, model) {
      var _self=this;
      //图片点击事件参数
      controller.set('informationParams',true);
      controller.set('healthParams',false);
      controller.set('serviceParams',false);
      controller.set('recordParams',false);
      //个人信息-点击参数
      controller.set('infoParams',true);
      controller.set('pointParams',false);
      controller.set('contactParams',false);
      controller.set('healthInfoParams',false);
      controller.set('systemParams',false);
      controller.set('medicineParams',false);
        this.doQuery();
        this._super(controller, model);
        controller.customerObs();
        //查询账户表
        this.store.query('tradeaccount', {
            filter: {
                '[customer][id]': controller.get('id'),
                '[type][typecode]': Constants.accountType1
            }
        }).then(function(actualDepositList) {
            controller.set('actualDepositInfo', actualDepositList.get('firstObject'));
        });
        this.store.query('tradeaccount', {
            filter: {
                '[customer][id]': controller.get('id'),
                '[type][typecode]': Constants.accountType2
            }
        }).then(function(balanceList) {
            controller.set('balanceInfo', balanceList.get('firstObject'));
        });
        //查询健康档案
        this.store.query('healthrecord', {
            filter: {
                '[customer][id]': controller.get('id')
            }
        }).then(function(healthList) {
            controller.set('healthRecordInfo', healthList.get('firstObject'));
        });
        //查询护理执行情况表
        this.store.query('nursingplanexe', {
              filter: {
                  '[itemProject][project][customer][id]':controller.get('id'),
              },
              sort: {
                exeStartTime:"desc",
              }
        }).then(function(planProjectList) {
          controller.set("planProjectList",planProjectList);
          console.log("planProjectList",planProjectList);
        });
    },
});
