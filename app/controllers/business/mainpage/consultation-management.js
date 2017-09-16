import Ember from 'ember';
export default Ember.Controller.extend({
    constants: Constants,
    mainController: Ember.inject.controller('business.mainpage'),
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),
    dataLoader: Ember.inject.service("data-loader"),
    exportDef:{
      "model":"consultinfo",
      "export":{
        "title":"咨询列表",
        "cols":[{"name":"advName","title":"咨询人姓名"},
                {"name":"advTel","title":"咨询人电话"},
                {"name":"advDate","title":"咨询日期"},
                {"name":"appointmentDate","title":"预约参观日期"},
                {"name":"receiveStaff.name","title":"接待人"},
                // {"name":"backVistInfos.length","title":"跟进次数"}
              ],
                 "format":[
                   {
                     "colName":"advDate",//需要格式化字段的字段名
                     "format":"yyyy-MM-dd"   //格式化表达式
                   },
                   {
                     "colName":"appointmentDate",//需要格式化字段的字段名
                     "format":"yyyy-MM-dd"   //格式化表达式
                   }
                 ]
        },
    },
    chooseDate:Ember.computed('showStartDate','showEndDate','dateQueryCondition',function(){
      if(this.get('dateQueryCondition')){
        let dateQueryCondition = this.get('dateQueryCondition');
        if(dateQueryCondition == 'today'){
          return '今天';
        }else if(dateQueryCondition == 'seven'){
          return '最近7天';
        }else if(dateQueryCondition == 'thirty'){
          return '最近30天';
        }else{
          if(this.get('showStartDate')&&this.get('showEndDate')){
            return this.get('showStartDate')+'至'+this.get('showEndDate');
          }else{
            return '选择日期';
          }
        }

      }else{
        return '选择日期';
      }
    }),
    chooseDateAp:Ember.computed('showStartDateAp','showEndDateAp','dateQueryConditionAp',function(){
      if(this.get('dateQueryConditionAp')){
        let dateQueryConditionAp = this.get('dateQueryConditionAp');
        if(dateQueryConditionAp == 'today'){
          return '今天';
        }else if(dateQueryConditionAp == 'seven'){
          return '最近7天';
        }else if(dateQueryConditionAp == 'thirty'){
          return '最近30天';
        }else{
          if(this.get('showStartDateAp')&&this.get('showEndDateAp')){
            return this.get('showStartDateAp')+'至'+this.get('showEndDateAp');
          }else{
            return '选择日期';
          }
        }

      }else{
        return '选择日期';
      }
    }),
    actions: {
      dpShowAction(e){
      },
        toDetailPage(consult) {
            if (consult) {
                let id = consult.get('id');
                console.log("++++++++id++++++++++++++++**********", id);
                this.get("mainController").switchMainPage('consultation-detail', {
                    id: id,
                    editMode: "edit"
                });
            } else {
                //alert("添加");
                console.log("+++++++consult+++++++++",consult);
                this.get("mainController").switchMainPage('consultation-detail', {
                    editMode: "add",
                    id:""
                });
            }
        },
        // changeBeginDateAction(date) {
        //     this.set("beginDate",date);
        // },
        // changeEndDateAction(date) {
        //     console.log("is true",typeof date);
        //     this.set("endDate",date);
        // },
        //跳转回访
        jumpVist(consult){
          this.get("mainController").switchMainPage('visit-management', {
            id:consult.get("id")
          });
        },
        //咨询转预定
        jumpAdvance(consult){
          //this.set("consult",consult);
          this.get("mainController").switchMainPage('consultation-advance', {editMode:'add',
          consultId:consult.get("id")
          });
        },
        search(flag){
          this.set("dateQueryCondition", flag);
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.consultation-management").doQuery();
        },
        searchAp(flag){
          this.set("dateQueryConditionAp", flag);
          this.set("beginDateAp", null);
          this.set("endDateAp", null);
          this.set('dateShowAp', false);
          App.lookup("route:business.mainpage.consultation-management").doQuery();
        },
        //时间选择器确定
        submmit(){
          this.set('dateShow', false);
          this.set("dateQueryCondition", 'flag');
          App.lookup("route:business.mainpage.consultation-management").doQuery();
        },
        submmitAp(){
          this.set('dateShowAp', false);
          this.set("dateQueryConditionAp", 'flag');
          App.lookup("route:business.mainpage.consultation-management").doQuery();
        },
        //清空时间
        emptied(){
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set("dateQueryCondition", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.consultation-management").doQuery();
        },
        emptiedAp(){
          this.set("beginDateAp", null);
          this.set("endDateAp", null);
          this.set("dateQueryConditionAp", null);
          this.set('dateShowAp', false);
          App.lookup("route:business.mainpage.consultation-management").doQuery();
        },
        changeBeginDateAction(date) {
            var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
            this.set("beginDate",date);
            this.set('showStartDate',stamp);
        },
        changeBeginDateActionAp(date) {
            var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
            this.set("beginDateAp",date);
            this.set('showStartDateAp',stamp);
        },
        changeEndDateAction(date) {
            var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
            this.set("endDate",date);
            this.set('showEndDate',stamp);
        },
        changeEndDateActionAp(date) {
            var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
            this.set("endDateAp",date);
            this.set('showEndDateAp',stamp);
        },
    }
});
