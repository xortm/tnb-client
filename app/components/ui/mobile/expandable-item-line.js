import Ember from 'ember';
import GesturesMixin from 'ember-gestures/mixins/recognizers';
import InfiniteScroll from '../../../controllers/infinite-scroll';

export default Ember.Component.extend({
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"showExesContainer",
  global_curStatus: Ember.inject.service("current-status"),
  dataLoader: Ember.inject.service("data-loader"),
  store: Ember.inject.service("store"),
  recognizers: 'tap press',
  classStatic: true,
  classNameBindings: ['classStatic:exp-item','expanded:expanded'],
  showExesModal: false,//弹出层默认不显示
  expanded: false,
  itemId:null,//标识
  itemName: null,//对应名称
  itemCount: 0,//对应次数
  detailData:[],//明细数据

  queryFlagIn: function(){return;},
  didInsertElement(){
    console.log("insert e in");
  },

  actions:{
    //弹出层显示
    showItemExes(){
      this.set('showExesModal', true);
    },
    //弹出层取消显示
    invitation() {
      this.set('showExesModal', false);
    },
    tapAction(){
      // this.sendAction("itemExpand",this.get("itemId"));
    },
    //添加内容
    cntAddAction(itemId){
      console.log("press in");
      this.sendAction("itemCntAdd",this.get("serviceItem"),itemId);
    },
    saveCountApply(){
      let _self = this;
      var saveId = "save_"+this.get("itemId");
      // let itemId = _self.get("itemId");
      console.log("itemProject111  type ",this.get("serviceItem"));
      //let sysTime = this.get("dataLoader").getNowTime();//系统时间
      // this.get("store").findAll("sysconfig").then(function (sysconfig) {
      //   let sysTime = sysconfig.get("firstObject").get("sysTime");//系统时间
        $("#"+saveId).addClass("tapped");
        setTimeout(function(){$("#"+saveId).removeClass("tapped");},300);
        // console.log("saveCountApply11111111 sysTime",sysTime);
        // _self.get("serviceItem").set("sysTime",sysTime);
        _self.sendAction("finishSave",_self.get("serviceItem"));

      // });

    },
    //删除按钮
    minusAction() {
        var _self = this;
        let itemExes = _self.get("itemExes");
        let itemExesLast = itemExes.get("lastObject");
        let itemExesLastId = itemExes.get("lastObject").get("id");
        console.log("itemExesLastId:",itemExesLastId);
        _self.get("store").findRecord("nursingplanexe",itemExesLastId).then(function(nursingplanexe){
          nursingplanexe.set("delStatus", 1);
          nursingplanexe.save().then(function(){
            // _self.sendAction("queryFlagAction");
            let itemCountMinus = _self.get("itemCount") - 1;
            _self.set("itemCount",itemCountMinus);
            itemExes.removeObject(itemExesLast);
            App.lookup("controller:business").popTorMsg("执行记录删除成功！");
          });
        });
    },
    // saveCountApply(){
    //   var saveId = "save_"+this.get("itemId");
    //   let _self = this;
    //   console.log("itemProject111  type ",this.get("serviceItem"));
    //let sysTime = this.get("dataLoader").getNowTime();//系统时间
    //   this.get("store").findAll("sysconfig").then(function (sysconfig) {
    //     let sysTime = sysconfig.get("firstObject").get("sysTime");//系统时间
    //     $("#"+saveId).addClass("tapped");
    //     setTimeout(function(){$("#"+saveId).removeClass("tapped");},300);
    //     console.log("saveCountApply11111111 sysTime",sysTime);
    //     let remark = [];
    //     if(_self.get("serviceItem.applyContent")&&_self.get("serviceItem.applyContent").length>0){
    //       remark = JSON.parse(_self.get("serviceItem.applyContent"));
    //       remark = [].slice.call(remark);
    //     }
    //     //把详情信息附加到之前的信息中
    //     // let user = _self.get("global_curStatus").getUserReal();,applyUserId:user.get("id")//
    //     let detailItem = {content:"",finishTime:sysTime};
    //     remark.push(detailItem);
    //     _self.get("serviceItem").set("applyContent",JSON.stringify(remark));
    //     // App.lookup("controller:business.mainpage.service-care").finishService(_self.get("serviceItem"));
    //     _self.sendAction("finishSave",_self.get("serviceItem"));
    //
    //   });
    //
    // },
    // minusAction(itemExeId,exeStaffId) {
    //     var _self = this;
    //     this.set('showExesModal', false);
    //     var user = this.get("global_curStatus").getUser();
    //     var curUser = user.get("employee");
    //     console.log("curUser id:",curUser.get("id"));
    //     console.log("exeStaffId",exeStaffId);
    //     if(curUser.get("id") != exeStaffId){
    //       App.lookup("controller:business").popTorMsg("不可以删除其他人的执行记录");
    //       return;
    //     }
    //     _self.get("store").findRecord("nursingplanexe",itemExeId).then(function(nursingplanexe){
    //       nursingplanexe.set("delStatus", 1);
    //       nursingplanexe.save().then(function(){
    //         _self.sendAction("queryFlagAction");
    //         let itemCountMinus = _self.get("itemCount") - 1;
    //         _self.set("itemCount",itemCountMinus);
    //         App.lookup("controller:business").popTorMsg("执行记录删除成功！");
    //       });
    //     });
    // },
    // minusAction(itemExeId){
    //   var minusId = "minus_"+this.get("itemId");
    //   $("#"+minusId).addClass("tapped");
    //   setTimeout(function(){$("#"+minusId).removeClass("tapped");},300);
    //   var _self = this;
    //   var serviceItem = this.get("serviceItem");
    //   var remark = JSON.parse(serviceItem.get("applyContent"));
    //   remark = [].slice.call(remark);
    //   console.log("serviceItem  ID",remark);
    //   remark.pop();
    //   serviceItem.set("applyContent",JSON.stringify(remark));
    //   _self.sendAction("finishSave",_self.get("serviceItem"),function(){
    //     if(remark.length===0){App.lookup("controller:business").popTorMsg("该护理任务次数已经是 0 次了");}});
      // App.lookup("controller:business.mainpage.service-care").finishService(this.get("serviceItem"),function(){
      //   if(remark.length===0){
      //     App.lookup("controller:business").popTorMsg("该护理任务次数已经是 0 次了");
      //   }else {
      //     // App.lookup("controller:business").popTorMsg("护理任务--" + _self.get("serviceItem").get("title") + ",减少一次");
      //   }
      // });
    // },

    addAction(){},

  }

});
