import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';


export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userBloodOxygenContainer",

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
  }.observes("healthInfoList").on("init"),
  queryFlagIn: function(){
    var _self = this;
    _self._showLoading();
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
      filter:{"[customer][id]":curCustomerId,"[type][typecode]":"healthExamType2"},
      sort:{"[createTime]":"desc"}
    }).then(function(healthAnalysisList){
      console.log("healthAnalysisList",healthAnalysisList);
      var contentsEmpty = healthAnalysisList.get("firstObject").get("contents");
      _self.set("contentsEmpty",contentsEmpty);
      _self.hideAllLoading();
    });
  },
  showChartData() {
        var _self = this;
        var healthInfoList = this.get("healthInfoList");
        console.log("healthInfoList controller",healthInfoList);
        if(!healthInfoList){return;}
        var bloodOxygen = _self.get("bloodOxygen");
        //重新定义
        var oxygenList = []; //存血氧的数组
        var oxygenListResult = []; //血氧
        var oxygenDate = []; //血氧体检时间
        //按体检项目归类
        healthInfoList.forEach(function(chartHealth) {
            console.log("healthInfoList1111 chartHealth",chartHealth);
            var chartType = chartHealth.get('itemtype.typecode'); //体检类型
            var chartResult = chartHealth.get('result'); //体检结果
            var chartResultAddtion = chartHealth.get('resultAddtion'); //低压
            var itemDate = chartHealth.get('examDateString'); //体检时间
            console.log("itemDate1111111",itemDate);
            //console.log("chartType is",chartType);
            //血氧
            if (chartType == 'healthExamType2') {
                oxygenListResult.push(chartResult);
                oxygenDate.push(itemDate);
                oxygenList.push(chartHealth);
                console.log('oxygenDate is',oxygenDate);
                console.log('chartHealth isis',chartHealth);
            }
          });
          //获取最近一次体检结果
          var firstOxygen=oxygenList.get('lastObject');
          console.log('oxygenList is',oxygenList);
          console.log('firstOxygen  is',firstOxygen);
          this.set('firstOxygen',firstOxygen);
          // 绘制血氧图表
          bloodOxygen.setOption({
              title: {
                  text: '血氧'
              },
              tooltip: {
                  trigger: "axis"
              },
              legend: {
                  data: ['血氧'],
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
                              color: "#ff0000"
                          }
                      }
                  },
                  //stack:"",
                  data: oxygenListResult
              }]
          });

    },
    initChart() {
        var theWidth = document.documentElement.clientWidth;
        //初始化图表-血氧
        // if (this.get("hasInitChartOxygen")) {
        //     return;
        // }
        // this.set("hasInitChartOxygen", true);
        var pwOxygen = theWidth ;
        // var pwOxygen = ($("#health-area").width()) ;
        console.log("pwOxygen is:" + pwOxygen);
        $("#bloodOxygen").width(pwOxygen);
        var bloodOxygen = echarts.init(document.getElementById('bloodOxygen'));
        this.set("bloodOxygen", bloodOxygen);

    },
    actions:{
      switchPage:function (menuLink,elementId) {//个人信息 界面
        console.log("id```````",elementId);
        var _self = this;
        var itemId = elementId;
        $("#" + itemId).addClass("tapped");
        Ember.run.later(function(){
          $("#" + itemId).removeClass("tapped");
          Ember.run.later(function(){
            // _self.get("mainController").switchMainPage(menuLink);
            App.lookup('controller:business.mainpage').switchMainPage(menuLink);
          },100);
        },200);
      },
      didRender(){
        this._super();
        this.initChart();
        this.showChartData();
      },
    },

});
