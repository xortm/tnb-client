import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  feedBus: Ember.inject.service("feed-bus"),
  store: Ember.inject.service("store"),
  statusService: Ember.inject.service("current-status"),

  infiniteContentPropertyName: "serviceWeekList",
  infiniteModelName: "nursingplanexe",
  infiniteContainerName:"nursingplanexeContainer",
  constants:Constants,
  queryFlag:0,
  curCustomerObs: function() {
    //let curCustomer = this.get("statusService.curStatus.currentCustomer");
    let curCustomer = this.get("statusService").getCustomer();
    console.log("curCustomer in public",curCustomer);
    if(!curCustomer||!curCustomer.get("id")){
      return;
    }
    this.set("curCustomer",curCustomer);
  }.observes("statusService.curStatus.currentCustomer").on("init"),

  //查询标志的观察者
  queryObs: function(){
    let _self = this;
    _self._showLoading();
    var commonInitHasCompleteFlag = this.get("global_curStatus.commonInitHasCompleteFlag");
    console.log("queryObs run commonInitHasCompleteFlag",commonInitHasCompleteFlag);
    if(!commonInitHasCompleteFlag){
      return;
    }
    var customer = this.get("curCustomer");
    console.log("query obs in");
    // let curUser = this.get("global_curStatus").getUser();
    // this.store.query("staffcustomer",{filter:{staff:{id:curUser.get("id")}}}).then(function(staffcustomers){
    //   var staffcustomer = staffcustomers.get("firstObject");
    //   console.log("customer11111 staffcustomer",staffcustomer);
    //   console.log("customer11111 staffcustomersssssss",staffcustomers);
    //   if(!staffcustomer){
    //     return;
    //   }
    //
    //   var customer = staffcustomer.get("customer");
    //   var customerId = staffcustomer.get("customer.id");
    //   console.log("customer11111",customer);
    //   console.log("customer11111",customerId);
      // var customer = this.get("global_curStatus").getCustomer();//获取公众号curCustomer
      var customerId = customer.get("id");

      //取得系统时间
      let sysTime = _self.get("dataLoader").getNowTime();
      let date = _self.get("dateService").timestampToTime(sysTime);
      let workDay = date.getDay();
      let sevenDate = _self.get("dateService").getDaysBeforeTimestamp(7);//7天前的0秒0分时间戳
      //首先查询出当前护工对应的服务对象
      console.log("customer11111 id",customerId);
      var createServiceItem = function(){
        let serviceItem = Ember.Object.extend({
          type:1,
          //排序用字段
          timeStrOne:Ember.computed("timeStr",function(){
            var timeStr = this.get("timeStr");
            var str1 = timeStr.split(":") ;
            return Number(str1[0]+"."+str1[1]);
          }),
          seq:Ember.computed("dateTimeNumber",function(){
            var dateTimeNumber = this.get("dateTimeNumber");
            var todayString = _self.get("dateService").formatDate(sysTime,"yyyyMMdd");
            var dateTimeNumberString = _self.get("dateService").formatDate(dateTimeNumber,"yyyyMMdd");
            return Number(todayString) - Number(dateTimeNumberString) + 1;
          }),
          todayOrYesterday:Ember.computed("dateTimeNumber",function(){
            var dateTimeNumber = this.get("dateTimeNumber");
            console.log("todayOrYesterday sysTime",sysTime);
            var todayString = _self.get("dateService").formatDate(sysTime,"yyyy-MM-dd");
            var todayLastS = Number(_self.get("dateService").getLastSecondStampOfDayString(todayString));//获取今天最后一秒的时间戳
            var todayfirstS = Number(_self.get("dateService").getFirstSecondStampOfDayString(todayString));//获取今天第一秒的时间戳
            var yesterdayString = _self.get("dateService").formatDate((sysTime-24*60*60),"yyyy-MM-dd");
            var yesterdayfirstS =Number( _self.get("dateService").getFirstSecondStampOfDayString(yesterdayString));
            if(dateTimeNumber > todayfirstS ){
              return "今天-";
            }else if(dateTimeNumber > yesterdayfirstS && dateTimeNumber < todayfirstS){
              return "昨天-";
            }else {
              return null;
            }
          }),

        });
        return serviceItem.create();
      };
      var serviceItemArray = new Ember.A();
      _self.set("serviceItemArray",serviceItemArray);
      // let serviceItemDrugArray = new Ember.A();//改变了 表格逻辑这些的代码暂放
      // _self.set("serviceItemDrugArray",serviceItemDrugArray);
      //查询定时服务
      // _self.store.query("nursingplanexe",{
      //   filter:{'[detail][customer][id]':customerId,
      //   "exeStartTime@$gte":sevenDate,},
      //   // include:{nursingplanexe:"exeStaff"}
      //   include:{nursingplanexe:["exeStaff","detail"]}
      // }).then(function(detailPlanList){
      //   _self.set("detailPlanList",detailPlanList);
      //   _self.set("detailFlag",true);
      // });
      // //计次服务
      // _self.store.query("nursingplanexe",{
      //   filter:{'[itemProject][project][customer][id]':customerId,
      //   "exeStartTime@$gte":sevenDate,},
      //   // include:{nursingplanexe:"exeStaff"}
      //   include:{nursingplanexe:["exeStaff","itemProject"]}
      // }).then(function(planProjectList){
      //   _self.set("planProjectList",planProjectList);
      //   _self.set("projectFlag",true);
      // });

      _self.store.query("nursingplanexe",{//以后exe 执行定时任务也会把 itemProject填入(detail中的nursingprojectitem)
        filter:{'[itemProject][project][customer][id]':customerId,
        "exeStartTime@$gte":sevenDate,},
        include:{
          nursingplanexe:["exeStaff","itemProject","detail"],
          // nursingproject:["level"]
        }
      }).then(function(itemList){
        let index = 0;
        if(itemList.get("length")===0){
          _self.set("planExeFlag",true);
          return;
        }
        itemList.forEach(function(item){
          let serviceItem = createServiceItem();
          if(item.get("exeStartTime")){}
          // console.log("serviceList111111 itemProject",item.get("itemProject"));
          // console.log("serviceList111111 itemProject.project",item.get("itemProject.project"));
          // console.log("serviceList111111 itemProject.customer",item.get("itemProject.project.customer"));
          // console.log("serviceList111111 itemProject.item.name title",item.get("itemProject.item.name"));
          // console.log("serviceList111111 detail.item",item.get("detail.item"));
          // console.log("serviceList111111 exeStaff",item.get("exeStaff"));
          // console.log("serviceList111111 personName",item.get("exeStaff.name"));
          // if(item.get("detail.item")){
          //   item.get("detail.item").then(function(item){
          //     console.log("item1111111111 getItem name",item.get("item.name"));
          //     serviceItem.set("title",item.get("item.name"));
          //   });
          // }else{
          //   serviceItem.set("title",item.get("itemProject.item.name"));
          // }
          serviceItem.set("remark",item.get("remark"));
          serviceItem.set("finishLevelName",item.get("finishLevel.name"));
          serviceItem.set("title",item.get("itemProject.item.name"));
          serviceItem.set("serviceTypeCode",item.get("itemProject.item.serviceType.typecode"));//服务类型typecode

          serviceItem.set("personName",item.get("exeStaff.name"));//服务人名
          serviceItem.set("timeStr",item.get("startTimeHourS"));//服务开始时间 小时:分钟
          serviceItem.set("dateTime",item.get("startTimeYMD")+"    "+item.get("week"));//服务开始时间 年月日
          serviceItem.set("dateTimeNumber",item.get("exeStartTime"));//服务开始时间 数据库秒时间

          serviceItemArray.pushObject(serviceItem);
          index++;
          if(index>=itemList.get("length")){
            //设置数据加载完毕标志
            _self.set("planExeFlag",true);
          }
        });
      });
      //查询用药服务
      _self.store.query("customerdrugprojectexe",{
        filter:{customerDrug:{customer:{id:customerId}},
        "createDateTime@$gte":sevenDate,},
        include:{customerdrugprojectexe:["lastUpdateUser"]}
      }).then(function(itemList){
        if(itemList.get("length")===0){
          _self.set("drugExeFlag",true);
          return;
        }
        let index = 0;
        itemList.forEach(function(item){
          let serviceItem = createServiceItem();
          serviceItem.set("remark",item.get("remark"));
          serviceItem.set("finishLevelName",item.get("finishLevel.name"));
          if(item.get("drugNum")<0){
            serviceItem.set("drugFlag",false);//实际用药量
          }else{
            serviceItem.set("drugFlag",true);//实际用药量
          }
          serviceItem.set("actualUse",item.get("drugNum"));//实际用药量
          if(item.get("drugNumPlan")){
            serviceItem.set("drugNumPlan",item.get("drugNumPlan"));//计划用药量
          }else {
            serviceItem.set("drugNumPlan",item.get("drugNum"));//计划用药量
          }
          console.log("exeDate:",item.get("exeDate"));
          serviceItem.set("exeDateString",item.get("exeDate")+":00");//实际用药时间
          serviceItem.set("useDrugDateString",item.get("useDrugDate")+":00");//计划用药时间
          item.get("customerDrug").then(function(item){
            console.log("customerDrugName111 in then drug",item.get("drug.name"));
            serviceItem.set("customerDrugName",item.get("drug.name"));//药品名
          });
          serviceItem.set("drugSpecName",item.get("drugSpec").get("typename"));//药品剂量
          serviceItem.set("title","用药情况");
          serviceItem.set("serviceTypeCode","用药情况");//服务类型typecode
          serviceItem.set("personName",item.get("lastUpdateUser.name"));//服务人名
          serviceItem.set("timeStr",item.get("createTimeHourS"));//用药完成创建时间 小时:分钟
          serviceItem.set("dateTime",item.get("createTimeYMD")+"    "+item.get("week"));//用药完成创建时间 年月日
          serviceItem.set("dateTimeNumber",item.get("createDateTime"));//用药完成创建时间 数据库秒时间
          serviceItem.set("content",item.get("remark"));//备注内容
          serviceItem.set("allDrugNum",item.get("drugProject.customerDrug.drugNum"));//剩余药量
          serviceItem.set("drugTypename",item.get("drugProject.useDrugSpec.typename"));//用药规格
          let useDrugNum = serviceItem.get("drugNumPlan");
          let medicineDrugFreq = item.get("drugProject.useDrugFreq");
          console.log("medicineDrugFreq:",medicineDrugFreq);
          let medicineDrugFreqid = item.get("drugProject.id");
          console.log("medicineDrugFreqid:",medicineDrugFreqid);
          let allDrugNum = item.get("drugProject.customerDrug.drugNum");
          console.log("allDrugNum:",allDrugNum);
          if(allDrugNum == "0"){
            serviceItem.set("littleDrugDetail","0");
          }else{
            let setDrugDaysRemind = _self.get("dataLoader").findConf(Constants.setDrugDaysRemind);
            console.log("setDrugDaysRemind in publicnumber-service:",setDrugDaysRemind);
            let drugRemainDays = Math.floor(allDrugNum/(useDrugNum*medicineDrugFreq));
            console.log("drugRemainDays::",drugRemainDays);
            if(drugRemainDays <= setDrugDaysRemind){
              serviceItem.set("littleDrugDetail",drugRemainDays);
            }
          }

          serviceItemArray.pushObject(serviceItem);
          index++;
          if(index>=itemList.get("length")){
            //设置数据加载完毕标志
            _self.set("drugExeFlag",true);
          }
        });
      });
    // });
    _self.set("serviceItemArray",serviceItemArray);

  }.observes("queryFlag","global_curStatus.commonInitHasCompleteFlag","curCustomer").on("init"),
  queryFlagIn(e){
    console.log("queryFlagIn public",this);
    this.incrementProperty("queryFlag");
    // var queryFlag = this.get("queryFlag");
    // this.set("queryFlag",queryFlag++);
    // this.set("detailFlag",false);//把定时服务flag set为false
    // this.set("projectFlag",false);//把按次服务flag set为false
    this.set("drugExeFlag",false);//把用药服务flag set为false
    this.set("planExeFlag",false);//把定时计次任务 set为false
  },

  //exe 定时和计次服务集合 //改变了 表格逻辑这些的代码暂放
  // exePlanObs: function(){
  //   var _self = this;
  //   var planList = new Ember.A();
  //   var  projectFlag = this.get("projectFlag");
  //   var  detailFlag = this.get("detailFlag");
  //   if(!detailFlag||!projectFlag){return;}//如果exe查询没有完成就return
  //   var detailPlanList = this.get("detailPlanList");//定时
  //   var planProjectList = this.get("planProjectList");//计次
  //   detailPlanList.forEach(function(item){
  //     planList.pushObject(item);
  //   });
  //   planProjectList.forEach(function(item){
  //     planList.pushObject(item);
  //   });
  //
  //   console.log("planList111",planList);
  //   if(!planList||planList.get("length")===0){//如果没有服务记录就return set Flag为true
  //     console.log("init  ???");
  //     this.set("planExeFlag",true);
  //     return;
  //   }
  //
  //   //取得系统时间
  //let sysTime = _self.get("dataLoader").getNowTime();
  //   let date = _self.get("dateService").timestampToTime(sysTime);
  //   let workDay = date.getDay();
  //   let sevenDate = _self.get("dateService").getDaysBeforeTimestamp(7);//7天前的0秒0分时间戳
  //   //首先查询出当前护工对应的服务对象
  //   var createServiceItem = function(){
  //     let serviceItem = Ember.Object.extend({
  //       type:1,
  //       //排序用字段
  //       timeStrOne:Ember.computed("timeStr",function(){
  //         var timeStr = this.get("timeStr");
  //         var str1 = timeStr.split(":") ;
  //         return Number(str1[0]+"."+str1[1]);
  //       }),
  //       seq:Ember.computed("dateTimeNumber",function(){
  //         var dateTimeNumber = this.get("dateTimeNumber");
  //         var todayString = _self.get("dateService").formatDate(sysTime,"yyyyMMdd");
  //         var dateTimeNumberString = _self.get("dateService").formatDate(dateTimeNumber,"yyyyMMdd");
  //         return Number(todayString) - Number(dateTimeNumberString) + 1;
  //       }),
  //       todayOrYesterday:Ember.computed("dateTimeNumber",function(){
  //         var dateTimeNumber = this.get("dateTimeNumber");
  //         console.log("todayOrYesterday sysTime",sysTime);
  //         var todayString = _self.get("dateService").formatDate(sysTime,"yyyy-MM-dd");
  //         var todayLastS = Number(_self.get("dateService").getLastSecondStampOfDayString(todayString));//获取今天最后一秒的时间戳
  //         var todayfirstS = Number(_self.get("dateService").getFirstSecondStampOfDayString(todayString));//获取今天第一秒的时间戳
  //         var yesterdayString = _self.get("dateService").formatDate((sysTime-24*60*60),"yyyy-MM-dd");
  //         var yesterdayfirstS =Number( _self.get("dateService").getFirstSecondStampOfDayString(yesterdayString));
  //         if(dateTimeNumber > todayfirstS ){
  //           return "今天-";
  //         }else if(dateTimeNumber > yesterdayfirstS && dateTimeNumber < todayfirstS){
  //           return "昨天-";
  //         }else {
  //           return null;
  //         }
  //       }),
  //
  //     });
  //     return serviceItem.create();
  //   };
  //
  //   if(!this.get("drugExeFlag")){
  //     return;
  //   }
  //   let serviceItemNuringArray = new Ember.A();
  //   this.set("serviceItemNuringArray",serviceItemNuringArray);
  //   console.log("planList111 serviceItemNuringArray",serviceItemNuringArray);
  //   var index = 0;
  //   planList.forEach(function(item){//planList 做下最后处理
  //     let serviceItem = createServiceItem();
  //     if(item.get("exeStartTime")){}
  //     let remark = item.get("remark");
  //     var str = "";
  //     if (remark) {
  //       if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
  //         var itemData = JSON.parse(remark);
  //         var itemDataServiceDesc = itemData.serviceDesc;
  //         var itemDataTag = itemData.serviceTag;
  //         if(itemDataTag){
  //           console.log("dicttype itemDataTag",itemDataTag+'  exe id: '+item.get("id"));
  //           console.log("dicttype peekRecord",_self.get("store").peekRecord("dicttype",itemDataTag));
  //           console.log("dicttype findDict",_self.get("dataLoader"));
  //           console.log("dicttype findDict",_self.get("dataLoader").findDict(itemDataTag));
  //           var dictServiceTypename = _self.get("dataLoader").findDict(itemDataTag).get("typename");
  //           // var dictServiceTypename = '';
  //           if(itemDataServiceDesc){
  //             str = dictServiceTypename+"，"+itemDataServiceDesc;
  //           }else {
  //             str = dictServiceTypename;
  //           }
  //           serviceItem.set("cooperateStr",str);//配合
  //         }else {
  //           str = "正常完成";
  //           if(itemDataServiceDesc){
  //             str = str + "，"+ itemDataServiceDesc;
  //           }
  //           serviceItem.set("cooperateStr",str);//配合
  //         }
  //       }else {
  //         serviceItem.set("cooperateStr","正常完成 " + remark);//配合 给remark
  //       }
  //     }else {
  //       serviceItem.set("cooperateStr","老人配合，正常完成");//配合
  //     }
  //     // console.log("itemProject1111 item itemProject",item.get("itemProject.item"));
  //     // console.log("itemProject1111 item detail.item",item.get("detail.item"));
  //     // console.log("itemProject1111 item detail.item.item",item.get("detail.item.item"));
  //
  //     if(item.get("itemProject.item")){
  //       serviceItem.set("title",item.get("itemProject.item.name"));
  //       console.log("itemProject1111 itemProject name",item.get("itemProject.item.name"));
  //     }else if(item.get("detail.item")){
  //       // item.get("detail.item.item").then(function(item){
  //       //   console.log("item1111111111",item);
  //       //   serviceItem.set("title",item.get("name"));
  //       // });
  //       item.get("detail.item").then(function(item){
  //         console.log("item1111111111 getItem name",item.get("item.name"));
  //         serviceItem.set("title",item.get("item.name"));
  //       });
  //       console.log("itemProject1111 detail name",item.get("detail.item.item.name"));
  //     }
  //
  //     serviceItem.set("personName",item.get("exeStaff.name"));//服务人名
  //     console.log("personName1111",item.get("exeStaff.name"));
  //     serviceItem.set("timeStr",item.get("startTimeHourS"));//服务开始时间 小时:分钟
  //     serviceItem.set("dateTime",item.get("startTimeYMD")+"    "+item.get("week"));//服务开始时间 年月日
  //     serviceItem.set("dateTimeNumber",item.get("exeStartTime"));//服务开始时间 数据库秒时间
  //
  //     serviceItemNuringArray.pushObject(serviceItem);
  //     index++;
  //     if(index>=planList.get("length")){
  //       //设置数据加载完毕标志
  //       _self.set("planExeFlag",true);
  //     }
  //   });
  //
  // }.observes("detailFlag","projectFlag").on("init"),


  dataBuildObs: function(){
    var _self = this;
    let curuser = this.get('global_curStatus').getUser();
    console.log("indataBuildObs1111111111111111111111111111111",this.get("planExeFlag"),this.get("drugExeFlag"));
    if(!this.get("planExeFlag")||!this.get("drugExeFlag")){
      return;
    }
    var serviceItemArray = this.get("serviceItemArray");
    // let serviceItemNuringArray = this.get("serviceItemNuringArray");
    // let serviceItemDrugArray = this.get("serviceItemDrugArray");
    // console.log("serviceList111111 serviceItemNuringArray",serviceItemNuringArray);
    // console.log("serviceList111111 serviceItemDrugArray",serviceItemDrugArray);
    // var serviceItemArray = new Ember.A();
    // if(serviceItemNuringArray){
    //   serviceItemNuringArray.forEach(function(item){
    //     serviceItemArray.pushObject(item);
    //   });
    // }
    // if (serviceItemDrugArray) {
    //   serviceItemDrugArray.forEach(function(item){
    //     serviceItemArray.pushObject(item);
    //   });
    // }
    // this.set("serviceList",serviceItemArray.sortBy("seq","dateTimeNumber"));
    console.log("serviceList111111 array",serviceItemArray);
    // let serviceList = serviceItemArray.sortBy("seq","dateTimeNumber").reverse();//reverse 倒叙
    let serviceList = serviceItemArray.sortBy("dateTimeNumber").reverse();//reverse 倒叙
    console.log("serviceList111111",serviceList);
    let serviceWeekList = new Ember.A();
    let curSeq = 0;
    serviceList.forEach(function(item,index){
      console.log("seq11111",item.get("seq"),curSeq,index);
      if(item.get("seq")!==curSeq){
        var specItem = Ember.Object.create({type:2,dateTimeNumber:item.get("dateTimeNumber"),dayStr:item.get("todayOrYesterday"),dateTimeSeq:item.get("dateTime")});
        serviceWeekList.pushObject(specItem);
        curSeq = item.get("seq");
        console.log("seq11111 curSeq",curSeq);
      }
      serviceWeekList.pushObject(item);
    });
    console.log("serviceList111111 serviceWeekList",serviceWeekList);
    var list = new Ember.A();
    serviceWeekList.forEach(function(item){
      if(item.get("type")){
        list.pushObject(item);
      }
    });
    console.log("serviceList111111 serviceWeekList list",list);
    // this.set("serviceWeekList",list);
    this.set("list",list);
    // this.set("serviceWeekList",serviceWeekList);
    this.hideAllLoading();
    this.directInitScoll();

  }.observes("planExeFlag","drugExeFlag").on("init"),

});
