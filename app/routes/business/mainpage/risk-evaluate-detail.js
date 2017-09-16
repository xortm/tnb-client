import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },
  header_title: "评估模板信息",
  model() {
    return {};
  },
  setupController(controller, model){
    var _self = this;
    this._super(controller, model);
    //进入前先清除垃圾数据
    this.store.unloadAll('evaluateanswer');
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    controller.set('curQuestion','');
    controller.set('curAnswer','');
    let evaInfo = this.store.peekRecord('evaluatemodel',id);
    controller.set('evaInfo',evaInfo);
    if(editMode=='edit'){//点击列表进入的详情页
      controller.set('detailEdit',false);
      /*
        评估模板修改编辑
        1、查询答案列表，选择该模板下的所有答案(answer-->question-->model)
        2、生成对应的问题列表
        3、将每个问题的答案放入
      */
      //查询答案列表，选择该模板下的所有答案
      this.store.query('evaluateanswer',{filter:{question:{model:{id:id}}}}).then(function(answerList){
        //清除answer垃圾数据
        let answerAll = _self.store.peekAll('evaluateanswer');
        answerAll.forEach(function(answer){
          if(!answer.get("id")){
            answer.set('hasHidden',true);
          }
        });
        let questionList = new Ember.A();
        answerList.forEach(function(answer){
          if (!questionList.findBy("id", answer.get('question.id'))) {
              questionList.pushObject(answer.get('question.content'));
              questionList = questionList.sortBy('seq');
              for(let i=0;i<questionList.get('length');i++){
                questionList.objectAt(i).set('seq',i+1);
              }
              questionList.forEach(function(question){
                let seq = ['A','B','C','D','E','F','G'];
                let answerList = question.get('answerList').sortBy('seq');
                for(let i=0;i<answerList.get('length');i++){
                  answerList.objectAt(i).set('curIndex',seq[i]);
                }
              });
              controller.set('questionList',questionList);
          }
        });
        });
      this.store.query('evaluatescorescope',{filter:{model:{id:id}}}).then(function(scoreScopeList){
        controller.set('scoreScopeList',scoreScopeList);
      });
    }else{//点击新增进入的编辑页
      controller.set('detailEdit',true);
        let questionList = new Ember.A();
        controller.set('questionList',questionList);
        controller.set('scoreScopeList',null);
    }
    this.store.query('evaluatescorescope',{filter:{model:{id:id}}}).then(function(scoreScopeList){
      controller.set('scoreScopeList',scoreScopeList);
    });
  }
});
