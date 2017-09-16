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
        if (source === 'advGender') { //性别
            filter = {
                typegroup: {
                    typegroupcode: 'sexType'
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
        if (source === 'customerSelfCareAbility') {
            filter = {
                typegroup: {
                    typegroupcode: 'selfCareLevel'
                }
            };
        }
        if (source === 'consultChannel') {
            filter = {
                typegroup: {
                    typegroupcode: 'consultChannel'
                }
            };
        }
        if (source === 'consultRelation') {
            filter = {
                typegroup: {
                    typegroupcode: 'relationType'
                }
            };
        }
        if (source === 'customerGender') {
            filter = {
                typegroup: {
                    typegroupcode: 'sexType'
                }
            };
        }
        if (source === 'customerEducation') {
            filter = {
                typegroup: {
                    typegroupcode: 'educationLevel'
                }
            };
        }
        if (source === 'advWay') {
            filter = {
                typegroup: {
                    typegroupcode: 'consultSource'
                }
            };
        }
        if (source === 'inPreference') {
            filter = {
                typegroup: {
                    typegroupcode: 'inPreference'
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
        controller.set('succeed', '');
        if(source === 'remark'){
           controller.set('textType', 'textarea');
        }else {
           controller.set('textType', 'text');
        }
        _self.set('editType', editType);
        this.store.findRecord('charging-standard', infoId).then(function(info) {
            if (source === 'title') {
                controller.set('edit', info.get('title'));
                _self.set('header_title', '标题');
            } else if (source === 'remark') {
                controller.set('edit', info.get('remark'));
                _self.set('header_title', '内容');
            }
        });
    },
    setupController: function(controller, model) {
        this._super(controller, model);
        this.doQuery();
    },

});
