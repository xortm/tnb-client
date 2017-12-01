import Ember from 'ember';
// import InfinityRoute from 'ember-infinity/mixins/route';
import InfinityRoute from '../../addon/ember-infinity/mixins/infinity-route';
import RouteMixin from '../../addon/ember-cli-pagination/remote/route-mixin';

export default Ember.Mixin.create(InfinityRoute,RouteMixin,{
  statusService: Ember.inject.service("current-status"),
  pageConstructure:Ember.inject.service('page-constructure'),
  //分页查询，根据不同模式不同实现
  findPaged: function(modelName,params,callback){
    var _self = this;
    var mainpageController = App.lookup('controller:business.mainpage');
    //页码记忆
    var rmodel = this.get("pageConstructure.funcTreeData");
    let hasPageRoute = rmodel.filter(function(item){
      return item.page > 0;
    });
    if(hasPageRoute.length>0){
      if(!this.get('pageConstructure.crumRouteList').findBy('code',hasPageRoute[0].code)){
        let item = rmodel.findBy('code',hasPageRoute[0].code);
        item.page = 1;
      }else{
        if(!this.get('statusService.pageChangeFlag')){//本页面再次请求findpaged
          params.page = 1;
        }else{//页面切换
          params.page = hasPageRoute[0].page;
        }

      }

    }
    var callbackAct = function(list){
      //消除加载提示
      if(_self.get("tableSelector")){
        mainpageController.removeTableLoading($(_self.get("tableSelector")));
        console.log('list data in pagination',list.get('length'));
        if(list.get('length')==0){
          if($('.nodate').length>0){

          }else{
            $(_self.get("tableSelector")).append("<div class='nodate'>暂无数据</div>");
          }

        }else{
          $('.nodate').remove();
        }


      }
      if(callback){
        //记忆当前页码
        let curRouteName = _self.get('pageConstructure.curRouteName');
        let route = _self.get('pageConstructure').getRouteDef(curRouteName);
        if(route){
          route.page = list.get('query.page[number]');
          route.modelName = modelName;
        }
        callback(list);
      }
    };
    if(!this.get("statusService.isMobile")){

      //加载提示,已经初始化过了才进行
      if(this.get("DISPLAY_initFlag")){
        console.log("showTableLoading in findPaged");
        mainpageController.showTableLoading($(_self.get("tableSelector")));
      }
      //pc端分页使用ember-cli-pagination
      return this._super(modelName,params,callbackAct);
    }
    //手机端使用ember-infinity
    var modelPath = "controller." + this.pageyModelListName;
    if(!this.pageyModelListName){
      modelPath = "controller.dataList";
    }
    var paramsUpt = $.extend({},params,{
      perPage: this.pageSize,
      startingPage: 1,
      modelPath: modelPath
    });
    this.set("afterInfinityModel", callbackAct);
    return this.infinityModel(modelName, paramsUpt,callbackAct);
  },
  /*ember-infinity部分*/
  pageyModelListName: null,//默认查询model名称
  pageSize:10,//每页的条数
  perPageParam: "page[size]",              // instead of "per_page"
  pageParam: "page[number]",                  // instead of "page"
  totalPagesParam: "meta.totalPage",
  pageData:{},
  stats: null,

  /*ember-cli-pagination部分*/
  perPage: 10,
  pagiParamsSet: function(){
    var params = {};
    var pageParams = {
      "page": "page[number]",
      "perPage": "page[size]",
      "total_pages": "totalPage",
      "total_count": "totalCount"
    };
    params.paramMapping = pageParams;
    return params;
  },

});
