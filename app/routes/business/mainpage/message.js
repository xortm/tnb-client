import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title: "提醒消息",

  model() {
    console.log("model in message");
    return {};
  },
  doQuery:function(){
    var controller = this.get("controller");
    this.get("global_ajaxCall").set("action","latestMessages");
    var params = this.buildQueryParams();
    controller.infiniteQuery('message',params).then(function(messageNews){
      messageNews.forEach(function(item){
        if(item.get("detailType")==1){
          item.icon = "fa-warning";
        }else if(item.get("detailType")==2){
          item.icon = "fa-credit-card";
        }else if(item.get("detailType")==3){
          item.icon = "fa-sign-in";
        }else if(item.get("detailType")==4){
          item.icon = "fa-wheelchair";
        }else if(item.get("detailType")==7){
          item.icon = "fa-heart";
        }
      });
      controller.set("messageNews",messageNews);
    });
  },
  buildQueryParams:function(){
    var params = {};
    var curUser = this.get('global_curStatus').getUser();
    var filter = {toUser:{id:curUser.get("id")},type:2};
    // var sort = {createTime:"desc"};
    // params.sort = sort;
    params.filter = filter;
    console.log("params filter",params);
    return params;
  },

  setupController:function(controller,model){
    this._super(controller,model);
    this.doQuery();
    console.log("controllermessage",controller);
  },

  actions:{

  }
});
