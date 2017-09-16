import Ember from 'ember';
import Cookies from 'ember-cli-js-cookie';
import TableExport from '../addon/tableExport';

export default Ember.Controller.extend({
  notify: Ember.inject.service(),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  service_dataLoader:Ember.inject.service("data-loader"),
  service_cordova:Ember.inject.service("cordova"),
  mainController: Ember.inject.controller('business.mainpage'),
  dateService:Ember.inject.service("date-service"),
  sidebarWidth:160,//边栏默认宽度
  sm_duration: 0.2,
  sm_transition_delay: 150,

  isMobile: Ember.computed("global_curStatus",function () {
    console.log("isMobile in:", this.get("global_curStatus").get("isMobile"));
    console.log("footBarMenusShowFlag in:"+this.get("global_curStatus").get("footBarMenusShowFlag"));
    return this.get("global_curStatus").get("isMobile");
  }),
  /*tree相关*/
  treedata: Ember.computed("model",function () {
    console.log("this.model", this.get("model"));
    return this.get("model").treedata;
  }),
  /*初始化入口*/
  init: function () {
    var _self = this;
    console.log("body in init:", this.get("body"));
    // console.log("public_vars:", public_vars);
    Ember.run.schedule("afterRender",this,function() {
      //通用设置
      this.popInit();
      //菜单渲染
      this.sideMenuInit();
      //初始化顶部滑动块
      this.toggleInit();
      //初始化jquery组件定义
      // this.initJqueryPlugin();
    });
  },
  showHeaderAndFooter:Ember.computed('service_PageConstrut.curRouteName',function(){
    var curRoutePath=this.get('service_PageConstrut').get('curRouteName');
    if(curRoutePath==="function-page"){
      return false;
    }
    return true;
  }),

  //观察用户切换功能区,生成不同的footbar菜单
  footBarMenusShowObs: function() {
    let _self = this;
    console.log("run footBarMenusShowObs");
    let footBarMenusShowFlag = this.get("global_curStatus").get("footBarMenusShowFlag");
    console.log("footBarMenusShowFlag in business:",footBarMenusShowFlag);
    if(footBarMenusShowFlag === null){
      return;
    }
    if(this.get("global_curStatus.isMobile")){
      //如果为公众号则return
      if(this.get("global_curStatus.isConsumer")){
        return;
      }
      //移动端底部菜单数据
      let privileges = this.get('store').peekAll("privilege");
      console.log("privileges:",privileges);
      let mobileMenus = null;
      //移动端和公众号取得不同类型菜单
      mobileMenus = privileges.filterBy("type",11);
      console.log("mobileMenus:",mobileMenus);
      let mobileMenusFilter = mobileMenus.filter(function(menu){
        //根据不同的功能区产生不同的footbar菜单
        //这里配置护理员功能区菜单
        if(footBarMenusShowFlag == "cs-user"){
          if(menu.get("code")==="service-care"||
          menu.get("code")==="service-nurse"||
          menu.get("code")==="customer-business"||
          // menu.get("code")==="customer-health"||
          menu.get("code")==="cs-info"||
          menu.get("code")==="customer-warning"||
          // menu.get("code")==="customer-point"||
          // menu.get("code")==="pressure-sores-care"||
          // menu.get("code")==="customer-dynamic-list"||
          menu.get('code')==="nurse-log"){
            return true;
          }
        }else if(footBarMenusShowFlag == "manager"){
          //这里配置管理员功能区菜单
          if(menu.get("code")==="attendance-check"||
          menu.get("code")==="employee-assessment"||
          menu.get("code")==="view-score"||
          //menu.get("code")==="connect-manage"||
          menu.get("code")==="workdelivery-view-mobile"||
          menu.get("code")==="cs-info"){
            return true;
          }
        }else if(footBarMenusShowFlag == "leader"){
          //这里配置领导者功能区菜单
          if(menu.get("code")==="service-query"||
          menu.get("code")==="consultation-management-mobile"||
          menu.get("code")==="other-business"||
          menu.get("code")==="cs-info"){
            return true;
          }
        }else{
          return false;
        }
      });
      mobileMenusFilter = mobileMenusFilter.sortBy("order");
      console.log("mobileMenusFilter:",mobileMenusFilter);
      let mobileMenusEnd = new Ember.A();
      var fetchGroup = function(groupCode){
        let menuGroup = mobileMenusEnd.findBy("code",groupCode);
        if(menuGroup){
          return menuGroup;
        }
        menuGroup = Ember.Object.create({
          code: groupCode,
          isMenuGroup: true,
          menus:[]
        });
        mobileMenusEnd.pushObject(menuGroup);
        return menuGroup;
      };
      //设置菜单分组
      if(footBarMenusShowFlag == "cs-user"){
        mobileMenusFilter.forEach(function(menu){

          //重置选中状态
          menu.set("selected",false);
          let careChoice = localStorage.getItem(Constants.uickey_careChoice);
          if(menu.get("code")==="service-care"){
            //分组菜单
            let menuGroup = Ember.Object.create({
              code: "menuGroupCare",
              isMenuGroup: true,
              menus:[]
            });
            menu.set("menuGroupOrder",1);
            //默认顯示第一個
            if(!careChoice||careChoice==="service-care"){
              menu.set("selected",true);
            }
            menuGroup.get("menus").pushObject(menu);
            mobileMenusEnd.pushObject(menuGroup);
          }else if(menu.get("code")==="service-nurse"){
            let menuGroup = mobileMenusEnd.findBy("code","menuGroupCare");
            menu.set("menuGroupOrder",2);
            if(careChoice&&careChoice==="service-nurse"){
              menu.set("selected",true);
            }
            menuGroup.get("menus").pushObject(menu);
          // }else if(menu.get("code")==="customer-health"){
          //   //分组菜单
          //   let menuGroup = fetchGroup("menuGroupCustomerHealth");
          //   menu.set("menuGroupOrder",1);
          //   //默认顯示第一個
          //   menu.set("selected",true);
          //   menuGroup.get("menus").pushObject(menu);
          // }else if(menu.get("code")==="customer-point"){
          //   let menuGroup = fetchGroup("menuGroupCustomerHealth");
          //   menu.set("menuGroupOrder",2);
          //   menuGroup.get("menus").pushObject(menu);
          // }else if(menu.get('code')==='pressure-sores-care'){
          //   let menuGroup = fetchGroup("menuGroupCustomerHealth");
          //   menu.set("menuGroupOrder",3);
          //   menuGroup.get("menus").pushObject(menu);
          // }else if(menu.get('code')==='customer-dynamic-list'){
          //   let menuGroup = fetchGroup("menuGroupCustomerHealth");
          //   menu.set("menuGroupOrder",4);
          //   menuGroup.get("menus").pushObject(menu);
          }
          else if(menu.get("code")==="customer-warning"){
            //分组菜单
            let menuGroup = fetchGroup("menuGroupNurseLog");
            menu.set("menuGroupOrder",1);
            //默认顯示第一個
            menu.set("selected",true);
            menuGroup.get("menus").pushObject(menu);
          }else if(menu.get("code")==="nurse-log"){
            console.log("customer-warning yes");
            let menuGroup = fetchGroup("menuGroupNurseLog");
            menu.set("menuGroupOrder",2);
            menuGroup.get("menus").pushObject(menu);
          }else{
            //单个菜单
            mobileMenusEnd.pushObject(menu);
          }
        });
        this.set("mobileMenus",mobileMenusEnd);
      }else if(footBarMenusShowFlag == "manager"){
        mobileMenusFilter.forEach(function(menu){
          //重置选中状态
          menu.set("selected",false);
          if(menu.get("code")==="employee-assessment"){
            //分组菜单
            let menuGroup = fetchGroup("menuGroupEmployeeAssessment");
            menu.set("menuGroupOrder",1);
            //默认顯示第一個
            menu.set("selected",true);
            menuGroup.get("menus").pushObject(menu);
          }else if(menu.get("code")==="view-score"){
            let menuGroup = fetchGroup("menuGroupEmployeeAssessment");
            menu.set("menuGroupOrder",2);
            menuGroup.get("menus").pushObject(menu);
          }else{
            //单个菜单
            mobileMenusEnd.pushObject(menu);
          }
        });
        this.set("mobileMenus",mobileMenusEnd);
      }else{
        mobileMenusFilter.forEach(function(menu){
          //重置选中状态
          menu.set("selected",false);
          if(menu.get("code")==="consultation-management-mobile"){
            menu.set("selected",true);
          }
          mobileMenusEnd.pushObject(menu);
        });
        this.set("mobileMenus",mobileMenusEnd);
      }
      console.log("mobileMenus:",this.get("mobileMenus"));
      if(this.get("global_curStatus.isConsumer")){
        return;
      }

    }

  }.observes("global_curStatus.footBarMenusShowFlag").on("init"),

  layoutInit: function(){
    jQuery('.sidebar').removeClass("hidden");
    jQuery('header').css("width","100%");
    let width = $(window).width();
    console.log("need set width:" + width);
    jQuery('#header').removeClass("navbar-fixed-top");
    this.extendAction(jQuery("#sidebar-collapse"));
    $("#main-content").on('resize', function (e) {
      e.stopPropagation();
    });
  },
  //折叠
  collapseAction: function(collapsedItem){
    let width = $(window).width();
    if(!this.get("media.isDesktop")){
      jQuery('.sidebar').removeClass("hidden");
      jQuery('#header').removeClass("navbar-fixed-top");
      jQuery('header').width(width);
      jQuery('#main-content').css("width",width);
      collapsedItem.attr("collapsed","yes");
    }else{
      /* For Navbar */
      jQuery('.navbar-brand').addClass("mini-menu");
      /* For sidebar */
      jQuery('#sidebar').addClass("mini-menu");
      jQuery('#main-content').addClass("margin-left-50");
      width = width - 50;
      console.log("main width:" + width);
      jQuery('#main-content').width(width);
      collapsedItem.attr("collapsed","yes");
    }
  },
  //展开
  extendAction: function(collapsedItem){
    let width = $(window).width();
    console.log("window width:" + width);
    if(!this.get("media.isDesktop")){
      jQuery('.sidebar').addClass("hidden");
      jQuery('#header').addClass("navbar-fixed-top");
      jQuery('header').css("width","auto");
      jQuery('#main-content').css("width","auto");
      collapsedItem.attr("collapsed","no");
    }else{
      jQuery('.sidebar').removeClass("hidden");
      /* For Navbar */
      jQuery('.navbar-brand').removeClass("mini-menu");
      /* For sidebar */
      jQuery('#sidebar').removeClass("mini-menu");
      jQuery('#main-content').removeClass("margin-left-50");
      width = width - this.get("sidebarWidth");
      console.log("main width:" + width);
      jQuery('#main-content').width(width);
      collapsedItem.attr("collapsed","no");
    }
  },
  /*
  * 初始化常规项
  */
  popInit: function () {
    let _self = this;
    //加载页面需要设置min height
    $("#pageLoadingDiv").css("minHeight", $(window).height());
    //布局数据初始化
    this.layoutInit();
    $(window).resize(function() {
      //保证宽度随着窗口大小变化
      console.log("resize in");
      let width = $(window).width();
      width = width - _self.get("sidebarWidth");
      console.log("main width:" + width);
      jQuery('#main-content').width(width);
    });
  },
  /*
  * 初始化顶部滑动块
  */
  toggleInit: function () {
    var _self = this;
    var handleMobileSidebar = function () {
      var menu = $('.sidebar');
      if (menu.parent('.slimScrollDiv').size() === 1) { // destroy existing instance before updating the height
        menu.slimScroll({
          destroy: true
        });
        menu.removeAttr('style');
        $('#sidebar').removeAttr('style');
      }
      menu.slimScroll({
        size: '7px',
        color: '#a1b2bd',
        opacity: 0.3,
        height: "100%",
        allowPageScroll: false,
        disableFadeOut: false
      });
    };
    //屏幕切换复位
    console.log("window width:" + $(window).width() + " and media isTablet:" + this.get("media.isTablet"));
    jQuery("#sidebar-collapse").click(function(){
      var collapsed = $(this).attr("collapsed");
      if(collapsed&&collapsed==="yes"){
        _self.extendAction($(this));
      }else{
        _self.collapseAction($(this));
      }
    });
  },
  /*菜单渲染*/
  sideMenuInit: function(){
    var _self = this;
    let sideWidth = this.get("sidebarWidth");
    jQuery('.sidebar-menu .has-sub > a').click(function () {
      var last = jQuery('.has-sub.open', $('.sidebar-menu'));
      last.removeClass("open");
      jQuery('.arrow', last).removeClass("open");
      jQuery('.sub', last).slideUp(sideWidth);

      var thisElement = $(this);
      var slideOffeset = -1 * sideWidth;
      var slideSpeed = sideWidth;

      var sub = jQuery(this).next();
      if (sub.is(":visible")) {
        jQuery('.arrow', jQuery(this)).removeClass("open");
        jQuery(this).parent().removeClass("open");
        sub.slideUp(slideSpeed, function () {
          if ($('#sidebar').hasClass('sidebar-fixed') === false) {
            // App.scrollTo(thisElement, slideOffeset);
          }
          // handleSidebarAndContentHeight();
        });
      } else {
        jQuery('.arrow', jQuery(this)).addClass("open");
        jQuery(this).parent().addClass("open");
        sub.slideDown(slideSpeed, function () {
          if ($('#sidebar').hasClass('sidebar-fixed') === false) {
            // App.scrollTo(thisElement, slideOffeset);
          }
          // handleSidebarAndContentHeight();
        });
      }
    });
    // Handle sub-sub menus
    jQuery('.sidebar-menu .has-sub .sub .has-sub-sub > a').click(function () {
      var last = jQuery('.has-sub-sub.open', $('.sidebar-menu'));
      last.removeClass("open");
      jQuery('.arrow', last).removeClass("open");
      jQuery('.sub', last).slideUp(sideWidth);
      var sub = jQuery(this).next();
      if (sub.is(":visible")) {
        jQuery('.arrow', jQuery(this)).removeClass("open");
        jQuery(this).parent().removeClass("open");
        sub.slideUp(sideWidth);
      } else {
        jQuery('.arrow', jQuery(this)).addClass("open");
        jQuery(this).parent().addClass("open");
        sub.slideDown(sideWidth);
      }
    });
  },

  /*显示提示信息*/
  popTorMsg: function(msg){
    let _self = this;
    this.set("footerTorMsg",true);
    this.set("toriseMessage",msg);
    $("#footerTor").show();
    $("#footerTor").fadeIn(500,function(){
      Ember.run.later(function(){
        $("#footerTor").fadeOut(1000);
      },3000);
    });
  },

  sysTimeObs:function(){
    let sysTime = this.get("global_dataLoader").getNowTime();
    if(!sysTime){return;}
    var nowHour = this.get("dateService").formatDate(sysTime,"hh");
    console.log("the nowHour",sysTime+"    "+nowHour);
    var queryCusObj =localStorage.getItem("queryCusObj");
    if(queryCusObj){
      console.log("queryCusObjinit ",queryCusObj);
      queryCusObj = JSON.parse(queryCusObj);
      this.get("global_curStatus").set("queryCusObj",queryCusObj);
    }else {
      var numH = Number(nowHour);
      var obj ={};
      if(numH>=0&&numH<6){
        obj = {
          queryStartDate:'0',
          queryEndDate:'6',
        };
      }else if (numH>=6&&numH<8) {
        obj = {
          queryStartDate:'6',
          queryEndDate:'8',
        };
      }else if (numH>=8&&numH<10) {
        obj = {
          queryStartDate:'8',
          queryEndDate:'10',
        };
      }else if (numH>=10&&numH<12) {
        obj = {
          queryStartDate:'10',
          queryEndDate:'12',
        };
      }else if (numH>=12&&numH<14) {
        obj = {
          queryStartDate:'12',
          queryEndDate:'14',
        };
      }else if (numH>=14&&numH<16) {
        obj = {
          queryStartDate:'14',
          queryEndDate:'16',
        };
      }else if (numH>=16&&numH<18) {
        obj = {
          queryStartDate:'16',
          queryEndDate:'18',
        };
      }else if (numH>=18&&numH<20) {
        obj = {
          queryStartDate:'18',
          queryEndDate:'20',
        };
      }else if (numH>=20&&numH<24) {
        obj = {
          queryStartDate:'20',
          queryEndDate:'24',
        };
      }
      obj.queryCusFlag = "personal";
      this.get("global_curStatus").set("queryCusFlag",obj.queryCusFlag);
      this.get("global_curStatus").set("queryCusObj",obj);
      // this.set("queryCusFlag",obj.queryCusFlag);
      // this.set("queryCusObj",queryCusObj);
    }
  }.observes("global_dataLoader.sysconfig.sysTime").on("init"),
  actions: {
    initPage: function () {
      this.get('jstreeActionReceiver').send('redraw');
    },
    //主页面跳转
    changeMainPage:function (menuLink) {
      let _self = this;
      //获取全局视频播放对象
      let videoObj = _self.get("global_curStatus").get("videoObj");
      console.log("videoObj in business:",videoObj);
      //如果存在全局的视频播放对象,则使其停止播放,并将全局播放对象清空
      if(videoObj){
        videoObj.get(0).pause();
        _self.get("global_curStatus").set("videoObj",null);
      }
      console.log("changeMainPage in,menuLink:" + menuLink);
      this.get("mainController").switchMainPage(menuLink);
    },
  },

  /*移动端导航功能*/
  breadCrumbsPath: null,
  pageTitle: null,
  //根据当前路径，计算导航信息
  curPath: null,//当前路径

});
