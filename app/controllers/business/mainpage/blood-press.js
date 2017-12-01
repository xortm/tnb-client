import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';


export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userBloodPressContainer",

  statusService: Ember.inject.service("current-status"),
  store: Ember.inject.service("store"),
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  mainController: Ember.inject.controller('business.mainpage'),

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
      filter:{"[customer][id]":curCustomerId,"[type][typecode]":"healthExamType1"},
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
        var bloodPress = _self.get("bloodPress");
        //重新定义
        var bloodList = []; //存血压的数组
        var bloodListResult = []; //高压
        var bloodListResultAddtion = []; //低压
        var bloodDate = []; //血压体检时间
        //按体检项目归类
        healthInfoList.forEach(function(chartHealth) {
            console.log("healthInfoList1111 chartHealth",chartHealth);
            var chartType = chartHealth.get('itemtype.typecode'); //体检类型
            var chartResult = chartHealth.get('result'); //体检结果
            var chartResultAddtion = chartHealth.get('resultAddtion'); //低压
            var itemDate = chartHealth.get('examDateString'); //体检时间
            console.log("itemDate1111111",itemDate);
            //console.log("chartType is",chartType);
            //血压
            if (chartType == 'healthExamType1') {
                bloodListResult.push(chartResult);
                bloodListResultAddtion.push(chartResultAddtion);
                bloodDate.push(itemDate);
                bloodList.push(chartHealth);
            }
          });
          //获取最近一次体检结果
          var firstBlood=bloodList.get('lastObject');
          console.log("firstBlood222:",firstBlood);
          console.log("bloodListResult222:",bloodListResult);
          console.log("bloodListResultAddtion222:",bloodListResultAddtion);
          this.set('firstBlood',firstBlood);
          // 绘制血压图表
          bloodPress.setOption({
              title: {
                  text: '血压'
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
                  data: bloodListResultAddtion
              }]
          });
          var option = bloodPress.getOption();
          console.log("option is", option.series);

    },
    initChart() {
        var theWidth = document.documentElement.clientWidth;
        //初始化图表-血压
        // if (this.get("hasInitChart")) {
        //     return;
        // }
        // this.set("hasInitChart", true);
        // var pwBlood = ($("#health-area").width()) ;
        var pwBlood = theWidth ;
        console.log("pwBlood is:" + pwBlood);
        $("#bloodPress").width(pwBlood);
        var bloodPress = echarts.init(document.getElementById('bloodPress'));
        this.set("bloodPress", bloodPress);
        console.log("bloodPress:"+bloodPress);

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
            _self.get("mainController").switchMainPage(menuLink);
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
