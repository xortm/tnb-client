import Ember from 'ember';
import Echarts from "npm:echarts";
import BaseUiItem from '../../ui/base-ui-item';

export default BaseUiItem.extend({
  store: Ember.inject.service("store"),
  swipeFlag: 1,
  swipeCount: 6,
  showLoadingImg: true,
  init: function(){
    this._super(...arguments);
    var _self = this;
  },
  swipeFlagArr: Ember.computed("swipeCount", function() {
    let swipeCount = this.get("swipeCount");
    let list = [];
    for (var i = 0; i < swipeCount; i++) {
      list[i] = i+1;
    }
    console.log("list:",list);
    return list;
  }),
  didInsertElement: function() {
    var _self = this;
    var pwBlood = $("#chartDataWrapper").width();
    console.log("pwBlood didinser::",pwBlood);
    let swipeCount = this.get("swipeCount");
    $(".wrapperin").width(swipeCount*pwBlood);
  },
  initChartObs:function(){
    let _self = this;
    console.log("has render in initChartObs:" + this.get("hasRender"));
    //如果没有渲染完毕，则不初始化
    if(!this.get("hasRender")){
      return;
    }
    //没有数据也不初始化
    var healthInfoArray = this.get("healthInfoArray");
    if(!healthInfoArray){
      return;
    }
    console.log("go on init chart");
    var sortByOver = healthInfoArray.sortBy("examDateTime");//排序
    console.log("sortByOver",sortByOver);
    _self.set("healthInfoList",sortByOver);
    _self.initChart();
    this.showChartData();
    this.set("showLoadingImg",false);
    // this.sendAction("showLoadingImgAction");
  }.observes("healthInfoArray,hasRender").on("init"),

  //初始化
  initChart() {
    let swipeCount = this.get("swipeCount");
    let widthWrapper = $("#chartDataWrapper").width();
    let heightWrapperOut = $(window).height();
    console.log("heightWrapperOut is:" + heightWrapperOut);
    console.log("widthWrapper before is:" + widthWrapper);
    //如果取不到，直接使用屏幕宽度,并调整外层
    if(widthWrapper===0){
      widthWrapper = $(window).width();
      $("#chartDataWrapper").width(widthWrapper);
      $("#chartDataWrapper .wrapperin").width(widthWrapper*swipeCount);
      $("#chartDataWrapper .wrapperin").height(heightWrapperOut-93);
    }
    let heightWrapper = heightWrapperOut-60-93;
    console.log("widthWrapper after is:" + widthWrapper);
    console.log("heightWrapper is:" + heightWrapper);
    //初始化图表-血压
    if (this.get("hasInitChart")) {
        return;
    }
    this.set("hasInitChart", true);
    $("#myChartBlood").width(widthWrapper);
    $("#myChartBlood").height(heightWrapper);
    var myChartBlood = Echarts.init(document.getElementById('myChartBlood'));
    console.log('myChartBlood is',myChartBlood);
    this.set("myChartBlood", myChartBlood);
    //初始化图表-血氧
    if (this.get("hasInitChartOxygen")) {
        return;
    }
    this.set("hasInitChartOxygen", true);
    $("#myChartOxygen").width(widthWrapper);
    $("#myChartOxygen").height(heightWrapper);
    var myChartOxygen = Echarts.init(document.getElementById('myChartOxygen'));
    this.set("myChartOxygen", myChartOxygen);
    //初始化图表-血糖
    if (this.get("hasInitChartEmpty")) {
        return;
    }
    this.set("hasInitChartEmpty", true);
    $("#myChartEmpty").width(widthWrapper);
    $("#myChartEmpty").height(heightWrapper);
    var myChartEmpty = Echarts.init(document.getElementById('myChartEmpty'));
    this.set("myChartEmpty", myChartEmpty);
    //初始化图表-呼吸频率
    if (this.get("hasInitChartBreath")) {
        return;
    }
    this.set("hasInitChartBreath", true);
    $("#myChartBreath").width(widthWrapper);
    $("#myChartBreath").height(heightWrapper);
    var myChartBreath = Echarts.init(document.getElementById('myChartBreath'));
    this.set("myChartBreath", myChartBreath);
    //初始化图表-心率数据
    if (this.get("hasInitChartHeart")) {
        return;
    }
    this.set("hasInitChartHeart", true);
    $("#myChartHeart").width(widthWrapper);
    $("#myChartHeart").height(heightWrapper);
    var myChartHeart = Echarts.init(document.getElementById('myChartHeart'));
    this.set("myChartHeart", myChartHeart);
    //初始化图表-体温
    if (this.get("hasInitChartTemperature")) {
        return;
    }
    this.set("hasInitChartTemperature", true);
    $("#myChartTemperature").width(widthWrapper);
    $("#myChartTemperature").height(heightWrapper);
    var myChartTemperature = Echarts.init(document.getElementById('myChartTemperature'));
    this.set("myChartTemperature", myChartTemperature);
  },

  showChartData() {
    var _self = this;
    var healthInfoList = this.get("healthInfoList");
    console.log("healthInfoList len:" + healthInfoList.get("length"));
    let hasInitChart = this.get("hasInitChart");
    console.log("hasInitChart in showChartData:" + hasInitChart);
    if(!hasInitChart){
      return;
    }
    var myChartBlood = _self.get("myChartBlood");
    var myChartOxygen = _self.get("myChartOxygen");
    var myChartEmpty = _self.get("myChartEmpty");
    var myChartBreath = _self.get("myChartBreath");
    var myChartHeart = _self.get("myChartHeart");
    var myChartTemperature = _self.get("myChartTemperature");
    //重新定义
    var bloodList = []; //存血压的数组
    var bloodListResult = []; //高压
    var bloodListResultAddtion = []; //低压
    var bloodDate = []; //血压体检时间
    var oxygenList = []; //存血氧的数组
    var oxygenListResult = []; //血氧
    var oxygenListResultAddtion = []; //脉搏
    var oxygenDate = []; //血氧体检时间
    var emptyList = []; //存空腹血糖的数组
    var emptyListResult = []; //空腹血糖
    var emptyDate = []; //空腹血糖体检时间
    var breathList = []; //存呼吸频率的数组
    var breathListResult = []; //呼吸频率
    var breathDate = []; //呼吸频率体检时间
    var heartList = []; //存心率的数组
    var heartListResult = []; //心率
    var heartDate = []; //心率体检时间
    var temperatureList = []; //存体温的数组
    var temperatureListResult = []; //体温
    var temperatureDate = []; //体温体检时间
    healthInfoList.forEach(function(chartHealth) {
      var chartType = chartHealth.get('itemtype.typecode'); //体检类型
      console.log("chartType:" + chartType + " and result:" + chartHealth.get('result'));
      var chartResult = chartHealth.get('result'); //体检结果
      var chartResultAddtion = chartHealth.get('resultAddtion'); //体检结果补充一
      var chartResultAddtionSec = chartHealth.get('resultAddtionSec');
      var chartResultAddtionThir = chartHealth.get('resultAddtionThir');
      var chartResultAddtionFou = chartHealth.get('resultAddtionFou');
      var chartResultAddtionFiv = chartHealth.get('resultAddtionFiv');
      var chartResultAddtionSix = chartHealth.get('resultAddtionSix');
      var chartResultAddtionSev = chartHealth.get('resultAddtionSev');
      var chartResultAddtionEig = chartHealth.get('resultAddtionEig');
      var chartResultAddtionNin = chartHealth.get('resultAddtionNin');
      var chartResultAddtionTen = chartHealth.get('resultAddtionTen');
      var itemDate = chartHealth.get('examDateString'); //体检时间
      var itemHourS=chartHealth.get('examDateHourS'); //体检时间(时 分)
      //console.log("chartType is",chartType);
      //血压
      if (chartType == 'healthExamType1') {
          bloodListResult.push(chartResult);
          bloodListResultAddtion.push(chartResultAddtion);
          bloodDate.push(itemDate);
          bloodList.push(chartHealth);
      }
      //血氧
      if (chartType == 'healthExamType2') {
          oxygenListResult.push(chartResult);
          oxygenListResultAddtion.push(chartResultAddtion);
          oxygenDate.push(itemDate);
          oxygenList.push(chartHealth);
          console.log('oxygenDate is',oxygenDate);
          console.log('chartHealth isis',chartHealth);
      }
      //血糖
      if (chartType == 'healthExamType7') {
        console.log("push healthExamType4");
          emptyListResult.push(chartResult);
          emptyDate.push(itemDate);
          emptyList.push(chartHealth);
      }
      //呼吸频率
      if (chartType == 'healthExamType4') {
          console.log("push healthExamType4");
          breathListResult.push(chartResult);
          breathDate.push(itemHourS);
          breathList.push(chartHealth);
      }
      //心率
      if (chartType == 'healthExamType3') {
          console.log("push healthExamType3,res:" + chartResult);
          heartListResult.push(chartResult);
          heartDate.push(itemHourS);
          heartList.push(chartHealth);
      }
      //体温
       if (chartType == 'healthExamType5') {
         console.log("push healthExamType5,res:" + chartResult);
           temperatureListResult.push(chartResult);
           temperatureDate.push(itemDate);
           temperatureList.push(chartHealth);
       }

    });
    // 绘制血压图表
    myChartBlood.setOption({
        title: {
            text:'血压'
        },
        tooltip: {
            trigger: "axis"
        },
        legend: {
            data: ['高压', '低压'],
            y: "top"
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category', //类目轴,选择此项必须使用data设置数据
            boundaryGap: false,
            data: bloodDate, //x轴(时间)
            axisLabel: {
                interval: "auto"
            }
        }],
        yAxis: {
            name: 'mmHg', //单位
            type: 'value',
        },
        dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: ((bloodListResult.length-10)/bloodListResult.length)*100, // 左边在 90% 的位置。
            end: 100, // 右边在 100% 的位置。
            filterMode: 'filter',

        }],
        series: [{
            name: '高压',
            type: "line",
            smooth: true,
            showAllSymbol:true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: "#ff0000"
                    }
                }
            },
            //stack:"",
            data: bloodListResult
        }, {
            name: '低压',
            type: "line",
            smooth: true,
            showAllSymbol:true,
            data: bloodListResultAddtion
        }]
    });
    var option = myChartBlood.getOption();
    console.log("option is", option.series);
    // 绘制血氧图表
    myChartOxygen.setOption({
        title: {
            text:'血氧'
        },
        tooltip: {
            trigger: "axis"
        },
        legend: {
            data: ['血氧值'],
            y: "top"
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category', //类目轴,选择此项必须使用data设置数据
            boundaryGap: false,
            data: oxygenDate, //x轴(时间)
            axisLabel: {
                interval: "auto"
            }
        }],
        yAxis: {
            name: '%', //单位
            type: 'value',
            min:80,
            max:100
        },
        dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 90, // 左边在 90% 的位置。
            end: 100, // 右边在 100% 的位置。
            filterMode: 'filter',
            right:0
        }],
        series: [{
            name: '血氧值',
            type: "line",
            smooth: true,
            showAllSymbol:true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: "#ff0000"
                    }
                }
            },
            //stack:"",
            data: oxygenListResult
        }]
    });
    // 绘制空腹血糖图表
    myChartEmpty.setOption({
        title: {
            text: '血糖',
        },
        tooltip: {
            trigger: "axis"
        },
        legend: {
            data: ['血糖'],
            y: "top",
            textStyle: {
               fontSize: 12
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category', //类目轴,选择此项必须使用data设置数据
            boundaryGap: false,
            data: emptyDate, //x轴(时间)
            axisLabel: {
                interval: 0
            }
        }],
        yAxis: {
            name: 'mmol/L', //单位
            type: 'value',
        },
        dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 10, // 左边在 10% 的位置。
            end: 90, // 右边在 60% 的位置。
            filterMode: 'filter'
        }],
        series: [{
            name: '血糖',
            type: "line",
            smooth: true,
            showAllSymbol:true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: "#ff0000",
                        fontSize: 12
                    }
                }
            },
            //stack:"",
            data: emptyListResult
        }]
    });
    // 绘制呼吸频率图表
    myChartBreath.setOption({
        title: {
            text:'呼吸频率'
        },
        tooltip: {
            trigger: "axis"
        },
        legend: {
            data: ['呼吸频率'],
            y: "top"
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category', //类目轴,选择此项必须使用data设置数据
            boundaryGap: false,
            data: breathDate, //x轴(时间)
            axisLabel: {
                interval: "auto"
            }
        }],
        yAxis: {
            name: 'times/min', //单位
            type: 'value',
        },
        dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: ((breathListResult.length-10)/breathListResult.length)*100, // 左边在 90% 的位置。
            end: 100, // 右边在 100% 的位置。
            filterMode: 'filter'
        }],
        series: [{
            name: '呼吸频率',
            type: "line",//图表类型
            smooth: true,
            showAllSymbol:true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: "#ff0000"
                    }
                }
            },
            //stack:"",
            data: breathListResult
        }]
    });
    // 绘制心率图表
    myChartHeart.setOption({
        title: {
            text:'心率'
        },
        tooltip: {
            trigger: "axis"
        },
        legend: {
            data: ['心率'],
            y: "top"
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category', //类目轴,选择此项必须使用data设置数据
            boundaryGap: false,
            data: heartDate, //x轴(时间)
            axisLabel: {
                interval: "auto"
            }
        }],
        yAxis: {
            name: 'times/min', //单位
            type: 'value',
        },
        dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: ((heartListResult.length-10)/heartListResult.length)*100, // 左边在 90% 的位置。
            end: 100, // 右边在 100% 的位置。
            filterMode: 'filter'
        }],
        series: [{
            name: '心率',
            type: "line",
            smooth: true,
            showAllSymbol:true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: "#ff0000"
                    }
                }
            },
            //stack:"",
            data: heartListResult
        }]
    });
    // 绘制体温图表
    myChartTemperature.setOption({
        title: {
            text: '体温',
        },
        tooltip: {
            trigger: "axis"
        },
        legend: {
            data: ['体温'],
            y: "top",
            textStyle: {
               fontSize: 12
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category', //类目轴,选择此项必须使用data设置数据
            boundaryGap: false,
            data: temperatureDate, //x轴(时间)
            axisLabel: {
                interval: 0
            }
        }],
        yAxis: {
            name: '℃', //单位
            type: 'value',
        },
        dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 10, // 左边在 10% 的位置。
            end: 90, // 右边在 60% 的位置。
            filterMode: 'filter'
        }],
        series: [{
            name: '体温',
            type: "line",
            smooth: true,
            showAllSymbol:true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: "#ff0000",
                        fontSize: 12
                    }
                }
            },
            //stack:"",
            data: temperatureListResult
        }]
    });


  },


  didRender(){
    this._super();
    console.log("didRender yes");
    this.set("hasRender",true);
  },
  actions: {
    swipeLeftActiion: function(){
      console.log("swipeLeftActiion!");
      if(!$(".wrapperin").is(":animated")){
        let swipeFlag = this.get("swipeFlag");
        let swipeCount = this.get("swipeCount");
        var pwBlood = $("#chartDataWrapper").width();
        if(swipeFlag === swipeCount){
          return;
        }
        let absoluteLeft = -(swipeFlag*pwBlood);
        this.set("swipeFlag",swipeFlag+1);
        // $(".wrapperin").css("left",absoluteLeft+"px");
        $(".wrapperin").animate({left:absoluteLeft+"px"},500);
      }
    },
    swipeRightActiion: function(){
      console.log("swipeRightActiion!");
      if(!$(".wrapperin").is(":animated")){
        let swipeFlag = this.get("swipeFlag");
        let swipeCount = this.get("swipeCount");
        var pwBlood = $("#chartDataWrapper").width();
        if(swipeFlag === 1){
          return;
        }
        let absoluteLeft = -((swipeFlag-2)*pwBlood);
        this.set("swipeFlag",swipeFlag-1);
      // $(".wrapperin").css("left",absoluteLeft+"px");
        $(".wrapperin").animate({left:absoluteLeft+"px"},500);
      }
    },
  },

});
