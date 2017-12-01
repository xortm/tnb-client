import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
//const {bizTypeWithdra_wash} = Constants;
export default BaseBusiness.extend(Pagination, {
    dataService: Ember.inject.service("date-service"),
    feedBus:Ember.inject.service('feed-bus'),
    header_title: '压疮护理',
    model() {
        return {};
    },
    buildQueryParams() {
        var _self = this;
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        //查询条件：已完成的压疮类模板的问卷
        var filter = {
          model:{
            riskAssessModel:{
              code:'pressureSores'
            }
          },
          completeStatus:1,
          delStatus:0
        };
        var sort;
        if (curController) {
            var queryCondition = curController.get('queryCondition');
            var dateQueryCondition = curController.get('dateQueryCondition');
            if (curController.get('queryCondition')) {
                filter = $.extend({}, filter, {'[customer][bed][room][name@$like]@$like@$or1':curController.get('queryCondition')});
                filter = $.extend({}, filter, {'[customer][name@$like]@$or1': curController.get('queryCondition')});
                filter = $.extend({}, filter, {'[customer][customerStatus][typecode@$like]@$or2---1':'customerStatusIn'});
                filter = $.extend({}, filter, {'[customer][customerStatus][typecode@$like]@$or2---2':'customerStatusTry'});
                filter = $.extend({}, filter, {'[customer][customerStatus][typecode@$like]@$or2---3':'customerStatus0'});
            }else {
              filter = $.extend({}, filter, {'[customer][customerStatus][typecode@$like]@$or1---1':'customerStatusIn'});
              filter = $.extend({}, filter, {'[customer][customerStatus][typecode@$like]@$or1---2':'customerStatusTry'});
              filter = $.extend({}, filter, {'[customer][customerStatus][typecode@$like]@$or1---3':'customerStatus0'});
            }
            if (dateQueryCondition) {
                var compareDate = null;
                if (dateQueryCondition === "today") {
                    compareDate = this.get("dataService").getTodayTimestamp();
                }
                if (dateQueryCondition === "seven") {
                    compareDate = this.get("dataService").getDaysBeforeTimestamp(7);
                }
                if (dateQueryCondition === "thirty") {
                    compareDate = this.get("dataService").getDaysBeforeTimestamp(30);
                }
                filter = $.extend({}, filter, {
                    'createDateTime@$gte': compareDate
                });
                console.log("compareDate is", compareDate);
            }
            //自定义日期搜索
            var conBeginDate = curController.get("beginDate");
            console.log("++++conBeginDate+++++", conBeginDate);
            var conEndDate = curController.get("endDate");
            console.log("++++conEndDate+++++", conEndDate);
            if (conBeginDate && conEndDate) {
                var beginCompare = this.get("dataService").getFirstSecondStampOfDay(conBeginDate);
                console.log("beginCompare is", beginCompare);
                var endCompare = this.get("dataService").getLastSecondStampOfDay(conEndDate);
                console.log("endCompare is", endCompare);
                filter = $.extend({}, filter, {
                    'createDateTime@$gte': beginCompare
                }, {
                    'createDateTime@$lte': endCompare
                });
            }
        }
        params.filter = filter;
        sort = {
            '[createDateTime]': 'desc',
        };
        params.sort = sort;
        return params;
    },
    doQuery: function() {
        var _self = this;
        var params = this.buildQueryParams(); //拼查询条件
        var evaluateList = this.findPaged('evaluateresult', params).then(function(evaluateList){
          _self.store.query('risk-level',{filter:{assess:{code:'pressureSores'}}}).then(function(riskLevelList){//压疮等级列表
            evaluateList.forEach(function(evaluate){
              let score = evaluate.get('score');
              riskLevelList.forEach(function(level){
                if((score<=level.get('maxScore'))&&(score>=level.get('minScore'))){
                  evaluate.set('levelName',level.get('levelName'));
                }
              });
            });
            _self.set('feedBus.pressureLevelList',riskLevelList);
            _self.getCurrentController().set("evaluateList", evaluateList);
          });
        });


    },
    setupController(controller, model) {
        let _self = this;
        _self.getCurrentController().set('evaShow',true);
        var queryCondition = controller.get('input');
        controller.set('queryCondition', queryCondition);
        controller.set("dateQueryCondition", "");
        this._super(controller, model);
        //取评估模板和答案放入全局
        this.store.query('evaluateanswer',{filter:{question:{model:{riskAssessModel:{code:'pressureSores'},useFlag:0,delStatus:0}}}}).then(function(list){
          let questionList = new Ember.A();
          list.forEach(function(answer){
            if(!questionList.findBy('id',answer.get('question.id'))){
              questionList.pushObject(answer.get('question'));
            }
          });
          let evaluate ;
          questionList.forEach(function(question){
            evaluate = question.get('model');
          });
          _self.set('feedBus.evaluateModel',evaluate);
          _self.set('feedBus.evaluateQuestions',questionList);
          _self.set('feedBus.evaluateAnswers',list);
        });
        //取所有的压疮类表格
        this.store.query('risk-record-model',{filter:{riskModel:{code:'pressureSores'}}}).then(function(riskList){
          controller.set('allRiskList',riskList);
          riskList.forEach(function(risk){
            console.log('risk name in service',risk.get('name'));
          });
          console.log('allRiskList in service',riskList);
        });
        //取所有压疮类内容项
        this.store.query('risk-record-field',{}).then(function(fieldList){
          controller.set('allFieldList',fieldList);
          let firstFieldList = new Ember.A();//列表第一级
          let secondFieldList = new Ember.A();//列表第二级
          let num = 2;
          fieldList.forEach(function(field){
            console.log('field name in service',field.get('name'));
            if(field.get('children.length')>0){
              console.log('has children length',field.get('children.length'));
              field.set('hasChildren',true);
              num += field.get('children.length');
            }else{
              num +=1;
              field.set('hasChildren',false);
            }

            if(field.get('parent.id')){
              secondFieldList.pushObject(field);
              num += -1;
            }else{
              firstFieldList.pushObject(field)
            }
            console.log('td num :',num);
          });
          controller.set('allFieldList',fieldList);
          controller.set('firstFieldList',firstFieldList);
          controller.set('secondFieldList',secondFieldList);
          console.log('allFieldList in service',fieldList);
        })
        //取所有的压疮表记录
        this.store.query('risk-record-result',{filter:{model:{riskModel:{code:'pressureSores'}}},sort:{id:'desc'}}).then(function(resultList){
          controller.set('allResultList',resultList);
          resultList.forEach(function(result){
            console.log('result in service',result.get('customer.name'),result.get('recordTimeStr'));
          });
          console.log('allResultList in service',resultList);
        });
        //取所有压疮结果子记录
        this.store.query('risk-field-result',{}).then(function(fieldResultList){
          console.log('all risk field result length:',fieldResultList.get('length'));
          controller.set('allRiskFieldList',fieldResultList);
        })
        this.doQuery();
    }
});
