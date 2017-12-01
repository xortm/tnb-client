/*jshint node:true*/
var stew = require('broccoli-stew');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var buildFilter = require('./buildfilter');
var androidBuildFilter = require('./androidbuildfilter');
module.exports = {
  name: 'remove-tree',
  environment:null,

  isDevelopingAddon: function() {
    return true;
  },
  config(environment, appConfig) {
    if(!this.environment){
      this.environment = environment;
    }
    return this._super(environment, appConfig);
  },
  treeForTemplates(tree){
    console.log("treeForTemplates tree",tree);
    return tree;
  },
  postprocessTree: function(type, tree){
  	console.log("type is:" + type + " and environment:" + this.environment);
    if(this.environment!=="public"){
      if(this.environment=="android"){//安卓端处理
        if (type === 'js')   {
          let filter = {include:androidBuildFilter.jsfiles(),exclude:androidBuildFilter.exfiles()};
          //筛选js
          tree = stew.find(tree,filter);
          return tree;
        } else if(type === 'template'){
          //筛选hbs
          // let filter = {include:buildFilter.hbsfiles()};
          // tree = stew.find(tree,filter);
          return tree;
        } else {
          return tree;
        }
      }
      return tree;
    }
    //针对公众号进行处理
    if (type === 'js')   {
      let filter = {include:buildFilter.jsfiles(),exclude:buildFilter.exfiles()};
      //筛选js
      tree = stew.find(tree,filter);
      return tree;
    } else if(type === 'template'){
      //筛选hbs
      // let filter = {include:buildFilter.hbsfiles()};
      // tree = stew.find(tree,filter);
      return tree;
    } else {
      return tree;
    }
  }
};
