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
        //this.queryLevel();
        //this.set("scores", scores);
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
    // queryLevel: function() {
    //     var _self = this;
    //     var filterLevel = {};
    //     if (this.get("scores")) {
    //         var computedScores = this.get("scores");
    //         console.log("computedScores is", computedScores);
    //         filterLevel = $.extend({}, {
    //             'lowScore@$lte': computedScores
    //         }, {
    //             'highScore@$gte': computedScores
    //         });
    //         console.log("filterLevel is", filterLevel);
    //     }
    //     this.get("store").query('nursinglevel', {
    //         filter: filterLevel
    //     }).then(function(level) {
    //         console.log("level is what", level);
    //     });
    // },
    actions: {
        dpShowAction(e) {

        },
        goDetail(evaluate) {
            var mainpageController = App.lookup('controller:business.mainpage');
            let id = evaluate.get("id");
            console.log("id33333333333", id);
            mainpageController.switchMainPage('evaluate-question-detail', {
                id: id,
                editMode: "edit"
            });
        },
        toAddPage() {
            //this.query();
            var mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('evaluate-question-add', {
                editMode: "add",
                id: ""
            });

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
          App.lookup("route:business.mainpage.evaluate-question").doQuery();
        },
        //时间选择器确定
        submmit(){
          this.set('dateShow', false);
          this.set("dateQueryCondition", 'flag');
          App.lookup("route:business.mainpage.evaluate-question").doQuery();
        },
        //清空时间
        emptied(){
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set("dateQueryCondition", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.evaluate-question").doQuery();
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
