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
        // if (editType === 'select') {
        //     var params = this.buildQueryParams();
        //     controller.infiniteQuery('dicttype', params);
        // }
        if (editType === 'staff') {
          _self.store.query('employee',{filter:{staffStatus:{typecode:'staffStatusIn'}}}).then(function(employeeList){
            controller.set('employeeList',employeeList);
          });
        }
        if(source === 'title'){
           controller.set('textType', 'text');
        }else {
           controller.set('textType', 'textarea');
        }
        controller.set('succeed', '');
        _self.set('editType', editType);
      var workdelivery=  this.store.peekRecord('workdelivery', infoId);
                controller.set('edit', '');
             if (source === 'remark') {
                controller.set('edit', workdelivery.get('remark'));
                _self.set('header_title', '备注');
            } else if (source === 'receiver') { //
                controller.set('theChoose', workdelivery.get('receiver'));
                _self.set('header_title', '接班人');
            } else if (source === 'specialRemark') { //
                controller.set('edit', workdelivery.get('specialRemark'));
                _self.set('header_title', '注意事项');
            } else if (source === 'illChange') { //
                controller.set('edit', workdelivery.get('illChange'));
                _self.set('header_title', '老人情况 ');
            }

    },
    setupController: function(controller, model) {
        this._super(controller, model);
        this.doQuery();
    },

});
