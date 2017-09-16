import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Echarts from "npm:echarts";
import Changeset from 'ember-changeset';
import HealthValidations from '../../validations/health';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Component.extend(HealthValidations,{
    textShow: true,
    informationShow: true,
    bloodShow: false, //血压显示
    heartShow: false, //心率显示
    analysisShow:false,//尿液分析显示
    OxygenShow:false,//血氧显示(血氧值、脉搏)
    bloodFatShow:false,//血脂显示
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
    tableSelector:'datatable2_wrapper',
    statusService: Ember.inject.service("current-status"),
    global_curStatus: Ember.inject.service("current-status"),
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    dataLoader: Ember.inject.service("data-loader"),
    healthModel:Ember.computed("health",function(){
      var model = this.get("health");
      if (!model) {
        return null;
      }
      return new Changeset(model, lookupValidator(HealthValidations), HealthValidations);
    }),
    defaultTypeName:Ember.computed('health.itemtype',function(){
      let health = this.get('health');
      let name;
      if(health.get('itemtype.typename')){
        return health.get('itemtype.typename');
      }else{
        return '体检结果';
      }
    }),
    // init() {
    //     this._super(...arguments);
    //     let model = this.get("store").createRecord('health-info', {});
    //     // this.set("customerInComp",model);
    //     this.health = model;
    // },
    healthTypeList:Ember.computed(function(){
      let list = new Ember.A();
      let pressure = this.get('dataLoader').findDict('healthExamType1');//血压
      list.pushObject(pressure);
      let oxygen = this.get('dataLoader').findDict('healthExamType2');//血氧
      list.pushObject(oxygen);
      let pulse = this.get('dataLoader').findDict('healthExamType3');//心率
      list.pushObject(pulse);
      let breathing = this.get('dataLoader').findDict('healthExamType4');//呼吸
      list.pushObject(breathing);
      let temperature = this.get('dataLoader').findDict('healthExamType5');//体温
      list.pushObject(temperature);
      let bloodSugar = this.get('dataLoader').findDict('healthExamType7');//血糖
      list.pushObject(bloodSugar);
      return list;
    }),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.customer-info');
        //route.refresh();
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    // itemTypelObs:function(){
    //   var _self=this;
    //   var itemtypeCode=this.get("itemtypeCode");
    //   var filter = {};
    //   if (this.get('customerInComp.id')) {
    //       filter = $.extend({}, filter, {
    //           '[examUser][id]': this.get('customerInComp.id')
    //       });
    //   }
    //   if(itemtypeCode){
    //     filter = $.extend({}, filter, {
    //         '[itemtype][typecode]': itemtypeCode
    //     });
    //     this.get("store").query('health-info', {
    //         filter: filter,
    //         sort: {
    //             '[examDateTime]': 'asc'
    //         },
    //     }).then(function(bloodList) {
    //         _self.set('lastHealth', bloodList.get('lastObject'));
    //         console.log("lastHealth is", _self.get("lastHealth"));
    //     });
    //   }
    // }.observes("itemtypeCode"),
    doQuery: function() {
        var _self = this;
        var filter = {};
        //var flag = this.get("flag");
        var sort;
        //按照id来查询
        if (this.get('customerInComp.id')) {
            filter = $.extend({}, filter, {
                '[examUser][id]': this.get('customerInComp.id')
            });
        }

        this.get("store").query('health-info', {
            filter: filter
        }).then(function(healthChartList) {
          healthChartList=healthChartList.sortBy("examDateTime");
            _self.set('healthChartList', healthChartList);
            console.log('healthChartList is',healthChartList);
            _self.initChart();
            _self.showChartData();
        });
    },
    doQueryHealth: function() {
        var _self = this;
        var filter = {};
        var customerInComp = this.get('customerInComp');
        console.log("customerInComp health is", this.get('customerInComp'));
        filter = $.extend({}, filter, {
            'customerId': customerInComp.get('id')
        }, {
            'healthInfoQueryType': 'healthAll'
        });
        this.get("store").query('health-info', {
            filter: filter,
        }).then(function(healthList) {
            _self.set('healthList', healthList);
            console.log('healthList health agin is', healthList);
            //关闭loading显示
            var mainpageController = App.lookup('controller:business.mainpage');
            if(_self.get("tableSelector")){
              mainpageController.removeTableLoading($(_self.get("tableSelector")));
            }
            let timeAry = new Ember.A();//构建时间数组
            for(let i=0;i<35;i++){
              let timeItem = Ember.Object.extend({
                seq:i,
                timeValue:Ember.computed('seq',function(){
                  var seq=this.get('seq');
                  if(seq%5=='0'){
                    return '0:00-05:59';
                  }
                  if(seq%5=='1'){
                    return '06:00-9:59';
                  }
                  if(seq%5=='2'){
                    return '10:00-13:59';
                  }
                  if(seq%5=='3'){
                    return '14:00-17:59';
                  }
                  if(seq%5=='4'){
                    return '18:00-23:59';
                  }
                })
              });
              timeAry.push(timeItem.create());
            }
            _self.set('timeAry',timeAry);
            //构建typeItems(tr)
            let typeItems = new Ember.A();//构建数组
            let todayDate = new Date();
            let length;
            if(_self.get('statusService.isJujia')){
              length = 13;
            }else{
              length = 6;
            }
            for(let i=0;i<length;i++){
              let typeItem = Ember.Object.extend({
                seq:i,
                statusService:_self.get('statusService.isJujia'),
                typecode:Ember.computed('seq','statusService',function(){
                  var seq=this.get('seq');
                  let statusService = this.get('statusService');
                  if(seq=='0'){
                    return 'healthExamType1';
                  }
                  if(seq=='1'){
                    return 'healthExamType2';
                  }
                  if(seq=='2'){
                    return 'healthExamType3';
                  }
                  if(seq=='3'){
                    return 'healthExamType4';
                  }
                  if(seq=='4'){
                    return 'healthExamType5';
                  }
                  if(seq=='5'){
                    return 'healthExamType7';
                  }
                  if(statusService){
                    if(seq=='6'){
                      return 'healthExamType6';
                    }

                    if(seq=='7'){
                      return 'healthExamType8';
                    }
                    if(seq=='8'){
                      return 'healthExamType9';
                    }
                    if(seq=='9'){
                      return 'healthExamType10';
                    }
                    if(seq=='10'){
                      return 'healthExamType11';
                    }
                    if(seq=='11'){
                      return 'healthExamType12';
                    }
                    if(seq=='12'){
                      return 'healthExamType13';
                    }
                  }
                }),
                typeName:Ember.computed('seq',function(){
                  var seq=this.get('seq');
                  let statusService = this.get('statusService');
                  if(seq=='0'){
                    return '血压(mmHg)';
                  }
                  if(seq=='1'){
                    return '血氧(%)';
                  }
                  if(seq=='2'){
                    return '心率(times/min)';
                  }
                  if(seq=='3'){
                    return '呼吸频率(times/min)';
                  }
                  if(seq=='4'){
                    return '体温(℃)';
                  }
                  if(seq=='5'){
                    return '血糖(mmol/L)';
                  }
                  if(statusService){
                    if(seq=='6'){
                      return '体重(kg)';
                    }

                    if(seq=='7'){
                      return '餐前血糖(mmol/L)';
                    }
                    if(seq=='8'){
                      return '餐后血糖(mmol/L)';
                    }
                    if(seq=='9'){
                      return '脂肪数据(g/100g)';
                    }
                    if(seq=='10'){
                      return '心电图';
                    }
                    if(seq=='11'){
                      return '尿液分析';
                    }
                    if(seq=='12'){
                      return '血脂';
                    }
                  }
                })
              });
              //构建tr
              var typeItem2=typeItem.create();
              var typeItemCode=typeItem2.get('typecode');
              console.log('typeItem2++++',typeItem2);
              console.log('typeItem.typecode++++',typeItem2.get('typecode'));
              let nodeType=$('<tr style="cursor:default;" typecode='+typeItem2.get('typecode')+'></tr>');
               $("#tbody").append(nodeType);
               var firstTd=$('<td class="ellipsis center text-nowrap">'+typeItem2.get('typeName')+'</td>');
               $("#tbody tr[typecode='" + typeItemCode + "']").append(firstTd);
               //构建seqItems(td)
               let seqItems = new Ember.A();//构建数组
               for(let i=0;i<35;i++){
                 let seqItem = Ember.Object.extend({
                   seq:i,
                 });
                 var seqItem2=seqItem.create();
                //  if(typeItemCode=='healthExamType12'||typeItemCode=='healthExamType13'||typeItemCode=='healthExamType1'||typeItemCode=='healthExamType2'){
                //    let nodeSeq=$('<td class="ellipsis center text-nowrap extend pointer" imgUrl="" data-toggle="tooltip" style="max-width:80px;" seq='+seqItem2.get("seq")+'></td>');
                //    $("#tbody tr[typecode='" + typeItemCode + "']").append(nodeSeq);
                //    nodeSeq.click(function(){
                //      let url=$(this).attr('imgUrl');
                //     //  _self.set('health.edit',false);
                //      _self.set('health',_self.get('store').createRecord('health-info',{}));
                //      _self.set('showpopInvitePassModal',true);
                //      _self.set('url',url);
                //    });
                 //
                //  }else if (typeItemCode=='healthExamType11') {
                //    let nodeSeq=$('<td class="ellipsis center text-nowrap pointer" imgUrl="" seq='+seqItem2.get("seq")+'></td>');
                //    $("#tbody tr[typecode='" + typeItemCode + "']").append(nodeSeq);
                //    //绑定点击事件
                //    nodeSeq.click(function(){
                //      let url=$(this).attr('imgUrl');
                //     //  _self.set('health.edit',false);
                //      _self.set('health',_self.get('store').createRecord('health-info',{}));
                //      _self.set('showpopInvitePassModal',true);
                //      _self.set('url',url);
                //    });
                //  }else {
                //    let nodeSeq=$('<td class="ellipsis center text-nowrap pointer" imgUrl="" seq='+seqItem2.get("seq")+'></td>');
                //    $("#tbody tr[typecode='" + typeItemCode + "']").append(nodeSeq);
                //    nodeSeq.click(function(){
                //      let url=$(this).attr('imgUrl');
                //     //  _self.set('health.edit',false);
                //      _self.set('health',_self.get('store').createRecord('health-info',{}));
                //      _self.set('showpopInvitePassModal',true);
                //      _self.set('url',url);
                //    });
                 //
                //  }
                let type = _self.get("dataLoader").findDict(typeItemCode);
                 let nodeSeq=$('<td class="ellipsis center text-nowrap pointer" imgUrl="" seq='+seqItem2.get("seq")+'></td>');
                 $("#tbody tr[typecode='" + typeItemCode + "']").append(nodeSeq);
                nodeSeq.click(function(){
                  let url=$(this).attr('imgUrl');
                  _self.set('health',_self.get('store').createRecord('health-info',{}));
                  _self.set('health.itemtype',type);
                  _self.set('health.edit',true);
                  _self.set('health.seq',i+1);
                  _self.set('showpopInvitePassModal',true);
                    _self.send('addHealthSelect',type);
                  _self.set('url',url);
                  console.log(i);
                  switch (i%5) {
                    case 0:
                      _self.set('health.minTime',new Date().setHours(0,0));
                      _self.set('health.maxTime',new Date().setHours(5,59));
                      break;
                    case 1:
                      _self.set('health.minTime',new Date().setHours(5,59));
                      _self.set('health.maxTime',new Date().setHours(9,59));
                      break;
                    case 2:
                      _self.set('health.minTime',new Date().setHours(9,59));
                      _self.set('health.maxTime',new Date().setHours(13,59));
                      break;
                    case 3:
                      _self.set('health.minTime',new Date().setHours(13,59));
                      _self.set('health.maxTime',new Date().setHours(17,59));
                      break;
                    case 4:
                      _self.set('health.minTime',new Date().setHours(17,59));
                      _self.set('health.maxTime',new Date().setHours(23,59));
                      break;
                  }

                });

               }
            }
            healthList.forEach(function(hitem){//hitem是每一条数据
              //let dataItem = datas.get(hitem.get("seq"));//每一行的数据
              let seq = hitem.get("seq");
              let code = hitem.get("itemtype.typecode");
              let str='';//尿液分析
              str+="白细胞:"+hitem.get("result")+";亚硝酸盐:"+hitem.get("resultAddtion")+";尿胆原:"+hitem.get("resultAddtionSec")+";蛋白质:"+hitem.get("resultAddtionThir")+";酸碱度:"+hitem.get("resultAddtionFou")+";红细胞:"+hitem.get("resultAddtionFiv")+";比重:"+hitem.get("resultAddtionSix")+";";
              str+="酮体:"+hitem.get("resultAddtionSev")+";胆红素:"+hitem.get("resultAddtionEig")+";尿葡萄糖:"+hitem.get("resultAddtionNin")+";维生素:"+hitem.get("resultAddtionTen")+";";
              let bloodFatStr='';
              bloodFatStr+="胆固醇(mmol/L):"+hitem.get("result")+";高密度脂蛋白胆固醇(mmol/L):"+hitem.get("resultAddtion")+";甘油三酯(mmol/L):"+hitem.get("resultAddtionSec")+";低密度脂蛋白胆固醇(mmol/L):"+hitem.get("resultAddtionThir")+";总胆固醇和高密度胆固醇的比值:"+hitem.get("resultAddtionFou")+";";
              let bloodStr="高压(mmHg):"+hitem.get("result")+";低压(mmHg):"+hitem.get("resultAddtion");
              let oxygenStr="血氧值(%):"+hitem.get("result")+";";
              //区分血压-尿液分析-心电图 与其他项不同
              if(code=='healthExamType1'){
                if(hitem.get("resultAddtion")){
                  $("#tbody tr[typecode='" + code + "']"  + " td[seq='" + seq + "']").html(hitem.get("bloodResult"));
                  $("#tbody tr[typecode='" + code + "']"  + " td[seq='" + seq + "']").attr('title',bloodStr);
                }
              }else if(code=='healthExamType12') {
                $("#tbody tr[typecode='" + code + "']"  + " td[seq='" + seq + "']").html(hitem.get("totalResult"));
                $("#tbody tr[typecode='" + code + "']"  + " td[seq='" + seq + "']").attr('title',str);
              }else if (code=='healthExamType13') {
                $("#tbody tr[typecode='" + code + "']"  + " td[seq='" + seq + "']").html(hitem.get("bloodFatResult"));
                $("#tbody tr[typecode='" + code + "']"  + " td[seq='" + seq + "']").attr('title',bloodFatStr);
              }else if (code=='healthExamType11') {
                var nodeImg=$('<img src='+hitem.get("realHeartImg")+' alt="">');
                $("#tbody tr[typecode='" + code + "']"  + " td[seq='" + seq + "']").append(nodeImg);
                $("#tbody tr[typecode='" + code + "']"  + " td[seq='" + seq + "']").attr('imgUrl',hitem.get("realHeartImg"));
              }else if (code=='healthExamType2') {
                $("#tbody tr[typecode='" + code + "']"  + " td[seq='" + seq + "']").html(hitem.get("oxygenResult"));
                $("#tbody tr[typecode='" + code + "']"  + " td[seq='" + seq + "']").attr('title',oxygenStr);

              }else {
                $("#tbody tr[typecode='" + code + "']"  + " td[seq='" + seq + "']").html(hitem.get("result"));
              }
              let nodeSeq = $("#tbody tr[typecode='" + code + "']"  + " td[seq='" + seq + "']");
              nodeSeq.click(function(){
                let url=$(this).attr('imgUrl');
                _self.set('health',hitem);
                _self.send('addHealthSelect',hitem.get('itemtype'));
                _self.set('showpopInvitePassModalThree',true);
                _self.set('url',url);
              });
            });
        });
    },
    queryHealthAnalysis:function(){
      var _self = this;
      var analysisObj={};
      var customerInComp = this.get('customerInComp');
      //查询healthanalysis(健康建议)
      this.get("store").query('health-analysis', {
          filter:{
            '[customer][id]':customerInComp.get('id'),
            'isLast':1
          }
      }).then(function(analysisList){
        console.log('analysisList is',analysisList);
       analysisList.forEach(function(analysis){
         var code=analysis.get('type.typecode');
         analysisObj[code]=analysis;
       });
       _self.set('analysisObj',analysisObj);
      });
    },
    didInsertElement: function() {
        var _self = this;
        //显示加载标识
        this.doQueryHealth();
        this.doQuery();
        this.queryHealthAnalysis();
    },
    showChartData() {
        var _self = this;
        var healthChartList = this.get("healthChartList");
        console.log("healthChartList len:" + healthChartList.get("length"));
        var myChartBlood = _self.get("myChartBlood");
        var myChartOxygen = _self.get("myChartOxygen");
        var myChartBreath = _self.get("myChartBreath");
        var myChartWeight = _self.get("myChartWeight");
        var myChartEmpty = _self.get("myChartEmpty");
        var myChartBefore = _self.get("myChartBefore");
        var myChartAfter = _self.get("myChartAfter");
        var myChartFat = _self.get("myChartFat");
        var myChartHeart = _self.get("myChartHeart");
        var myChartTemperature = _self.get("myChartTemperature");
        var myChartAnalysis=_self.get('myChartAnalysis');//尿液分析
        var myChartBloodFat=_self.get('myChartBloodFat');//血脂
        //重新定义
        var bloodList = []; //存血压的数组
        var bloodListResult = []; //高压
        var bloodListResultAddtion = []; //低压
        var bloodDate = []; //血压体检时间
        var oxygenList = []; //存血氧的数组
        var oxygenListResult = []; //血氧
        var oxygenListResultAddtion = []; //脉搏
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
        var beforeList = []; //存餐前血糖的数组
        var beforeListResult = []; //餐前血糖
        var beforeDate = []; //餐前血糖体检时间
        var afterList = []; //存餐后血糖的数组
        var afterListResult = []; //餐后血糖
        var afterDate = []; //餐后血糖体检时间
        var fatList = []; //存脂肪数据的数组
        var fatListResult = []; //脂肪数据
        var fatDate = []; //脂肪数据体检时间
        var heartList = []; //存心率的数组
        var heartListResult = []; //心率
        var heartDate = []; //心率体检时间
        var temperatureList = []; //存体温的数组
        var temperatureListResult = []; //体温
        var temperatureDate = []; //体温体检时间
        var analysisList = []; //存尿液分析的数组
        var analysisResult = []; //白细胞
        var analysisResultAddtion = []; //亚硝酸盐
        var analysisResultSec = []; //尿胆原
        var analysisResultThir = []; //蛋白质
        var analysisResultFou = []; //酸碱度
        var analysisResultFiv = []; //红细胞
        var analysisResultSix = []; //比重
        var analysisResultSev = []; //酮体
        var analysisResultEig = []; //胆红素
        var analysisResultNin = []; //尿葡萄糖
        var analysisResultTen = []; //维生素
        var analysisDate = []; //尿液分析时间
        var heartImgList=[];//心电图
        var bloodFatList = []; //存血脂的数组
        var bloodFatResult = []; //胆固醇
        var bloodFatResultAddtion = []; //高密度脂蛋白胆固醇
        var bloodFatResultSec = []; //甘油三酯含量
        var bloodFatResultThir = []; //低密度脂蛋白胆固醇
        var bloodFatResultFou = []; //总胆固醇和高密度胆固醇的比值
        var bloodFatDate = []; //血脂时间
        //按体检项目归类
        healthChartList.forEach(function(chartHealth) {
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
            //呼吸频率
            if (chartType == 'healthExamType4') {
                console.log("push healthExamType4");
                breathListResult.push(chartResult);
                breathDate.push(itemHourS);
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
            //餐前血糖
            if (chartType == 'healthExamType8') {
                beforeListResult.push(chartResult);
                beforeDate.push(itemDate);
                beforeList.push(chartHealth);
            }
            //餐后血糖
            if (chartType == 'healthExamType9') {
                afterListResult.push(chartResult);
                afterDate.push(itemDate);
                afterList.push(chartHealth);
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
                console.log("push healthExamType3,res:" + chartResult);
                 heartListResult.push(chartResult);
                 heartDate.push(itemHourS);
                 heartList.push(chartHealth);
             }
             //尿液分析
             if (chartType == 'healthExamType12') {
                 analysisResult.push(chartResult);
                 analysisResultAddtion.push(chartResultAddtion);
                 analysisResultSec.push(chartResultAddtionSec);
                 analysisResultThir.push(chartResultAddtionThir);
                 analysisResultFou.push(chartResultAddtionFou);
                 analysisResultFiv.push(chartResultAddtionFiv);
                 analysisResultSix.push(chartResultAddtionSix);
                 analysisResultSev.push(chartResultAddtionSev);
                 analysisResultEig.push(chartResultAddtionEig);
                 analysisResultNin.push(chartResultAddtionNin);
                 analysisResultTen.push(chartResultAddtionTen);
                 analysisDate.push(itemDate);
                 analysisList.push(chartHealth);
             }
             //血脂
             if (chartType == 'healthExamType13') {
                 bloodFatResult.push(chartResult);
                 bloodFatResultAddtion.push(chartResultAddtion);
                 bloodFatResultSec.push(chartResultAddtionSec);
                 bloodFatResultThir.push(chartResultAddtionThir);
                 bloodFatResultFou.push(chartResultAddtionFou);
                 bloodFatDate.push(itemDate);
                 bloodFatList.push(chartHealth);
             }
             //心电图
             if (chartType == 'healthExamType11'){
               heartImgList.push(chartHealth);
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
        var firstBefore=beforeList.get('lastObject');
        this.set('firstBefore',firstBefore);
        var firstAfter=afterList.get('lastObject');
        this.set('firstAfter',firstAfter);
        var firstFat=fatList.get('lastObject');
        this.set('firstFat',firstFat);
        var firstHeart=heartList.get('lastObject');
        this.set('firstHeart',firstHeart);
        var firstTemperature=temperatureList.get('lastObject');
        this.set('firstTemperature',firstTemperature);
        var firstAnalysis=analysisList.get('lastObject');
        this.set('firstAnalysis',firstAnalysis);
        var firstHeartImg=heartImgList.get('lastObject');
        this.set('firstHeartImg',firstHeartImg);//心电图
        var firstBloodFat=bloodFatList.get('lastObject');
        this.set('firstBloodFat',firstBloodFat);
        // 绘制血压图表
        if(myChartBlood){
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
                  showAllSymbol:true,
                  smooth: true,
                  data: bloodListResultAddtion
              }]
          });
          var option = myChartBlood.getOption();
          console.log("option is", option.series);
        }
        if(myChartOxygen){
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
        }
        if(myChartBreath){
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
        }
        // 绘制体重图表
        myChartWeight.setOption({
            title: {
                text:'体重'
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                data: ['体重'],
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
                data: weightDate, //x轴(时间)
                axisLabel: {
                    interval: "auto"
                }
            }],
            yAxis: {
                name: 'kg', //单位
                type: 'value',
            },
            dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: ((weightListResult.length-10)/weightListResult.length)*100, // 左边在 90% 的位置。
                end: 100, // 右边在 100% 的位置。
                filterMode: 'filter'
            }],
            series: [{
                name: '体重',
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
                data: weightListResult
            }]
        });
        // 绘制空腹血糖图表
        myChartEmpty.setOption({
            title: {
                text:'血糖'
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                data: ['血糖'],
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
                data: emptyDate, //x轴(时间)
                axisLabel: {
                    interval: "auto"
                }
            }],
            yAxis: {
                name: 'mmol/L', //单位
                type: 'value',
            },
            dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: ((emptyListResult.length-10)/emptyListResult.length)*100, // 左边在 90% 的位置。
                end: 100, // 右边在 100% 的位置。
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
                            color: "#ff0000"
                        }
                    }
                },
                //stack:"",
                data: emptyListResult
            }]
        });
        // 绘制餐前血糖图表
        myChartBefore.setOption({
            title: {
                text:'餐前血糖'
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                data: ['餐前血糖'],
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
                data: beforeDate, //x轴(时间)
                axisLabel: {
                    interval: "auto"
                }
            }],
            yAxis: {
                name: 'mmol/L', //单位
                type: 'value',
            },
            dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: ((beforeListResult.length-10)/beforeListResult.length)*100, // 左边在 90% 的位置。
                end: 100, // 右边在 100% 的位置。
                filterMode: 'filter'
            }],
            series: [{
                name: '餐前血糖',
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
                data: beforeListResult
            }]
        });
        // 绘制餐后血糖图表
        myChartAfter.setOption({
            title: {
                text: '餐后血糖'
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                data: ['餐后血糖'],
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
                data: afterDate, //x轴(时间)
                axisLabel: {
                    interval: "auto"
                }
            }],
            yAxis: {
                name: 'mmol/L', //单位
                type: 'value',
            },
            dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: ((afterListResult.length-10)/afterListResult.length)*100, // 左边在 90% 的位置。
                end: 100, // 右边在 100% 的位置。
                filterMode: 'filter'
            }],
            series: [{
                name: '餐后血糖',
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
                data: afterListResult
            }]
        });
        // 绘制脂肪数据图表
        myChartFat.setOption({
            title: {
                text:'脂肪数据'
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                data: ['脂肪数据'],
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
                data: fatDate, //x轴(时间)
                axisLabel: {
                    interval: "auto"
                }
            }],
            yAxis: {
                name: 'g/100g', //单位
                type: 'value',
            },
            dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: ((fatListResult.length-10)/fatListResult.length)*100, // 左边在 90% 的位置。
                end: 100, // 右边在 100% 的位置。
                filterMode: 'filter'
            }],
            series: [{
                name: '脂肪数据',
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
                data: fatListResult
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
                text:'体温'
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                data: ['体温'],
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
                data: temperatureDate, //x轴(时间)
                axisLabel: {
                    interval: "auto"
                }
            }],
            yAxis: {
                name: '℃', //单位
                type: 'value',
                min:35,
                max:42
            },
            dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: ((temperatureListResult.length-10)/temperatureListResult.length)*100, // 左边在 90% 的位置。
                end: 100, // 右边在 100% 的位置。
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
                            color: "#ff0000"
                        }
                    }
                },
                //stack:"",
                data: temperatureListResult
            }]
        });

        // 绘制尿液分析图表
        myChartAnalysis.setOption({
            title: {
                text:'尿液分析'
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                data: ['','','','白细胞','亚硝酸盐','尿胆原','蛋白质','酸碱度','红细胞','比重','酮体','胆红素','尿葡萄糖','维生素'],
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
                data: analysisDate, //x轴(时间)
                axisLabel: {
                    interval: "auto"
                }
            }],
            yAxis: {
                name: '', //单位
                type: 'value',
            },
            dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: ((analysisResult.length-10)/analysisResult.length)*100, // 左边在 90% 的位置。
                end: 100, // 右边在 100% 的位置。
                filterMode: 'filter'
            }],
            series: [{
                name: '白细胞',
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
                data: analysisResult
            },
            {
                name: '亚硝酸盐',
                type: "line",
                smooth: true,
                data: analysisResultAddtion
            },
            {
                name: '尿胆原',
                type: "line",
                smooth: true,
                data: analysisResultSec
            },
            {
                name: '蛋白质',
                type: "line",
                smooth: true,
                data: analysisResultThir
            },
            {
                name: '酸碱度',
                type: "line",
                smooth: true,
                data: analysisResultFou
            },
            {
                name: '红细胞',
                type: "line",
                smooth: true,
                data: analysisResultFiv
            },
            {
                name: '比重',
                type: "line",
                smooth: true,
                data: analysisResultSix
            },
            {
                name: '酮体',
                type: "line",
                smooth: true,
                data: analysisResultSev
            },
            {
                name: '胆红素',
                type: "line",
                smooth: true,
                data: analysisResultEig
            },
            {
                name: '尿葡萄糖',
                type: "line",
                smooth: true,
                data: analysisResultNin
            },
            {
                name: '维生素',
                type: "line",
                smooth: true,
                data: analysisResultTen
            }
          ]
        });
        //绘制-血脂
        myChartBloodFat.setOption({
            title: {
                text:'血脂'
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                data: ['','','','胆固醇','高密度脂蛋白胆固醇','甘油三酯含量','低密度脂蛋白胆固醇','总胆固醇和高密度胆固醇的比值'],
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
                data: bloodFatDate, //x轴(时间)
                axisLabel: {
                    interval: "auto"
                }
            }],
            yAxis: {
                name: '', //单位
                type: 'value',
            },
            dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: ((bloodFatResult.length-10)/bloodFatResult.length)*100, // 左边在 90% 的位置。
                end: 100, // 右边在 100% 的位置。
                filterMode: 'filter'
            }],
            series: [{
                name: '胆固醇',
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
                data: bloodFatResult
            },
            {
                name: '高密度脂蛋白胆固醇',
                type: "line",
                smooth: true,
                data: bloodFatResultAddtion
            },
            {
                name: '甘油三酯含量',
                type: "line",
                smooth: true,
                data: bloodFatResultSec
            },
            {
                name: '低密度脂蛋白胆固醇',
                type: "line",
                smooth: true,
                data: bloodFatResultThir
            },
            {
                name: '总胆固醇和高密度胆固醇的比值',
                type: "line",
                smooth: true,
                data: bloodFatResultFou
            }
          ]
        });
    },
    initChart() {
        //初始化图表-血压
        if (this.get("hasInitChart")) {
            return;
        }
        this.set("hasInitChart", true);
        var pwBlood = ($("#health-area").width()) / 2;
        $("#myChartBlood").width(pwBlood);
        var myChartBlood = Echarts.init(document.getElementById('myChartBlood'));
        this.set("myChartBlood", myChartBlood);
        //初始化图表-血氧
        if (this.get("hasInitChartOxygen")) {
            return;
        }
        this.set("hasInitChartOxygen", true);
        var pwOxygen = ($("#health-area").width()) / 2;
        $("#myChartOxygen").width(pwOxygen);
        var myChartOxygen = Echarts.init(document.getElementById('myChartOxygen'));
        this.set("myChartOxygen", myChartOxygen);
        //初始化图表-呼吸频率
        if (this.get("hasInitChartBreath")) {
            return;
        }
        this.set("hasInitChartBreath", true);
        var pwBreath = ($("#health-area").width()) / 2;
        $("#myChartBreath").width(pwBreath);
        var myChartBreath = Echarts.init(document.getElementById('myChartBreath'));
        this.set("myChartBreath", myChartBreath);
        //初始化图表-体重
        if (this.get("hasInitChartWeight")) {
            return;
        }
        this.set("hasInitChartWeight", true);
        var pwWeight = ($("#health-area").width()) / 2;
        $("#myChartWeight").width(pwWeight);
        var myChartWeight = Echarts.init(document.getElementById('myChartWeight'));
        this.set("myChartWeight", myChartWeight);
        //初始化图表-空腹血糖
        if (this.get("hasInitChartEmpty")) {
            return;
        }
        this.set("hasInitChartEmpty", true);
        var pwEmpty = ($("#health-area").width()) / 2;
        $("#myChartEmpty").width(pwEmpty);
        var myChartEmpty = Echarts.init(document.getElementById('myChartEmpty'));
        this.set("myChartEmpty", myChartEmpty);
        //初始化图表-餐前血糖
        if (this.get("hasInitChartBefore")) {
            return;
        }
        this.set("hasInitChartBefore", true);
        var pwBefore = ($("#health-area").width()) / 2;
        $("#myChartBefore").width(pwBefore);
        var myChartBefore = Echarts.init(document.getElementById('myChartBefore'));
        this.set("myChartBefore", myChartBefore);
        //初始化图表-餐后血糖
        if (this.get("hasInitChartAfter")) {
            return;
        }
        this.set("hasInitChartAfter", true);
        var pwAfter = ($("#health-area").width()) / 2;
        $("#myChartAfter").width(pwAfter);
        var myChartAfter = Echarts.init(document.getElementById('myChartAfter'));
        this.set("myChartAfter", myChartAfter);
        //初始化图表-脂肪数据
        if (this.get("hasInitChartFat")) {
            return;
        }
        this.set("hasInitChartFat", true);
        var pwFat = ($("#health-area").width()) / 2;
        $("#myChartFat").width(pwFat);
        var myChartFat = Echarts.init(document.getElementById('myChartFat'));
        this.set("myChartFat", myChartFat);
        //初始化图表-心率数据
        if (this.get("hasInitChartHeart")) {
            return;
        }
        this.set("hasInitChartHeart", true);
        var pwHeart = ($("#health-area").width()) / 2;
        $("#myChartHeart").width(pwHeart);
        var myChartHeart = Echarts.init(document.getElementById('myChartHeart'));
        this.set("myChartHeart", myChartHeart);
        //初始化图表-体温数据
        if (this.get("hasInitChartTemperature")) {
            return;
        }
        this.set("hasInitChartTemperature", true);
        var pwTemperature = ($("#health-area").width()) / 2;
        $("#myChartTemperature").width(pwTemperature);
        var myChartTemperature = Echarts.init(document.getElementById('myChartTemperature'));
        this.set("myChartTemperature", myChartTemperature);

        //初始化图表-尿液分析数据
        if (this.get("hasInitChartAnalysis")) {
            return;
        }
        this.set("hasInitChartAnalysis", true);
        var pwAnalysis = ($("#health-area").width()) / 2;
        $("#myChartAnalysis").width(pwAnalysis);
        var myChartAnalysis = Echarts.init(document.getElementById('myChartAnalysis'));
        this.set("myChartAnalysis", myChartAnalysis);
        //初始化图表-血脂数据
        if (this.get("hasInitChartBloodFat")) {
            return;
        }
        this.set("hasInitChartBloodFat", true);
        var pwBloodFat = ($("#health-area").width()) / 2;
        $("#myChartBloodFat").width(pwBloodFat);
        var myChartBloodFat = Echarts.init(document.getElementById('myChartBloodFat'));
        this.set("myChartBloodFat", myChartBloodFat);
    },
    actions: {
        dpShowAction(e) {},
        search: function(flag) {
            //alert("执行了");
            var _self = this;
            this.set("flag", flag);
            this.doQuery();
            this.set("beginDate", null);
            this.set("endDate", null);
            this.set("bedTypeID", '');
            if (flag) {
                if (flag == "today") {
                    this.set("todayShow", true);
                    this.set("sevenShow", false);
                    this.set("thirtyShow", false);
                    this.set("compareShow", false);
                    this.set("allDateShow", false);
                }
                if (flag == "seven") {
                    this.set("todayShow", false);
                    this.set("sevenShow", true);
                    this.set("thirtyShow", false);
                    this.set("compareShow", false);
                    this.set("allDateShow", false);
                }
                if (flag == "thirty") {
                    this.set("todayShow", false);
                    this.set("sevenShow", false);
                    this.set("thirtyShow", true);
                    this.set("compareShow", false);
                    this.set("allDateShow", false);
                }
            }
        },
        //添加按钮
        addData: function() {
            var _self = this;
            this.set('showpopInvitePassModal', true);
            let health = this.get("store").createRecord('health-info', {});
            this.set('health', health);
            this.set("bloodShow", false);
            this.set("heartShow", false);
            this.set("analysisShow", false);
            this.set("OxygenShow", false);
            this.set("bloodFatShow", false);
        },
        //弹窗取消
        invitation() {
            this.set('showpopInvitePassModal', false);
            this.set('showpopInvitePassModalThree', false);
        },
        cancel(){
          this.set('showpopInvitePassModalTwo', false);
        },
        invalid() {
          //alert("error");
        },
        //保存按钮
        saveClick: function() {

            //alert("保存");
            this.doQuery();

            var _self = this;
            var mainpageController = App.lookup('controller:business.mainpage');
            let health = this.get("store").createRecord('health-info', {});
            let healthModel = this.get('healthModel');
            //health.set('examDateTime', _self.get("health.examDateTime"));
            health.set('itemtype', _self.get("health.itemtype"));
            health.set('result', _self.get("health.result"));
            healthModel.set('itemtype', _self.get("health.itemtype"));
            healthModel.set('result', _self.get("health.result"));
            healthModel.set('examDateTime', _self.get("health.examDateTime"));
            //console.log("health realResult", _self.get("health.realResult"));
            health.set('resultAddtion', _self.get("health.resultAddtion"));
            health.set('resultAddtionSec', _self.get("health.resultAddtionSec"));
            health.set('resultAddtionThir', _self.get("health.resultAddtionThir"));
            health.set('resultAddtionFou', _self.get("health.resultAddtionFou"));
            health.set('resultAddtionFiv', _self.get("health.resultAddtionFiv"));
            health.set('resultAddtionSix', _self.get("health.resultAddtionSix"));
            health.set('resultAddtionSev', _self.get("health.resultAddtionSev"));
            health.set('resultAddtionEig', _self.get("health.resultAddtionEig"));
            health.set('resultAddtionNin', _self.get("health.resultAddtionNin"));
            health.set('resultAddtionTen', _self.get("health.resultAddtionTen"));
            health.set("examUser", _self.get("customerInComp"));
            var examDateTime = _self.get("health.examDateTime");
            health.set("examDateTime", examDateTime);
            health.set('sourceFlag','fromHand');
            healthModel.validate().then(function(){
              if(healthModel.get('errors.length')===0){
                _self.set("showpopInvitePassModal", false);
                _self.set("showpopInvitePassModalThree", false);
                App.lookup('controller:business.mainpage').openPopTip("正在保存");
                health.save().then(function() {
                    //alert("跳转");
                    App.lookup('controller:business.mainpage').showPopTip("保存成功");

                     $("#tbody").empty();
                    _self.doQueryHealth();
                    _self.doQuery();
                });
              }else{
                healthModel.set("validFlag",Math.random());
              }
            });

        },
        showList: function() {
            this.set('textShow', true);
            $('#listBtn2').attr('class', 'cur');
            $('#textBtn2').attr('class', '');
        }, //列表显示
        showText: function() {
            this.set('textShow', false);
            $('#listBtn2').attr('class', '');
            $('#textBtn2').attr('class', 'cur');
            this.initChart();
            this.showChartData();
        }, //图文显示
        showListJujia: function() {
            this.set('textShow', true);
            $('#listBtn2').attr('class', 'jujia_cur');
            $('#textBtn2').attr('class', 'jujia_nocur');
        }, //列表显示
        showTextJujia: function() {
            this.set('textShow', false);
            $('#listBtn2').attr('class', 'jujia_nocur');
            $('#textBtn2').attr('class', 'jujia_cur');
            this.initChart();
            this.showChartData();
        }, //图文显示
        showDate: function() {
            this.set('dateShow', true);
        }, //显示时间选择器
        hideDate: function() {
            this.set('dateShow', false);
            this.send('search');
        }, //隐藏时间选择器
        showBigImg: function() {
            this.set('bigImg', true);
        }, //大图显示
        hideBigImg: function() {
            this.set('bigImg', false);
        }, //大图显示
        newData: function() {
            $('#windowInsideDIV').modal();
        }, //新增健康数据弹窗
        hideData: function() {
            $('#windowInsideDIV').hide();
        },
        // 下载健康数据
        uploadData: function() {
          $(".dataTables_wrapper table").tableExport({type:'excel',escape:'false'});
        },
        healthSelect: function(itemtype) {
            if (itemtype) {
                this.set('itemtype', itemtype);
                this.set('itemtypeID', itemtype.id);
                this.set('itemtypeCode', itemtype.get('typecode'));
                this.set('itemtypeRemark', itemtype.get('remark'));
                this.set("informationShow", false);

            } else {
                this.set('itemtypeID', '');
                if (!this.get("textShow")) {
                    this.set("informationShow", true);
                }
            }
            this.doQuery();
        }, //数据项字典
        addHealthSelect: function(healthDict) {
            this.get("health").set("itemtype", healthDict);
            var healthDictCode = healthDict.get("typecode");
            if (healthDictCode == "healthExamType1") {
                this.set("bloodShow", true);
            } else {
                this.set("bloodShow", false);
            }
            if (healthDictCode == "healthExamType3") {
                this.set("heartShow", true);
            } else {
                this.set("heartShow", false);
            }
            if (healthDictCode == "healthExamType12") {
                this.set("analysisShow", true);
            } else {
                this.set("analysisShow", false);
            }
            if (healthDictCode == "healthExamType2") {
                this.set("OxygenShow", true);
            } else {
                this.set("OxygenShow", false);
            }
            if (healthDictCode == "healthExamType13") {
                this.set("bloodFatShow", true);
            } else {
                this.set("bloodFatShow", false);
            }
            this.get('health').set('itemRemark',healthDict.get('remark'));
        }, //添加界面数据项字典
        changeExamAction(date) {
            var stamp = this.get("dateService").timeToTimestamp(date);
            let health = this.get('health');
            if(health.get('seq')){
                let seq = parseInt(health.get('seq'));
                if(seq==1||seq==2||seq==3||seq==4||seq==5){
                  this.set("health.examDateTime", stamp);
                }
                else if(seq==6||seq==7||seq==8||seq==9||seq==10){
                  this.set("health.examDateTime", stamp-86400);
                }
                else if(seq==11||seq==12||seq==13||seq==14||seq==15){
                  this.set("health.examDateTime", stamp-86400*2);
                }
                else if(seq==16||seq==17||seq==18||seq==19||seq==20){
                  this.set("health.examDateTime", stamp-86400*3);
                }
                else if(seq==21||seq==22||seq==23||seq==24||seq==25){
                  this.set("health.examDateTime", stamp-86400*4);
                }
                else if(seq==26||seq==27||seq==28||seq==29||seq==30){
                  this.set("health.examDateTime", stamp-86400*5);
                }else if(seq==31||seq==32||seq==33||seq==34||seq==35){
                  this.set("health.examDateTime", stamp-86400*6);
                }
            }else {
              this.set("health.examDateTime", stamp);
            }
        },
        changeBeginDateAction(date) {
            this.set("beginDate", date);
            var begin = this.get("dateService").timeToTimestamp(date);
            var computedBegin = this.get("dateService").formatDate(begin, "yyyy-MM-dd");
            this.set("computedBegin", computedBegin);
            if (date) {
                this.set("todayShow", false);
                this.set("sevenShow", false);
                this.set("thirtyShow", false);
                this.set("compareShow", true);
                this.set("allDateShow", false);
            }
        },
        changeEndDateAction(date) {
            this.set("endDate", date);
            var end = this.get("dateService").timeToTimestamp(date);
            var computedEnd = this.get("dateService").formatDate(end, "yyyy-MM-dd");
            this.set("computedEnd", computedEnd);
            if (date) {
                this.set("todayShow", false);
                this.set("sevenShow", false);
                this.set("thirtyShow", false);
                this.set("compareShow", true);
                this.set("allDateShow", false);
            }
        },
    }
});
