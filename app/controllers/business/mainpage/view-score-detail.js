import Ember from 'ember';

export default Ember.Controller.extend({
  dataLoader: Ember.inject.service("data-loader"),
  feedBus: Ember.inject.service("feed-bus"),
  pathConfiger: Ember.inject.service("path-configer"),
  global_curStatus: Ember.inject.service("current-status"),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  customerListFlag: 0,
  queryFlagInFlag: 1,
  showLoadingImgFlag: 0,
  scoreByCustomerFlag: 0,
  scoreByEmployeeFlag: 0,
  scollFlag: 0,//刷新后使组件包裹滚动条
  constants:Constants,
  tabFuncs:Ember.computed("taskList",function() {
    var a = new Ember.A();
    var t1 = Ember.Object.create({
      code:"scoreByCustomer",
      text:"按照老人",
      numberTip:0
    });
    var t2 = Ember.Object.create({
      code:"scoreByEmployee",
      text:"按照员工",
      numberTip:0
    });
    a.pushObject(t1);
    a.pushObject(t2);
    return a;
  }),
  init: function(){
    this._super(...arguments);
    // this.set("showLoadingImgIn",true);
    var _self = this;
    Ember.run.schedule("afterRender",this,function() {
      //设置默认显示tab页
      console.log("menuitem in tab init");
      _self.set("clickActFlag","scoreByCustomer");
    });
  },

  //查找数据
  appraiseObs: function(){
    let _self = this;
    _self.set("service_PageConstrut.showLoader",true);//set 加载图片显示
    let itemId = this.get("itemId");
    let queryFlagInFlag = this.get("queryFlagInFlag");
    if(!itemId||!queryFlagInFlag){
      return;
    }
    _self.store.query("appraise-result-item",{
      filter:{
        result:{
          appraise:{
            id:itemId
          }
        }
      },
    }).then(function(appraiseResultItemList){
      if(!appraiseResultItemList){return;}
      console.log("appraiseResultItemList:",appraiseResultItemList);
      console.log("appraiseResultItemList length:",appraiseResultItemList.get("length"));
      let length = appraiseResultItemList.get("length");
      //如果没有人答题,则无数据
      if(!length){
        _self.incrementProperty("showLoadingImgFlag");
        return;
      }
      //拿到这一期的数据信息
      let appraise = appraiseResultItemList.get("firstObject").get("result.appraise");
      _self.set("appraise",appraise);
      console.log("appraiseResultItemList",appraiseResultItemList);
      //对数据进行排序
      appraiseResultItemList.forEach(function(appraiseResultItem){
        let appraiseCustomerId = appraiseResultItem.get("result.appraiseCustomer.id");
        let appraiseEmployeeId = appraiseResultItem.get("result.employee.id");
        let appraiseResultId = appraiseResultItem.get("result.id");
        appraiseResultItem.set("appraiseCustomerId",appraiseCustomerId);
        appraiseResultItem.set("appraiseResultId",appraiseResultId);
        appraiseResultItem.set("appraiseEmployeeId",appraiseEmployeeId);
      });
      console.log("appraiseResultItemList in sort:",appraiseResultItemList);
      // let appraiseResultItemListSort = appraiseResultItemList.sortBy("appraiseCustomerId","id");
      let appraiseResultItemListSort = appraiseResultItemList.sortBy("appraiseCustomerId","appraiseResultId","id");
      let appraiseResultItemListSortByEmployeeId = appraiseResultItemList.sortBy("appraiseEmployeeId","appraiseResultId","id");
      console.log("appraiseResultItemListSortByEmployeeId",appraiseResultItemListSortByEmployeeId);
      console.log("appraiseResultItemListSort",appraiseResultItemListSort);

      let customerList = new Ember.A();
      let curCustomer = null;
      let curEmployee = null;
      appraiseResultItemListSort.forEach(function(appraiseResultItem){
        let maxScore = appraiseResultItem.get("item.maxScore");
        let appraiseItemId = appraiseResultItem.get("item.id");
        console.log("maxScore in:",maxScore);
        let maxScoreArr = [];
        console.log("arr:",maxScoreArr);
        for (var i = 0; i < maxScore; i++) {
          maxScoreArr[i] = i+1;
        }
        appraiseResultItem.set("maxScoreArr",maxScoreArr);
        appraiseResultItem.set("appraiseItemId",appraiseItemId);
        let customerIdInloop = appraiseResultItem.get("result.appraiseCustomer.id");
        if(!curCustomer||curCustomer.get("customerId")!==customerIdInloop){
          curCustomer = Ember.Object.create({
            customerId:customerIdInloop,
            curCustomer:appraiseResultItem.get("result.appraiseCustomer"),
            appraiseResult:appraiseResultItem.get("result"),
            services: new Ember.A(),
          });
          customerList.pushObject(curCustomer);
          _self.set("changeCustomerId",true);
        }

        let employeeIdInloop = appraiseResultItem.get("result.employee.id");
        if(!employeeIdInloop){
          employeeIdInloop = "0";
        }
        let employee = appraiseResultItem.get("result.employee");
        if(!employee){
          employee = null;
        }
        console.log("employeeIdInloop:",employeeIdInloop);
        let changeCustomerId = _self.get("changeCustomerId");
        if(changeCustomerId||!curEmployee||curEmployee.get("employeeIdInloop")!==employeeIdInloop){
          curEmployee = Ember.Object.create({
            employeeIdInloop:employeeIdInloop,
            hasReady:true,
            employee:employee,
            items: new Ember.A(),
          });
          curCustomer.get("services").pushObject(curEmployee);
          _self.set("changeCustomerId",false);
        }
        curEmployee.get("items").pushObject(appraiseResultItem);
      });
      console.log("customerList in detail:",customerList);
      // let customerListSort = customerList.sortBy("appraiseTime").reverse();
      // console.log("customerListSort:",customerListSort);
      customerList.forEach(function(customerItem){
        let employeeListRemark = "";
        let averageScoreAll = 0;
        let averageScoreAllLength = 0;
        let averageScoreEmployee = 0;
        let averageScoreEmployeeLength = 0;
        let averageScoreEmployeeName = "";
        let servicesSort = customerItem.get("services").sortBy("employeeIdInloop");
        console.log("servicesSort:",servicesSort);
        customerItem.set("services",servicesSort);
        console.log("services:",customerItem.get("services"));
        customerItem.get("services").forEach(function(service){
          let sort = service.get("items").sortBy("appraiseItemId");
          console.log("sort:",sort);
          service.set("items",sort);
          let employeeName = service.get("employee.name");
          if(employeeName){
            employeeListRemark = employeeListRemark + employeeName + ",";
            console.log("employeeListRemark in each:",employeeListRemark);
            if(service.get("hasReady")){
              let itemsArrEmployee = service.get("items");
              let averageScoreEmployeeOfItem = 0;
              let averageScoreEmployeeOfItemLength = 0;
              itemsArrEmployee.forEach(function(item){
                if(!averageScoreEmployeeLength){
                  averageScoreEmployee = averageScoreEmployee + item.get("score");
                  averageScoreEmployeeLength++;
                  averageScoreEmployeeName = employeeName;
                }
                averageScoreEmployeeOfItem = averageScoreEmployeeOfItem + item.get("score");
                averageScoreEmployeeOfItemLength++;
              });
              if(averageScoreEmployeeOfItemLength){
                averageScoreEmployeeOfItem = averageScoreEmployeeOfItem/averageScoreEmployeeOfItemLength;
                averageScoreEmployeeOfItem = averageScoreEmployeeOfItem.toFixed(1);
              }
              service.set("averageScoreEmployeeOfItem",averageScoreEmployeeOfItem);

            }
          }
          let employeeIdInloop = service.get("employeeIdInloop");
          if(employeeIdInloop == "0"){
            if(service.get("hasReady")){
              let itemsArrAll = service.get("items");
              itemsArrAll.forEach(function(item){
                averageScoreAll = averageScoreAll + item.get("score");
                averageScoreAllLength++;
              });
            }
          }
        });
        if(averageScoreAllLength){
          averageScoreAll = averageScoreAll/averageScoreAllLength;
          averageScoreAll = averageScoreAll.toFixed(1);
        }
        if(averageScoreEmployeeLength){
          averageScoreEmployee = averageScoreEmployee/averageScoreEmployeeLength;
          averageScoreEmployee = averageScoreEmployee.toFixed(1);
        }
        customerItem.set("averageScoreAll",averageScoreAll);
        customerItem.set("averageScoreEmployee",averageScoreEmployee);
        customerItem.set("averageScoreEmployeeName",averageScoreEmployeeName);
        console.log("employeeListRemark out:",employeeListRemark);
        employeeListRemark = employeeListRemark.substr(0, employeeListRemark.length - 1);
        customerItem.set("employeeListRemark",employeeListRemark);
      });






      //得到以员工为中心的数据
      let employeeList = new Ember.A();
      let curCustomerExtend = null;
      let curEmployeeExtend = null;
      appraiseResultItemListSortByEmployeeId.forEach(function(appraiseResultItem){
        if(!appraiseResultItem.get("appraiseEmployeeId")){
          // continue;
          return;
        }
        let maxScore = appraiseResultItem.get("item.maxScore");
        let appraiseItemId = appraiseResultItem.get("item.id");
        console.log("maxScore in:",maxScore);
        let maxScoreArr = [];
        console.log("arr:",maxScoreArr);
        for (var i = 0; i < maxScore; i++) {
          maxScoreArr[i] = i+1;
        }
        appraiseResultItem.set("maxScoreArr",maxScoreArr);
        appraiseResultItem.set("appraiseItemId",appraiseItemId);
        let employeeIdInEach = appraiseResultItem.get("appraiseEmployeeId");
        if(!curEmployeeExtend||curEmployeeExtend.get("employeeId")!==employeeIdInEach){
          curEmployeeExtend = Ember.Object.create({
            employeeId:employeeIdInEach,
            curEmployeeExtend:appraiseResultItem.get("result.employee"),
            appraiseResult:appraiseResultItem.get("result"),
            services: new Ember.A(),
          });
          employeeList.pushObject(curEmployeeExtend);
        }

        let customerIdInEach = appraiseResultItem.get("appraiseCustomerId");
        let customer = appraiseResultItem.get("result.appraiseCustomer");
        console.log("customerIdInEach:",customerIdInEach);
        if(!curCustomerExtend||curCustomerExtend.get("customerIdInEach")!==customerIdInEach){
          curCustomerExtend = Ember.Object.create({
            customerIdInEach:customerIdInEach,
            hasReady:true,
            customer:customer,
            items: new Ember.A(),
          });
          curEmployeeExtend.get("services").pushObject(curCustomerExtend);
        }
        curCustomerExtend.get("items").pushObject(appraiseResultItem);
      });
      console.log("employeeList in detail:",employeeList);
      // let customerListSort = customerList.sortBy("appraiseTime").reverse();
      // console.log("customerListSort:",customerListSort);


      employeeList.forEach(function(employeeItem){
        let averageScore = 0;
        let averageScoreLength = 0;
        let servicesSort = employeeItem.get("services").sortBy("customerIdInEach");
        console.log("servicesSort:",servicesSort);
        employeeItem.set("services",servicesSort);
        console.log("services:",employeeItem.get("services"));
        employeeItem.get("services").forEach(function(service){
          let sort = service.get("items").sortBy("appraiseItemId");
          console.log("sort:",sort);
          service.set("items",sort);
          let itemsArr = service.get("items");
          let averageScoreCustomerOfItem = 0;
          let averageScoreCustomerOfItemLength = 0;
          itemsArr.forEach(function(item){
            averageScore = averageScore + item.get("score");
            averageScoreLength++;
            averageScoreCustomerOfItem = averageScoreCustomerOfItem + item.get("score");
            averageScoreCustomerOfItemLength++;
          });
          if(averageScoreCustomerOfItemLength){
            averageScoreCustomerOfItem = averageScoreCustomerOfItem/averageScoreCustomerOfItemLength;
            averageScoreCustomerOfItem = averageScoreCustomerOfItem.toFixed(1);
          }
          service.set("averageScoreCustomerOfItem",averageScoreCustomerOfItem);
        });
        if(averageScoreLength){
          averageScore = averageScore/averageScoreLength;
          averageScore = averageScore.toFixed(1);
        }
        console.log("averageScore:"+averageScore);
        employeeItem.set("averageScore",averageScore);
      });

      console.log("customerListSort after:",customerList);
      _self.set("customerList",customerList);

      console.log("employeeListSort after:",employeeList);
      _self.set("employeeList",employeeList);

      _self.incrementProperty("showLoadingImgFlag");
      // _self.set("service_PageConstrut.showLoader",false);//set 加载图片显示
      // _self.directInitScoll(true);
    });

  }.observes("itemId","queryFlagInFlag"),

  queryFlagIn: function(){
    this.incrementProperty("queryFlagInFlag");
  },

  actions:{
    //tab页的切换
    switchTab(code){
      let _self = this;
      console.log('switchTab in,code:' + code);
      this.set("curTabCode",code);
      //用于只刷新jroll,不重新包裹.可以保证滚动条的位置不变
      _self.incrementProperty("scollFlag");
    },
    //从组件中获取是否下拉刷新
    queryFlagInAction(){
      this.queryFlagIn();
    },

    switchShowAction(){
      // this.directInitScoll(true);
    },

  }
});
