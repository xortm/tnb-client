import Ember from 'ember';
export default Ember.Controller.extend({
    constants: Constants,
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
        toDetailPage(purchase) {
            if (purchase) {
                let id = purchase.get('id');
                this.get("mainController").switchMainPage('purchase-detail', {
                    id: id,
                    editMode: "edit"
                });
            } else {
                this.get("mainController").switchMainPage('purchase-detail', {
                    editMode: "add",
                    id: ""
                });
            }
        },
        search(flag){
          this.set("dateQueryCondition", flag);
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.purchase-management").doQuery();
        },
        //时间选择器确定
        submmit(){
          this.set('dateShow', false);
          this.set("dateQueryCondition", 'flag');
          App.lookup("route:business.mainpage.purchase-management").doQuery();
        },
        //清空时间
        emptied(){
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set("dateQueryCondition", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.purchase-management").doQuery();
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
