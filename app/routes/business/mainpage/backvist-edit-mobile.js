import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
    queryParams: {
        source: {
            refreshModel: true
        },
        infoId: {
            refreshModel: true
        },
        editType: {
            refreshModel: true
        }
    },
    model(params) {
        return {};
    },
    buildQueryParams: function() {
        var params = {};
        var controller = this.getCurrentController();
        var source = controller.get("source");
        var filter = {};
        if (source === 'accessType') {
            filter = {
                typegroup: {
                    typegroupcode: 'accessType'
                }
            };
        }
        if (source === 'liveIntent') {
            filter = {
                typegroup: {
                    typegroupcode: 'liveIntent'
                }
            };
        }

        params.filter = filter;
        console.log("params filter", params);
        return params;
    },
    doQuery() {
        var controller = this.getCurrentController();
        var source = controller.get("source");
        var infoId = controller.get("infoId");
        var editType = controller.get("editType");
        var _self = this;
        if (editType === 'select') {
            var params = this.buildQueryParams();
            controller.infiniteQuery('dicttype', params);
        }
        if (editType === 'staff') {
          _self.store.query('employee',{filter:{staffStatus:{typecode:'staffStatusIn'}}}).then(function(employeeList){
            controller.set('employeeList',employeeList);
          });
        }
         if(source === 'content'||source === 'remark'){
           controller.set('textType', 'textarea');
        }else {
           controller.set('textType', 'text');
        }
        controller.set('succeed', '');
        _self.set('editType', editType);
        this.store.findRecord('backvist', infoId).then(function(consultinfo) {

             if (source === 'remark') {
                controller.set('edit', consultinfo.get('remark'));
                _self.set('header_title', '详细情况');
            } else if (source === 'customerName') {
                controller.set('edit', consultinfo.get('customerName'));
                _self.set('header_title', '客户姓名');
            }  else if (source === 'customerTel') { //
                controller.set('edit', consultinfo.get('customerTel'));
                _self.set('header_title', '客户电话');
            } else if (source === 'accessType') { //
                controller.set('theChoose', consultinfo.get('accessType'));
                _self.set('header_title', '跟进类别');
            } else if (source === 'liveIntent') { //
                controller.set('theChoose', consultinfo.get('liveIntent'));
                _self.set('header_title', '咨询意向');
            }  else if (source === 'createDateTime') { //
              if (consultinfo.get('createDateTime')) {
                  controller.set('nowDate', _self.get("dateService").formatDateT(consultinfo.get('createDateTime'), "yyyy-MM-dd hh:mm"));
              } else {
                  controller.set('nowDate', _self.get("dateService").formatDateT(_self.get("dataLoader").getNowTime(), "yyyy-MM-dd hh:mm"));
              }
              _self.set('header_title', '跟进时间');
            } else if (source === 'vistUser') { //
                controller.set('theChoose', consultinfo.get('vistUser'));
                _self.set('header_title', '跟进人');
            }
        });
    },
    setupController: function(controller, model) {
        this._super(controller, model);
        this.doQuery();
    },

});
