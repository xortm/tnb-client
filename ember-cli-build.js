/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var ConfigReplace = require('broccoli-config-replace');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var assetRev = require('broccoli-asset-rev');
var env = process.env.EMBER_ENV;
var config = require('./config/environment')(env);

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    SRI: {
      enabled: false,
    },
    'ember-cli-bootstrap-datetimepicker': {
      icons: {
        date: 'glyphicon glyphicon-calendar',
      }
    },
    "ember-bootstrap-switch": {
      excludeCSS: true
    },
    fingerprint: {
      enabled: false,//取消打包时的随机版本号
      exclude: ['config/product_env.js', 'public/index_test.html']
    },
    outputPaths: {
      app: {
        html: 'index.html',
        css: {
          'app': '/assets/styles/app.css'
        }
      }
    },
    lessOptions: {
      paths: [
        'app/styles',
        "bower_components/bootstrap/less",
        "bower_components/bootstrap-switch/src/less/bootstrap3"
      ]
    },
    //解决cssfilterclean的broken的问题
    minifyCSS: {
      options: {
        processImport: false
      },
    },
  });
  var faAssets = new Funnel("app/styles/fonts", {
    srcDir: "/",
    include: ["fontawesome/*.*","linecons/*.*","elusive/*.*","bootstrap/*.*"],
    destDir: "/assets/styles/fonts"
  });
  if(config.environment==="public"){
    //公众号使用精简的库
    console.log("use public lib");
    app.import('bower_components/moment/min/moment.min.js');
    app.import('bower_components/mobile-detect/mobile-detect.js');
    app.import('bower_components/operative/dist/operative.js');
    app.import('bower_components/lmx-jsonpath/index.js');
    app.import('bower_components/lmx-jsonpath/jquery.base64.js');
    app.import('bower_components/lmx-jsonpath/jroll.js');
    app.import('bower_components/lmx-jsonpath/zoomage.min.js');
    app.import('bower_components/lmx-jsonpath/jquery.combo.select.js');
    app.import('bower_components/lmx-jsonpath/in-view.min.js');
    app.import('bower_components/lmx-jsonpath/echarts.common.min.js', {outputFile: 'assets/part/echarts.js'});
    app.import('bower_components/lmx-jsonpath/video.js');
    app.import('bower_components/lmx-jsonpath/videojs-contrib-hls.js');
    app.import('bower_components/hammer.js/hammer.js');
    app.import('bower_components/jquery-hammerjs/jquery.hammer.js');
    //最小化处理
    app.options.minifyCSS.enabled = true;
    app.options.minifyJS.enabled = true;
    app.options.sourcemaps.enabled = false;
    app.options.lessOptions.paths = ['app/styles'];
    app.options['ember-bootstrap-switch'] = null;
    app.vendorFiles = {public:'bower_components/jquery/dist/jquery.min.js'};
  }else{
    app.import('bower_components/jquery-md5/jquery.md5.js');
    app.import('bower_components/mobile-detect/mobile-detect.js');
    app.import('bower_components/operative/dist/operative.js');
    app.import('bower_components/bootstrap/dist/js/bootstrap.js');
    app.import('bower_components/lmx-jsonpath/index.js');
    app.import('bower_components/lmx-jsonpath/pinyin_dict_firstletter.js');
    app.import('bower_components/lmx-jsonpath/pinyin_dict_withtone.js');
    app.import('bower_components/lmx-jsonpath/pinyinUtil.js');
    app.import('bower_components/lmx-jsonpath/jquery.base64.js');
    app.import('bower_components/lmx-jsonpath/jroll.js');
    app.import('bower_components/lmx-jsonpath/zoomage.min.js');
    app.import('bower_components/lmx-jsonpath/jquery.combo.select.js');
    app.import('bower_components/lmx-jsonpath/in-view.min.js');
    app.import('bower_components/lmx-jsonpath/echarts.common.min.js');
    app.import('bower_components/lmx-jsonpath/tableExport.js');
    app.import('bower_components/jquery-qrcode/jquery.qrcode.min.js');
    app.import('bower_components/js-cookie/src/js.cookie.js');
    app.import('bower_components/hammer.js/hammer.js');
    app.import('bower_components/jquery-hammerjs/jquery.hammer.js');
    app.import('bower_components/jquery-ui/jquery-ui.js');
    app.import('bower_components/weixin/jweixin-1.0.0.js');
    app.import('bower_components/cropit/dist/jquery.cropit.js');
    app.import('bower_components/recordrtc/RecordRTC.js');
    app.import('bower_components/kindeditor/kindeditor.js');
    app.import('bower_components/kindeditor/lang/zh-CN.js');
    app.import('bower_components/isInViewport/lib/isInViewport.js');
    app.import('bower_components/lmx-jsonpath/video.js');
    app.import('bower_components/lmx-jsonpath/videojs-contrib-hls.js');
    //最小化处理
    console.log("environment is:" + config.environment);
    if(config.environment!=="development"){
      app.options.minifyCSS.enabled = true;
      app.options.minifyJS.enabled = true;
      app.options.sourcemaps.enabled = false;
    }else{
      app.options.minifyCSS.enabled = false;
      app.options.minifyJS.enabled = false;
      app.options.sourcemaps.enabled = true;
    }
  }
  var assets = mergeTrees([faAssets]);
  let tree = app.toTree(assets);
  return tree;
};
