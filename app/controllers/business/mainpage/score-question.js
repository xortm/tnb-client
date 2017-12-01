import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"scoreQuestionContainer",
  // scrollPrevent:true,

  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  statusService: Ember.inject.service("current-status"),
  global_dataLoader: Ember.inject.service('data-loader'),
  constants:Constants,
  appraiseResultItemHasExist:true,//默认已填写
  queryFlagInFlag:0,//默认
  itemListFlag:0,//默认
  init: function(){
    let _self = this;
    _self._showLoading();
    var curCustomer = this.get("statusService").getCustomer();//获取curCustomer
    this.set("curCustomer",curCustomer);
    //拿到各自的题库模板
    this.store.query("appraise",{
      filter:{
        publishStatus:1,
      },
      sort:{endTime:"desc"}
    }).then(function(appraiseList){
      let allAppraiseItemList = _self.get("global_dataLoader").get("appraiseItemList");//查找预制题库
      console.log("allAppraiseItemList:",allAppraiseItemList);
      if(!appraiseList&&appraiseList.get("length")===0){
        _self.set("appraiseNotExist",false);//set 加载图片隐藏
        return;
      }
      console.log("appraiseList",appraiseList);
      let appraise = appraiseList.get("firstObject");
      let hasEmployeeItem = appraise.get("incluedEmplooye");
      if(hasEmployeeItem){
        _self.set("hasEmployeeItemFlag",true);
      }else{
        _self.set("hasEmployeeItemFlag",false);
      }
      console.log("appraise:",appraise);
      _self.set("appraise",appraise);
      console.log("appraise appraiseName:",appraise.get("name"));
      _self.set("appraiseName",appraise.get("name"));
      _self.set("appraiseRemark",appraise.get("remark"));
      let appraiseItemIdList = appraise.get("items");
      console.log("appraiseItemIdList:",appraiseItemIdList);
      //机构题库
      let appraiseItemListOfPublic = new Ember.A();
      //员工题库
      let appraiseItemListOfemployee = new Ember.A();
      //生成各自的题库模板
      appraiseItemIdList.forEach(function(appraiseItemId){
        console.log("appraiseItemId:",appraiseItemId.get("id"));
        let appraiseItem = allAppraiseItemList.findBy("id",appraiseItemId.get("id"));
        if(appraiseItem){
          //机构题库
          if(appraiseItem.get("type.typecode") == Constants.appraiseType1){
            appraiseItemListOfPublic.pushObject(appraiseItem);
          }
          //员工题库
          if(appraiseItem.get("type.typecode") == Constants.appraiseType2){
            appraiseItemListOfemployee.pushObject(appraiseItem);
          }
        }
      });
      console.log("appraiseItemListOfPublic:",appraiseItemListOfPublic);
      console.log("appraiseItemListOfemployee:",appraiseItemListOfemployee);
      //对模板进行排序
      let appraiseItemListOfPublicSort = appraiseItemListOfPublic.sortBy("id");
      let appraiseItemListOfemployeeSort = appraiseItemListOfemployee.sortBy("id");
      _self.set("appraiseItemListOfPublic",appraiseItemListOfPublicSort);
      _self.set("appraiseItemListOfemployee",appraiseItemListOfemployeeSort);
      _self.incrementProperty("queryFlagInFlag");
    });
  },
  //拿到已经填写的题目放到对象中
  appraiseObs: function(){
    var _self = this;
    _self._showLoading();
    let queryFlagInFlag = this.get("queryFlagInFlag");
    if(!queryFlagInFlag){return;}
    let curCustomer = this.get("curCustomer");
    var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
    _self.store.query("appraise-result-item",{
      filter:{
        result:{
          appraiseCustomer:{
            id:curCustomerId
          },
          appraise:{
            publishStatus:1
          }
        }
      },
    }).then(function(appraiseResultItemList){
      //拿到已经填写的数据对象
      if(appraiseResultItemList && appraiseResultItemList.get("length")){
        let appraise = appraiseResultItemList.get("firstObject").get("result.appraise");
        _self.set("appraise",appraise);
        console.log("appraiseResultItemList",appraiseResultItemList);
        let employeeItemList = new Ember.A();
        let curEmployee = null;
        appraiseResultItemList.forEach(function(appraiseResultItem){
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
          //给机构的题目employeeId默认设置为0
          let employeeId;
          if(appraiseResultItem.get("result.employee.id")){
            employeeId = appraiseResultItem.get("result.employee.id");
          }else{
            employeeId = "0";
          }
          if(!curEmployee||curEmployee.get("employeeIdInloop")!==employeeId){
            curEmployee = Ember.Object.create({
              employeeIdInloop:employeeId,
              appraiseCustomer:curCustomer,
              appraise:appraise,
              hasReady:true,
              appraiseTime:appraiseResultItem.get("result.appraiseTime"),
              appraiseResult:appraiseResultItem.get("result"),
              items: new Ember.A(),
            });
            employeeItemList.pushObject(curEmployee);
          }
          curEmployee.get("items").pushObject(appraiseResultItem);
        });
        console.log("employeeItemList:",employeeItemList);
        //对已经填写项目里面的模板进行排序
        employeeItemList.forEach(function(employeeItem){
          let averageScore = 0;
          let averageScoreLength = 0;
          let itemsSort = employeeItem.get("items").sortBy("appraiseItemId");
          console.log("itemsSort in each:",itemsSort);
          employeeItem.set("items",itemsSort);
          employeeItem.get("items").forEach(function(item){
            averageScore = averageScore + item.get("score");
            averageScoreLength++;
          });
          if(averageScoreLength){
            averageScore = averageScore/averageScoreLength;
            averageScore = averageScore.toFixed(1);
          }
          employeeItem.set("averageScore",averageScore);
        });
        console.log("employeeItemList:",employeeItemList);
        _self.set("employeeItemList",employeeItemList);
      }else{
        let employeeItemList = new Ember.A();
        _self.set("employeeItemList",employeeItemList);
      }
      _self.incrementProperty("itemListFlag");
    });
  }.observes("queryFlagInFlag").on("init"),
  //处理数据
  itemListFlagObs: function(){
    let _self = this;
    let itemListFlag = this.get("itemListFlag");
    if(!itemListFlag){return;}
    //拿到已经填写的题目列表
    let employeeItemList = this.get("employeeItemList");
    console.log("employeeItemList in itemListFlagObs:",employeeItemList);
    //是否有员工模板
    let hasEmployeeItemFlag = this.get("hasEmployeeItemFlag");
    let curCustomer = this.get("curCustomer");
    let appraise = this.get("appraise");
    console.log("curCustomer11:",curCustomer);
    console.log("appraise11:",appraise);
    //拿到各自的题库模板
    let appraiseItemListOfPublic = _self.get("appraiseItemListOfPublic");
    console.log("appraiseItemListOfPublic:",appraiseItemListOfPublic);
    let itemList = new Ember.A();
    //找到对养老机构评分的题目
    let hasFirstItem = employeeItemList.findBy("employeeIdInloop","0");
    console.log("hasFirstItem:",hasFirstItem);
    if(hasFirstItem){
      itemList.pushObject(hasFirstItem);
      console.log("itemList 111:",itemList);
    }else{
      //新建对杨机构评分题目的模板,用于保存
      let appraiseResultModel = _self.store.createRecord('appraise-result',{
        employeeIdInloop:"0",
        averageScore:0,
        appraiseCustomer:curCustomer,
        appraise:appraise,
        hasReady:false,
        items:new Ember.A(),
      });
      appraiseItemListOfPublic.forEach(function(appraiseItem){
        let maxScoreArr = [];
        for (var i = 0; i < appraiseItem.get("maxScore"); i++) {
          maxScoreArr[i] = i+1;
        }
        let newObj = _self.store.createRecord('appraise-result-item',{
          item:appraiseItem,
          name:appraiseItem.get('name'),
          score:0,
          maxScoreArr:maxScoreArr,
        });
        appraiseResultModel.get("items").pushObject(newObj);
      });
      itemList.pushObject(appraiseResultModel);
      console.log("itemList 222:",itemList);
    }
    console.log("itemList out:",itemList);
    //如果有对于员工的评分,则遍历员工列表,生成对应的末班题库
    if(hasEmployeeItemFlag){
      _self.store.query("employee",{filter:{
        staffStatus:{'typecode@$not':Constants.staffStatusLeave}
      }}).then(function(employeeList){
        let curCustomer = _self.get("curCustomer");
        let appraise = _self.get("appraise");
        console.log("curCustomer:",curCustomer);
        console.log("appraise:",appraise);
        console.log("employeeList:",employeeList);
        let appraiseItemListOfemployee = _self.get("appraiseItemListOfemployee");
        console.log("appraiseItemListOfemployee in employeeList:",appraiseItemListOfemployee);
        employeeList.forEach(function(employee){
          console.log("employee in each:",employee);
          //如果已经完成对该员工的评分,则直接替换
          let hasFirstItem = employeeItemList.findBy("employeeIdInloop",employee.get("id"));
          console.log("hasFirstItem:",hasFirstItem);
          if(hasFirstItem){
            hasFirstItem.set("employee",employee);
            itemList.pushObject(hasFirstItem);
            console.log("itemList 111:",itemList);
          }else{
            //如果没有则生成题库模板
            let appraiseResultModel = _self.store.createRecord('appraise-result',{
              employeeIdInloop:employee.get("id"),
              averageScore:0,
              appraiseCustomer:curCustomer,
              appraise:appraise,
              hasReady:false,
              employee:employee,
              items:new Ember.A(),
            });
            appraiseItemListOfemployee.forEach(function(appraiseItem){
              let maxScoreArr = [];
              for (var i = 0; i < appraiseItem.get("maxScore"); i++) {
                maxScoreArr[i] = i+1;
              }
              console.log("maxScoreArr:",maxScoreArr);
              let newObj = _self.store.createRecord('appraise-result-item',{
                item:appraiseItem,
                name:appraiseItem.get('name'),
                score:0,
                maxScoreArr:maxScoreArr,
              });
              console.log("newObj in each:",newObj);
              appraiseResultModel.get("items").pushObject(newObj);
              console.log("appraiseResultModel in each:",appraiseResultModel);
            });
            console.log("appraiseResultModel in each out:",appraiseResultModel);
            itemList.pushObject(appraiseResultModel);
          }
        });
        _self.set("itemList",itemList);
        console.log("itemList end:",itemList);
        _self.hideAllLoading();
        _self.directInitScoll(true);
      });
    }else{
      _self.set("itemList",itemList);
      _self.hideAllLoading();
      _self.directInitScoll(true);
    }
  }.observes("itemListFlag").on("init"),

  queryFlagIn:function(){
    this.incrementProperty("queryFlagInFlag");
  },

  actions:{
    switchShowAction(){
      this.directInitScoll(true);
    },



  },

});
