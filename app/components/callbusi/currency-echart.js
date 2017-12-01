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
    bigFlag: true,
    reRenderFlag:0,
    nextFlag:0,

    doQuery: function() {
      var _self = this;
      if (!this.get('doQueryFlag')) {
          return;
      }
      //构造tr之前判断是否有tr
      var getTbody = '#' + this.get('echartId');
      if ($(getTbody + ' tr').length === 0) {
          console.log('没有元素', $(getTbody + '>tr').length);
      } else {
          //alert('有元素');
          console.log('有元素', $(getTbody + '>tr').length);
          $(getTbody).empty();
      }
      var fildurTypeFlag=null;
      var durTypeFlag = this.get('durTypeFlag'); //统计区间,1:年 2季 3月 4周 5日
      var employeeArr = this.get('employeeArr');
      console.log("employeeArr:",employeeArr);
      let employeeStr = "";
      employeeArr.forEach(function(item){
        employeeStr += item.get("id") + ",";
      });
      console.log("employeeStr:",employeeStr);
      if(durTypeFlag=='year'){
        fildurTypeFlag=1;
      }
      if(durTypeFlag=='season'){
        fildurTypeFlag=2;
      }
      if(durTypeFlag=='mouth'){
        fildurTypeFlag=3;
      }
      if(durTypeFlag=='day'){
        fildurTypeFlag=5;
      }
      var beginDate = this.get('beginDate'); //开始日期
      console.log('start-analytic:beginDate',beginDate);
      var endDate = this.get('endDate'); //结束日期
      //computed：季度-时间
      var beginseaconDate=this.get('beginseaconDate');
      var endseaconDate=this.get('endseaconDate');
      var beginseaconFlag=this.get('beginseaconFlag');
      var endseaconFlag=this.get('endseaconFlag');
      var begincurDate=null;//开始季度的第一个月第一天第一秒时间戳
      var beginYear=null;
      if(beginseaconDate){
        beginYear=parseInt(beginseaconDate.getFullYear());//年份
      }
      var beginMouth=null;//月份
      if(beginseaconFlag=='beginone'){//第一季度
        beginMouth=1;//月份
        begincurDate=this.get("dateService").getFirstSecondStampOfMonth(beginYear,beginMouth);
      }
      if(beginseaconFlag=='beginsecond'){//第二季度
        beginMouth=4;//月份
        begincurDate=this.get("dateService").getFirstSecondStampOfMonth(beginYear,beginMouth);
      }
      if(beginseaconFlag=='beginthird'){//第三季度
        beginMouth=7;//月份
        begincurDate=this.get("dateService").getFirstSecondStampOfMonth(beginYear,beginMouth);
      }
      if(beginseaconFlag=='beginfour'){//第四季度
        beginMouth=10;//月份
        begincurDate=this.get("dateService").getFirstSecondStampOfMonth(beginYear,beginMouth);
      }
      //-------------  结束-季度
      var endcurDate=null;//结束季度的第一个月第一天第一秒时间戳
      var endYear=null;
      if(endseaconDate){
        endYear=parseInt(endseaconDate.getFullYear());//年份
      }
      var endMouth=null;//月份
      if(endseaconFlag=='endone'){//第一季度
        endMouth=3;//月份
        endcurDate=this.get("dateService").getLastSecondStampOfMonth(endYear,endMouth);
      }
      if(endseaconFlag=='endsecond'){//第二季度
        endMouth=6;//月份
        endcurDate=this.get("dateService").getLastSecondStampOfMonth(endYear,endMouth);
      }
      if(endseaconFlag=='endthird'){//第三季度
        endMouth=9;//月份
        endcurDate=this.get("dateService").getLastSecondStampOfMonth(endYear,endMouth);
      }
      if(endseaconFlag=='endfour'){//第四季度
        endMouth=12;//月份
        endcurDate=this.get("dateService").getLastSecondStampOfMonth(endYear,endMouth);
      }
      //查询条件-统计类型
      //查询条件-开始时间(结束时间)
      var beginTime=null;
      var endTime=null;
      if(beginDate&&endDate){
        beginTime=beginDate;
        endTime=endDate;
      }
      if(beginseaconDate&&endseaconDate){
        beginTime=begincurDate;
        endTime=endcurDate;
      }
      //var chartType = this.get('chartType'); //图表类型(比传)
      this.get('store').query('statquery', {
        filter: {
          queryType:"statService",
          'durType':fildurTypeFlag,
          'beginTime':beginTime,
          'endTime':endTime,
          'staffId':employeeStr,
        }
      }).then(function(dataList) {
        dataList=dataList.sortBy("statDate");
        //根据口径类型区分数据
        let mapData = [];
        let mapDate= [];
        //拼data数据
        dataList.forEach(function(data){
          var statResult=data.get('statResult');//结果数据
          var statDate=data.get('statDate');//结果日期(时间戳)
          mapData.push(statResult);
          //日期
          if(mapDate.indexOf(statDate)<0){
            mapDate.push(statDate);
          }
        });
        _self.set('mapData',mapData);
        console.log('shujushi',mapData);
        _self.set('mapDate',mapDate);
        console.log('shijianshi',mapDate);
        _self.set('dataList',dataList);
        _self.incrementProperty("nextFlag");
      });
    }.observes('doQueryFlag'),

    computedList: function() {
        //构造ember(口径名称数组)
        var _self = this;
        //获取时间数组
        var getTbody = '#' + this.get('echartId');
        var employeeArr = this.get('employeeArr');
        var serviceLevelList = this.get('serviceLevelList');
        var dateAry = this.get('mapDate');
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
            var firstTd = $('<td class="ellipsis center text-nowrap">' + typeItem2.get('dateShowItem') + '</td>'); //第一列显示的时间
            let tbody = $(getTbody);
            tbody.find("tr[typecode='" + typeItemCode + "']").append(firstTd);
            //tbody.$("tr[typecode='" + typeItemCode + "']").append(firstTd);
            //构建seqItems(td)
            let seqItems = new Ember.A(); //构建数组
            console.log('所有的employeeArr是', employeeArr);
            employeeArr.forEach(function(employee, index) {
                console.log('employee id is', employee.get("id"));
                let employeeId = employee.get("id");
                serviceLevelList.forEach(function(serviceLevel, index) {
                  let serviceLevelId = serviceLevel.get("id");
                  let seq = employeeId + "_" + serviceLevelId;
                  let nodeSeq = $('<td class="ellipsis center text-nowrap" seq=' + seq + '></td>');
                  let tbody = $(getTbody);
                  tbody.find("tr[typecode='" + typeItemCode + "']").append(nodeSeq);
                });
                let seq = employeeId + "_all";
                let nodeSeq = $('<td class="ellipsis center text-nowrap mobel" seq=' + seq + '></td>');
                let tbody = $(getTbody);
                tbody.find("tr[typecode='" + typeItemCode + "']").append(nodeSeq);
            });
        });
        let dataList = _self.get('dataList'); //请求得到的所有数据
        console.log('所有数据是哪些', dataList);
        dataList.forEach(function(data) {
          let employeeId = data.get("employee.id");
          let passengersGrade = data.get("passengersGrade");
          console.log("passengersGrade:",passengersGrade);
          let passengersGradeObj = JSON.parse(passengersGrade);
          console.log("passengersGradeObj:",passengersGradeObj);
          let seq = employeeId + "_all";
          let code = data.get("statDate");
          let tbody = $(getTbody);
          tbody.find("tr[typecode='" + code + "']" + " td[seq='" + seq + "']").html(data.get("statResult"));
          for(var i in passengersGradeObj) {
            console.log(i,":",passengersGradeObj[i]);
            let seq = employeeId + "_" + i;
            tbody.find("tr[typecode='" + code + "']" + " td[seq='" + seq + "']").html(passengersGradeObj[i]);
          }
        });
    }.observes('nextFlag'),

    actions:{
      listClick: function() { //点击显示列表
          this.set('listContainer', true);
          this.set('chartContainer', false);
      },
      chartClick: function() {
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

    }








});
