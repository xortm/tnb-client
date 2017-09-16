import Ember from 'ember';
export default Ember.Controller.extend({
    constants: Constants,
    //queryCondition:'',
    mainController: Ember.inject.controller('business.mainpage'),
    dateService: Ember.inject.service("date-service"),
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
    actions: {
        dpShowAction(e) {
        },
        toDetailPage(recharge) {
            if (recharge) {
                let id = recharge.get('id');
                console.log("++++++++id++++++++++++++++**********", id);
                this.get("mainController").switchMainPage('recharge-detail', {
                    id: id,
                    editMode: "edit"
                });
            } else {
                //alert("添加");
                console.log("+++++++recharge+++++++++", recharge);
                this.get("mainController").switchMainPage('recharge-detail', {
                    editMode: "add",
                    id: ""
                });
            }
        },
        // changeBeginDateAction(date) {
        //     this.set("beginDate", date);
        // },
        // changeEndDateAction(date) {
        //     console.log("is true", typeof date);
        //     this.set("endDate", date);
        // },
        search(flag){
          this.set("dateQueryCondition", flag);
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.recharge-management").doQuery();
        },
        //时间选择器确定
        submmit(){
          this.set('dateShow', false);
          this.set("dateQueryCondition", 'flag');
          App.lookup("route:business.mainpage.recharge-management").doQuery();
        },
        //清空时间
        emptied(){
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set("dateQueryCondition", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.recharge-management").doQuery();
        },
        changeBeginDateAction(date) {
            var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
            this.set("beginDate",date);
            this.set('showStartDate',stamp);
        },
        changeEndDateAction(date) {
            var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
            this.set("endDate",date);
            this.set('showEndDate',stamp);
        },
    }
});
