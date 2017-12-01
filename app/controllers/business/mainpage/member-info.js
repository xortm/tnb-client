import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
const {
    taskApplyStatus_apply,
    taskApplyStatus_applySuc,
    taskApplyStatus_applyFail
} = Constants;

export default Ember.Controller.extend(InfiniteScroll, {
    feedService: Ember.inject.service('feed-bus'),
    infiniteContentPropertyName: "customerList",
    infiniteModelName: "customer",
    infiniteContainerName: "customerContainer",
    curTabCode: "user",
    clickFlag: 0, //标识(点击健康档案)
    accountFlag:0,//标识(点击服务信息)
    systemFlag:0,//标识(点击系统信息)
    medicineFlag:0,//标识(点击系统信息)
    projectFlag:0,//计次服务标示
    detailFlag:0,//定时服务标示
    tabFuncs: Ember.computed(function() {
        var a = new Ember.A();
        var t1 = Ember.Object.create({
            code: "user",
            selected: true,
            text: "长者信息"
        });
        var t2 = Ember.Object.create({
            code: "checkIn",
            text: "入住信息"
        });
        var t3 = Ember.Object.create({
            code: "healthy",
            text: "健康信息"
        });
        a.pushObject(t1);
        a.pushObject(t2);
        a.pushObject(t3);
        return a;
    }),

    init: function() {
        var _self = this;
        Ember.run.schedule("afterRender", this, function() {
            _self.set("clickActFlag", "user");
        });
    },
    // planProjectListObs:function(){
    //   var _self = this;
    //   var id = _self.get("id");
    //   //查询护理执行情况表
    //   _self.store.query('nursingplanexe', {
    //         filter: {
    //             '[detail][customer][id]':id,
    //         }
    //       // filter:{detail:{customer:{"id@$or1":controller.get('id')}},itemProject:{project:{customer:{"id@$or1":controller.get('id')}}}}
    //   }).then(function(detailplanProjectList){
    //     _self.set("detailplanProjectList",detailplanProjectList);
    //     console.log("detailplanProjectList",detailplanProjectList);
    //     _self.incrementProperty("detailFlag");
    //   });
    //   _self.store.query('nursingplanexe', {
    //         filter: {//或者条件
    //             // 'detail@$isNull@$or1':'null',
    //             // '[itemProject][project][customer][id]@$or1':controller.get('id'),
    //             // 'itemProject@$isNull@$or2':'null',
    //             // '[detail][customer][id]@$or2':controller.get('id'),
    //             '[itemProject][project][customer][id]':id,
    //         }
    //   }).then(function(planProjectList) {
    //     _self.set("planProjectList",planProjectList);
    //     console.log("planProjectList",planProjectList);
    //     _self.incrementProperty("projectFlag");
    //   });
    // }.observes("id"),

    //exe 定时和计次服务集合
    // exePlanObs: function(){
    //   var planProjectList = new Ember.A();
    //   var  projectFlag = this.get("projectFlag");
    //   var  detailFlag = this.get("detailFlag");
    //   if(!detailFlag||!projectFlag){return;}//如果exe查询没有完成就return
    //   var detailplanProjectList = this.get("detailplanProjectList");//定时
    //   var planProjectList = this.get("planProjectList");//计次
    //   detailplanProjectList.forEach(function(item){
    //     planProjectList.pushObject(item);
    //   });
    //   planProjectList.forEach(function(item){
    //     planProjectList.pushObject(item);
    //   });
    //   planProjectList.forEach(function(plan){//planProjectList 做下最后处理
    //     var remark=plan.get('remark');
    //     console.log('recored:remark is',remark);
    //     if(remark){
    //       var remarkData = JSON.parse(remark);
    //       var remarkTag = remarkData.serviceTag;
    //       if(remarkTag){
    //           var executeName = _self.get("store").peekRecord("dicttype", remarkTag).get("typename");
    //           console.log('executeName is',executeName);
    //           plan.set('executeName',executeName);
    //       }else {
    //         plan.set('executeName','正常完成');
    //         console.log('plan:remark',plan.get('executeName'));
    //       }
    //     }else {
    //       plan.set('executeName','正常完成');
    //     }
    //   });
    //   planProjectList=planProjectList.sortBy("exeStartTime").reverse();
    //   this.set('planProjectList', planProjectList);
    //   console.log("planProjectList111",planProjectList);
    // }.observes("detailFlag","projectFlag","id"),

    customerObs: function() {
        var _self = this;
        console.log("QQQQQ", _self.get('id'));
        this.get("store").findRecord('customer', _self.get('id')).then(function(customer) {
            _self.set("customer", customer);
            _self.set("customerInfo", customer);
        });
    },
    actions: {
      //删除按钮
      delById: function() {
          var _self = this;
          var customerInfo = this.get('customerInfo');
          var mainpageController = App.lookup('controller:business.mainpage');
          App.lookup('controller:business.mainpage').showConfirm("是否确定删除此会员的所有信息", function() {
              App.lookup('controller:business.mainpage').openPopTip("正在删除");
              // 删除customer user staffcustomer表中的数据
              customerInfo.set("delStatus", 1);
              customerInfo.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('member-management', {});
              });
          });
      },

        switchTab(code) {
            this.set("curTabCode", code);
        },
        goDetail() {
            var mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('customer-info');
        },
        csItemDetail() {
            var mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('customer-service-detail');
        },
        //个人信息
        information(informationParams) {
            if (informationParams) {
                this.set("informationParams", true);
                this.set("healthParams", false);
                this.set("serviceParams", false);
                this.set("recordParams", false);
                this.set("infoParams", true);
                this.set("systemParams", false);
                this.set("medicineParams", false);
                this.set("pointParams", false);
                this.set("contactParams", false);
            }
        },
        //健康监测
        health(healthParams) {
          var _self=this;
            if (healthParams) {
                this.set("informationParams", false);
                this.set("healthParams", true);
                this.set("serviceParams", false);
                this.set("recordParams", false);
            }
        },
        //服务信息
        service(serviceParams) {
            if (serviceParams) {
                this.set("informationParams", false);
                this.set("healthParams", false);
                this.set("serviceParams", true);
                this.set("recordParams", false);
                this.set("infoParams", true);
                this.set("systemParams", false);
                this.set("medicineParams", false);
                this.set("pointParams", false);
                this.set("contactParams", false);
            }
            var accountFlag = this.get('accountFlag');
            accountFlag = ++accountFlag;
            this.set('accountFlag', accountFlag);
            console.log('accountFlag++', this.get('accountFlag'));
        },
        //服务记录
        record(recordParams) {
            if (recordParams) {
                this.set("informationParams", false);
                this.set("healthParams", false);
                this.set("serviceParams", false);
                this.set("recordParams", true);
            }
        },
        infoClick(infoParams) {
            if (infoParams) {
                this.set("infoParams", true);
                this.set("pointParams", false);
                this.set("contactParams", false);
                this.set("systemParams", false);
                this.set("medicineParams", false);
            }
        },
        pointClick(pointParams) {
            if (pointParams) {
                this.set("infoParams", false);
                this.set("pointParams", true);
                this.set("contactParams", false);
                this.set("systemParams", false);
                this.set("medicineParams", false);
            }
        },
        contactClick(contactParams) {
            if (contactParams) {
                this.set("infoParams", false);
                this.set("pointParams", false);
                this.set("contactParams", true);
                this.set("systemParams", false);
                this.set("medicineParams", false);
            }
        },
        healthClick(healthInfoParams) {
            if (healthInfoParams) {
                this.set("infoParams", false);
                this.set("pointParams", false);
                this.set("contactParams", false);
                this.set("systemParams", false);
                this.set("medicineParams", false);
            }
            var clickFlag = this.get('clickFlag');
            clickFlag = ++clickFlag;
            this.set('clickFlag', clickFlag);
            console.log('clickFlag++', this.get('clickFlag'));
        },
        systemClick(systemParams){
          if(systemParams){
            this.set("infoParams", false);
            this.set("pointParams", false);
            this.set("contactParams", false);
            this.set("systemParams", true);
            this.set("medicineParams", false);
          }
          var systemFlag = this.get('systemFlag');
          systemFlag = ++systemFlag;
          this.set('systemFlag', systemFlag);
        },
        medicineClick(medicineParams){
          if(medicineParams){
            this.set("infoParams", false);
            this.set("pointParams", false);
            this.set("contactParams", false);
            this.set("systemParams", false);
            this.set("medicineParams", true);
          }
          var medicineFlag = this.get('medicineFlag');
          medicineFlag = ++medicineFlag;
          this.set('medicineFlag', medicineFlag);
        },
        refreshFuntion: function() {
          var _self=this;
            //var route = App.lookup('route:business.mainpage.customer-info');
            //App.lookup('controller:business.mainpage').refreshPage(route);
        },
    }
});
