import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
export default BaseBusiness.extend(Pagination, {
    queryParams: {
        id: {
            refreshModel: true
        },
        editMode: {
            refreshModel: true
        },
    },
    feedBus: Ember.inject.service("feed-bus"),
    header_title: '评估问卷详情',
    model() {
        return {};
    },
    setupController: function(controller, model) {
        this._super(controller, model);
        controller.set('evaluate',null);
        let _self = this;
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');

        // this.store.findRecord('evaluatebatch',id).then(function(evaluate){
          _self.store.query('evaluateexameranswer',{filter:{result:{evaluateBatch:{id:id}}}}).then(function(allAnswerList){
            let results = new Ember.A();//所有问卷列表
            let questions = new Ember.A();//所有问题列表
            let evaluate = _self.store.peekRecord('evaluatebatch',id);
            allAnswerList.forEach(function(answer){
              if(answer.get('selectFlag')==0){
                answer.set('hasSelcted',false);
              }else if(answer.get('selectFlag')==1){
                answer.set('hasSelcted',true);
              }
              if(!results.findBy('id',answer.get('result.id'))){
                results.pushObject(answer.get('result'));
              }
              //每个问题和其对应的答案处理
              if(!questions.findBy('id',answer.get('question.id'))){
                let question = answer.get('question') ;
                let answers = allAnswerList.filter(function(item){
                  return item.get('question.id') == answer.get('question.id');
                });
                let seq = ['A','B','C','D','E'];
                for(let i=0;i<answers.get('length');i++){
                  answers.objectAt(i).set('answerIndex',seq[i]);
                }
                question.set('answerList',answers);
                questions.pushObject(question);
              }
            });
            results.forEach(function(result){
              console.log('问卷信息：'+result.get('id')+result.get('score'));
              console.log('批次信息：'+result.get('evaluateBatch.id')+result.get('evaluateBatch.customer.name'));
              //判断模板规范,属于统一规范的，显示自理等级和护理等级
              if(result.get('model.modelSource.remark')=='beijing'){
                controller.set('sourceType',true);
              }else{
                controller.set('sourceType',false);
              }
              let levelName = '未完成';
              //设置所有问卷为收起状态
              result.set('hasShow',false);
              result.set('doneFlag',1);
              //设置问卷的等级名称，一般问卷取护理等级，规范类问卷取自理等级
              if(result.get('level.id')){
                levelName = result.get('level.name');
              }else if(result.get('actionLevel.id')){
                levelName = result.get('actionLevel.typename');
              }else{
                result.set('doneFlag',0);
              }
              //设置问卷的问题列表
              let questionList = questions.filter(function(question){
                return question.get('model.id') == result.get('model.id');
              });
              questionList.forEach(function(question,index){
                question.set('realIndex',index+1);
              });
              result.set('levelName',levelName);
              result.set('questions',questionList);
            });
            evaluate.set('results',results);
            controller.set('evaluate',evaluate);
            if(editMode=='edit'){
              controller.set('addMode', false);
              controller.set("flagEdit", true);
            }else if(editMode=='add'){
              controller.set('addMode', true);
              controller.set("flagEdit", false);
            }
            controller.incrementProperty("changeFlag");
          });

        // });
        this.store.query('employee', {filter:{staffStatus:{typecode:'staffStatusIn'}}}).then(function(userList) {
            controller.set('userList', userList);
        });
    },
});
