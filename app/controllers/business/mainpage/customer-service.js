import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
const { taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail} = Constants;

export default Ember.Controller.extend(InfiniteScroll,{
  queryCondition:'',
  textShow: true,
  feedService: Ember.inject.service('feed-bus'),
  infiniteContentPropertyName: "financialList",
  infiniteModelName: "financial",
  infiniteContainerName:"financialContainer",
  queryParams:{},
  tabFuncs:Ember.computed(function() {
    var a = new Ember.A();
    var t1 = Ember.Object.create({
      code:"todayTask",
      selected:true,
      text:"当日任务"
    });
    var t2 = Ember.Object.create({
      code:"finished",
      text:"已完成任务"
    });
    a.pushObject(t1);
    a.pushObject(t2);
    return a;
  }),
  init: function(){
    Ember.run.schedule("afterRender",this,function() {
      console.log("datatable1_wrapper ele",$("#datatable1_wrapper"));
      //$("#datatable1_wrapper").append("<div style='position:relative;top:100px;left:100px;font-size:20px;'>loading...</div>");
    });
  },
  /*通过event service监控顶部菜单的选择事件，并进行相关方法调用*/
  listenner: function() {
    console.log("feedService reg");
    this.get('feedService').on('headerEvent_queryTask', this, 'queryTask');
  }.on('init'),
  //注销时清除事件绑定
  cleanup: function() {
    console.log("cleanup feed");
    this.get('feedService').off('headerEvent_queryTask', this, 'queryTask');
  }.on('willDestroyElement'),

  actions:{
    switchTab(code){
      console.log('switchTab in,code:' + code);
      this.set("curTabCode",code);
    },
    goDetail(customer){
      console.log("go detail",customer);
      var mainpageController = App.lookup('controller:business.mainpage');
      var id = customer.get("id");
      mainpageController.switchMainPage('customer-info',{id:id});
    },
    toAddPage(){
      var mainpageController = App.lookup('controller:business.mainpage');
      //var id = this.get("customer").get("id");
     mainpageController.switchMainPage('customer-add');
    //alert("111111");
  },
  //列表显示
  showList: function() {
      this.set('textShow', false);
      $('#listBtn2').attr('class', 'cur');
      $('#textBtn2').attr('class', '');

  },
  //图文显示
  showText: function() {
      this.set('textShow', true);
      $('#listBtn2').attr('class', '');
      $('#textBtn2').attr('class', 'cur');
  },
  }
});
