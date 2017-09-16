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
  var androidApp = new EmberApp(defaults, {
  });
  var androidTree = new ConfigReplace(androidApp, {}, {
    // annotate the output. See broccoli-plugin
    annotations: true,
    // A list of files to parse:
    files: [
      'app/index_android.html',
    ],
    configPath: './config/environment.json',
    outputPath: './',
    patterns: [{
      match: /\{\{EMBER_ENV\}\}/g,
      replacement: function(config) { return config.EMBER_ENV; }
    }, {
      match: /\{\{test\}\}/g,
      replacement: 'test content'
    }]
  });
  let andassets = new Funnel(androidTree, {
    srcDir: "/",
    destDir: "/dist"
  });
  // return androidApp.toTree([andassets]);
  var app = new EmberApp(defaults, {
    SRI: {
      enabled: false,
    },
    vendorFiles: {
      'jquery.js': {
        development: 'bower_components/jquery/dist/jquery.js',
      }
    },
    'ember-cli-bootstrap-datetimepicker': {
      icons: {
        date: 'glyphicon glyphicon-calendar',
      }
    },
    fingerprint: {
      enabled: false,//取消打包时的随机版本号
      exclude: ['config/product_env.js', 'public/index_test.html','pubilc/load.js']
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
        'app/styles'
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
  app.import('bower_components/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js');
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
  app.import('bower_components/moment-duration-format/lib/moment-duration-format.js');
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
  app.import('bower_components/froala-wysiwyg-editor/js/froala_editor.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/froala_editor.pkgd.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/align.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/char_counter.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/code_beautifier.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/code_view.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/colors.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/draggable.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/emoticons.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/entities.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/file.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/font_family.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/font_size.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/forms.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/fullscreen.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/help.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/image.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/image_manager.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/inline_style.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/line_breaker.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/link.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/lists.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/paragraph_format.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/paragraph_style.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/print.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/quick_insert.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/quote.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/save.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/special_characters.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/video.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/table.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/word_paste.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/plugins/url.min.js');
  app.import('bower_components/froala-wysiwyg-editor/js/languages/zh_cn.js');
  var assets = mergeTrees([faAssets]);
  return app.toTree(assets);
};
