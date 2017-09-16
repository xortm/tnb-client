import Ember from 'ember';
export default Ember.Controller.extend({
    constants: Constants,
    //queryCondition:'',
    mainController: Ember.inject.controller('business.mainpage'),
    dateService: Ember.inject.service("date-service"),
    chooseDate:Ember.computed('showStartDate','showEndDate','timeCondition',function(){
      if(this.get('timeCondition')){
        let timeCondition = this.get('timeCondition');
        if(timeCondition == 'today'){
          return '今天';
        }else if(timeCondition == 'seven'){
          return '最近7天';
        }else if(timeCondition == 'thirty'){
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
    defaultCustomer: Ember.computed('nurscustomer', function() {
        return this.get('nurscustomer');
    }),
    // customerList:Ember.computed('nursingList',function(){
    //
    //   let nursingList = this.get('nursingList');
    //   let list = new Ember.A();
    //   if(nursingList){
    //     nursingList.forEach(function(project){
    //       let c = Ember.Object.create({
    //         id:project.get('nurscustomer.id'),
    //         name:project.get('nurscustomer.name'),
    //         sortName:pinyinUtil.getFirstLetter(project.get('nurscustomer.name')),
    //       });
    //       list.pushObject(c);
    //     });
    //
    //   }
    //   console.log("就是他   ", list);
    //   return list;
    // }),


    actions: {
        dpShowAction(e) {},
        toDetailPage(nursing) {
            if (nursing) {
                let id = nursing.get('id');
                console.log("++++++++id++++++++++++++++**********", id);
                this.get("mainController").switchMainPage('nursing-detail', {
                    id: id,
                    editMode: "edit"
                });
            } else {
                console.log("+++++++nursing+++++++++", nursing);
                this.get("mainController").switchMainPage('nursing-detail', {
                    editMode: "add",
                    id: ""
                });
            }
        },
        selectCustomer(customer){
          this.set('nurscustomer',customer);
          App.lookup("route:business.mainpage.nursinglog-management").doQuery();
        },
        search(flag){
          this.set("timeCondition", flag);
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.nursinglog-management").doQuery();
        },
        //时间选择器确定
        submmit(){
          this.set('dateShow', false);
          this.set("timeCondition", 'flag');
          App.lookup("route:business.mainpage.nursinglog-management").doQuery();
        },
        //清空时间
        emptied(){
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set("timeCondition", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.nursinglog-management").doQuery();
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
