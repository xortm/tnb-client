/* jshint node: true */

module.exports = function(deployTarget) {
  var ENV = {
    build: {
      outputPath:"build"
    },
    gzip:{
      zopfli:false,
      filePattern:"**/{vendor.js,tiannianbao.js,app.css,vendor.css}"
    },
    // include other plugin configuration that applies to all deploy targets here
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    // configure other plugins for development deploy target here
  }
  if (deployTarget === 'test') {
    ENV.build.environment = 'test';
    // configure other plugins for development deploy target here
  }
  if (deployTarget === 'staging') {
    ENV.build.environment = 'staging';
    // configure other plugins for staging deploy target here
  }
  if (deployTarget === 'emuprod') {
    ENV.build.environment = 'emuprod';
    // configure other plugins for staging deploy target here
  }
  if (deployTarget === 'monitest') {
    ENV.build.environment = 'monitest';
    // configure other plugins for staging deploy target here
  }
  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
