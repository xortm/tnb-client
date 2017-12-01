/*
 * 创建人：梁慕学 2017-09-10
 * 说明：build时定制筛选需要编译的脚本
 */
var filter = {
    jsfiles: function() {
        let baseControllersJs = ['tiannianbao/controllers/application.js','tiannianbao/blg-mix.js', 'tiannianbao/controllers/infinite-scroll.js', 'tiannianbao/controllers/bind-customer.js', 'tiannianbao/controllers/business.js', 'tiannianbao/controllers/business/mainpage.js'];
        let controllersJs = [
            'tiannianbao/controllers/business/mainpage/publicnumber-service.js',
            'tiannianbao/controllers/business/mainpage/publichealth-data.js',
            'tiannianbao/controllers/business/mainpage/accounts-message.js',
            'tiannianbao/controllers/business/mainpage/accounts-recharge.js',
            'tiannianbao/controllers/business/mainpage/hospital-interaction.js',
            'tiannianbao/controllers/business/mainpage/accounts-info.js',
            'tiannianbao/controllers/business/mainpage/score-question.js',
            'tiannianbao/controllers/business/mainpage/score-question-detail.js',
            'tiannianbao/controllers/business/mainpage/customer-dynamic.js',
            'tiannianbao/controllers/business/mainpage/customer-feedback.js',
            'tiannianbao/controllers/business/mainpage/drug-information.js',
            'tiannianbao/controllers/business/mainpage/consumer-service.js',
            'tiannianbao/controllers/business/mainpage/service-order-list.js',
            'tiannianbao/controllers/business/mainpage/service-order.js',
            'tiannianbao/controllers/business/mainpage/service-order-look.js',
            'tiannianbao/controllers/business/mainpage/service-order-detail.js',
            'tiannianbao/controllers/business/mainpage/customer-ordering-cust.js',
            'tiannianbao/controllers/business/mainpage/customer-ordering-look.js',
        ];
        let baseRoutesJs = ['tiannianbao/routes/application.js', 'tiannianbao/routes/business.js', 'tiannianbao/routes/business/base-business.js', 'tiannianbao/routes/business/mainpage.js', 'tiannianbao/routes/**/index.js', 'tiannianbao/routes/business/mainpage/blank-page*.js'];
        let routesJs = [
            'tiannianbao/routes/business/mainpage/publicnumber-service.js',
            'tiannianbao/routes/business/mainpage/publichealth-data.js',
            'tiannianbao/routes/business/mainpage/accounts-message.js',
            'tiannianbao/routes/business/mainpage/accounts-recharge.js',
            'tiannianbao/routes/business/mainpage/hospital-interaction.js',
            'tiannianbao/routes/business/mainpage/accounts-info.js',
            'tiannianbao/routes/business/mainpage/score-question.js',
            'tiannianbao/routes/business/mainpage/score-question-detail.js',
            'tiannianbao/routes/business/mainpage/customer-dynamic.js',
            'tiannianbao/routes/business/mainpage/customer-feedback.js',
            'tiannianbao/routes/business/mainpage/drug-information.js',
            'tiannianbao/routes/business/mainpage/consumer-service.js',
            'tiannianbao/routes/business/mainpage/service-order-list.js',
            'tiannianbao/routes/business/mainpage/service-order.js',
            'tiannianbao/routes/business/mainpage/service-order-look.js',
            'tiannianbao/routes/business/mainpage/service-order-detail.js',
            'tiannianbao/routes/business/mainpage/customer-ordering-cust.js',
            'tiannianbao/routes/business/mainpage/customer-ordering-look.js',
        ];
        let baseComponentsJs = [
            'tiannianbao/components/bootstrap-switch.js',
            'tiannianbao/components/bs-switch.js',
            'tiannianbao/components/foot-bar.js',
            'tiannianbao/components/infinity-loader.js',
            'tiannianbao/components/ui/base-ui-item.js',
            'tiannianbao/components/ui/footer*.js',
            'tiannianbao/components/ui/*-button.js',
            'tiannianbao/components/ui/button-group.js',
            'tiannianbao/components/ui/img-*.js',
            'tiannianbao/components/ui/container/*.js'
        ];
        let componentsJs = [
          'tiannianbao/components/ui/mobile/*.js',
          'tiannianbao/components/callbusi/mobile/*.js',
          'tiannianbao/components/callbusi/customer-selecter.js',
          'tiannianbao/components/callbusi/select-bar.js',
          'tiannianbao/components/callbusi/customer-select-list.js',
          'tiannianbao/components/callbusi/right-bar-letter.js',
          'tiannianbao/components/bs-modal*.js',
          'tiannianbao/components/ember-wormhole.js',
          'tiannianbao/components/ui/addon/bs-modal*.js',
        ];
        let componentsBusiJs = [];
        let jsfiles = baseControllersJs.concat(controllersJs, baseRoutesJs, routesJs, baseComponentsJs, componentsJs, componentsBusiJs);
        let hbsfiles = this.hbsfiles();
        let commonfiles = this.commonfiles();
        return commonfiles.concat(jsfiles, hbsfiles);
    },
    commonfiles: function() {
        let projJs = [
            'tiannianbao/adapters/**/*.js',
            'tiannianbao/addon/**/*.js',
            'tiannianbao/helpers/**/*.js',
            'tiannianbao/initializers/**/*.js',
            'tiannianbao/instance-initializers/**/*.js',
            'tiannianbao/models/**/*.js',
            'tiannianbao/serializers/**/*.js',
            'tiannianbao/services/**/*.js',
            'tiannianbao/ember-gestures/**/*.js',
            'tiannianbao/utils/**/*.js',
            'tiannianbao/validations/**/*.js'
        ];
        let appJs = ['tiannianbao/app.js', 'tiannianbao/router.js', 'tiannianbao/breakpoints.js', 'tiannianbao/transitions.js', 'tiannianbao/event_dispatcher.js'];
        return projJs.concat(appJs);
    },
    hbsfiles: function() {
        let baseTemplatesJs = ['tiannianbao/templates/*.js', 'tiannianbao/templates/business/*.js', 'tiannianbao/templates/business/mainpage/blank-page*.js'];
        let templatesJs = [
            'tiannianbao/templates/business/mainpage/publicnumber-service.js',
            'tiannianbao/templates/business/mainpage/publichealth-data.js',
            'tiannianbao/templates/business/mainpage/accounts-message.js',
            'tiannianbao/templates/business/mainpage/accounts-recharge.js',
            'tiannianbao/templates/business/mainpage/hospital-interaction.js',
            'tiannianbao/templates/business/mainpage/accounts-info.js',
            'tiannianbao/templates/business/mainpage/score-question.js',
            'tiannianbao/templates/business/mainpage/score-question-detail.js',
            'tiannianbao/templates/business/mainpage/customer-dynamic.js',
            'tiannianbao/templates/business/mainpage/customer-feedback.js',
            'tiannianbao/templates/business/mainpage/drug-information.js',
            'tiannianbao/templates/business/mainpage/consumer-service.js',
            'tiannianbao/templates/business/mainpage/service-order-list.js',
            'tiannianbao/templates/business/mainpage/service-order.js',
            'tiannianbao/templates/business/mainpage/service-order-look.js',
            'tiannianbao/templates/business/mainpage/service-order-detail.js',
            'tiannianbao/templates/business/mainpage/customer-ordering-cust.js',
            'tiannianbao/templates/business/mainpage/customer-ordering-look.js',
        ];
        let baseComponentsJs = [
            'tiannianbao/templates/components/foot-bar.js',
            'tiannianbao/templates/components/infinity-loader.js',
            'tiannianbao/templates/components/ui/base-ui-item.js',
            'tiannianbao/templates/components/ui/footer*.js',
            'tiannianbao/templates/components/ui/*-button.js',
            'tiannianbao/templates/components/ui/button-group.js',
            'tiannianbao/templates/components/ui/img-*.js',
            'tiannianbao/templates/components/ui/container/*.js'
        ];
        let componentsJs = [
          'tiannianbao/templates/components/ui/mobile/*.js',
          'tiannianbao/templates/components/callbusi/customer-selecter.js',
          'tiannianbao/templates/components/callbusi/customer-select-list.js',
          'tiannianbao/templates/components/callbusi/select-bar.js',
          'tiannianbao/templates/components/callbusi/right-bar-letter.js',
          'tiannianbao/templates/components/bs-modal*.js',
          'tiannianbao/components/ember-wormhole.js',
          'tiannianbao/templates/components/ui/addon/bs-modal*.js'
        ];
        let componentsBusiJs = ['tiannianbao/templates/components/callbusi/mobile/*.js'];
        return baseTemplatesJs.concat(templatesJs, baseComponentsJs, componentsJs, componentsBusiJs);
    },
    exfiles: function() {
        let exjsfiles = ['tiannianbao/routes/business/pagination.js', 'tiannianbao/addon/tableExport.js', 'tiannianbao/addon/ember-cli-pagination/**', 'tiannianbao/addon/ember-infinity/**', 'tiannianbao/initializers/responsive.js'];
        return exjsfiles;
    }
};
module.exports = filter;
