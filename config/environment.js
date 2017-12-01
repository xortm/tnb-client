// /* jshint node: true */

module.exports = function(environment) {
    var ENV = {
        modulePrefix: 'tiannianbao',
        environment: environment,
        blankMobileInitPageNumber:5,//需要初始化的空白页面数
        isMinify: false,
        // firebase: 'https://resplendent-torch-5437.firebaseio.com/',
        baseURL: '/',
        rootURL: '/',
        PLUPLOAD_BASE_URL: '/',
        // locationType: 'hash',
        "global-status": {},
        SRI: {
            enabled: false
        },
        APP: {}
    };
    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        ENV.APP.LOG_ACTIVE_GENERATION = true;
        ENV.APP.LOG_TRANSITIONS = true;
        ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        ENV.APP.LOG_VIEW_LOOKUPS = true;
        ENV.socketHost = "http://locacustomer-vip-infolhost:9080";
        ENV.resourceHost = "http://resource.tnb99.net";
        // ENV.socketHost = "http://47.93.78.97:7090";
        // ENV.socketHost = "http://182.92.149.145:7060";
        ENV.socketHost = "http://101.200.143.200:7070";
        // ENV.host = "http://localhost:8080";
        // ENV.host = "http://api.tiannianbao.com";
        // ENV.imgHost = "http://img.tiannianbao.com";
        // ENV.host = "http://api.tnb99.net";
        // ENV.imgHost = "http://imgdemo.tnb99.cn";
        // ENV.host = "http://apidemo.tnb99.cn";
        // ENV.host = "http://localhost:8080";
        // ENV.host = "http://api.tnb99.net";
        ENV.host = "http://api.tnb99.net";
        ENV.imgHost = "http://img.tnb99.net";
        // ENV.host = "http://api.tiannianbao.com";
        // ENV.imgHost = "http://img.tiannianbao.com";
        // ENV.host = "http://api.kyserver01.com";
        // ENV.imgHost = "http://img.kyserver01.com";
        ENV.wxScanurl = "http://localhost:4200/index.html";
        // ENV.locationType = 'hash';
    }
    if (environment === 'test') {
        // ENV.APP.LOG_RESOLVER = true;
        ENV.APP.LOG_ACTIVE_GENERATION = true;
        ENV.APP.LOG_TRANSITIONS = true;
        ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        ENV.APP.LOG_VIEW_LOOKUPS = true;
        ENV.resourceHost = "http://resource.tnb99.net";
        // ENV.socketHost = "http://47.93.78.97:7090";
        ENV.socketHost = "http://101.200.143.200:7070";

        // ENV.host = "http://localhost:8080";
        // ENV.host = "http://api.tiannianbao.com";
        // ENV.imgHost = "http://img.tiannianbao.com";
        // ENV.host = "http://api.tnb99.net";
        // ENV.imgHost = "http://imgdemo.tnb99.cn";
        // ENV.host = "http://apidemo.tnb99.cn";
        // ENV.host = "http://192.168.1.80:8080";
        // ENV.host = "http://localhost:8080";
        ENV.host = "http://api.tnb99.net";
        ENV.imgHost = "http://img.tnb99.net";
        // ENV.host = "http://api.kyserver01.com";
        // ENV.imgHost = "http://img.kyserver01.com";
        ENV.wxScanurl = "http://192.168.1.246:4200/index.html";
        ENV.locationType = 'hash';
    }

    if (environment === 'production') {
        ENV.isMinify = true;
        ENV['ember-faker'] = {
            enabled: true
        };
        ENV.SRI = {
            enabled: false
        };
        ENV.baseURL = null;
        ENV.resourceHost = "http://resource.tnb99.cn";
        ENV.socketHost = "http://47.93.78.97:7090";
        ENV.host = "http://api.tnb99.cn";
        ENV.imgHost = "http://img.tnb99.cn";
        ENV.wxScanurl = "http://web.tnb99.cn";
        ENV.locationType = 'none';
    }

    if (environment === 'emuprod') {
        ENV['ember-faker'] = {
            enabled: true
        };
        ENV.SRI = {
            enabled: false
        };
        ENV.baseURL = null;
        ENV.resourceHost = "http://resource.tnb99.cn";
        ENV.socketHost = "http://api.tnb99.net";
        ENV.host = "https://apimobile.tnb99.net";
        ENV.imgHost = "http://img.tnb99.net";
        ENV.wxScanurl = "http://web.tnb99.net";
        ENV.locationType = 'none';
    }
    if (environment === 'monitest') {
        ENV.isMinify = true;
        ENV['ember-faker'] = {
            enabled: true
        };
        ENV.SRI = {
            enabled: false
        };
        ENV.baseURL = null;
        ENV.resourceHost = "http://resource.tnb99.net";
        ENV.socketHost = "http://101.200.143.200:7070";
        ENV.host = "http://api.tnb99.net";
        ENV.imgHost = "http://img.tnb99.net";
        ENV.wxScanurl = "http://web.tnb99.net";
        ENV.locationType = 'none';
    }
    if (environment === 'public') {
        // ENV.APP.LOG_RESOLVER = true;
        ENV.APP.LOG_ACTIVE_GENERATION = true;
        ENV.APP.LOG_TRANSITIONS = true;
        ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        ENV.APP.LOG_VIEW_LOOKUPS = true;
        ENV.socketHost = "http://locacustomer-vip-infolhost:9080";
        ENV.resourceHost = "http://resource.tnb99.net";
        // ENV.socketHost = "http://47.93.78.97:7090";
        ENV.socketHost = "http://101.200.143.200:7070";

        // ENV.host = "http://localhost:8080";
        // ENV.host = "http://api.tiannianbao.com";
        // ENV.imgHost = "http://img.tiannianbao.com";
        // ENV.host = "http://api.tnb99.net";
        // ENV.imgHost = "http://imgdemo.tnb99.cn";
        // ENV.host = "http://apidemo.tnb99.cn";
        // ENV.host = "http://192.168.1.80:8080";
        // ENV.host = "http://api.tnb99.net";
        ENV.host = "http://api.tnb99.net";
        ENV.imgHost = "http://img.tnb99.net";
        // ENV.host = "http://api.kyserver01.com";
        // ENV.imgHost = "http://img.kyserver01.com";
        ENV.wxScanurl = "http://web.tnb99.net/index.html";
        ENV.locationType = 'hash';
    }
    return ENV;
};
