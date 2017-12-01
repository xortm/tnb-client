// /* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'tiannianbao',
    environment: environment,
    // resourceHost:"http://localhost:4200",
    // resourceHost:"http://img.callcloud.cn",
    resourceHost:"http://resource.callcloud.cn",
    imgHost:"http://img.callcloud.cn",
    // audioHost:"http://resource.callcloud.cn/audio",
    // host: "http://localhost:9080",
    // socketHost: "http://api.callcloud.cn",
    socketHost: "http://123.56.77.218:9080",
    // socketHost: "http://localhost:9080",
    // host:"http://123.56.77.218:9080",
    host:"http://api.callcloud.cn",
    //  host:"http://10.1.3.83:8081",
    //  host:"http://192.168.1.103:9080",
    //  host:"http://123.56.77.218:9080",
    pythonHost:"http://localhost:8000",
    // corsWithCredentials: true,
    contentSecurityPolicy: {
      // 'script-src': "'none'",
      // 'default-src': "'self'",
      // 'img-src': "'self'",
      // 'font-src': "'self'",
      // 'style-src': "'self' 'unsafe-inline'",
      // 'media-src': ["'self'"],
      // 'connect-src': ["'self'", "http://10.2.0.111:8081"],
    },
    firebase: 'https://resplendent-torch-5437.firebaseio.com/',
    baseURL: '/',
    rootURL: '/',
    locationType: 'hash',
    "global-status":{},
    SRI: {
      enabled: false
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    emberFullCalendar: {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };
  if (environment === 'public') {
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
    ENV.wxScanurl = "http://pub.tnb99.net/index.html";
    ENV.locationType = 'none';
  }
  if (environment === 'development') {
    ENV.isMinify = false;
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
    ENV.wxScanurl = "http://web.tnb99.net/index.html";
    ENV.locationType = 'none';
  }
  if (environment === 'android') {
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
    ENV.wxScanurl = "http://web.tnb99.net/index.html";
    ENV.locationType = 'none';
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
    ENV.resourceHost = "http://resource.tnb99.net";
    ENV.socketHost = "http://101.200.143.200:7070";
    ENV.host = "http://api.tnb99.net";
    ENV.imgHost = "http://img.tnb99.net";
    ENV.wxScanurl = "http://web.tnb99.net/index.html";
    ENV.locationType = 'none';
  }
  return ENV;
};
