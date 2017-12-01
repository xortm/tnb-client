import Ember from 'ember';
const { Mixin, run, computed, RSVP: { resolve } } = Ember;

export default Mixin.create({
  dataLoader: Ember.inject.service("data-loader"),
  store: Ember.inject.service("store"),
  feedBus: Ember.inject.service("feed-bus"),
  dateService: Ember.inject.service("date-service"),
  constants: Constants,
  //保存方法
  finishService: function(serviceItem,callback){
    let _self = this;
    var user = this.get("global_curStatus").getUser();
    console.log("employee11111111",user.get("employee"));
    let exeRecord = this.get('store').createRecord("nursingplanexe",{
      exeStaff:user.get("employee"),
    });
    let drugprojectExe = this.get('store').createRecord("customerdrugprojectexe",{
      lastUpdateUser:user,
    });
    //存储按时或计次的服务情况
    if(serviceItem.get("type")===1){
      App.lookup('controller:business.mainpage').showMobileShade("正在处理,请稍候..");
        if(serviceItem.get("medicineDesc")){
          let planItem = serviceItem.get("planItem");
          drugprojectExe.set("customerDrug",planItem.get("customerDrug"));
          drugprojectExe.set("drugProject",planItem);
          console.log("trueDrugNum111",serviceItem.get("trueDrugNum"));
          // let serviceTag ;
          if(serviceItem.get("trueDrugNum") >= 0){//如果有的话证明点进 detail里操作的
            drugprojectExe.set("drugNum",serviceItem.get("trueDrugNum"));//实际用药量
            // serviceTag = serviceItem.get("serviceTag");
          }else {
            drugprojectExe.set("drugNum",serviceItem.get("useDrugNum"));//实际用药量 else  直接把计划里的数量填入
            // serviceTag = Constants.useDrugResult1;//直接写完成
          }
          drugprojectExe.set("drugNumPlan",serviceItem.get("useDrugNum"));

          // console.log("serviceTag1111",serviceTag);
          // var useDrugResultObj = _self.get("dataLoader").findDict(serviceTag);//serviceTag变为typecode了
          var useDrugFreqObj = _self.get("dataLoader").findDict(serviceItem.get("drugTypecode"));//用药规格
          // console.log("serviceTag1111 useDrugResultObj",useDrugResultObj);
          //备注信息
          // let jsonObj = {};
          let serviceDesc = serviceItem.get("serviceDesc");
          if(serviceDesc){
            drugprojectExe.set("remark",serviceDesc);
            // jsonObj.serviceDesc = serviceDesc;
          }
          // if(serviceItem.get("serviceTag")){
          //   jsonObj.serviceTag = serviceItem.get("serviceTag");
          // }
          // if(serviceItem.get("serviceTagexe")){
          //   jsonObj.serviceTagexe = serviceItem.get("serviceTagexe");//完成情况名字
          //   jsonObj.serviceFinishId = serviceItem.get("serviceFinishId");//finishlevel id
          // }
          // let remark = JSON.stringify(jsonObj);
          // let remarkString = _self.remarkString(remark);
          // drugprojectExe.set("remark",remark);
          if(serviceItem.get("servicefinishlevel")){
            drugprojectExe.set("finishLevel",serviceItem.get("servicefinishlevel"));//标签对象
          }else{
            var servicefinishlevelDrug = _self.get("dataLoader.serviceFinishDefaultList").findBy("remark",Constants.servicefinishlevelDefault1);
            drugprojectExe.set("finishLevel",servicefinishlevelDrug);//标签对象
          }
          drugprojectExe.set("drugSpec",useDrugFreqObj);//用药规格
          // drugprojectExe.set("result",useDrugResultObj);//完成情况
          drugprojectExe.set("useDrugDate",serviceItem.get("timeStrDate"));// 计划用药时间用于和 exe表比较
          drugprojectExe.save().then(function(drugprojectExeRecord){
            App.lookup('controller:business.mainpage').closeMobileShade("保存成功");
            let exeDate = drugprojectExeRecord.get("exeDate");
            let finishTime = _self.get("dateService").formatDate(exeDate,"hh:mm");
            //设置已执行的标志用于页面处理
            serviceItem.set("hasApply",true);
            serviceItem.set("finishTime",finishTime);
            serviceItem.set("finishRemark",serviceDesc);
            console.log("finishLevel in save1:",serviceItem.get("servicefinishlevel"));
            serviceItem.set("finishLevelName",drugprojectExe.get("finishLevel.name"));
            serviceItem.set("finishLevel",drugprojectExe.get("finishLevel"));
            serviceItem.set("trueDrugNum",drugprojectExe.get("drugNum"));//实际用药量
            serviceItem.set("personName",user.get("employee.name"));//服务人名
            _self.get("feedBus").set("serviceData",serviceItem);
            if(callback){
              callback();
            }
          },function(err){
            let error = err.errors[0];
            if(error.code==="14"){
              App.lookup("controller:business").popTorMsg("保存失败,药品已经不够此次使用");
              App.lookup('controller:business.mainpage').closeMobileShade("保存失败");
            }
            if(error.code==="15"){
              App.lookup("controller:business").popTorMsg("保存失败,此服务已被完成");
              App.lookup('controller:business.mainpage').closeMobileShade("保存失败");
            }
          });
          return ;
        }
        let detail = serviceItem.get("detail");
        // exeRecord.set("plan",planItem.get("plan"));
        exeRecord.set("detail",detail);
        exeRecord.set("itemProject",detail.get("item"));
        exeRecord.set("planExeDate",serviceItem.get("startTimeTab"));//计划开始时间
        console.log("detailGet item",detail.get("item"));
        //备注信息
        // let jsonObj = {};
        let serviceDesc = serviceItem.get("serviceDesc");
        if(serviceDesc){
          exeRecord.set("remark",serviceDesc);
          // jsonObj.serviceDesc = serviceDesc;
        }
        // if(serviceItem.get("serviceTag")){
        //   jsonObj.serviceTag = serviceItem.get("serviceTag");
        // }
        // if(serviceItem.get("serviceTagexe")){
        //   jsonObj.serviceTagexe = serviceItem.get("serviceTagexe");//完成情况名字
        //   jsonObj.serviceFinishId = serviceItem.get("serviceFinishId");//finishlevel id
        // }
        if(serviceItem.get("exeTabRemark")){
          exeRecord.set("exeTabRemark",serviceItem.get("exeTabRemark"));//标签对象
        }else{
          exeRecord.set("exeTabRemark",null);//标签对象
        }
        if(serviceItem.get("servicefinishlevel")){
          exeRecord.set("finishLevel",serviceItem.get("servicefinishlevel"));//标签对象
        }else{
          var servicefinishlevel = _self.get("dataLoader.serviceFinishDefaultList").findBy("remark",Constants.servicefinishlevelDefault1);
          console.log("servicefinishlevel in exeRecord save:",servicefinishlevel);
          exeRecord.set("finishLevel",servicefinishlevel);//标签对象
        }
        // let remark = JSON.stringify(jsonObj);
        // let remarkString = _self.remarkString(remark);
        // exeRecord.set("remark",remark);
        exeRecord.save().then(function(nursingplanexeRecord){
          App.lookup('controller:business.mainpage').closeMobileShade("保存成功");
          let createDateTime = nursingplanexeRecord.get("createDateTime");
          let finishTime = _self.get("dateService").formatDate(createDateTime,"hh:mm");
          serviceItem.set("hasApply",true);
          serviceItem.set("finishTime",finishTime);
          serviceItem.set("finishRemark",serviceDesc);
          console.log("finishLevel in save:",serviceItem.get("servicefinishlevel"));
          serviceItem.set("finishLevelName",exeRecord.get("finishLevel.name"));
          serviceItem.set("finishLevel",exeRecord.get("finishLevel"));
          serviceItem.set("exeTabRemark",serviceItem.get("exeTabRemark"));
          serviceItem.set("personName",user.get("employee.name"));//服务人名
          _self.get("feedBus").set("serviceData",serviceItem);
          if(callback){
            callback();
          }
        },function(err){
          let error = err.errors[0];
          if(error.code==="14"){
            App.lookup("controller:business").popTorMsg("保存失败,此服务已被完成");
            App.lookup('controller:business.mainpage').closeMobileShade("保存失败");
          }
          if(error.code==="15"){
            App.lookup("controller:business").popTorMsg("保存失败,请刷新页面后再尝试");
            App.lookup('controller:business.mainpage').closeMobileShade("保存失败");
          }
        });

    }else{//不定时任务  计次服务
      console.log("itemProject111  type 应该是 2",serviceItem.get("type"),serviceItem);
      //如果已经执行过，则使用之前的执行对象
      if(serviceItem.get("hasApply")){
        exeRecord = serviceItem.get("itemExe.content");
        console.log("exeRecord hasApply",exeRecord);
        exeRecord.set("remark",serviceItem.get("applyContent"));
        console.log("remark",exeRecord.get("remark")+"  and  "+serviceItem.get("applyContent"));
      }else {
        exeRecord.set("itemProject",serviceItem.get("item"));
        // let detail = serviceItem.get("item");//add
        // exeRecord.set("detail",detail);
        exeRecord.set("remark",serviceItem.get("applyContent"));//从0添加到有 第二次继续添加报 set undefined
      }
      console.log("exeRecord save before",exeRecord);
      exeRecord.set('remark',serviceItem.get('remark'));
      exeRecord.set('finishLevel',serviceItem.get('finishLevel'));
      exeRecord.set('exeTabRemark',serviceItem.get('exeTabRemark'));
      exeRecord.save().then(function(){
        //设置已执行的标志用于页面处理
        if(!serviceItem.get("hasApply")){//不是 hasApply才刷新exe
          _self.set("falgOfprojectPlanCustomerId",serviceItem.get("customerId"));//不定时任务完成 刷新标识 customerId
          serviceItem.set("hasApply",true);
          _self.incrementProperty("queryFlag");//再让查询exe方法执行下
          _self.set("exeDataPushFlag",false);//把不定时任务exeflag set为false
        }
        serviceItem.set("hasApply",true);
        // serviceItem.set("exeItem",exeRecord);//暂时还是有bug
        if(callback){
          callback();
        }
      });
    }
  },

  remarkString: function(remark){
    let _self = this;
    let str = "";
    if (remark) {
      if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
        var itemData = JSON.parse(remark);
        var itemDataServiceDesc = itemData.serviceDesc;
        var itemDataTag = itemData.serviceTag;
        var serviceTagexe = itemData.serviceTagexe;
        if(itemDataTag){
          var dictServiceTypename = _self.get("dataLoader").findDict(itemDataTag).get("typename");
          console.log("dictServiceTypename",dictServiceTypename);
          if(itemDataServiceDesc){
            str = dictServiceTypename+"，"+itemDataServiceDesc;
          }else {
            str = dictServiceTypename;
          }
        }else if (serviceTagexe) {
          if(itemDataServiceDesc){
            str = serviceTagexe+"，"+itemDataServiceDesc;
          }else {
            str = serviceTagexe;
          }
        }else {
          str = "正常完成";
          if(itemDataServiceDesc){
            str = str + "，"+ itemDataServiceDesc;
          }
        }
      }else {
        str = "正常完成" + remark;
      }
    }else {
      str = "老人配合，正常完成";
    }
    return str;
  },





});
