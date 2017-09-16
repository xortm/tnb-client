import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
import config from '../../../config/environment';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  dataLoader: Ember.inject.service("data-loader"),
  feedService: Ember.inject.service('feed-bus'),
  global_curStatus: Ember.inject.service('current-status'),
  infiniteContentPropertyName: "healthMobileDetailList",
  infiniteModelName: "health-info",
  infiniteContainerName:"healthMobileDetailContainer",
  constants: Constants,
  preventInfinite: true,
  noChoose:true,
  healthFlag:0,
  init: function(){
    var _self = this;
    Ember.run.schedule("afterRender",this,function() {
      let selector = $("#healthExamTypeSelector");
      console.log("selector is",selector);
      selector.comboSelect({focusInput:false});
    });
  },
  healthExamTypeList:Ember.computed(function(){
    let _self = this;
    let typecodeList = ["healthExamType1","healthExamType2","healthExamType3","healthExamType4","healthExamType5","healthExamType7"];
    let healthExamTypeList = new Ember.A();
    typecodeList.forEach(function(typecode){
      console.log("typecode in each:",typecode);
      let typecodeObj = _self.get('dataLoader').findDict(typecode);
      console.log("typecodeObj in each:",typecodeObj);
      healthExamTypeList.pushObject(typecodeObj);
    });
    // healthExamTypeList.forEach(function(obj){
    //   obj.set('namePinyin',obj.get('typename'));
    // });
    console.log("healthExamTypeList:",healthExamTypeList);
    return healthExamTypeList;
  }),
  healthInfoObs:function(){
    var customerId = this.get("customerId");
    var source = this.get("source");
    if(!customerId){return;}
    var healthInfo;
    var customer = this.store.peekRecord('customer',customerId);
    if(source=="add"){
      var _self = this;
      // this.set("theTypecode",null);
      Ember.run.schedule("afterRender",this,function() {
        $("#select_id").val("1");
      });
      healthInfo = this.store.createRecord('health-info',{examUser:customer,sourceFlag:"fromHand"});
    }
    this.set("healthInfo",healthInfo);
    console.log("healthInfo11111",healthInfo);
  }.observes("customerId","source","flag").on("init"),

  showNoMessage:function(text){
    var _self = this;
    this.set("noMessageShow",true);
    this.set("noMessage",text);
    Ember.run.later(function(){
      _self.set("noMessageShow",false);
    },5000);
  },
  //只能是大于0的数字
  isInteger(obj) {
    var parnt = /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;
    if(parnt.exec(obj)){
      return true;
    } else {
      return false;
    }
  },
  actions:{
    switchShowAction(){
      console.log("in switchShowAction");
      this.set("date","");
      this.set("noChoose",true);
      this.set("twoResult",false);
      this.set("result","");
      this.set("resultAddtion","");
      this.set("theTypecode","");
      $("#healthExamTypeSelector").val("1");
      $("#healthMobileDetailContainer .combo-input").val("");
    },
    typeName:function(code){
       let healthExamType = this.get("healthExamTypeList").findBy("typecode",code);
       this.set('healthInfo.itemtype',healthExamType);
       this.set("noChoose",false);
       let typecode = healthExamType.get("typecode");
       if(typecode=="healthExamType1"){
         this.set("resultName","高压(mmHg)");
         this.set("resultAddtionName","低压(mmHg)");
         this.set('twoResult',true);
       }else if(typecode=="healthExamType2"){
         this.set("resultName","血氧值(%)");
         this.set('twoResult',false);
       }else if(typecode=="healthExamType3"){
         this.set("resultName","心率(times/min)");
         this.set('twoResult',false);
       }else if(typecode=="healthExamType4"){
         this.set("resultName","呼吸频率(times/min)");
         this.set('twoResult',false);
       }else if(typecode=="healthExamType5"){
         this.set("resultName","体温(℃)");
         this.set('twoResult',false);
       }else if(typecode=="healthExamType7"){
         this.set("resultName","血糖(mmol/L)");
         this.set('twoResult',false);
       }
       console.log("healthExamType in select:",healthExamType);
       this.set('theTypecode',typecode);
       this.set('itemtypeObj',healthExamType);
     },
     //保存
     saveHealth:function(){
       var _self = this;
       var itemId = "healthMobileDetailBut";
       $("." + itemId).addClass("tapped");
       Ember.run.later(function(){
         $("." + itemId).removeClass("tapped");
         Ember.run.later(function(){
           var healthFlag = _self.get("healthFlag");
           _self.incrementProperty("healthFlag");
           var params = {
             healthFlag:healthFlag
           };
           var date = _self.get("date");//体检时间
           var healthInfo = _self.get("healthInfo");//体检
           var itemtypeObj = _self.get("itemtypeObj");
           _self.set('healthInfo.itemtype',itemtypeObj);
           var theTypecode = _self.get("theTypecode");//体检项目
           var result = _self.get("result");//结果
           var resultAddtion = _self.get("resultAddtion");//第二个结果
           var twoResult = _self.get("twoResult");//是否有两个结果
           if(!date){
             _self.showNoMessage("请选择测量时间");
             return;
           }
           console.log("data11",date);
           //时间 type="time"
           let sysTime = _self.get("dataLoader").getNowTime();
           var nowDay = _self.get("dateService").formatDate(sysTime,"yyyy-MM-dd");
           date = nowDay+" "+date+":00";
           date = date.replace(/-/g,'/');
           console.log("data11+nowDay:",date);
           var examDateTime = new Date(date).getTime()/1000;
           console.log("data11 examDateTime",examDateTime);
           healthInfo.set("examDateTime",examDateTime);
           console.log("healthInfo.itemtype",healthInfo.get("itemtype"));
           if(!theTypecode){
             _self.showNoMessage("请选择所测量的类型");
             return;
           }
           if(!result){
             _self.showNoMessage("测量结果不能为空");
             return;
           }else{
             if(!_self.isInteger(result)){
               _self.showNoMessage("测量结果应该为大于0的数字");
               return;
             }
           }
           if(twoResult){
             if(!resultAddtion){
               _self.showNoMessage("请补全测量结果");
               return;
             }else{
               if(!_self.isInteger(resultAddtion)){
                 _self.showNoMessage("测量结果应该为大于0的数字");
                 return;
               }
             }
           }
           if(theTypecode=="healthExamType1"){// ||theTypecode=="healthExamType2"去掉了
           _self.set('healthInfo.result',result);
           _self.set('healthInfo.resultAddtion',resultAddtion);
         }else {
           _self.set('healthInfo.result',result);
         }
         let curuser = _self.get('global_curStatus').getUser();
         let curuserReal = _self.get('global_curStatus').getUserReal();
         console.log("curuser in:",curuser);
         console.log("curuserReal in:",curuserReal);
         _self.set('healthInfo.createUser',curuser);
         healthInfo.save().then(function(){
           var mainpageController = App.lookup('controller:business.mainpage');
           mainpageController.switchMainPage('customer-health',params);
         });
         },100);
       },200);
     },

  },


});
