import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  global_curStatus: Ember.inject.service("current-status"),

  infiniteContentPropertyName: "healthInfoList",
  infiniteModelName: "health-info",
  infiniteContainerName:"healthInfoContainer",
  queryFlag:0,
  chartShow: true,
  didRenderFlag: false,

  chartShowObs: function(){
    var chartShow = this.get("global_curStatus.chartShow");
    this.set("chartShow",chartShow);
  }.observes("global_curStatus.chartShow").on("init"),

  queryObs: function(){
    let _self = this;
    _self._showLoading();
    console.log("query obs in");
    // let curUser = this.get("global_curStatus").getUser();
    // this.store.query("staffcustomer",{filter:{staff:{id:curUser.get("id")}}}).then(function(staffcustomers){
    //   var staffcustomer = staffcustomers.get("firstObject");
    //   console.log("customer11111 staffcustomer",staffcustomer);
    //   console.log("customer11111 staffcustomersssssss",staffcustomers);
    //   if(!staffcustomer){
    //     return;
    //   }
      // var customer = staffcustomer.get("customer");
      var customer = this.get("global_curStatus").getCustomer();//获取公众号curCustomer
      var customerId = customer.get("id");
      console.log("customerId:",customerId);
      console.log("customer in publichealth-data allBedName",customer.get("bed.allBedName"));

      //取得系统时间
      let sysTime = _self.get("dataLoader").getNowTime();
      let date = _self.get("dateService").timestampToTime(sysTime);
      let workDay = date.getDay();
      let thirtyDate = _self.get("dateService").getDaysBeforeTimestamp(30);//30天前的0秒0分时间戳
      //首先查询出当前护工对应的服务对象
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
            console.log("dateTimeNumber11111",dateTimeNumber);
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
      let serviceItemArray = new Ember.A();
      _self.set("serviceItemArray",serviceItemArray);

      _self.store.query('health-info',{
        // sort:{examDateTime:'asc'},
        sort:{examDateTime:'desc'},
        // filter:{examUser:{id:customerId},
        filter:{
        customerId:customerId,
        "examDateTime@$gte":thirtyDate,
        // sourceFlag:"fromHand",
        healthInfoQueryType:"healthAll"
        // healthInfoQueryType:"normal"
      }}).then(function(healthInfoArray){
        console.log("healthInfoArray:",healthInfoArray);
        let index = 0;
        if(healthInfoArray.get("length")===0){
          _self.set("healthInfoFlag",true);
          return;
        }
        _self.set("healthInfoArray",healthInfoArray);
        healthInfoArray.forEach(function(item){
          let serviceItem = createServiceItem();
          serviceItem.set("typename",item.get("itemtype.typename"));//体检项目名
          serviceItem.set("companyName",item.get("itemtype.remark"));//体检项目的单位
          serviceItem.set("resultType",item.get("resultType"));//结果和单位结合
          serviceItem.set("resHbsType",item.get("resHbsType"));//Hbs判断条件 1的话就是结果太长
          serviceItem.set("result",item.get("result"));//体检结果
          serviceItem.set("hourM",item.get("examDateHourS"));//体检时间 小时 分钟
          serviceItem.set("dateTime",item.get("examDateYMD")+"    "+item.get("week"));//体检时间 年月日 + 周几
          serviceItem.set("dateTimeNumber",item.get("examDateTime"));//体检时间 时间戳秒

          serviceItemArray.pushObject(serviceItem);
          index++;
          if(index>=healthInfoArray.get("length")){
            //设置数据加载完毕标志
            _self.set("healthInfoFlag",true);
          }
        });
      });

    // });

  }.observes("queryFlag").on("init"),

  queryFlagIn(){
    console.log("queryFlagIn public");
    this.incrementProperty("queryFlag");
    this.set("healthInfoFlag",false);//把健康数据flag set为false
  },

  dataBuildObs: function(){
    var _self = this;
    if(!this.get("healthInfoFlag")){return;}
    let serviceItemArray = this.get("serviceItemArray");
    console.log("serviceList111111 serviceItemArray",serviceItemArray);
    // let serviceList = serviceItemArray.sortBy("seq","dateTimeNumber");//下面有 .reverse()了
    let serviceList = serviceItemArray.sortBy("dateTimeNumber").reverse();//下面有 .reverse()了
    // let serviceList = serviceItemArray;
    console.log("serviceList111111",serviceList);
    let healthInfoList = new Ember.A();
    let curSeq = 0;
    serviceList.forEach(function(item){
      console.log("curSeq11111111",curSeq,item.get("seq"));
      if(item.get("seq")!==curSeq){
        var specItem = Ember.Object.create({type:2,dateTimeNumber:item.get("dateTimeNumber"),dayStr:item.get("todayOrYesterday"),dateTimeSeq:item.get("dateTime")});
        healthInfoList.pushObject(specItem);
        curSeq = item.get("seq");
      }
      healthInfoList.pushObject(item);
    });
    this.set("healthInfoList",healthInfoList);
    // this.set("healthInfoList",healthInfoList);
    this.hideAllLoading();
    this.directInitScoll();
    console.log("healthInfoList 111111",healthInfoList);
  }.observes("healthInfoFlag"),
  actions:{
    showText(text,eleId){
      var _self = this;
      var itemId = "healthInfo_"+eleId;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          console.log("init text",text);
          _self.set("showModel",true);
          _self.set("showContent",text);
        },100);
      },200);
    },
    closeText(){
      this.set("showModel",false);
    },
    showLoadingImgAction(){
      console.log("showLoadingImgAction run");
      this.hideAllLoading();
    },

  }
});
