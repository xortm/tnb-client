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
    listContainer: false, //列表显示
    chartContainer: true, //图表显示
    listAccount: 0,
    bigFlag: false,
    hasRenderFlag: false, //是否渲染完毕
    reRenderFlag:0,
    statTypeAryFlag:0,
    changeLargeClass: 'changeLarge',
    changeSmallClass: 'changeSmall',
    init: function() {
        this._super(...arguments);
        //this.get("service_PageConstrut").set("mainpageController",this);
        var _self = this;
        Ember.run.schedule("afterRender", this, function() {
            _self.$().find("div[name='containerId']").on("webkitAnimationEnd", function() {
                console.log("webkitAnimationEnd in");
                if (_self.get('bigFlag')) {
                    _self.$().find("div[name='containerId']").addClass('position-absolute');
                    $(this).removeClass(_self.get("changeLargeClass"));
                } else {
                    _self.$().find("div[name='containerId']").removeClass('position-absolute');
                    $(this).removeClass(_self.get("changeSmallClass"));
                }
                _self.set("hasRenderFlag",true);
                // _self.didRender();
            });
        });

    },
    didInsertElement: function() {
        console.log('querytypeList 是哪些', this.get('querytypeList'));
        //设置box-title
        var _self = this;
        var statTypeCode = this.get('statTypeCode'); //统计类型
        console.log('statTypeCode++++++', statTypeCode);
        var titleShow = this.get("dataLoader").findDict(statTypeCode);
        this.set('titleShow', titleShow);

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
        if(!querytypeList || !this.get('mapDate')){return;}
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
    }.observes('querytypeList',"mapDate"),
    didRender: function() {
        this.initChart();
        this.showChartData();
        //this.computedList();

    },
    reRenderObs: function(){
      this.didRender();
    }.observes("reRenderFlag"),
    didRenderObs: function(){
      if ((!this.get('hasRenderFlag')) || (!this.get('mapDate')) || (!this.get('statTypeAryFlag'))) {
          return;
      }
      this.didRender();
    }.observes("hasRenderFlag","statTypeAryFlag","mapDate"),
    // doQuery: function() {
    //     var _self = this;
    //     var fildurTypeFlag = null;
    //     var statTypeCode = this.get('statTypeCode'); //统计类型(code)
    //     console.log('start-analytic:statTypeCode', statTypeCode);
    //     var durTypeFlag = this.get('durTypeFlag'); //统计区间,1:年 2季 3月 4周 5日
    //     if (durTypeFlag == 'year') {
    //         fildurTypeFlag = 1;
    //     }
    //     if (durTypeFlag == 'season') {
    //         fildurTypeFlag = 2;
    //     }
    //     if (durTypeFlag == 'mouth') {
    //         fildurTypeFlag = 3;
    //     }
    //     if (durTypeFlag == 'day') {
    //         fildurTypeFlag = 5;
    //     }
    //     var beginDate = this.get('beginDate'); //开始日期
    //     console.log('start-analytic:beginDate', beginDate);
    //     var endDate = this.get('endDate'); //结束日期
    //     //computed：季度-时间
    //     var beginseaconDate = this.get('beginseaconDate');
    //     var endseaconDate = this.get('endseaconDate');
    //     var beginseaconFlag = this.get('beginseaconFlag');
    //     var endseaconFlag = this.get('endseaconFlag');
    //     var begincurDate = null; //开始季度的第一个月第一天第一秒时间戳
    //     var beginYear = null;
    //     if (beginseaconDate) {
    //         beginYear = parseInt(beginseaconDate.getFullYear()); //年份
    //     }
    //     var beginMouth = null; //月份
    //     if (beginseaconFlag == 'beginone') { //第一季度
    //         beginMouth = 1; //月份
    //         begincurDate = this.get("dateService").getFirstSecondStampOfMonth(beginYear, beginMouth);
    //     }
    //     if (beginseaconFlag == 'beginsecond') { //第二季度
    //         beginMouth = 4; //月份
    //         begincurDate = this.get("dateService").getFirstSecondStampOfMonth(beginYear, beginMouth);
    //     }
    //     if (beginseaconFlag == 'beginthird') { //第三季度
    //         beginMouth = 7; //月份
    //         begincurDate = this.get("dateService").getFirstSecondStampOfMonth(beginYear, beginMouth);
    //     }
    //     if (beginseaconFlag == 'beginfour') { //第四季度
    //         beginMouth = 10; //月份
    //         begincurDate = this.get("dateService").getFirstSecondStampOfMonth(beginYear, beginMouth);
    //     }
    //     //-------------  结束-季度
    //     var endcurDate = null; //结束季度的第一个月第一天第一秒时间戳
    //     var endYear = null;
    //     if (endseaconDate) {
    //         endYear = parseInt(endseaconDate.getFullYear()); //年份
    //     }
    //     var endMouth = null; //月份
    //     if (endseaconFlag == 'endone') { //第一季度
    //         endMouth = 1; //月份
    //         endcurDate = this.get("dateService").getFirstSecondStampOfMonth(beginYear, endMouth);
    //     }
    //     if (endseaconFlag == 'endsecond') { //第二季度
    //         endMouth = 4; //月份
    //         endcurDate = this.get("dateService").getFirstSecondStampOfMonth(beginYear, endMouth);
    //     }
    //     if (endseaconFlag == 'endthird') { //第三季度
    //         endMouth = 7; //月份
    //         endcurDate = this.get("dateService").getFirstSecondStampOfMonth(beginYear, endMouth);
    //     }
    //     if (endseaconFlag == 'endfour') { //第四季度
    //         endMouth = 10; //月份
    //         endcurDate = this.get("dateService").getFirstSecondStampOfMonth(beginYear, endMouth);
    //     }
    //     var chartType = this.get('chartType'); //图表类型(比传)
    //     //统计区间：年 月 日
    //     if (beginDate && endDate) {
    //         this.get('store').query('statquery', {
    //             filter: {
    //                 '[statType][typecode]': statTypeCode,
    //                 'durType': fildurTypeFlag,
    //                 'beginTime': beginDate,
    //                 'endTime': endDate,
    //             }
    //         }).then(function(dataList) {
    //             _self.set('dataList', dataList);
    //         });
    //     }
    //     //统计区间：季度
    //     if (beginseaconDate && endseaconDate) {
    //         this.get('store').query('statquery', {
    //             filter: {
    //                 '[statType][typecode]': statTypeCode,
    //                 'durType': fildurTypeFlag,
    //                 'beginTime': begincurDate,
    //                 'endTime': endcurDate,
    //             }
    //         }).then(function(dataList) {
    //             _self.set('dataList', dataList);
    //         });
    //     }
    // },
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
        if ((!this.get('mapData')) || (!this.get('mapDate')) || (!this.get('statTypeAry'))) {
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
        var code = statTypeAry[0];
        //console.log('start-analytic:code', statTypeCode);
        var mapDate = this.get('mapDate');
        //console.log('start-analytic:mapDate', mapDate);
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
            //构造雷达图的数据
            var radarObj = {
                value: totalDataAry,
                name: '实际退住人数'
            };
            radarDataAry.push(radarObj);
            //-------------------------------
            if (chartType == 'bar') {
                let obj = {
                    name: dictObjTypename,
                    type: chartType,
                    data: totalDataAry
                };
                series.push(obj);
            } else if (chartType == 'pie') {
                //if (statTypeCode == 'statType7') {//玫瑰图
                if (false) {
                    let obj = {
                        name: '半径模式',
                        radius: [20, 110],
                        center: ['25%', '50%'],
                        roseType: 'radius',
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        lableLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        type: chartType,
                        data: pieDataAry
                    };
                    let obj2 = {
                        name: '面积模式',
                        type: 'pie',
                        radius: [30, 110],
                        center: ['75%', '50%'],
                        roseType: 'area',
                        data: pieDataAry
                    };
                    series.push(obj);
                    series.push(obj2);
                } else if (statTypeCode == 'statType5' || statTypeCode == 'statType18' || statTypeCode == 'statType21' || statTypeCode == 'statType22' || statTypeCode == 'statType23') {
                    let obj = {
                        type: chartType,
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: pieDataAry,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    };
                    series.push(obj);
                    //series=series.reverse();
                } else {
                    let obj = {
                        //name: dictObj.get('typename'),
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        type: chartType,
                        data: pieDataAry
                    };
                    series.push(obj);
                }
            } else if (chartType == 'radar') {
                //pieDataAry
                let obj = {
                    name: dictObjTypename,
                    type: chartType,
                    data: radarDataAry
                };
                series.push(obj);
            } else {
                if (statTypeCode == 'statType14') {
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
                } else {
                    let obj = {
                        name: dictObjTypename,
                        type: chartType,
                        data: mapData[statType]
                    };
                    series.push(obj);
                }
            }
        });
        console.log(_self.get('statTypeCode') + 'series', series);
        //拼接X轴数据和Y轴数据
        var xAxis = {};
        var yAxis = {};
        if (chartType == 'bar') {
            xAxis = {
                type: 'category',
                boundaryGap: false,
                data: [] //x轴(时间)
            };
            yAxis = {
                type: 'value',
                data: realDateAry
            };
        } else if (chartType == 'pie' || chartType == 'radar') {
            xAxis = null;
            yAxis = null;
        } else {
            if (statTypeCode == 'statType14') {
                xAxis = [{
                    type: 'category',
                    boundaryGap: false,
                    data: realDateAry //x轴(时间)
                }];
                yAxis = [{
                    type: 'value',
                }];
            } else {
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
        }
        console.log(_self.get("statTypeCode") + ' series is', series);
        //拼接 tooltip
        if (chartType == 'pie') {
            tooltip = {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            };
        } else if (chartType == 'radar') {
            tooltip = {};
        } else if (chartType == 'bar' || chartType == 'line') {
            tooltip = {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            };
        }
        //else if(chartType == 'line'){
        //   tooltip = {
        //       trigger: 'axis',
        //       axisPointer: {
        //           type: 'cross',
        //           label: {
        //               backgroundColor: '#6a7985'
        //           }
        //       }
        //   };
        // }
        //拼接 legend
        if (chartType == 'radar') {
            legend = {
                orient: 'vertical',
                x: 'left',
                data: ['实际退住人数']
            };
            radar = {
                indicator: [{
                        name: '老人离世',
                        max: 6500
                    },
                    {
                        name: '因病就医',
                        max: 16000
                    },
                    {
                        name: '价格过高',
                        max: 30000
                    },
                    {
                        name: '服务不满意',
                        max: 38000
                    },
                    {
                        name: '回家居住',
                        max: 52000
                    },
                    {
                        name: '其他原因',
                        max: 25000
                    }
                ]
            };
        } else {
            legend = {
                data: nameAry
            };
            radar = null;
        }
        //构造 toolbox
        if (statTypeCode == 'statType14') {
            toolbox = {
                feature: {
                    saveAsImage: {}
                }
            };
        } else {
            toolbox = null;
        }
        //绘制图表
        var myChart = this.get('myChart');
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
    }, //.observes('nextFlag')
    computedList: function() {
        //构造ember(口径名称数组)
        var _self = this;
        if ((!this.get('mapData')) || (!this.get('mapDate')) || (!this.get("statTypeAryFlag"))) {
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
        let dataList = _self.get('dataList'); //请求得到的所有数据
        console.log('所有数据是哪些', dataList);
        dataList.forEach(function(data) {
            let seq = data.get("statItemType.typecode");
            let code = data.get("statDate");
            let tbody = $(getTbody);
            tbody.find("tr[typecode='" + code + "']" + " td[seq='" + seq + "']").html(data.get("statResult"));
        });
    }.observes('statTypeAryFlag','mapDate'),
    // computedBigFlag:function(){
    //   var bigFlag=this.get('bigFlag');
    //   console.log('监控的bigFlag is',bigFlag);
    //   if(bigFlag){
    //     this.$().find("div[name='containerId']").addClass('position-absolute');
    //     // this.$().find("div[name='containerId']").animate({
    //     //   backgroundPosition:'absolute',
    //     //   zIndex:'5'
    //     // },600);
    //   }else {
    //     this.$().find("div[name='containerId']").removeClass('position-absolute');
    //     // this.$().find("div[name='containerId']").animate({
    //     //   backgroundPosition:'none',
    //     //   zIndex:'0'
    //     // },600);
    //   }
    //
    // }.observes('bigFlag'),
    actions: {
        setClick: function() { //点击设置
            if (this.get('listShow')) {
                this.set('listShow', false); //弹框显示标识
                return;
            }
            this.set('listShow', true);
        },
        listClick: function() { //点击显示列表
            this.set('listShow', false);
            this.set('listContainer', true);
            this.set('chartContainer', false);
            var listAccount = this.get('listAccount');
            listAccount = ++listAccount;
            this.set('listAccount', listAccount);
        },
        chartClick: function() {
            this.set('listShow', false);
            this.set('listContainer', false);
            this.set('chartContainer', true);
        },
        bigClick: function(params) {
            if (this.get('bigFlag')) {
                this.set('bigFlag', false);
            } else {
                this.set('bigFlag', true);
            }
        }
    },

});
