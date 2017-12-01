import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';

import InfiniteScroll from '../../../controllers/infinite-scroll';

export default BaseUiItem.extend(InfiniteScroll,{
  statusService: Ember.inject.service("current-status"),
  store: Ember.inject.service("store"),
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  service_PageConstrut:Ember.inject.service("page-constructure"),

  infiniteContentPropertyName: "healthInfoList",
  infiniteModelName: "health-info",
  infiniteContainerName:"healthInfoContainerDetail",

  service_notification:Ember.inject.service("notification"),//消息变动
  init(){
    // this.set("showLoadingImg",true);
    this._super(...arguments);
    var _self = this;
    Ember.run.schedule("afterRender",function() {
      _self.get("service_notification").registNoticePage(function(msgObj){
        if(msgObj.code == 1101){
          console.log("1111111111111111111111111111111  in code");
          // _self.incrementProperty("switchShowFlag");//数据有进来就变动falg  触发观察者
        }
      });
    });
  },

  textShow: true,
  informationShow: true,
  bloodShow: false, //血压显示
  heartShow: false, //心率显示
  allDateShow: true, //显示所有时间
  todayShow: false, //显示今天
  sevenShow: false, //显示一周
  thirtyShow: false, //显示一个月
  compareShow: false, //自定义日期
  constants: Constants,
  itemtypeID: "",
  itemtypeCode: "",
  itemtypeRemark: "",
  itemtype: null,

  customerObs: function(){
    this.set("showLoadingImg",true);

    var _self = this;
    console.log("customerObs in,switchShowFlag: health" + this.get("switchShowFlag"));
    //只有点击本tab页的时候，才进行渲染处理
    var customerId = this.get("customer").get("id");
    var switchShowFlag = this.get("switchShowFlag");
    var sourceFlag = this.get("sourceFlag");
    console.log("sourceFlag",sourceFlag);
    if(sourceFlag=="fromHand"){
      this.set("healthMessage","(日四)");
    }else {
      this.set("healthMessage","(全部)");
    }
    console.log("healthInfoList id",customerId);
    //如果已经渲染过了，并且是相同的task，则不再次渲染
    // if(this.get("hasRender")&&this.get("oriTaskId")===customerId){
    //   return;
    // }
    this.set("hasRender",true);
    this.set("oriTaskId",customerId);
    var thirtyDate = _self.get("dateService").getDaysBeforeTimestamp(30);
    var params = {};
    if(sourceFlag){
      sourceFlag = sourceFlag.toString();
      params = {sort: {'[examDateTime]': 'desc'},filter:{
        examUser:{id:customerId},
        'examDateTime@$gte': thirtyDate,
        // 'sourceFlag@like':sourceFlag,
        sourceFlag:sourceFlag,
        healthInfoQueryType:"normal"
      }};
    }else {
      params = {sort: {'[examDateTime]': 'desc'},filter:{
        examUser:{id:customerId},
        'examDateTime@$gte': thirtyDate,
        healthInfoQueryType:"normal"
      }};
    }

    this.infiniteQuery('health-info',params).then(function(healthInfoList){
      // if(sourceFlag){
      //   healthInfoList = healthInfoList.filter(function(health){
      //     return health.get('sourceFlag') == 'fromHand';
      //   });
      // }
      console.log('healthInfoList length:',healthInfoList.get('length'));
      _self.set("healthInfoList",healthInfoList);
      _self.set("showLoadingImg",false);//隐藏加载图片
    });
    // this.initChart();//图表不要
  }.observes("healthShowFlag","customer","sourceFlag"),
  actions:{
    queryAllOrOther(){
      var otherChoose = this.get("otherChoose");
      if(otherChoose){
        this.set("otherChoose",false);
      }else {
      }
      this.set("otherChoose",true);
    },
    closeAllOrOther(){
      this.set("otherChoose",false);
    },
    queryHealth(type){
      console.log("sourceFlag in queryHealth");
      this.sendAction("queryHealth",type);
      this.set("otherChoose",false);
    },
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
    addHealth:function(){
      var _self = this;
      var itemId = "customer_detail_healthbtn";
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          _self.sendAction("addHealth");
        },100);
      },200);
    },
  },

  // healthInfoList.forEach(function(item){
  //   var result = item.get("result");
  //   var typecode = item.get("itemtype.typecode");
  //   if(typecode=="healthExamType1"){//血压
  //     if(result > 85 && result < 130){
  //       item.set("typeStatus","正常");
  //     }else {
  //       item.set("typeStatus","异常");
  //     }
  //   }else if (typecode=="healthExamType2") {//血氧
  //     if(result > 75 && result <= 100){
  //       item.set("typeStatus","正常");
  //     }else {
  //       item.set("typeStatus","异常");
  //     }
  //   }else if (typecode=="healthExamType3") {//心率
  //     if(result > 50 && result < 100){
  //       item.set("typeStatus","正常");
  //     }else {
  //       item.set("typeStatus","异常");
  //     }
  //   }else if (typecode=="healthExamType4") {//呼吸频率
  //     if(result > 12 && result < 20){
  //       item.set("typeStatus","正常");
  //     }else {
  //       item.set("typeStatus","异常");
  //     }
  //   }else if (typecode=="healthExamType5") {//体温
  //     if(result > 37 && result < 37){
  //       item.set("typeStatus","正常");
  //     }else {
  //       item.set("typeStatus","异常");
  //     }
  //   }else if (typecode=="healthExamType6") {//体重 乱写的
  //     if(result > 50 && result < 80){
  //       item.set("typeStatus","正常");
  //     }else {
  //       item.set("typeStatus","异常");
  //     }
  //   }else if (typecode=="healthExamType7") {//血糖-空腹血糖
  //     if(result > 3.89 && result < 6.11){
  //       item.set("typeStatus","正常");
  //     }else {
  //       item.set("typeStatus","异常");
  //     }
  //   }else if (typecode=="healthExamType8") {//血糖-餐前血糖
  //     if(result > 3.89 && result < 6.11){
  //       item.set("typeStatus","正常");
  //     }else {
  //       item.set("typeStatus","异常");
  //     }
  //   }else if (typecode=="healthExamType9") {//血糖-餐后血糖
  //     if(result > 7.8 && result < 11.1){
  //       item.set("typeStatus","正常");
  //     }else {
  //       item.set("typeStatus","异常");
  //     }
  //   }else if (typecode=="healthExamType10") {//脂肪数据 未细分男女
  //     if(result > 14 && result < 24){
  //       item.set("typeStatus","正常");
  //     }else {
  //       item.set("typeStatus","异常");
  //     }
  //   }else if (typecode=="healthExamType11") {//心电分析图
  //     if(result > 60 && result < 100){
  //       item.set("typeStatus","正常");
  //     }else {
  //       item.set("typeStatus","异常");
  //     }
  //   }else if (typecode=="healthExamType12") {//尿液 ph
  //     if(result > 5.0 && result < 8.0){
  //       item.set("typeStatus","正常");
  //     }else {
  //       item.set("typeStatus","异常");
  //     }
  //   }else if (typecode=="healthExamType13") {//血脂分析 胆固醇
  //     if(result > 3.9 && result < 6.5){ //if(result > 0.4 && result < 1.86)//甘油三脂
  //       item.set("typeStatus","正常");
  //     }else {
  //       item.set("typeStatus","异常");
  //     }
  //   }
  // });

  // showChartData() {
  //     var _self = this;
  //     var healthInfoList = this.get("healthInfoList");
  //     if(!healthInfoList){return;}
  //     var myChartBlood = _self.get("myChartBlood");
  //     var myChartOxygen = _self.get("myChartOxygen");
  //     var myChartBreath = _self.get("myChartBreath");
  //     var myChartWeight = _self.get("myChartWeight");
  //     var myChartEmpty = _self.get("myChartEmpty");
  //     var myChartBefore = _self.get("myChartBefore");
  //     var myChartAfter = _self.get("myChartAfter");
  //     var myChartFat = _self.get("myChartFat");
  //     var myChartHeart = _self.get("myChartHeart");
  //     var myChartTemperature = _self.get("myChartTemperature");
  //
  //     //重新定义
  //     var bloodList = []; //存血压的数组
  //     var bloodListResult = []; //高压
  //     var bloodListResultAddtion = []; //低压
  //     var bloodDate = []; //血压体检时间
  //     var oxygenList = []; //存血氧的数组
  //     var oxygenListResult = []; //血氧
  //     var oxygenDate = []; //血氧体检时间
  //     var breathList = []; //存呼吸频率的数组
  //     var breathListResult = []; //呼吸频率
  //     var breathDate = []; //呼吸频率体检时间
  //     var weightList = []; //存体重的数组
  //     var weightListResult = []; //体重
  //     var weightDate = []; //体重体检时间
  //     var emptyList = []; //存空腹血糖的数组
  //     var emptyListResult = []; //空腹血糖
  //     var emptyDate = []; //空腹血糖体检时间
  //     var beforeList = []; //存餐前血糖的数组
  //     var beforeListResult = []; //餐前血糖
  //     var beforeDate = []; //餐前血糖体检时间
  //     var afterList = []; //存餐后血糖的数组
  //     var afterListResult = []; //餐后血糖
  //     var afterDate = []; //餐后血糖体检时间
  //     var fatList = []; //存脂肪数据的数组
  //     var fatListResult = []; //脂肪数据
  //     var fatDate = []; //脂肪数据体检时间
  //     var heartList = []; //存心率的数组
  //     var heartListResult = []; //心率
  //     var heartDate = []; //心率体检时间
  //     var temperatureList = []; //存体温的数组
  //     var temperatureListResult = []; //体温
  //     var temperatureDate = []; //体温体检时间
  //     //按体检项目归类
  //     healthInfoList.forEach(function(chartHealth) {
  //         console.log("healthInfoList1111 chartHealth",chartHealth);
  //         var chartType = chartHealth.get('itemtype.typecode'); //体检类型
  //         var chartResult = chartHealth.get('result'); //体检结果
  //         var chartResultAddtion = chartHealth.get('resultAddtion'); //低压
  //         var itemDate = chartHealth.get('examDateStringMobile'); //体检时间
  //         console.log("itemDate1111111",itemDate);
  //         //console.log("chartType is",chartType);
  //         //血压
  //         if (chartType == 'healthExamType1') {
  //             bloodListResult.push(chartResult);
  //             bloodListResultAddtion.push(chartResultAddtion);
  //             bloodDate.push(itemDate);
  //             bloodList.push(chartHealth);
  //         }
  //         //血氧
  //         if (chartType == 'healthExamType2') {
  //             oxygenListResult.push(chartResult);
  //             oxygenDate.push(itemDate);
  //             oxygenList.push(chartHealth);
  //             console.log('oxygenDate is',oxygenDate);
  //             console.log('chartHealth isis',chartHealth);
  //         }
  //         //呼吸频率
  //         if (chartType == 'healthExamType4') {
  //             breathListResult.push(chartResult);
  //             breathDate.push(itemDate);
  //             breathList.push(chartHealth);
  //         }
  //         //体重
  //         if (chartType == 'healthExamType6') {
  //             weightListResult.push(chartResult);
  //             weightDate.push(itemDate);
  //             weightList.push(chartHealth);
  //         }
  //         //空腹血糖
  //         if (chartType == 'healthExamType7') {
  //             emptyListResult.push(chartResult);
  //             emptyDate.push(itemDate);
  //             emptyList.push(chartHealth);
  //         }
  //         //餐前血糖
  //         if (chartType == 'healthExamType8') {
  //             beforeListResult.push(chartResult);
  //             beforeDate.push(itemDate);
  //             beforeList.push(chartHealth);
  //         }
  //         //餐后血糖
  //         if (chartType == 'healthExamType9') {
  //             afterListResult.push(chartResult);
  //             afterDate.push(itemDate);
  //             afterList.push(chartHealth);
  //         }
  //         //脂肪数据
  //         if (chartType == 'healthExamType10') {
  //             fatListResult.push(chartResult);
  //             fatDate.push(itemDate);
  //             fatList.push(chartHealth);
  //         }
  //        //体温
  //         if (chartType == 'healthExamType5') {
  //             temperatureListResult.push(chartResult);
  //             temperatureDate.push(itemDate);
  //             temperatureList.push(chartHealth);
  //         }
  //         //心率
  //          if (chartType == 'healthExamType3') {
  //              heartListResult.push(chartResult);
  //              heartDate.push(itemDate);
  //              heartList.push(chartHealth);
  //          }
  //     });
  //     //获取最近一次体检结果
  //     var firstBlood=bloodList.get('lastObject');
  //     this.set('firstBlood',firstBlood);
  //     var firstOxygen=oxygenList.get('lastObject');
  //     console.log('oxygenList is',oxygenList);
  //     console.log('firstOxygen  is',firstOxygen);
  //     this.set('firstOxygen',firstOxygen);
  //     var firstBreath=breathList.get('lastObject');
  //     this.set('firstBreath',firstBreath);
  //     var firstWeight=weightList.get('lastObject');
  //     this.set('firstWeight',firstWeight);
  //     var firstEmpty=emptyList.get('lastObject');
  //     this.set('firstEmpty',firstEmpty);
  //     var firstBefore=beforeList.get('lastObject');
  //     this.set('firstBefore',firstBefore);
  //     var firstAfter=afterList.get('lastObject');
  //     this.set('firstAfter',firstAfter);
  //     var firstFat=fatList.get('lastObject');
  //     this.set('firstFat',firstFat);
  //     var firstHeart=heartList.get('lastObject');
  //     this.set('firstHeart',firstHeart);
  //     var firstTemperature=temperatureList.get('lastObject');
  //     this.set('firstTemperature',firstTemperature);
  //
  //     // 绘制血压图表
  //     myChartBlood.setOption({
  //         title: {
  //             text: '血压'
  //         },
  //         tooltip: {
  //             trigger: "axis"
  //         },
  //         legend: {
  //             data: ['高压', '低压'],
  //             y: "top"
  //         },
  //         grid: {
  //             left: '3%',
  //             right: '4%',
  //             bottom: '3%',
  //             containLabel: true
  //         },
  //         xAxis: [{
  //             type: 'category', //类目轴,选择此项必须使用data设置数据
  //             boundaryGap: false,
  //             data: bloodDate, //x轴(时间)
  //             axisLabel: {
  //                 interval: 0
  //             }
  //         }],
  //         yAxis: {
  //             name: 'mmHg', //单位
  //             type: 'value',
  //         },
  //         dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
  //             type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
  //             start: 10, // 左边在 10% 的位置。
  //             end: 90, // 右边在 60% 的位置。
  //             filterMode: 'filter'
  //         }],
  //         series: [{
  //             name: '高压',
  //             type: "line",
  //             smooth: true,
  //             itemStyle: {
  //                 normal: {
  //                     lineStyle: {
  //                         color: "#ff0000"
  //                     }
  //                 }
  //             },
  //             //stack:"",
  //             data: bloodListResult
  //         }, {
  //             name: '低压',
  //             type: "line",
  //             smooth: true,
  //             data: bloodListResultAddtion
  //         }]
  //     });
  //     var option = myChartBlood.getOption();
  //     console.log("option is", option.series);
  //
  //     // 绘制血氧图表
  //     myChartOxygen.setOption({
  //         title: {
  //             text: '血氧'
  //         },
  //         tooltip: {
  //             trigger: "axis"
  //         },
  //         legend: {
  //             data: ['血氧'],
  //             y: "top"
  //         },
  //         grid: {
  //             left: '3%',
  //             right: '4%',
  //             bottom: '3%',
  //             containLabel: true
  //         },
  //         xAxis: [{
  //             type: 'category', //类目轴,选择此项必须使用data设置数据
  //             boundaryGap: false,
  //             data: oxygenDate, //x轴(时间)
  //             axisLabel: {
  //                 interval: 0
  //             }
  //         }],
  //         yAxis: {
  //             name: '%', //单位
  //             type: 'value',
  //         },
  //         dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
  //             type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
  //             start: 10, // 左边在 10% 的位置。
  //             end: 90, // 右边在 60% 的位置。
  //             filterMode: 'filter'
  //         }],
  //         series: [{
  //             name: '血氧',
  //             type: "line",
  //             smooth: true,
  //             itemStyle: {
  //                 normal: {
  //                     lineStyle: {
  //                         color: "#ff0000"
  //                     }
  //                 }
  //             },
  //             //stack:"",
  //             data: oxygenListResult
  //         }]
  //     });
  //     // 绘制呼吸频率图表
  //     myChartBreath.setOption({
  //         title: {
  //             text: '呼吸频率'
  //         },
  //         tooltip: {
  //             trigger: "axis"
  //         },
  //         legend: {
  //             data: ['呼吸频率'],
  //             y: "top"
  //         },
  //         grid: {
  //             left: '3%',
  //             right: '4%',
  //             bottom: '3%',
  //             containLabel: true
  //         },
  //         xAxis: [{
  //             type: 'category', //类目轴,选择此项必须使用data设置数据
  //             boundaryGap: false,
  //             data: breathDate, //x轴(时间)
  //             axisLabel: {
  //                 interval: 0
  //             }
  //         }],
  //         yAxis: {
  //             name: '次/分', //单位
  //             type: 'value',
  //         },
  //         dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
  //             type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
  //             start: 10, // 左边在 10% 的位置。
  //             end: 90, // 右边在 60% 的位置。
  //             filterMode: 'filter'
  //         }],
  //         series: [{
  //             name: '呼吸频率',
  //             type: "line",
  //             smooth: true,
  //             itemStyle: {
  //                 normal: {
  //                     lineStyle: {
  //                         color: "#ff0000"
  //                     }
  //                 }
  //             },
  //             //stack:"",
  //             data: breathListResult
  //         }]
  //     });
  //     // 绘制体重图表
  //     myChartWeight.setOption({
  //         title: {
  //             text: '体重'
  //         },
  //         tooltip: {
  //             trigger: "axis"
  //         },
  //         legend: {
  //             data: ['体重'],
  //             y: "top"
  //         },
  //         grid: {
  //             left: '3%',
  //             right: '4%',
  //             bottom: '3%',
  //             containLabel: true
  //         },
  //         xAxis: [{
  //             type: 'category', //类目轴,选择此项必须使用data设置数据
  //             boundaryGap: false,
  //             data: weightDate, //x轴(时间)
  //             axisLabel: {
  //                 interval: 0
  //             }
  //         }],
  //         yAxis: {
  //             name: 'kg', //单位
  //             type: 'value',
  //         },
  //         dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
  //             type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
  //             start: 10, // 左边在 10% 的位置。
  //             end: 90, // 右边在 60% 的位置。
  //             filterMode: 'filter'
  //         }],
  //         series: [{
  //             name: '体重',
  //             type: "line",
  //             smooth: true,
  //             itemStyle: {
  //                 normal: {
  //                     lineStyle: {
  //                         color: "#ff0000"
  //                     }
  //                 }
  //             },
  //             //stack:"",
  //             data: weightListResult
  //         }]
  //     });
  //     // 绘制空腹血糖图表
  //     myChartEmpty.setOption({
  //         title: {
  //             text: '空腹血糖'
  //         },
  //         tooltip: {
  //             trigger: "axis"
  //         },
  //         legend: {
  //             data: ['空腹血糖'],
  //             y: "top"
  //         },
  //         grid: {
  //             left: '3%',
  //             right: '4%',
  //             bottom: '3%',
  //             containLabel: true
  //         },
  //         xAxis: [{
  //             type: 'category', //类目轴,选择此项必须使用data设置数据
  //             boundaryGap: false,
  //             data: emptyDate, //x轴(时间)
  //             axisLabel: {
  //                 interval: 0
  //             }
  //         }],
  //         yAxis: {
  //             name: 'mmol/L', //单位
  //             type: 'value',
  //         },
  //         dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
  //             type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
  //             start: 10, // 左边在 10% 的位置。
  //             end: 90, // 右边在 60% 的位置。
  //             filterMode: 'filter'
  //         }],
  //         series: [{
  //             name: '空腹血糖',
  //             type: "line",
  //             smooth: true,
  //             itemStyle: {
  //                 normal: {
  //                     lineStyle: {
  //                         color: "#ff0000"
  //                     }
  //                 }
  //             },
  //             //stack:"",
  //             data: emptyListResult
  //         }]
  //     });
  //     // 绘制餐前血糖图表
  //     myChartBefore.setOption({
  //         title: {
  //             text: '餐前血糖'
  //         },
  //         tooltip: {
  //             trigger: "axis"
  //         },
  //         legend: {
  //             data: ['餐前血糖'],
  //             y: "top"
  //         },
  //         grid: {
  //             left: '3%',
  //             right: '4%',
  //             bottom: '3%',
  //             containLabel: true
  //         },
  //         xAxis: [{
  //             type: 'category', //类目轴,选择此项必须使用data设置数据
  //             boundaryGap: false,
  //             data: beforeDate, //x轴(时间)
  //             axisLabel: {
  //                 interval: 0
  //             }
  //         }],
  //         yAxis: {
  //             name: 'mmol/L', //单位
  //             type: 'value',
  //         },
  //         dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
  //             type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
  //             start: 10, // 左边在 10% 的位置。
  //             end: 90, // 右边在 60% 的位置。
  //             filterMode: 'filter'
  //         }],
  //         series: [{
  //             name: '餐前血糖',
  //             type: "line",
  //             smooth: true,
  //             itemStyle: {
  //                 normal: {
  //                     lineStyle: {
  //                         color: "#ff0000"
  //                     }
  //                 }
  //             },
  //             //stack:"",
  //             data: beforeListResult
  //         }]
  //     });
  //     // 绘制餐后血糖图表
  //     myChartAfter.setOption({
  //         title: {
  //             text: '餐后血糖'
  //         },
  //         tooltip: {
  //             trigger: "axis"
  //         },
  //         legend: {
  //             data: ['餐后血糖'],
  //             y: "top"
  //         },
  //         grid: {
  //             left: '3%',
  //             right: '4%',
  //             bottom: '3%',
  //             containLabel: true
  //         },
  //         xAxis: [{
  //             type: 'category', //类目轴,选择此项必须使用data设置数据
  //             boundaryGap: false,
  //             data: afterDate, //x轴(时间)
  //             axisLabel: {
  //                 interval: 0
  //             }
  //         }],
  //         yAxis: {
  //             name: 'mmol/L', //单位
  //             type: 'value',
  //         },
  //         dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
  //             type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
  //             start: 10, // 左边在 10% 的位置。
  //             end: 90, // 右边在 60% 的位置。
  //             filterMode: 'filter'
  //         }],
  //         series: [{
  //             name: '餐后血糖',
  //             type: "line",
  //             smooth: true,
  //             itemStyle: {
  //                 normal: {
  //                     lineStyle: {
  //                         color: "#ff0000"
  //                     }
  //                 }
  //             },
  //             //stack:"",
  //             data: afterListResult
  //         }]
  //     });
  //     // 绘制脂肪数据图表
  //     myChartFat.setOption({
  //         title: {
  //             text: '脂肪数据'
  //         },
  //         tooltip: {
  //             trigger: "axis"
  //         },
  //         legend: {
  //             data: ['脂肪数据'],
  //             y: "top"
  //         },
  //         grid: {
  //             left: '3%',
  //             right: '4%',
  //             bottom: '3%',
  //             containLabel: true
  //         },
  //         xAxis: [{
  //             type: 'category', //类目轴,选择此项必须使用data设置数据
  //             boundaryGap: false,
  //             data: fatDate, //x轴(时间)
  //             axisLabel: {
  //                 interval: 0
  //             }
  //         }],
  //         yAxis: {
  //             name: 'g/100g', //单位
  //             type: 'value',
  //         },
  //         dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
  //             type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
  //             start: 10, // 左边在 10% 的位置。
  //             end: 90, // 右边在 60% 的位置。
  //             filterMode: 'filter'
  //         }],
  //         series: [{
  //             name: '脂肪数据',
  //             type: "line",
  //             smooth: true,
  //             itemStyle: {
  //                 normal: {
  //                     lineStyle: {
  //                         color: "#ff0000"
  //                     }
  //                 }
  //             },
  //             //stack:"",
  //             data: fatListResult
  //         }]
  //     });
  //     // 绘制心率图表
  //     myChartHeart.setOption({
  //         title: {
  //             text:'心率'
  //         },
  //         tooltip: {
  //             trigger: "axis"
  //         },
  //         legend: {
  //             data: ['心率'],
  //             y: "top"
  //         },
  //         grid: {
  //             left: '3%',
  //             right: '4%',
  //             bottom: '3%',
  //             containLabel: true
  //         },
  //         xAxis: [{
  //             type: 'category', //类目轴,选择此项必须使用data设置数据
  //             boundaryGap: false,
  //             data: heartDate, //x轴(时间)
  //             axisLabel: {
  //                 interval: 0
  //             }
  //         }],
  //         yAxis: {
  //             name: 'times/min', //单位
  //             type: 'value',
  //         },
  //         dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
  //             type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
  //             start: 10, // 左边在 10% 的位置。
  //             end: 90, // 右边在 60% 的位置。
  //             filterMode: 'filter'
  //         }],
  //         series: [{
  //             name: '心率',
  //             type: "line",
  //             smooth: true,
  //             itemStyle: {
  //                 normal: {
  //                     lineStyle: {
  //                         color: "#ff0000"
  //                     }
  //                 }
  //             },
  //             //stack:"",
  //             data: heartListResult
  //         }]
  //     });
  //     // 绘制体温图表
  //     myChartTemperature.setOption({
  //         title: {
  //             text: '体温'
  //         },
  //         tooltip: {
  //             trigger: "axis"
  //         },
  //         legend: {
  //             data: ['体温'],
  //             y: "top"
  //         },
  //         grid: {
  //             left: '3%',
  //             right: '4%',
  //             bottom: '3%',
  //             containLabel: true
  //         },
  //         xAxis: [{
  //             type: 'category', //类目轴,选择此项必须使用data设置数据
  //             boundaryGap: false,
  //             data: temperatureDate, //x轴(时间)
  //             axisLabel: {
  //                 interval: 0
  //             }
  //         }],
  //         yAxis: {
  //             name: '℃', //单位
  //             type: 'value',
  //         },
  //         dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
  //             type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
  //             start: 10, // 左边在 10% 的位置。
  //             end: 90, // 右边在 60% 的位置。
  //             filterMode: 'filter'
  //         }],
  //         series: [{
  //             name: '体温',
  //             type: "line",
  //             smooth: true,
  //             itemStyle: {
  //                 normal: {
  //                     lineStyle: {
  //                         color: "#ff0000"
  //                     }
  //                 }
  //             },
  //             //stack:"",
  //             data: temperatureListResult
  //         }]
  //     });
  // },
  //
  // initChart() {
  //     var theWidth = document.documentElement.clientWidth;
  //     //初始化图表-血压
  //     if (this.get("hasInitChart")) {
  //         return;
  //     }
  //     this.set("hasInitChart", true);
  //     // var pwBlood = ($("#health-area").width()) ;
  //     var pwBlood = theWidth ;
  //     console.log("pwBlood is:" + pwBlood);
  //     $("#myChartBlood").width(pwBlood);
  //     var myChartBlood = echarts.init(document.getElementById('myChartBlood'));
  //     this.set("myChartBlood", myChartBlood);
  //     //初始化图表-血氧
  //     if (this.get("hasInitChartOxygen")) {
  //         return;
  //     }
  //     this.set("hasInitChartOxygen", true);
  //     var pwOxygen = theWidth ;
  //     // var pwOxygen = ($("#health-area").width()) ;
  //     console.log("pwOxygen is:" + pwOxygen);
  //     $("#myChartOxygen").width(pwOxygen);
  //     var myChartOxygen = echarts.init(document.getElementById('myChartOxygen'));
  //     this.set("myChartOxygen", myChartOxygen);
  //     //初始化图表-呼吸频率
  //     if (this.get("hasInitChartBreath")) {
  //         return;
  //     }
  //     this.set("hasInitChartBreath", true);
  //     var pwBreath = theWidth;
  //     // var pwBreath = ($("#health-area").width());
  //     console.log("pwBreath is:" + pwBreath);
  //     $("#myChartBreath").width(pwBreath);
  //     var myChartBreath = echarts.init(document.getElementById('myChartBreath'));
  //     this.set("myChartBreath", myChartBreath);
  //     //初始化图表-体重
  //     if (this.get("hasInitChartWeight")) {
  //         return;
  //     }
  //     this.set("hasInitChartWeight", true);
  //     var pwWeight = theWidth;
  //     // var pwWeight = ($("#health-area").width()) ;
  //     console.log("pwWeight is:" + pwWeight);
  //     $("#myChartWeight").width(pwWeight);
  //     var myChartWeight = echarts.init(document.getElementById('myChartWeight'));
  //     this.set("myChartWeight", myChartWeight);
  //     //初始化图表-空腹血糖
  //     if (this.get("hasInitChartEmpty")) {
  //         return;
  //     }
  //     this.set("hasInitChartEmpty", true);
  //     var pwEmpty = theWidth;
  //     // var pwEmpty = ($("#health-area").width()) ;
  //     console.log("pwEmpty is:" + pwEmpty);
  //     $("#myChartEmpty").width(pwEmpty);
  //     var myChartEmpty = echarts.init(document.getElementById('myChartEmpty'));
  //     this.set("myChartEmpty", myChartEmpty);
  //     //初始化图表-餐前血糖
  //     if (this.get("hasInitChartBefore")) {
  //         return;
  //     }
  //     this.set("hasInitChartBefore", true);
  //     var pwBefore = theWidth ;
  //     // var pwBefore = ($("#health-area").width()) ;
  //     console.log("pwBefore is:" + pwBefore);
  //     $("#myChartBefore").width(pwBefore);
  //     var myChartBefore = echarts.init(document.getElementById('myChartBefore'));
  //     this.set("myChartBefore", myChartBefore);
  //     //初始化图表-餐后血糖
  //     if (this.get("hasInitChartAfter")) {
  //         return;
  //     }
  //     this.set("hasInitChartAfter", true);
  //     var pwAfter = theWidth ;
  //     // var pwAfter = ($("#health-area").width()) ;
  //     console.log("pwAfter is:" + pwAfter);
  //     $("#myChartAfter").width(pwAfter);
  //     var myChartAfter = echarts.init(document.getElementById('myChartAfter'));
  //     this.set("myChartAfter", myChartAfter);
  //     //初始化图表-脂肪数据
  //     if (this.get("hasInitChartFat")) {
  //         return;
  //     }
  //     this.set("hasInitChartFat", true);
  //     var pwFat = theWidth ;
  //     // var pwFat = ($("#health-area").width()) ;
  //     console.log("pwFat is:" + pwFat);
  //     $("#myChartFat").width(pwFat);
  //     var myChartFat = echarts.init(document.getElementById('myChartFat'));
  //     this.set("myChartFat", myChartFat);
  //     //初始化图表-心率数据
  //     if (this.get("hasInitChartHeart")) {
  //         return;
  //     }
  //     this.set("hasInitChartHeart", true);
  //     var pwHeart = theWidth;
  //     // var pwHeart = ($("#health-area").width());
  //     console.log("pwHeart is:" + pwHeart);
  //     $("#myChartHeart").width(pwHeart);
  //     var myChartHeart = echarts.init(document.getElementById('myChartHeart'));
  //     this.set("myChartHeart", myChartHeart);
  //     //初始化图表-体温数据
  //     if (this.get("hasInitChartTemperature")) {
  //         return;
  //     }
  //     this.set("hasInitChartTemperature", true);
  //     var pwTemperature = theWidth;
  //     // var pwTemperature = ($("#health-area").width());
  //     console.log("pwHeart is:" + pwTemperature);
  //     $("#myChartTemperature").width(pwTemperature);
  //     var myChartTemperature = echarts.init(document.getElementById('myChartTemperature'));
  //     this.set("myChartTemperature", myChartTemperature);
  // },


});
