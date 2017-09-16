import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
import Echarts from "npm:echarts";

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "healthInfoList",
  infiniteModelName: "healthInfo",
  infiniteContainerName:"userHealthyReportContainer",

  moment: Ember.inject.service(),
  statusService: Ember.inject.service("current-status"),
  store: Ember.inject.service("store"),
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),

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
  EchartFlag:0,

  init: function(){
    var _self = this;
    _self.queryFlagIn();
    Ember.run.schedule("afterRender",this,function() {
      _self.initChart();
    });
  },
  initChartObs:function(){
    console.log("init 11111111111111");
    this.showChartData();
    this.showMulContents();
  }.observes("healthInfoList","healthAnalysisList").on("init"),
  queryFlagIn: function(){
    var _self = this;
    var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
    var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
    var params = {
      filter:{
      examUser:{id:curCustomerId},
      }
    };
    _self.store.query('health-info',params).then(function(healthInfoList){
      var sortByOver = healthInfoList.sortBy("examDateTime");//排序
      console.log("sortByOver",sortByOver);
      console.log("healthInfoList model",healthInfoList);
      _self.set("healthInfoList",sortByOver);
    });
    // 获取建议信息
   _self.store.query("healthAnalysis",{
     filter:{customer:{id:curCustomerId}},
     sort:{createTime:"desc"}
   }).then(function(healthAnalysisList){
     console.log("healthAnalysisList",healthAnalysisList);
     _self.set("healthAnalysisList",healthAnalysisList);
   });
    _self.incrementProperty("queryFlag");
  },
  showMulContents() {
    // 设置综合建议值
    // var nulContentsBlood = '';
    // var nulContentsOxygen = '';
    // var nulContentsBreath = '';
    // var nulContentsWeight = '';
    // var nulContentsEmpty = '';
    // var nulContentsFat = '';
    // var nulContentsTemperature = '';
    // var nulContentsHeart = '';
    var _self = this;
    var healthAnalysisList = this.get("healthAnalysisList");
    console.log("healthAnalysisList".healthAnalysisList);
    if(!healthAnalysisList){return;}
    console.log("arr is null!");
    healthAnalysisList.forEach(function(healthAnalysis) {
        console.log("healthAnalysis init",healthAnalysis);
        var mulContentsType = healthAnalysis.get('type.typecode'); //体检类型
        var mulContents = healthAnalysis.get('mul_contents'); //体检结果综合建议
        console.log("mulContentsType",mulContentsType);
        console.log("mulContents",mulContents);
        //血压
        if (!_self.get("nulContentsBlood") && mulContentsType == 'healthExamType1') {
          //获取最近一次体检结果综合建议
          _self.set('nulContentsBlood',mulContents);
        }
        //血氧
        if (!_self.get("nulContentsOxygen") && mulContentsType == 'healthExamType2') {
          //获取最近一次体检结果综合建议
          _self.set('nulContentsOxygen',mulContents);
        }
        //呼吸频率
        if (!_self.get("nulContentsBreath") && mulContentsType == 'healthExamType4') {
          //获取最近一次体检结果综合建议
          _self.set('nulContentsBreath',mulContents);
        }
        //体重
        if (!_self.get("nulContentsWeight") && mulContentsType == 'healthExamType6') {
          //获取最近一次体检结果综合建议
          _self.set('nulContentsWeight',mulContents);
        }
        //空腹血糖
        if (!_self.get("nulContentsEmpty") && mulContentsType == 'healthExamType7') {
          //获取最近一次体检结果综合建议
          _self.set('nulContentsEmpty',mulContents);
        }
        //脂肪数据
        if (!_self.get("nulContentsFat") && mulContentsType == 'healthExamType10') {
          //获取最近一次体检结果综合建议
          _self.set('nulContentsFat',mulContents);
        }
       //体温
        if (!_self.get("nulContentsTemperature") && mulContentsType == 'healthExamType5') {
          //获取最近一次体检结果综合建议
          _self.set('nulContentsTemperature',mulContents);
        }
        //心率
         if (!_self.get("nulContentsHeart") && mulContentsType == 'healthExamType3') {
           //获取最近一次体检结果综合建议
           _self.set('nulContentsHeart',mulContents);
         }
      });
  },

  showChartData() {
    var _self = this;
    var healthInfoList = this.get("healthInfoList");
    if(!healthInfoList){return;}
    var myChartBlood = _self.get("myChartBlood");
    var myChartOxygen = _self.get("myChartOxygen");
    var myChartBreath = _self.get("myChartBreath");
    var myChartWeight = _self.get("myChartWeight");
    var myChartEmpty = _self.get("myChartEmpty");
    var myChartFat = _self.get("myChartFat");
    var myChartHeart = _self.get("myChartHeart");
    var myChartTemperature = _self.get("myChartTemperature");

    //重新定义
    var bloodList = []; //存血压的数组
    var bloodListResult = []; //高压
    var bloodListResultAddtion = []; //低压
    var bloodDate = []; //血压体检时间
    var oxygenList = []; //存血氧的数组
    var oxygenListResult = []; //血氧
    var oxygenDate = []; //血氧体检时间
    var breathList = []; //存呼吸频率的数组
    var breathListResult = []; //呼吸频率
    var breathDate = []; //呼吸频率体检时间
    var weightList = []; //存体重的数组
    var weightListResult = []; //体重
    var weightDate = []; //体重体检时间
    var emptyList = []; //存空腹血糖的数组
    var emptyListResult = []; //空腹血糖
    var emptyDate = []; //空腹血糖体检时间
    var fatList = []; //存脂肪数据的数组
    var fatListResult = []; //脂肪数据
    var fatDate = []; //脂肪数据体检时间
    var heartList = []; //存心率的数组
    var heartListResult = []; //心率
    var heartDate = []; //心率体检时间
    var temperatureList = []; //存体温的数组
    var temperatureListResult = []; //体温
    var temperatureDate = []; //体温体检时间
    //按体检项目归类
    healthInfoList.forEach(function(chartHealth) {
        console.log("healthInfoList1111 chartHealth",chartHealth);
        var chartType = chartHealth.get('itemtype.typecode'); //体检类型
        var chartResult = chartHealth.get('result'); //体检结果
        var chartResultAddtion = chartHealth.get('resultAddtion'); //低压
        var itemDate = chartHealth.get('examDateStringMobile'); //体检时间
        console.log("itemDate1111111",itemDate);
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
            oxygenDate.push(itemDate);
            oxygenList.push(chartHealth);
            console.log('oxygenDate is',oxygenDate);
            console.log('chartHealth isis',chartHealth);
        }
        //呼吸频率
        if (chartType == 'healthExamType4') {
            breathListResult.push(chartResult);
            breathDate.push(itemDate);
            breathList.push(chartHealth);
        }
        //体重
        if (chartType == 'healthExamType6') {
            weightListResult.push(chartResult);
            weightDate.push(itemDate);
            weightList.push(chartHealth);
        }
        //空腹血糖
        if (chartType == 'healthExamType7') {
            emptyListResult.push(chartResult);
            emptyDate.push(itemDate);
            emptyList.push(chartHealth);
        }
        //脂肪数据
        if (chartType == 'healthExamType10') {
            fatListResult.push(chartResult);
            fatDate.push(itemDate);
            fatList.push(chartHealth);
        }
       //体温
        if (chartType == 'healthExamType5') {
            temperatureListResult.push(chartResult);
            temperatureDate.push(itemDate);
            temperatureList.push(chartHealth);
        }
        //心率
         if (chartType == 'healthExamType3') {
             heartListResult.push(chartResult);
             heartDate.push(itemDate);
             heartList.push(chartHealth);
         }
    });
    //获取最近一次体检结果
    var firstBlood=bloodList.get('lastObject');
    this.set('firstBlood',firstBlood);
    var firstOxygen=oxygenList.get('lastObject');
    console.log('oxygenList is',oxygenList);
    console.log('firstOxygen  is',firstOxygen);
    this.set('firstOxygen',firstOxygen);
    var firstBreath=breathList.get('lastObject');
    this.set('firstBreath',firstBreath);
    var firstWeight=weightList.get('lastObject');
    this.set('firstWeight',firstWeight);
    var firstEmpty=emptyList.get('lastObject');
    this.set('firstEmpty',firstEmpty);
    var firstFat=fatList.get('lastObject');
    this.set('firstFat',firstFat);
    var firstHeart=heartList.get('lastObject');
    this.set('firstHeart',firstHeart);
    var firstTemperature=temperatureList.get('lastObject');
    this.set('firstTemperature',firstTemperature);

    // 绘制血压图表
    myChartBlood.setOption({
        title: {
            text: '血压',
            textStyle: {
               fontSize: 12
            }
        },
        tooltip: {
            trigger: "axis"
        },
        legend: {
            data: ['高压', '低压'],
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
            data: bloodDate, //x轴(时间)
            axisLabel: {
                interval: 0
            }
        }],
        yAxis: {
            name: 'mmHg', //单位
            type: 'value',
        },
        dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 10, // 左边在 10% 的位置。
            end: 90, // 右边在 60% 的位置。
            filterMode: 'filter'
        }],
        series: [{
            name: '高压',
            type: "line",
            smooth: true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: "#ff0000",
                        fontSize: 12
                    }
                }
            },
            //stack:"",
            data: bloodListResult
        }, {
            name: '低压',
            type: "line",
            smooth: true,
            data: bloodListResultAddtion
        }]
    });
    var option = myChartBlood.getOption();
    console.log("option is", option.series);

    // 绘制血氧图表
    myChartOxygen.setOption({
        title: {
            text: '血氧',
            textStyle: {
               fontSize: 12
            }
        },
        tooltip: {
            trigger: "axis"
        },
        legend: {
            data: ['血氧'],
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
            data: oxygenDate, //x轴(时间)
            axisLabel: {
                interval: 0
            }
        }],
        yAxis: {
            name: '%', //单位
            type: 'value',
        },
        dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 10, // 左边在 10% 的位置。
            end: 90, // 右边在 60% 的位置。
            filterMode: 'filter'
        }],
        series: [{
            name: '血氧',
            type: "line",
            smooth: true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: "#ff0000",
                        fontSize: 12
                    }
                }
            },
            //stack:"",
            data: oxygenListResult
        }]
    });
    // 绘制呼吸频率图表
    myChartBreath.setOption({
        title: {
            text: '呼吸频率',
            textStyle: {
               fontSize: 12
            }
        },
        tooltip: {
            trigger: "axis"
        },
        legend: {
            data: ['呼吸频率'],
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
            data: breathDate, //x轴(时间)
            axisLabel: {
                interval: 0
            }
        }],
        yAxis: {
            name: '次/分', //单位
            type: 'value',
        },
        dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 10, // 左边在 10% 的位置。
            end: 90, // 右边在 60% 的位置。
            filterMode: 'filter'
        }],
        series: [{
            name: '呼吸频率',
            type: "line",
            smooth: true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: "#ff0000",
                        fontSize: 12
                    }
                }
            },
            //stack:"",
            data: breathListResult
        }]
    });
    // 绘制体重图表
    myChartWeight.setOption({
        title: {
            text: '体重',
            textStyle: {
               fontSize: 12
            }
        },
        tooltip: {
            trigger: "axis"
        },
        legend: {
            data: ['体重'],
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
            data: weightDate, //x轴(时间)
            axisLabel: {
                interval: 0
            }
        }],
        yAxis: {
            name: 'kg', //单位
            type: 'value',
        },
        dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 10, // 左边在 10% 的位置。
            end: 90, // 右边在 60% 的位置。
            filterMode: 'filter'
        }],
        series: [{
            name: '体重',
            type: "line",
            smooth: true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: "#ff0000",
                        fontSize: 12
                    }
                }
            },
            //stack:"",
            data: weightListResult
        }]
    });
    // 绘制空腹血糖图表
    myChartEmpty.setOption({
        title: {
            text: '血糖',
            textStyle: {
               fontSize: 12
            }
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
    // 绘制脂肪数据图表
    myChartFat.setOption({
        title: {
            text: '脂肪数据',
            textStyle: {
               fontSize: 12
            }
        },
        tooltip: {
            trigger: "axis"
        },
        legend: {
            data: ['脂肪数据'],
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
            data: fatDate, //x轴(时间)
            axisLabel: {
                interval: 0
            }
        }],
        yAxis: {
            name: 'g/100g', //单位
            type: 'value',
        },
        dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 10, // 左边在 10% 的位置。
            end: 90, // 右边在 60% 的位置。
            filterMode: 'filter'
        }],
        series: [{
            name: '脂肪数据',
            type: "line",
            smooth: true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: "#ff0000",
                        fontSize: 12
                    }
                }
            },
            //stack:"",
            data: fatListResult
        }]
    });
    // 绘制心率图表
    myChartHeart.setOption({
        title: {
            text:'心率',
            textStyle: {
               fontSize: 12
            }
        },
        tooltip: {
            trigger: "axis"
        },
        legend: {
            data: ['心率'],
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
            data: heartDate, //x轴(时间)
            axisLabel: {
                interval: 0
            }
        }],
        yAxis: {
            name: 'times/min', //单位
            type: 'value',
        },
        dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 10, // 左边在 10% 的位置。
            end: 90, // 右边在 60% 的位置。
            filterMode: 'filter'
        }],
        series: [{
            name: '心率',
            type: "line",
            smooth: true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: "#ff0000",
                        fontSize: 12
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
            textStyle: {
               fontSize: 12
            }
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
initChart() {
    var chartWidth = document.documentElement.clientWidth;
    var theWidth = chartWidth/5*3;
    //初始化图表-血压
    // if (this.get("hasInitChart")) {
    //     return;
    // }
    // this.set("hasInitChart", true);
    // var pwBlood = ($("#health-area").width()) ;
    var pwBlood = theWidth ;
    console.log("pwBlood is:" + pwBlood);
    $("#myChartBlood").width(pwBlood);
    var myChartBlood = Echarts.init(document.getElementById('myChartBlood'));
    this.set("myChartBlood", myChartBlood);
    //初始化图表-血氧
    // if (this.get("hasInitChartOxygen")) {
    //     return;
    // }
    // this.set("hasInitChartOxygen", true);
    var pwOxygen = theWidth ;
    // var pwOxygen = ($("#health-area").width()) ;
    console.log("pwOxygen is:" + pwOxygen);
    $("#myChartOxygen").width(pwOxygen);
    var myChartOxygen = Echarts.init(document.getElementById('myChartOxygen'));
    this.set("myChartOxygen", myChartOxygen);
    //初始化图表-呼吸频率
    // if (this.get("hasInitChartBreath")) {
    //     return;
    // }
    // this.set("hasInitChartBreath", true);
    var pwBreath = theWidth;
    // var pwBreath = ($("#health-area").width());
    console.log("pwBreath is:" + pwBreath);
    $("#myChartBreath").width(pwBreath);
    var myChartBreath = Echarts.init(document.getElementById('myChartBreath'));
    this.set("myChartBreath", myChartBreath);
    //初始化图表-体重
    // if (this.get("hasInitChartWeight")) {
    //     return;
    // }
    // this.set("hasInitChartWeight", true);
    var pwWeight = theWidth;
    // var pwWeight = ($("#health-area").width()) ;
    console.log("pwWeight is:" + pwWeight);
    $("#myChartWeight").width(pwWeight);
    var myChartWeight = Echarts.init(document.getElementById('myChartWeight'));
    this.set("myChartWeight", myChartWeight);
    //初始化图表-空腹血糖
    // if (this.get("hasInitChartEmpty")) {
    //     return;
    // }
    // this.set("hasInitChartEmpty", true);
    var pwEmpty = theWidth;
    // var pwEmpty = ($("#health-area").width()) ;
    console.log("pwEmpty is:" + pwEmpty);
    $("#myChartEmpty").width(pwEmpty);
    var myChartEmpty = Echarts.init(document.getElementById('myChartEmpty'));
    this.set("myChartEmpty", myChartEmpty);
    //初始化图表-脂肪数据
    // if (this.get("hasInitChartFat")) {
    //     return;
    // }
    // this.set("hasInitChartFat", true);
    var pwFat = theWidth ;
    // var pwFat = ($("#health-area").width()) ;
    console.log("pwFat is:" + pwFat);
    $("#myChartFat").width(pwFat);
    var myChartFat = Echarts.init(document.getElementById('myChartFat'));
    this.set("myChartFat", myChartFat);
    //初始化图表-心率数据
    // if (this.get("hasInitChartHeart")) {
    //     return;
    // }
    // this.set("hasInitChartHeart", true);
    var pwHeart = theWidth;
    // var pwHeart = ($("#health-area").width());
    console.log("pwHeart is:" + pwHeart);
    $("#myChartHeart").width(pwHeart);
    var myChartHeart = Echarts.init(document.getElementById('myChartHeart'));
    this.set("myChartHeart", myChartHeart);
    //初始化图表-体温数据
    // if (this.get("hasInitChartTemperature")) {
    //     return;
    // }
    // this.set("hasInitChartTemperature", true);
    var pwTemperature = theWidth;
    // var pwTemperature = ($("#health-area").width());
    console.log("pwHeart is:" + pwTemperature);
    $("#myChartTemperature").width(pwTemperature);
    var myChartTemperature = Echarts.init(document.getElementById('myChartTemperature'));
    this.set("myChartTemperature", myChartTemperature);
  },
  actions:{
    didRender(){
      this._super();
      this.initChart();
      this.showChartData();
    },
  },

});
