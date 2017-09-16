import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
// import InfiniteScroll from '../../controllers/infinite-scroll';

export default BaseItem.extend({
  global_dataLoader: Ember.inject.service('data-loader'),
  i:0,//这个是判断 list是否在hbs加载完毕标示
  allSrc: "./assets/images/icon/all1.png",
  // isExpandMode: false,//设置显示隐藏
  //观察global_dataLoader里面加载完数据,立马准备绘制页面
  allCustomersObs: function(){
    let allCustomers;
    let isSquare = this.get("isSquare");
    console.log("isSquare in select:",isSquare);
    if(isSquare == 12){
      allCustomers = this.get("global_dataLoader").get("employeeSelecter");
    }else{
      allCustomers = this.get("global_dataLoader").get("customerSelecter");
    }
    if(!allCustomers){return;}
    this.set("allCustomers",allCustomers);
    console.log("allCustomers in selecter:",allCustomers);
  }.observes("global_dataLoader.customerSelecter","global_dataLoader.employeeSelecter","isSquare").on("init"),
  //处理收起展开动画
  isExpandModeSlide: function(){
    let _self = this;
    let isExpand = this.get("isExpand");
    if(isExpand == 1){
      this.$("#selectBarContainer").css("right","0px").hide();
      this.$("#rightBar").css("right","0px").hide();
      this.set("isExpand",2);
      console.log("wwwww");
      // return;
    }
    let isExpandMode = this.get("isExpandMode");
    if(isExpandMode){
      this.$("#selectBarContainer").slideDown(500);
      this.$("#rightBar").slideDown(500);
    }else{
      if(_self.get("cid")){
        this.$("#selectBarContainer").slideUp(500,function(){
          _self.sendAction("choiceCustomer", _self.get("cid"),_self.get("leaveStatus"));
        });
        this.$("#rightBar").slideUp(500);
      }else{
        this.$("#selectBarContainer").slideUp(500);
        this.$("#rightBar").slideUp(500);
      }
    }
  }.observes("isExpandMode"),
  //生成大写字母数组
  letterArr:Ember.computed(function() {
    var letter = new Ember.A();
    for(var i=0;i<26;i++){
      letter.pushObject(String.fromCharCode(65+i));//输出A-Z  26个大写字母
    }
    console.log("letter:",letter);
    return letter;
  }),
  //进一步处理customer数据
  allCustomersInBarEnd:Ember.computed("allCustomers",function() {
      var allCustomers = this.get("allCustomers");
      if(!allCustomers){
        return null;
      }
      // let allCustomersInBar = allCustomers.toArray();
      let allCustomersInBar = new Ember.A();
      let allCustomersInBarArr = new Ember.A();
      let allCustomersInBarEnd = new Ember.A();
      let flagBar = new Ember.A();
      let isSquare = this.get("isSquare");
      allCustomers.forEach(function(customer) {
        if(isSquare == 12){
          customer.set("leaveStatus",0);
        }
        var initial = pinyinUtil.getPinyin(customer.get("name"));
        console.log("initial:",initial);
        customer.set('initial',initial);
        allCustomersInBar.pushObject(customer);
      });
      // let allCustomersInBarArr = allCustomersInBar.sort(
      //   function compareFunction(param1, param2) {
      //           console.log("param1 is",param1);
      //           return param1.get("name").localeCompare(param2.get("name"));
      //       }
      // );
      allCustomersInBarArr = allCustomersInBar.sortBy("initial");//排序一下
      console.log("allCustomersInBarArr:",allCustomersInBarArr);

      allCustomersInBarArr.forEach(function(customer) {
        // var initial = customer.get("initial").charAt(0);
        var initial = pinyinUtil.getFirstLetter(customer.get("name")).charAt(0);
        if(initial == "A"){
          if(!flagBar.A){
            customer.set('initial',initial);
            flagBar.set('A',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "B"){
          if(!flagBar.B){
            customer.set('initial',initial);
            flagBar.set('B',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "C"){
          if(!flagBar.C){
            customer.set('initial',initial);
            flagBar.set('C',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "D"){
          if(!flagBar.D){
            customer.set('initial',initial);
            flagBar.set('D',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "E"){
          if(!flagBar.E){
            customer.set('initial',initial);
            flagBar.set('E',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "F"){
          if(!flagBar.F){
            customer.set('initial',initial);
            flagBar.set('F',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "G"){
          if(!flagBar.G){
            customer.set('initial',initial);
            flagBar.set('G',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "H"){
          if(!flagBar.H){
            customer.set('initial',initial);
            flagBar.set('H',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "I"){
          if(!flagBar.I){
            customer.set('initial',initial);
            flagBar.set('I',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "J"){
          if(!flagBar.J){
            customer.set('initial',initial);
            flagBar.set('J',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "K"){
          if(!flagBar.K){
            customer.set('initial',initial);
            flagBar.set('K',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "L"){
          if(!flagBar.L){
            customer.set('initial',initial);
            flagBar.set('L',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "M"){
          if(!flagBar.M){
            customer.set('initial',initial);
            flagBar.set('M',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "N"){
          if(!flagBar.N){
            customer.set('initial',initial);
            flagBar.set('N',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "O"){
          if(!flagBar.O){
            customer.set('initial',initial);
            flagBar.set('O',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "P"){
          if(!flagBar.P){
            customer.set('initial',initial);
            flagBar.set('P',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "Q"){
          if(!flagBar.Q){
            customer.set('initial',initial);
            flagBar.set('Q',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "R"){
          if(!flagBar.R){
            customer.set('initial',initial);
            flagBar.set('R',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "S"){
          if(!flagBar.S){
            customer.set('initial',initial);
            flagBar.set('S',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "T"){
          if(!flagBar.T){
            customer.set('initial',initial);
            flagBar.set('T',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "U"){
          if(!flagBar.U){
            customer.set('initial',initial);
            flagBar.set('U',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "V"){
          if(!flagBar.V){
            customer.set('initial',initial);
            flagBar.set('V',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "W"){
          if(!flagBar.W){
            customer.set('initial',initial);
            flagBar.set('W',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "X"){
          if(!flagBar.X){
            customer.set('initial',initial);
            flagBar.set('X',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "Y"){
          if(!flagBar.Y){
            customer.set('initial',initial);
            flagBar.set('Y',true);
          }else{
            customer.set('initial',null);
          }
        }
        if(initial == "Z"){
          if(!flagBar.Z){
            customer.set('initial',initial);
            flagBar.set('Z',true);
          }else{
            customer.set('initial',null);
          }
        }
        allCustomersInBarEnd.pushObject(customer);
      });
      return allCustomersInBarEnd;
  }),

  didInsertElement(){
    this._super(...arguments);
    var _self = this;
    //直接在dom上设置宽度
    // this.$("#selectBarContainer").hide();
    // this.$("#rightBar").hide();
    var selecter = $(window).height();
    var selecterHeight = selecter - 44;
    console.log("selecterHeight",selecterHeight);
    var barLineHeight = Math.floor(selecterHeight/27);
    // alert(barLineHeight);
    console.log("barLineHeight",barLineHeight);
    this.$("#rightBar").css('height',selecterHeight+"px");
    this.$("#rightBar").css("lineHeight",barLineHeight+"px");

  },

  actions:{
    choiceCustomer(cid,leaveStatus){
      var _self = this;
      _self.set("cid",cid);
      _self.set("leaveStatus",leaveStatus);
      var itemClass = "item"+cid;
      $("." + itemClass).addClass("tapped");
      Ember.run.later(function(){
        $("." + itemClass).removeClass("tapped");
        Ember.run.later(function(){
          _self.sendAction("switchShrink");
        },100);
      },200);

    },
    //这个是判断 list是否在hbs加载完毕标示
    didInsertAct(){
      // alert("run didInsertAct!");
      var _self = this;
      var list = this.get("allCustomersInBarEnd");
      var i = this.get("i");
      i++;
      this.set("i",i);
      console.log("i and listLenght",i,list.get("length"));
      if(i == list.get("length")){
        var scroller = new JRoll(selectBarContainer, {
          scrollX : false, //是否水平滚动
          scrollY : true, //是否垂直滚动
          // scrollFree: true,
          minY: 20,
          bounce : true, //是否超过实际位置反弹
          scrollBarY : false, //是否隐藏滚动条 false是隐藏
        });
        scroller.refresh();
        _self.set("_scroller",scroller);
        _self.set("i",0);
        console.log("i and listLenght",i);
      }
    },
    queryInitial(param){
      console.log("param:",param);
      let paramNum;
      if($('#'+param).length){
        paramNum = this.$('#'+param).offset().top;
        this.set("letterAddClass",param);
        App.lookup("controller:business").popTorMsg(param);
        console.log("paramNum:",paramNum);
      }else{
        App.lookup("controller:business").popTorMsg("没有相关老人");
        return;
      }
      var topNum = this.$('#selecterUl').offset().top;
      console.log("topNum:",topNum);
      var scrollNum = topNum-paramNum;
      console.log("scrollNum:",scrollNum);
      var scroller = this.get("_scroller");
      scroller.scrollTo(0, scrollNum, 500);
      // this.$("#selecterUl").scrollTop(topNum,500);

    },





  },



});
