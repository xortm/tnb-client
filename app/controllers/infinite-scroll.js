import Ember from 'ember';

const { Mixin, run, computed, RSVP: { resolve } } = Ember;

/**
A mixin for infinite scrolls.

@class EmberCliInfiniteScroll.Mixin.InfiniteScroll
@extends Ember.Mixin
*/

export default Mixin.create({
  service_PageConstrut:Ember.inject.service("page-constructure"),
  service_dateService:Ember.inject.service("date-service"),
  infiniteCallback:null,//预存callback接口
  /**
  True if a request has been initiated but not resolved.
  @property infiniteQuerying
  @default false
  */
  // 是否用了此组件中的上拉加载更多功能,用于区别,
  // 使没有用此功能的页面不会出现上拉加载数据提示
  hasInfiniteQueryFlag: false,
  //用了infiniteQuery的功能,且页面进行下拉刷新,并且没有queryFlagIn函数拦截
  infiniteQueryInFlag: false,
  infiniteQuerying: false,
  //默认是有数据,用于页面中的暂无数据判断,主要在控制器和hbs中控制
  // hasDate: true,
  //循环被查询次数
  _cycleCount: 0,
  queryFlagIn: null,
  //是否滚动可用
  infiniteScrollAvailable: true,
  //底部距离判断阀值
  triggerDistance: 10,
  pageScrollY: 90,
  //是否具备触发条件
  aboveTheTrigger: false,
  //是否有更多内容
  hasMoreContent: true,
  //页码
  "page[number]": 1,
  //每页数据量
  "page[size]": 20,
  //页码参数
  infiniteIncrementProperty: 'page[number]',
  //每页数据参数
  infiniteIncrementBy: 'page[size]',
  //返回值中的总页数
  totalPagesResKey: "meta.totalPage",
  //iscroll容器id
  infiniteContainerName: 'iscroll',
  //滚动触发标记（累加）
  scrollInFlag: 0,
  //查询的model
  infiniteContentPropertyName: 'model',
  infiniteModelName: '',
  //拼接的查询参数
  _fullQueryParams: computed('infiniteIncrementBy', 'infiniteIncrementProperty', 'infiniteQueryParams', function() {
    let defaultQueryParams = [this.get('infiniteIncrementBy'), this.get('infiniteIncrementProperty')];
    let infiniteQueryParams = this.get('infiniteQueryParams');
    return defaultQueryParams.concat(infiniteQueryParams);
  }),
  infiniteQueryParams: [],
  getContainerDom: function(){
    var selector = "#" + this.get("infiniteContainerName") + " .wrapperInner";
    return $(selector);
  },
  getContainerParentDom: function(){
    var selector = "#" + this.get("infiniteContainerName");
    return $(selector);
  },
  /**
  Does what's needed for the infinite scroll.
  - sets `infiniteQuerying` to `true`
  - if passed `modelName`, sets `infiniteModelName`
  - if passed `params`, sets `infiniteQueryParams`
  - calls `beforeInfiniteQuery`
  - calls `infiniteQuery`
  then:
  - calls `afterInfiniteQuery`
  - calls `_updateInfiniteProperties`
  - sets ` infiniteQuerying` to `false`

  @method performInfinite
  @param modelName { String } the model to be queried
  @param params { Object } params to use in the query
  @returns { Promise } the records
  */

  infiniteQuery(modelName, params,callback) {
    var _self = this;
    _self.set("queryparams",params);
    //如果有model名，说明是第一次查询，重置参数
    console.log("infiniteQuery is in,modelName:" + modelName);
    if(modelName&&modelName.trim()!=="undefined") {
      console.log("need reset");
      //首先对滚动屏实施一个遮罩加载的效果,如果是下拉刷新引起的,则跳过
      let infiniteQueryInFlag = _self.get("infiniteQueryInFlag");
      console.log("infiniteQueryInFlag in infiniteQuery" + infiniteQueryInFlag);
      if(!infiniteQueryInFlag){
        this._showLoading();
      }
      this.resetInfinite();
      this.set('infiniteModelName', modelName);
    }
    console.log("infiniteQuerying:" + this.get('infiniteQuerying') + " and infiniteScrollAvailable:" + this.get("infiniteScrollAvailable"));
    if (this.get('infiniteQuerying') || !this.get('infiniteScrollAvailable')) {
      // this._hideLoading();
      return resolve([]);
    }
    this.set('infiniteQuerying', true);
    this.set('hasInfiniteQueryFlag', true);
    if(params) {
      let paramsToSet = Object.keys(params);
      this.set('infiniteQueryParams', paramsToSet);
      this.setProperties(params);
    }
    let infiniteModelName = this.get('infiniteModelName');
    let fullQueryParams = this.get('_fullQueryParams');
    params = this.getProperties(fullQueryParams);
    this.beforeInfiniteQuery(params);
    let newRecords = this.infiniteDataQuery(infiniteModelName, params)
    .then(records => {
      let totalPages = records.get(_self.get('totalPagesResKey'));
      console.log("totalPages in:",totalPages);
      let returnedContentLength = records.get('length');
      let recordsArray = records.toArray();
      this.afterInfiniteQuery(recordsArray);
      this._updateInfiniteProperties(returnedContentLength,totalPages);
      this.set('infiniteQuerying', false);
      _self._hideLoading();
      _self._hideTopLoading();
      _self._hideBottomLoading();
      if(callback){
        this.set('infiniteCallback', callback);
        this.infiniteCallback = callback;
        console.log("callback in:",recordsArray);
        callback(recordsArray);
      }else{
        //执行预存的回调
        if(this.infiniteCallback){
          this.infiniteCallback(recordsArray);
        }
      }
      return recordsArray;
    });

    return newRecords;
  },
  _showTopLoading: function(){
    console.log("run in _showTopLoading");
    console.log("run in showLoadingFlagscroll",this.get("showLoadingFlagscroll"));
    let showLoader = this.get("service_PageConstrut.showLoader");
    var containerDom = this.getContainerDom();
    var loadDom = $("<div id='loadingDiv' class='center top60'><img width='35' src='assets/images/logo/loading.gif'/></div>");
    if(this.get("showLoadingFlagscroll") || showLoader){return;}
    this.set("showLoadingFlagscroll",true);//加载图片标示
    this.set("loadDom",loadDom);
    containerDom.parent().prepend(loadDom);
    // containerDom.hide();
  },
  _hideTopLoading:function(){
    var _self = this;
    var containerDom = this.getContainerDom();
    console.log("run in _hideTopLoading");
    // var loadDom =  this.get("loadDom")[0];
    var loadDom =  this.get("loadDom");
    var scroller = this.get("_scroller");
    console.log("loadDom11111111111",loadDom);
    console.log("loadDom11111111111 scroller",scroller);
    var _needScrollTo = this.get("_needScrollTo");
    $(loadDom).remove();
    _self.set("showLoadingFlagscroll",false);
    console.log("run in _hideTopLoading showLoadingFlagscroll",_self.get("showLoadingFlagscroll"));
    // loadDom.style.display = 'none';
    Ember.run.later(function(){
      if(!scroller||!scroller.id){return;}
      console.log("isScrollToTop11:");
      console.log("isScrollToTop22:",_self.get("isScrollToTop"));
      if(_self.get("isScrollToTop")){
        _self.set("isScrollToTop",false);
        scroller.scrollTo(0, 0, 0);
      }
    },700);
  },
  _showBottomLoading: function(){
    var containerDom = this.getContainerDom();
    // var loadBottomDom = $("<div id='loadingBottomDiv' class='center'><img width='35' src='assets/images/logo/loading.gif'/></div>");
    var loadBottomDom = $("<div id='loadingBottomDiv' class='center height20 font14 line-height-20 padding-top10'>加载中&nbsp;<img width='14' src='assets/images/logo/loading.gif'/></div>");
    if(this.get("showBottomLoadingFlag")){return;}
    this.set("showBottomLoadingFlag",true);//加载图片标示
    this.set("loadBottomDom",loadBottomDom);
    containerDom.append(loadBottomDom);
    // containerDom.hide();
  },
  _hideBottomLoading:function(){
    var _self = this;
    var containerDom = this.getContainerDom();
    // var loadBottomDom =  this.get("loadBottomDom")[0];
    var loadBottomDom =  this.get("loadBottomDom");
    var scroller = this.get("_scroller");
    console.log("loadBottomDom11111111111",loadBottomDom);
    console.log("loadBottomDom11111111111 scroller",scroller);
    $(loadBottomDom).remove();
    _self.set("showBottomLoadingFlag",false);
  },
  _showLoading: function(){
    this.get("service_PageConstrut").set("showLoader", true);
    console.log("hhh");
  },
  _hideLoading: function(){
    this.get("service_PageConstrut").set("showLoader", false);
    this.get("service_PageConstrut").set("pageInLoading", false);
  },
  /**
  Called immediately before the infinite query starts.

  @method beforeInfiniteQuery
  @param params { Object } the params that will be used in the query
  */

  beforeInfiniteQuery: Ember.K,

  /**
  The query that will be used.

  @method infiniteQuery
  @param modelName { String } the name of the model
  @param params { Object } the params that will be used in the query
  @return { Promise } the records
  */

  infiniteDataQuery(modelName, params={}) {
    return this.get('store').query(modelName, params);
  },

  /**
  Record processing or anything else that needs to happen with the returned
  records.

  @method afterInfiniteQuery
  @param  newRecords { Object } the records returned in this cycle
  */

  afterInfiniteQuery(newRecords) {
    var _self = this;
    let contentPropertyName = this.get('infiniteContentPropertyName');
    let model = this.get(contentPropertyName);
    //用于判断是否为下拉刷新操作,如果是,则清空数据
    let infiniteQueryInFlag = _self.get("infiniteQueryInFlag");
    if (!model || infiniteQueryInFlag) {
      model = new Ember.A();
    }
    // console.log("model ori len:" + model.get("length"));
    model.addObjects(newRecords);
    let infiniteModelSort = this.get("infiniteModelSort");
    //刷新后进行排序
    if(infiniteModelSort){
      let sortManu = infiniteModelSort.split(":");
      let modelSort = model.sortBy(sortManu[0]);
      //正序和倒序指定
      if(sortManu[1]==="desc"){
        modelSort = modelSort.reverse();
      }
      this.set(contentPropertyName,modelSort);
    }else{
      this.set(contentPropertyName,model);
    }
    //重置为false,等待下一次下拉刷新
    _self.set("infiniteQueryInFlag",false);
    console.log("model len is:" + model.get("length"));
    //iscroll初始化
    var scroller = this.get("_scroller");
    //如果当前屏幕还未初始化，则不处理
    if(!scroller||!scroller.id){
      return;
    }
    console.log("scroller is:",scroller);
    Ember.run.later(function(){
      _self._refreshScroller();
    },100);
  },

  /**
  Calls `_updateInfiniteCount` and `updateInfiniteAvailable`.

  @method _updateScrollProperties
  @param addedLength { Number } the incremental length of the model
  @private
  */

  _updateInfiniteProperties(addedLength,totalPages) {
    this._updateInfiniteCount(addedLength);
    this.updateHasMoreContent(addedLength,totalPages);
    this.incrementProperty('_cycleCount');
  },

  /**
  Increments a property after the infinite scroll is finished.

  @method _updateInfiniteCount
  @param addedLength { Number } the incremental length of the model
  @private
  */

  _updateInfiniteCount(addedLength) {
    let incrementProperty = this.get('infiniteIncrementProperty');
    let increment = this.get(incrementProperty) + 1;
    this.set(incrementProperty,increment);
    // this.incrementProperty(incrementProperty, addedLength);
  },

  /**
  Determines whether the infinite scroll should continue after it finishes.

  @method updateHasMoreContent
  @param addedLength { Number } the incremental length of the model
  */

  updateHasMoreContent(addedLength,totalPages) {
    let infiniteIncrement = this.get("infiniteIncrementProperty");
    let curPageNum = this.get(infiniteIncrement);
    let hasMoreContent = curPageNum <= totalPages;
    this.set('hasMoreContent', hasMoreContent);
    console.log("need hasMoreContent:" + hasMoreContent);
    console.log("need totalPages:" + totalPages);
    this.set('infiniteScrollAvailable', hasMoreContent);
  },
  //查询重置
  resetInfinite() {
    let {
      infiniteIncrementProperty,
      infiniteContentPropertyName
    } = this.getProperties('infiniteContentPropertyName', 'infiniteIncrementProperty');
    let infiniteQueryInFlag = this.get("infiniteQueryInFlag");
    if(this.get(infiniteContentPropertyName) && !infiniteQueryInFlag){
      var list = this.get(infiniteContentPropertyName);
      console.log("list get",list);
      let objectConstructor = {}.constructor;
      //有可能只是个对象
      if(list&&list.constructor !== objectConstructor){
        list.clear();
      }
    }
    this.set("_cycleCount",0);
    this.set(infiniteIncrementProperty, 1);
    // this.set('hasMoreContent', true);
    this.set('infiniteScrollAvailable', true);
    this.directInitScoll(true);
  },

  //检查是否达到底部
  _listenerFired(offsetY) {
    var containerDom = this.getContainerDom();
    let scroller = this.get('_scroller'),
    triggerDistance = this.get('triggerDistance'),
    previousAboveTheTrigger = this.get('aboveTheTrigger');

    let offsetFromTop = containerDom.offset().top,
    scrollContainerPosition =  parseInt(scroller.y) * -1,
    scrollContainerHeight = containerDom.height()-560;

    let heightOffset = scrollContainerPosition + triggerDistance;
    let mayLoadContent = ( heightOffset >= scrollContainerHeight );
    console.log("heightOffset:" + heightOffset + " and scrollContainerHeight:" +
    scrollContainerHeight + " scrollContainerPosition:" + scrollContainerPosition);
    var containerName = this.get("infiniteContainerName");
    if(containerName=="staffscheduleContainer"||containerName=="nursingplanexeContainer"||
    containerName=="healthInfoContainer"||containerName=="serviceCareContainer"||containerName=="serviceNurseContainer"){
      console.log("1111111111111111111111111 end staffHBS");
      return;
    }
    if (mayLoadContent && this.get('hasInfiniteQueryFlag') && this.get("hasMoreContent")) {
      this._showBottomLoading();
      this.infiniteQuery();
    }
  },
  //初始化iscroll
  _initIscroll: function(){
    var stopScroll = this.get("stopScroll");
    if(stopScroll){return;}//阻止下拉刷新的所有操作
    var showLoadingFlagscroll = this.get("showLoadingFlagscroll");
    if(showLoadingFlagscroll){return;}
    var _self = this;
    var scroller = this.get("_scroller");
    var containerName = "#" + this.get("infiniteContainerName");
    if(scroller&&scroller.id){
      console.log("need destroy first,scroller:",scroller);
      console.log("need destroy first:",this.get("noNeedDestroy"));
      if(!this.get("noNeedDestroy")){
        scroller.destroy();
      }else{
        //如果设置了不销毁，则处理
        this.set("noNeedDestroy",false);
      }
    }else{
      //初始化事件屏蔽逻辑
      $(containerName).on("tap", function(e) {
        console.log("tap in");
        if(_self.get("scrollFlag")){
          console.log("tap and ignore");
          // e.preventDefault();
          // e.stopPropagation();
          // $(this).off('click');
        }
      });
    }
    console.log("containerName is:" + containerName);
    Ember.run.later(function(){
      console.log("rende,Container len:",Ember.$(containerName).length);
      var scroller = new JRoll(containerName, {
        scrollX : false, //是否水平滚动
        scrollY : true, //是否垂直滚动
        // scrollFree: true,
        minY: 20,
        bounce : true, //是否超过实际位置反弹
        scrollBarY : false, //是否隐藏滚动条 false是隐藏
      });
      scroller.on("scrollStart", function() {
        //阻止时不进行操作
        if(_self.get("scrollPrevent")){
          console.log("scrollStart need prevent");
          return;
        }
        console.log("scroll start goon");
        _self.set("beginY",this.y);
      });
      scroller.on("scroll",function () {
        console.log('scroll in:' + this.y);
        //阻止时不进行操作
        if(_self.get("scrollPrevent")){
          console.log("scroll need prevent");
          return;
        }
        console.log("scroll goon");
        //发送滚动事件
        _self.incrementProperty("scrollInFlag");
        console.log("scrollInFlag add:" + _self.get("scrollInFlag"));
        //进行滚动标记，屏蔽其他事件
        _self.getContainerParentDom().attr("scrollFlag","yes");
        _self.getContainerParentDom().attr("scrollFlagTime",Date.now());
        //记录曾经滚动的最大值，后续需要判断是否进行上拉加载更多
        let maxY = _self.get("scrollMaxY");
        if(!maxY){
          maxY = 0;
        }
        if(maxY<this.y){
          console.log("need set maxY:" + this.y);
          _self.set("scrollMaxY",this.y);
        }
      });
      scroller.on("scrollEnd",function () {
        //重置标志,延时1秒
        Ember.run.later(function(){
          let curTime = Date.now();
          let prevTime = _self.getContainerParentDom().attr("scrollFlagTime");
          if(!prevTime){
            prevTime = 0;
          }
          let durTime = curTime - prevTime;
          console.log("curTime:" + curTime + " and prevTime:" + prevTime + " and durTime:" + durTime);
          //只有大于1秒，才重置，因为有可能出现时间期空档
          if(durTime>500){
            _self.getContainerParentDom().attr("scrollFlag","no");
          }
        },500);
        //阻止时不进行操作
        if(_self.get("scrollPrevent")){
          console.log("scrollEnd need prevent");
          return;
        }
        let scrollMaxY = _self.get("scrollMaxY");
        console.log('scroll end in:' + this.y + " and scrollMaxY:" + scrollMaxY);
        var containerNametask = _self.get("infiniteContainerName");
        //下拉刷新
        if(Math.abs(this.y)<Math.abs(scrollMaxY)){
          // var showLoadingFlagscroll = _self.get("showLoadingFlagscroll");
          // if(showLoadingFlagscroll){return;}
          var preventInfinite = _self.get("preventInfinite");//不会刷新,也不会出现loading图标,但上滑时可能会造成刷新,可以用scrollPrevent
          if(preventInfinite){return;}
          // let queryparams = _self.get("queryparams");
          // _self.infiniteQuery();
          console.log("need refresh");
          //需要重置参考值
          _self.set("scrollMaxY",0);
          _self.set("infiniteScrollAvailable",true);
          // if(containerNametask!="nursingplanexeContainer"){
          _self._showTopLoading();
          // }
          if(_self.queryFlagIn){
            _self.queryFlagIn();
            _self.set("noNeedDestroy",true);
          }else{
            let infiniteModelName = _self.get('infiniteModelName');
            let queryparams = _self.get("queryparams");
            let infiniteCallback = _self.get("infiniteCallback");
            //用于标识是下拉刷新的操作
            _self.set("infiniteQueryInFlag",true);
            _self.infiniteQuery(infiniteModelName,queryparams,infiniteCallback);
          }
        }
        _self._listenerFired();
      });
      console.log("loadDom11111111111scroller",scroller);
      _self.set("_scroller",scroller);
      _self._refreshScroller();
      //关闭转场页面
      _self.get("service_PageConstrut").set("pageInLoading",false);
      _self.set("scrollHasReady",true);
      console.log("scrollHasReady has done");
      //从directInitScoll函数进来的需要scrollToTop
      console.log("isScrollToTop:",_self.get("isScrollToTop"));
      if(_self.get("isScrollToTop")){
        _self.set("isScrollToTop",false);
        scroller.scrollTo(0, 0, 0);
      }
    },500);
  },
  _refreshScroller:function() {
    var scroller = this.get("_scroller");
    console.log("_refreshScroller in,scroller",scroller);
    //如果当前屏幕还未初始化，则不处理
    if(!scroller||!scroller.id){
      console.log("quit from _refreshScroller");
      return;
    }
    scroller.refresh();
    let pageScrollY = this.get("pageScrollY");
    scroller.maxScrollY = scroller.maxScrollY - pageScrollY;
  },
  directInitScoll(flag){
    //当从这个函数进来的加一个标志位
    if(flag){
      this.set("isScrollToTop",true);
    }
    console.log("directInitScoll in");
    this._initIscroll();
  },
  //已经加载完滚动条,只进行刷新操作,可以保证滑动当前位置
  refreshScrollerAction(){
    console.log("directInitRefresh in");
    this._refreshScroller();
  },
  hideAllLoading(){
    this._hideTopLoading();
    this._hideLoading();
  },
  actions: {
    scrollIn(){
      //下级实现
    },
    //从组件可以接到didRender事件
    didRender() {
      console.log("didRender in,this.infiniteContainerName:" + this.get("infiniteContainerName"));
      //发送渲染事件
      this.get("service_PageConstrut").set("pageStatus",5);
    },
    didInsertElement() {
      this.set("showLoadingFlagscroll",false);
      var theDom ;//当前移动端界面的ID
      theDom = $("#" + this.get("infiniteContainerName"));
      // theDom.before("<div class='height44 line-height-44'>下拉刷新</div>");//外面的前面
      // theDom.prepend("<div class='height44 line-height-44'>下拉刷新</div>");//外面的前面

      // this.get("service_PageConstrut").set("showLoader", false);
      //接收到insert渲染事件后初始化iscroll
      console.log("didInsertElement is in,this.infiniteContainerName:" + this.get("infiniteContainerName"));
      //调整高度
      var _self = this;
      let offset = _self.get("screenOffset");
      let containerDom =  $("#" + _self.get("infiniteContainerName"));
      let newHeight = containerDom.height() + offset;
      console.log("ori height:"+offset);
      console.log("ori height:" + containerDom.height() + " and newHeight:" + newHeight);
      var containerName = _self.get("infiniteContainerName");
      if(containerName=="taskSquareContainer"){
        // var curUser = this.get("statusService").getUser();
        // App.lookup("controller:business.mainpage.task-square").queryFlagIn();
      }else {
      }
      if(offset&&containerDom.height()){
        console.log("need re height");
        containerDom.height(newHeight);
      }
      this._initIscroll();
    },
    //激活退回页面的事件处理
    switchBackAction(){

    },
    //激活显示页面的事件处理,需要屏幕刷新
    switchShowAction(){
      var _self = this;
      if(!_self.get("switchShowActionFlag")){
        _self.set("isScrollToTop",false);
      }
      console.log("switchShowAction in");
      //设置transition标志，用于识别是否history的页面跳转
      this.set("service_PageConstrut.curTransitionFlag",this.get("service_PageConstrut.preTransitionFlag"));
      var scroller = this.get("_scroller");
      //如果当前屏幕还未初始化，则不处理
      if(!scroller||!scroller.id){
        console.log("quit _refreshScroller");
        return;
      }
      console.log("do refresh");
      Ember.run.later(function(){
        if(!_self.get("inRefresh")){
           console.log("do refresh in");
           _self._refreshScroller();
         }
      },100);
    },
  }
});
