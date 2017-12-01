import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
const {
    taskApplyStatus_apply,
    taskApplyStatus_applySuc,
    taskApplyStatus_applyFail
} = Constants;
export default Ember.Controller.extend(InfiniteScroll, {
    mainController: Ember.inject.controller('business.mainpage'),
    dateService: Ember.inject.service("date-service"),
    queryCondition: '',
    scoreObs: function() {
    }.observes("scores"),
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
    //查询答卷
    query: function(evaluate) {
        var _self = this;
        var serviceArray = new Ember.A();
        var question = "";
        if (evaluate) {
            this.get("store").query('evaluateexameranswer', {
                filter: {
                    "[result][id]": evaluate.get('id') //问卷id查询客户答卷
                }
            }).then(function(answers) {
                var resultStr = "";
                console.log("answers is", answers);
                answers.forEach(function(answer) {
                    //查询护理项目
                    console.log("answer isis", answer);
                    answer.get("answer").then(function(answers) {
                        console.log("answer get", answers);
                        if (answers.get("services")) {
                            answers.get("services").then(function(services) {
                                console.log("services isis", services);
                                var len = services.get("length");
                                console.log("len is:" + len);
                                for (var i = 0; i < len; i++) {
                                    var service = services.objectAt(i);
                                    console.log("service id:" + service.get("id"));
                                    if (!serviceArray.findBy("id", service.get("id"))) {
                                        serviceArray.pushObject(service);
                                    }
                                }
                                console.log("serviceArray now", serviceArray);
                                evaluate.set("serviceArray", serviceArray);
                            });
                        }
                        //查询答卷分数
                        if (answers.get("score")) {
                            console.log("answers score", answers.get("score"));
                            var score = answers.get("score");
                            var scores = null;
                            scores += score;
                            evaluate.set("scores", scores);
                            _self.set("scores", scores);
                            console.log("scores is", scores);
                        }
                        //查询护理等级
                    });
                });
            });
        }
    },
    //压疮记录表
    customerFieldList:function(){
      //拼接列表，包括老人姓名，记录日期，所有的内容项，有记录的将记录填到对应的内容项
      let customerFieldList = new Ember.A();
      let allRiskList = this.get('allRiskList');//所有记录模板
      let allResultList = this.get('allResultList');//所有记录表
      let allFieldList = this.get('allFieldList');//所有内容项
      let allRiskFieldList = this.get('allRiskFieldList');//所有记录数据
      let recordShow = this.get('recordShow');//是否显示记录表
      if(!allFieldList||!allRiskFieldList||!allResultList){
        return null;
      }
      let fieldList = new Ember.A();//处理所有的内容项，将没有子级内容项的放到一个数组，用来显示数据
      allFieldList.forEach(function(field){
        if(field.get('children.length')==0){
          fieldList.pushObject(field);
        }
      });
      if(recordShow){//选择记录表
        //选择所有记录表的内容项，目前只有一个表，先不做过滤了
        allResultList.forEach(function(result){
          let item = Ember.Object.create({});
          item.set('customer',result.get('customer'));
          item.set('recordTimeStr',result.get('recordTimeStr'));
          //该记录表里所有的内容项
          let cusFieldList = allRiskFieldList.filter(function(field){
            return field.get('recordResult.id') == result.get('id');
          });
          let valueList = new Ember.A();
          //遍历所有要填写的内容项，如果该内容项在记录中有数据，则填写数据，否则为空
          fieldList.forEach(function(field){
            let item = Ember.Object.create({});
            let cusField = cusFieldList.findBy('field.id',field.get('id'));
            if(cusField){
              if(field.get('valueType.typecode')=="fieldType4"){
                item.set('boolean',true);
                if(cusField.get('value')=='true'){
                  item.set('fieldValue',1);
                }
              }else{
                item.set('fieldValue',cusField.get('value'));
              }

            }
            valueList.pushObject(item);
          });
          item.set('valueList',valueList);
          customerFieldList.pushObject(item);
        });
        this.set('customerFieldList',customerFieldList);
      }

    }.observes('allFieldList','allRiskFieldList','allResultList','recordShow'),
    actions: {
        chooseTab(str){
          let _self = this;
          if(str=='evaShow'){
            this.set('evaShow',true);
            this.set('recordShow',false);
          }else{//先只做护理记录表
            this.set('evaShow',false);
            this.set('recordShow',true);
          }
        },

        dpShowAction(e) {

        },
        goDetail(evaluate) {
            var mainpageController = App.lookup('controller:business.mainpage');
            let id = evaluate.get("id");
            mainpageController.switchMainPage('pressure-eva-detail', {
                id: id,
            });
        },
        search(flag){
          this.set("dateQueryCondition", flag);
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.pressure-sores-service").doQuery();
        },
        //时间选择器确定
        submmit(){
          this.set('dateShow', false);
          this.set("dateQueryCondition", 'flag');
          App.lookup("route:business.mainpage.pressure-sores-service").doQuery();
        },
        //清空时间
        emptied(){
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set("dateQueryCondition", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.pressure-sores-service").doQuery();
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
