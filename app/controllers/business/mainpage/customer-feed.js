import Ember from 'ember';

export default Ember.Controller.extend({
  dynamicType:true,//默认是老人动态
  selectTypeName:'动   态',//默认动态
  theShowCustomerList : new Ember.A(),// Ember数组
  service_notification:Ember.inject.service("notification"),
  dateService: Ember.inject.service("date-service"),
  init(){
    this._super(...arguments);
    var _self = this;
    let allBeds = _self.get("global_dataLoader.allBedList");
    console.log('allBeds:',allBeds);
    _self.set("allBeds",allBeds);
    Ember.run.schedule("afterRender",function() {
      $("#overflowXHidden").parent().addClass("overflow-x-hidden");
      // jQuery.fn.slideLeftShow = function( speed, callback ) { this.animate( { width: "show", paddingLeft: "show", paddingRight: "show", marginLeft: "show", marginRight: "show" }, speed, callback ); };
      // jQuery.fn.slideLeftHide = function( speed, callback ) { this.animate( { width: "hide", paddingLeft: "hide", paddingRight: "hide", marginLeft: "hide", marginRight: "hide" }, speed, callback ); };
      jQuery.fn.slideLeftShow = function( speed, callback ) { this.stop().animate( { right:"0px"}, speed, callback ); };
      jQuery.fn.slideLeftHide = function( speed, callback ) { this.stop().animate( { right:"-310px" }, speed, callback ); };
      //在animate()前增加了stop()解决的多次执行的性能问题

      // $("#elderHideBtn").click(function(){//init 内切换route 就执行不了这个方法
      //   $("#click_elder").slideLeftHide(800);
      // });
      _self.get("service_notification").registNoticePage(function(msgObj){
        _self.showData(msgObj);
      });
    });
  },

  showData:function(data){
    var dataObj = {};
    if(data){
      dataObj = JSON.parse(data.content);
    }
    var messageList;
    var warningNew,
        warningNewList = new Ember.A(),
        heartNew,
        heartNewList = new Ember.A(),
        downloadNew,
        downloadNewList = new Ember.A(),
        customer;
    var customerId = +dataObj.customerId;
    var theShowCustomerList = this.get("theShowCustomerList");
    console.log("theShowCustomerList",theShowCustomerList);
    if(theShowCustomerList && theShowCustomerList.findBy('id',customerId)){
      customer = theShowCustomerList.findBy('id',customerId);
      if(data.code == 1102){
        if(customer.get("warningNewList")){
          warningNewList = customer.get("warningNewList");
        }
      }else if (data.code == 1101) {
        if(customer.get("heartNewList")){
          heartNewList = customer.get("heartNewList");
        }
      }else if (data.code == 1103) {
        if(customer.get("downloadNewList")){
          downloadNewList = customer.get("downloadNewList");
        }
      }
    }else {
      customer = Ember.Object.create({id:customerId});
    }
    console.log("theList customer",customer);
    console.log("theList customer",customer.get("heartNewList"));
    console.log("theList customer",customer.heartNewList);
    console.log("theList downloadNewList",downloadNewList);
    console.log("theList warningNewList",warningNewList);
    console.log("theList heartNewList",heartNewList);

    var healthName;
    var healthTypeUnit;
    if(data.business=="healthExamType1"){
      healthName = "血压 ";
      healthTypeUnit = " mmHg";
    }else if (data.business=="healthExamType2") {
      healthName = "血氧 ";
      healthTypeUnit = " %";
    }else if (data.business=="healthExamType3") {
      healthName = "心率 ";
      healthTypeUnit = " times/min";
    }else if (data.business=="healthExamType4") {
      healthName = "呼吸频率 ";
      healthTypeUnit = " time/min";
    }else if (data.business=="healthExamType5") {
      healthName = "体温 ";
      healthTypeUnit = " ℃";
    }else if (data.business=="healthExamType6") {
      healthName = "体重 ";
      healthTypeUnit = "kg";
    }else if (data.business=="healthExamType7") {
      healthName = "血糖-空腹血糖 ";
      healthTypeUnit = " mmol/L";
    }else if (data.business=="healthExamType8") {
      healthName = "血糖-餐前血糖 ";
      healthTypeUnit = " mmol/L";
    }else if (data.business=="healthExamType9") {
      healthName = "血糖-餐后血糖 ";
      healthTypeUnit = " mmol/L";
    }else if (data.business=="healthExamType10") {
      healthName = "脂肪数据 ";
      healthTypeUnit = " %";
    }else if (data.business=="healthExamType11") {
      healthName = "心电分析图 ";
      healthTypeUnit = " ";
    }else if (data.business=="healthExamType12") {
      healthName = "尿液分析 ";
      healthTypeUnit = " ";
    }else if (data.business=="healthExamType13") {
      healthName = "血脂分析 ";
      healthTypeUnit = " mmol/L";
    }
    console.log("msg get time",data.createTime);
    var messageTime = this.get("dateService").formatDate(data.createTime, "hh:mm");
    var allBeds = this.get("allBeds");
    var allBedName ='';
    if(dataObj.bedId){
      var bed = allBeds.findBy('id',dataObj.bedId);
      allBedName = bed.get("allBedName");
      console.log("allBedName",allBedName);
      console.log("allBedName bed",bed);
      console.log("allBedName allBeds",allBeds);
    }
    var warningTypename = '';
    if(data.detailType==9){//离床回床
      if(data.business=="lichuang"){//回床
        warningTypename ="老人回床";
      }else if(data.business=="huichuang"){//离床
        warningTypename ="老人离床";
      }
    }else if(data.detailType==10){//床垫心律异常
      warningTypename ="老人床垫心律异常";
    }else if(data.detailType==11){//按键呼叫
      if(data.business=="buttonCalling"){//呼叫
        warningTypename ="老人按键呼叫";
      }else if(data.business=="cancelButtonCalling"){//取消呼叫
        warningTypename ="取消按键呼叫";
      }
    }
    var specItem = Ember.Object.create({
      time:messageTime,type:dataObj.type,result:dataObj.result,resultAddtion:dataObj.resultAddtion,customerId:dataObj.customerId,
      allBedName:allBedName,customerName:dataObj.customerName,buildingRoomBed:dataObj.buildingRoomBed,
      position:dataObj.location,healthName:healthName,healthTypeUnit:healthTypeUnit,
      content:dataObj.content,detailType:data.detailType,warningTypename:warningTypename,
      business:data.business
    });

    console.log("dataObj2.code   "+data.code);
    if(data.code == 1102){//预警提醒
      $("#customer_"+customerId).addClass("bk-color-598AA7");
      $("#warning_"+customerId+" img").addClass("icon-shine");

      this.set("warningNew",warningTypename);
      warningNewList.unshiftObject(specItem);
      // this.set("warningNewList",warningNewList);
      customer.set("warningNewList",warningNewList);
    }else if (data.code == 1101) {//健康数据
      console.log("1101",$("#heart_"+customerId+" img"));
      $("#heart_"+customerId+" img").addClass("icon-shine");
      if(data.business=="healthExamType1"){//血压
        this.set("heartNew","高压:" + dataObj.result + healthTypeUnit +",低压:"+dataObj.resultAddtion + healthTypeUnit);
      }else {
        this.set("heartNew",healthName + dataObj.result + healthTypeUnit);
      }
      heartNewList.unshiftObject(specItem);
      // this.set("heartNewList",heartNewList);
      customer.set("heartNewList",heartNewList);
    }else if (data.code == 1103) {//位置信息
      $("#download_"+customerId+" img").addClass("icon-shine");

      this.set("downloadNew",dataObj.location);
      downloadNewList.unshiftObject(specItem);
      // this.set("downloadNewList",downloadNewList);
      customer.set("downloadNewList",downloadNewList);
    }
    // var theShowCustomerList = new Ember.A();
    if(!theShowCustomerList.findBy('id',customerId)){
      theShowCustomerList.pushObject(customer);
    }
    this.set("theShowCustomerList",theShowCustomerList);

    var customerList = this.get("theCustomerList");
    customerList.forEach(function(item){
      if(item.get("id")==customer.get("id")){
        item.set("warningNewList",customer.get("warningNewList"));
        item.set("heartNewList",customer.get("heartNewList"));
        item.set("downloadNewList",customer.get("downloadNewList"));
      }
    });
    this.set("rightCustomerList",customerList);
    console.log("rightCustomerList111 22222",this.get("rightCustomerList"));
  },

  actions:{
    showelderfeed(type,customerId){
      $("#elderHideBtn").click(function(){//这里再添加以下
        $("#click_elder").slideLeftHide(800);
      });
      this.set('seachCriteria',false);//关闭检索
      // var messageList;
      var customer ;
      var customerList ;
      // var customerList = this.get("theCustomerList");
      customerList = this.get("rightCustomerList");
      console.log("rightCustomerList111 22222",this.get("rightCustomerList"));
      if(!customerList){
        customerList = this.get("theCustomerList");
      }

      customerList.forEach(function(item){
        if(item.get("id")==customerId){
          customer = item;
        }
      });
      this.set("customerAvatarUrl",customer.get("avatarUrl"));
      this.set("customerName",customer.get("name"));
      var customerRealBed = customer.get("realBed");
      if(customerRealBed){
        console.log("customerRealBed",customerRealBed);
        if(customerRealBed.allBedName){//这个是 居家老人没有 床位 (是否需要再 动态保留位置)
          this.set("buildingRoomBed",customerRealBed.allBedName);
        }else {
          this.set("buildingRoomBed",customer.get("realBed").get("buildingRoomBed"));
        }

      }
      var $click_elder =$("#click_elder");
      var display =$click_elder.css('display');
      if(type=="heart"){
        this.set("elderMessage","健康数据");
        $click_elder.slideLeftShow(800);
        this.set("heartNewList",customer.get("heartNewList"));
        this.set("showFlag","heartNewFlag");//显示右侧框 的判断
        // if(display=="block"){
        //   $click_elder.slideDown(1000);
        // }else {
        //   $click_elder.slideUp(1000);
        // }
      }else if (type=="download") {
        this.set("elderMessage","所在位置");
        $click_elder.slideLeftShow(800);
        this.set("downloadNewList",customer.get("downloadNewList"));
        this.set("showFlag","downloadNewFlag");//显示右侧框 的判断
      }else if (type=="warning") {
        this.set("elderMessage","预警信息");
        $click_elder.slideLeftShow(800);
        this.set("warningNewList",customer.get("warningNewList"));
        this.set("showFlag","warningNewFlag");//显示右侧框 的判断
      }
    },

    elderSeach(){
      this.set("seachCriteria",true);
    },
    searchHide(){
      this.set("seachCriteria",false);
    },

    //查看全部老人
    queryAll(){
      this.set('seachCriteria',false);//关闭检索
      this.set('queryScheduled',false);//关掉只显示预警老人
      this.set("customerList",this.get("theCustomerList"));
    },
    //组件come方法 检索老人
    come(param,buildSearch){
      this.set('queryScheduled',false);//关掉只显示预警老人
      var _self = this;
      this.set('customerList',param);
      this.set("seachCriteria",false);
    },

    //选择动态类型
    selectType(){
      this.set("selectTypeFlag",true);
      this.set('seachCriteria',false);
    },
    dynamicType(){
      this.set("dynamicType",true);
      this.set("positionType",false);
      this.set("selectTypeFlag",false);
      this.set("selectTypeName","动   态");
    },
    positionType(){
      this.set("positionType",true);
      this.set("dynamicType",false);
      this.set("selectTypeFlag",false);
      this.set("selectTypeName","位   置");
    },


  },
});
