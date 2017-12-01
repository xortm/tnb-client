import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';

export default Ember.Component.extend({
    statusService: Ember.inject.service("current-status"),
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    dataLoader: Ember.inject.service("data-loader"),
    service_PageConstrut: Ember.inject.service("page-constructure"),
    listShow: false, //弹框显示标识
    listContainer: true, //列表显示
    chartContainer: false, //图表显示
    listAccount: 0,
    bigFlag: false,
    hasRenderFlag: false, //是否渲染完毕
    reRenderFlag:0,
    statTypeAryFlag:0,
    dataListFlag:0,
    changeLargeClass: 'changeLarge',
    changeSmallClass: 'changeSmall',
    init: function() {
        this._super(...arguments);
        //this.get("service_PageConstrut").set("mainpageController",this);
        var _self = this;
        let statTypeCode = this.get("statTypeCode");
        this.sendAction("queryAction",statTypeCode);
        Ember.run.schedule("afterRender", this, function() {
            // _self.$().find("div[name='containerId']").on("webkitAnimationEnd", function() {
            //     console.log("webkitAnimationEnd in");
            //     if (_self.get('bigFlag')) {
            //         _self.$().find("div[name='containerId']").addClass('position-absolute');
            //         $(this).removeClass(_self.get("changeLargeClass"));
            //     } else {
            //         _self.$().find("div[name='containerId']").removeClass('position-absolute');
            //         $(this).removeClass(_self.get("changeSmallClass"));
            //     }
            //     _self.set("hasRenderFlag",true);
            //     // _self.didRenderAction();
            // });
            _self.set("hasRenderFlag",true);
        });

    },
    doQueryFlagObs:function(){
      let statTypeCode = this.get("statTypeCode");
      this.sendAction("queryAction",statTypeCode);
    }.observes("doQueryFlag"),
    didInsertElement: function() {
        console.log('querytypeList 是哪些', this.get('querytypeList'));
        //设置box-title
        var _self = this;
        var statTypeCode = this.get('statTypeCode'); //统计类型
        console.log('statTypeCode++++++', statTypeCode);
        var titleShow = this.get("dataLoader").findDict(statTypeCode);
        this.set('titleShow', titleShow.get("typename"));

        console.log('nextFlag', this.get('nextFlag'));
        var idName = 'myChart' + statTypeCode;
        this.set('idName', idName);
        var tbodyIdName = 'tbody' + statTypeCode; //tbody的id
        this.set('tbodyIdName', tbodyIdName);
        var getTbody = '#tbody' + statTypeCode;
        this.set('getTbody', getTbody);
        var containerId = 'container' + statTypeCode; //外面大容器的id
        this.set('containerId', containerId);
        var getContainerId = '#container' + statTypeCode; //外面大容器的id
        this.set('getContainerId', getContainerId);
        var getIdName = '#myChart' + statTypeCode;
        this.set('getIdName', getIdName);
        this.$().find("div[name='echartContainer']").attr('id', idName);
        this.$().find("div[name='containerId']").attr('id', containerId);
    },
    statTypeAryObs: function() {
        //构造每个统计类型对应的口径
        var _self = this;
        let querytypeList = this.get('querytypeList');
        if(!querytypeList){return;}
        let statTypeAry = [];
        console.log('接收到的:querytypeList', this.get('statTypeCode') + ':' + querytypeList);
        if(!querytypeList){
          return ;
        }
        let statTypeAryList = querytypeList.filter(function(statquerytype) {
            return statquerytype.get('statType.typecode') == _self.get('statTypeCode');
        });
        console.log('重新计算的statTypeAryList:', this.get('statTypeCode') + ':' + statTypeAryList);
        statTypeAryList.forEach(function(statType) {
            statTypeAry.push(statType.get('statItem.typecode'));
        });
        console.log('计算得到的statTypeAry是:', this.get('statTypeCode') + ':' + statTypeAry);
        this.set('statTypeAry', statTypeAry);
        this.incrementProperty("statTypeAryFlag");
    }.observes('querytypeList').on("init"),
    dataListObs: function() {
        //构造每个统计类型对应的口径
        var _self = this;
        let statTypeCode = this.get("statTypeCode");
        let dataList = this.get('dataList');
        console.log("dataList in echart:",statTypeCode,dataList);
        if(!dataList){return;}
        //根据口径类型区分数据
        let mapData = new Ember.A();
        let mapDate= new Ember.A();
        let allNum= new Ember.A();
        //拼data数据
        dataList.forEach(function(data){
          var statResult=data.get('statResult');//结果数据
          var statDate=data.get('statDate');//结果日期(时间戳)
          var statItemTypecode=data.get('statItemType.typecode');//口径类型-code
          let typecode = mapData[statItemTypecode];
          if(!typecode){
            let array = [];
            array.push(statResult);
            allNum[statItemTypecode] = statResult;
            mapData[statItemTypecode]=array;
          }else{
            let array = mapData[statItemTypecode];
            allNum[statItemTypecode] += statResult;
            array.push(statResult);
          }
          //日期
          if(!typecode){
            let array = [];
            array.push(statDate);
            mapDate[statItemTypecode]=array;
          }else {
            let array = mapDate[statItemTypecode];
            if(array.indexOf(statDate)<0){
              array.push(statDate);
            }
          }
        });
        _self.set('mapData',mapData);
        console.log('shujushi',mapData);
        _self.set('mapDate',mapDate);
        console.log('shijianshi',mapDate);
        _self.set('dataList',dataList);
        console.log('allNum after',allNum);
        _self.set('allNum',allNum);

        if(dataList){
          var nextFlag=0;
          nextFlag=++nextFlag;
          _self.set('nextFlag',nextFlag);
          console.log('nextFlag对不对',nextFlag);
        }
        this.incrementProperty("dataListFlag");
    }.observes("dataList"),
    didRenderAction: function() {
        this.initChart();
        this.showChartData();
        //this.computedList();

    },
    reRenderObs: function(){
      this.didRenderAction();
    }.observes("reRenderFlag"),
    didRenderObs: function(){
      if ((!this.get('hasRenderFlag')) || (!this.get('dataListFlag')) || (!this.get('statTypeAryFlag')) || (!this.get('chartContainer'))) {
          return;
      }
      this.didRenderAction();
    }.observes("hasRenderFlag","statTypeAryFlag","dataListFlag"),
    initChart: function() {
        var containerId = this.get('containerId');
        var getContainerId = this.get('getContainerId');
        var idName = this.get('idName');
        var getIdName = this.get('getIdName');
        var pw = ($(getContainerId).width());
        console.log('大容器的宽度是', pw);
        //初始化图表
        console.log('chartName is', idName);
        $(getIdName).width(pw);
        var myChart = echarts.init(document.getElementById(idName));
        console.log('init myChart is', myChart);
        this.set("myChart", myChart);

    }, //.observes('nextFlag')
    showChartData: function() {
        var _self = this;
        if (!this.get('dataListFlag') || !this.get('statTypeAry')) {
            return;
        }
        console.log("statTypeAryFlag in showChartData:",this.get('statTypeAryFlag'));
        var statTypeAry = this.get('statTypeAry');
        console.log('填充数据statTypeAry是', statTypeAry);
        var nameAry = []; //口径类型对应的名称
        statTypeAry.forEach(function(statType) {
            console.log('statType is?', statType);
            let dictObj = _self.get("dataLoader").findDict(statType);
            //如果dictObj为空，则name为空字符
            console.log('dictObj is', dictObj);
            var name='';
            if(dictObj){
              name = dictObj.get('typename');
            }

            nameAry.push(name);
        });
        //获取时间数组
        var durTypeFlag = this.get('durTypeFlag');
        var statTypeCode = this.get('statTypeCode');
        var echartType = this.get('echartType');
        var code = statTypeAry[0];
        //console.log('start-analytic:code', statTypeCode);
        var mapDate = this.get('mapDate');
        var dateAry = mapDate[code];
        //dateAry=dateAry.sort();
        if (!dateAry) {
            return;
        }
        var realDateAry = [];
        var realDate = null;
        //this.set('dateAry', dateAry);
        dateAry.forEach(function(date) {
            date = _self.get('dateService').timestampToTime(date);
            if (durTypeFlag == 'year') {
                realDate = date.getFullYear() + '年';
            }
            if (durTypeFlag == 'season') {
                if ((date.getMonth() + 1) == 1) {
                    realDate = date.getFullYear() + '年' + ':第一季度';
                }
                if ((date.getMonth() + 1) == 4) {
                    realDate = date.getFullYear() + '年' + ':第二季度';
                }
                if ((date.getMonth() + 1) == 7) {
                    realDate = date.getFullYear() + '年' + ':第三季度';
                }
                if ((date.getMonth() + 1) == 10) {
                    realDate = date.getFullYear() + '年' + ':第四季度';
                }
            }
            if (durTypeFlag == 'mouth') {
                realDate = date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
            }
            if (durTypeFlag == 'day') {
                realDate = _self.get("dateService").formatDateString(date);
            }
            realDateAry.push(realDate);
        });
        //构造-series(数组对象)
        var series = [];
        let pieDataAry = [];
        let radarDataAry = [];
        var mapData = this.get('mapData'); //结果数据对象
        console.log("mapData in foreach:",mapData);
        var chartType = this.get('chartType'); //图表类型
        let tooltip = {}; //鼠标悬浮显示信息
        let legend = {}; //图例
        let radar = {}; //雷达图的外围框
        let toolbox = {}; //堆叠区域图
        statTypeAry.forEach(function(statType) { //循环得到每一个口径类型的code
            let totalData = 0;
            let totalDataAry = [];
            mapData[statType].forEach(function(item) {
                totalData += parseInt(item);
            });
            console.log('总的数据和是：totalData', totalData);
            totalDataAry.push(totalData);
            var dictObj = _self.get("dataLoader").findDict(statType);
            //如果dictObj为空的话，则构造设置name为空字符串
            var dictObjTypename='';
            if(dictObj){
              dictObjTypename=dictObj.get('typename');
            }
            //构造饼图的数据
            var pieObj = {
                value: totalData,
                name: dictObjTypename
            };
            pieDataAry.push(pieObj);
            console.log('pieDataAry is', pieDataAry);

          // } else if (statTypeCode == 'statType5' || statTypeCode == 'statType18' || statTypeCode == 'statType21' || statTypeCode == 'statType22' || statTypeCode == 'statType23') {
          if(echartType == "type1"){
            let obj = {
                name: dictObjTypename,
                type: chartType,
                stack: '总量',
                areaStyle: {
                    normal: {}
                },
                data: mapData[statType]
            };
            series.push(obj);
          } else if(echartType == "type2"){
            let obj = {
                name: dictObjTypename,
                type: chartType,
                data: mapData[statType]
            };
            series.push(obj);
          }
          console.log(_self.get('statTypeCode') + 'series', series);
          //拼接X轴数据和Y轴数据
          var xAxis = {};
          var yAxis = {};
          if(echartType == "type1"){
            xAxis = [{
                type: 'category',
                boundaryGap: false,
                data: realDateAry //x轴(时间)
            }];
            yAxis = [{
                type: 'value',
            }];
          } else if(echartType == "type2"){
            xAxis = {
                type: 'category',
                boundaryGap: false,
                data: realDateAry //x轴(时间)
            };
            yAxis = {
                type: 'value',
                data: nameAry
            };
          }
          tooltip = {
              trigger: 'axis',
              axisPointer: {
                  type: 'shadow'
              }
          };
          legend = {
              data: nameAry
          };
          radar = null;
          if(echartType == "type1"){
            toolbox = {
                feature: {
                    saveAsImage: {}
                }
            };
          } else if(echartType == "type2"){
            toolbox = null;
          }
          //绘制图表
          var myChart = _self.get('myChart');
          myChart.setOption({
              title: {
                  text: '',
                  subtext: '',
                  x: 'center'
              },
              tooltip: tooltip,
              legend: legend,
              radar: radar,
              toolbox: toolbox,
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
              },
              xAxis: xAxis,
              yAxis: yAxis,
              series: series

          });
          var option = myChart.getOption();
          console.log("option is", option.series);
          console.log('option is:tooltip', option.tooltip);
        });
      },

      computedList: function() {
        //构造ember(口径名称数组)
        var _self = this;
        if (!this.get('dataListFlag') || !this.get("statTypeAryFlag") || !this.get("hasRenderFlag")) {
          return;
        }
        var statTypeAry = this.get('statTypeAry'); //口径类型对应的数组(普通数组)
        var statItemAry = new Ember.A(); //口径类型对应的名称
        statTypeAry.forEach(function(statType, index) {
          console.log('++++++=index,', index);
          console.log('statType is?', statType);
          let dictObj = _self.get("dataLoader").findDict(statType);
          console.log('dictObj is', dictObj);
          //判断如果dictObj为空的话，则name为空字符串
          var name='';
          if(dictObj){
            name = dictObj.get('typename');
          }
          let itemObj = Ember.Object.extend({
            index: name
          });
          statItemAry.pushObject(itemObj.create());
          console.log('statItemAry+++++is', statItemAry);
        });
        this.set('statItemAry', statItemAry);
        //构造tr之前判断是否有tr
        var getTbody = this.get('getTbody');
        if ($(getTbody + ' tr').length === 0) {
          console.log('没有元素', $(getTbody + '>tr').length);
        } else {
          //alert('有元素');
          console.log('有元素', $(getTbody + '>tr').length);
          $(getTbody).empty();
        }
        //构造数据(tbody)-tr
        //获取时间数组

        var statTypeCode = this.get('statTypeCode');
        console.log('列表里面：statTypeAry', this.get('statTypeAry'));
        var code = statTypeAry[0];
        console.log('start-analytic:code', code);
        var mapDate = this.get('mapDate');
        console.log('start-analytic:mapDate', mapDate);
        var dateAry = mapDate[code];
        console.log('dateAry is', dateAry);
        let typeItems = new Ember.A(); //构建数组
        if (!dateAry) { //dateAry不存在的时候：阻止报错
          return;
        }
        var allNum = this.get('allNum');
        let dateLength = dateAry.get("length");
        console.log("dateLength",dateLength);
        console.log("dateLength allNum",allNum);
        console.log("dateLength allNum arr",allNum[code]);
        let averageNum = new Ember.A();
        statTypeAry.forEach(function(statType, index) {
          let item = Ember.Object.create({
            typecode:statType,
          });
          let num = allNum[statType];
          let average = 0;
          if(num !== 0){
            average = Math.round(num / dateLength * 100) / 100.00;
          }
          item.set("num",num);
          item.set("average",average);
          averageNum.pushObject(item);
        });
        console.log("averageNum:",averageNum);
        let addAry = new Ember.A();
        let allItem = Ember.Object.create({
          dataTr:"all",
          nameStr:"总计",
        });
        let averageItem = Ember.Object.create({
          dataTr:"average",
          nameStr:"平均值",
        });
        addAry.pushObject(allItem);
        addAry.pushObject(averageItem);
        dateAry.forEach(function(date, index) { //有几个时间就创建几个tr
          let typeItem = Ember.Object.extend({
            seq: index,
            date: date,
            dateShowItem: Ember.computed('date', function() {
              var date = this.get('date');
              var durTypeFlag = _self.get('durTypeFlag');
              date = _self.get('dateService').timestampToTime(date);
              if (durTypeFlag == 'year') {
                return date.getFullYear() + '年';
              }
              if (durTypeFlag == 'season') {
                if ((date.getMonth() + 1) == 1) {
                  return date.getFullYear() + '年' + ':第一季度';
                }
                if ((date.getMonth() + 1) == 4) {
                  return date.getFullYear() + '年' + ':第二季度';
                }
                if ((date.getMonth() + 1) == 7) {
                  return date.getFullYear() + '年' + ':第三季度';
                }
                if ((date.getMonth() + 1) == 10) {
                  return date.getFullYear() + '年' + ':第四季度';
                }
              }
              if (durTypeFlag == 'mouth') {
                return date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
              }
              if (durTypeFlag == 'day') {
                return _self.get("dateService").formatDateString(date);
              }
            }),

          });
          var typeItem2 = typeItem.create(); //每一个tr
          var typeItemCode = typeItem2.get('date');
          let nodeType = $('<tr style="cursor:default;" typecode=' + typeItem2.get('date') + '></tr>');
          console.log('tr is', nodeType);
          $(getTbody).append(nodeType);
          var firstTd = $('<td class="ellipsis center text-nowrap noBorder">' + typeItem2.get('dateShowItem') + '</td>'); //第一列显示的时间
          let tbody = $(getTbody);
          tbody.find("tr[typecode='" + typeItemCode + "']").append(firstTd);
          //tbody.$("tr[typecode='" + typeItemCode + "']").append(firstTd);
          //构建seqItems(td)
          let seqItems = new Ember.A(); //构建数组
          let dataList = _self.get('dataList'); //请求得到的所有数据
          console.log('所有的数据', dataList);
          console.log('所有的statTypeAry是', statTypeAry);
          statTypeAry.forEach(function(statType, index) {
            console.log('statType is', statType);
            let seqItem = Ember.Object.extend({
              seq: statType,
            });
            var seqItem2 = seqItem.create();
            let nodeSeq = $('<td class="ellipsis center text-nowrap noBorder" seq=' + seqItem2.get("seq") + '></td>');
            let tbody = $(getTbody);
            tbody.find("tr[typecode='" + typeItemCode + "']").append(nodeSeq);
          });
        });
        addAry.forEach(function(date, index) { //有几个时间就创建几个tr
          let nodeType = $('<tr class="mobel" style="cursor:default;" typecode=' + date.get('dataTr') + '></tr>');
          console.log('tr is', nodeType);
          $(getTbody).append(nodeType);
          var firstTd = $('<td class="ellipsis center text-nowrap noBorder">' + date.get('nameStr') + '</td>'); //第一列显示的时间
          let tbody = $(getTbody);
          tbody.find("tr[typecode='" + date.get('dataTr') + "']").append(firstTd);
          //构建seqItems(td)
          let seqItems = new Ember.A(); //构建数组
          console.log('所有的statTypeAry是', statTypeAry);
          statTypeAry.forEach(function(statType, index) {
            console.log('statType is', statType);
            let seqItem = Ember.Object.extend({
              seq: statType,
            });
            var seqItem2 = seqItem.create();
            let nodeSeq = $('<td class="ellipsis center text-nowrap noBorder" seq=' + seqItem2.get("seq") + '></td>');
            let tbody = $(getTbody);
            tbody.find("tr[typecode='" + date.get('dataTr') + "']").append(nodeSeq);
          });
        });
        let dataList = _self.get('dataList'); //请求得到的所有数据
        console.log('所有数据是哪些', dataList);
        dataList.forEach(function(data) {
          let seq = data.get("statItemType.typecode");
          let code = data.get("statDate");
          let tbody = $(getTbody);
          tbody.find("tr[typecode='" + code + "']" + " td[seq='" + seq + "']").html(data.get("statResult"));
        });
        averageNum.forEach(function(data) {
          let seq = data.get("typecode");
          let num = data.get("num");
          let tbody = $(getTbody);
          tbody.find("tr[typecode='all']" + " td[seq='" + seq + "']").html(num);
        });
        averageNum.forEach(function(data) {
          let seq = data.get("typecode");
          let average = data.get("average");
          let tbody = $(getTbody);
          tbody.find("tr[typecode='average']" + " td[seq='" + seq + "']").html(average);
        });
      }.observes('hasRenderFlag','statTypeAryFlag','dataListFlag'),

    actions:{
      listClick: function() { //点击显示列表
          this.set('listContainer', true);
          this.set('chartContainer', false);
      },
      chartClick: function() {
          this.set('listContainer', false);
          this.set('chartContainer', true);
          this.didRenderAction();
      },
      bigClick: function(params) {
          if (this.get('bigFlag')) {
              this.set('bigFlag', false);
          } else {
              this.set('bigFlag', true);
          }
      }

    }








});
