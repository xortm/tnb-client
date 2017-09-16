import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  feedBus: Ember.inject.service("feed-bus"),
  pathConfiger: Ember.inject.service("path-configer"),
  global_curStatus: Ember.inject.service("current-status"),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"viewScoreDetailContainer",
  customerListFlag: 0,
  queryFlagInFlag: 1,
  constants:Constants,

  uploadUrl: Ember.computed(function() {return this.get("pathConfiger").get("uploadUrl");}),
  //查找数据
  appraiseObs: function(){
    let _self = this;
    let itemId = this.get("itemId");
    _self._showLoading();
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
      console.log("appraiseResultItemList:",appraiseResultItemList);
      console.log("appraiseResultItemList length:",appraiseResultItemList.get("length"));
      let length = appraiseResultItemList.get("length");
      //如果没有人答题,则无数据
      if(!length){
        _self.set("hasResult",false);
        _self.hideAllLoading();
        return;
      }
      _self.set("hasResult",true);
      //拿到这一期的数据信息
      let appraise = appraiseResultItemList.get("firstObject").get("result.appraise");
      _self.set("appraise",appraise);
      console.log("appraiseResultItemList",appraiseResultItemList);
      //对数据进行排序
      appraiseResultItemList.forEach(function(appraiseResultItem){
        let appraiseCustomerId = appraiseResultItem.get("result.appraiseCustomer.id");
        let appraiseResultId = appraiseResultItem.get("result.id");
        appraiseResultItem.set("appraiseCustomerId",appraiseCustomerId);
        appraiseResultItem.set("appraiseResultId",appraiseResultId);
      });
      // let appraiseResultItemListSort = appraiseResultItemList.sortBy("appraiseCustomerId","id");
      let appraiseResultItemListSort = appraiseResultItemList.sortBy("appraiseCustomerId","appraiseResultId","id");
      console.log("appraiseResultItemListSort",appraiseResultItemListSort);
      if(!appraiseResultItemListSort){return;}
      // let appraiseResultItemListSort = appraiseResultItemList.sortBy("item.id");
      // console.log("appraiseResultItemListSort",appraiseResultItemListSort);
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
            if(service.get("hasReady") && !averageScoreEmployeeLength){
              let itemsArrEmployee = service.get("items");
              itemsArrEmployee.forEach(function(item){
                averageScoreEmployee = averageScoreEmployee + item.get("score");
                averageScoreEmployeeLength++;
                averageScoreEmployeeName = employeeName;
              });
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
      console.log("customerListSort after:",customerList);

      _self.set("customerList",customerList);
      _self.hideAllLoading();
      _self.directInitScoll(true);
    });

  }.observes("itemId","queryFlagInFlag"),

  queryFlagIn: function(){
    this.incrementProperty("queryFlagInFlag");
  },

  actions:{
    switchShowAction(){
      this.directInitScoll(true);
    },

  }
});