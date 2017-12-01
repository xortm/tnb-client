import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  dataLoader:Ember.inject.service('data-loader'),
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
    console.log("clear cache before");
    this.store.unloadAll('evaluateanswer');
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    controller.set('curQuestion','');
    controller.set('curAnswer','');
    controller.set('evaInfo',null);
    controller.set('questionList',null);
    if(editMode=='edit'){//点击列表进入的详情页
      controller.set('detailEdit',false);
      /*
        评估模板修改编辑
        1、查询答案列表，选择该模板下的所有答案(answer-->question-->model)
        2、生成对应的问题列表
        3、将每个问题的答案放入
      */
      //查询答案列表，选择该模板下的所有答案
      let evaInfo = this.store.peekRecord('evaluatemodel',id);
        controller.set('evaInfo',evaInfo);
        let modelSource = evaInfo.get('modelSource');
        console.log('source remark',modelSource.get('id'),modelSource.get('remark'),modelSource.get('name'));
        if(modelSource.get('remark') == 'beijing'){
          controller.set('sourceType',true);
          let actionLevelList = _self.get('dataLoader').findDictList('actionLevel');
          controller.set('actionLevelList',actionLevelList);
        }else{
          controller.set('sourceType',false);
        }
      this.store.query('evaluateanswer',{filter:{question:{model:{id:id}}}}).then(function(answerList){
        //清除answer垃圾数据

        let questionList = new Ember.A();
        answerList.forEach(function(answer){
          if (!questionList.findBy("id", answer.get('question.id'))) {
              questionList.pushObject(answer.get('question.content'));
              questionList = questionList.sortBy('seq');
              for(let i=0;i<questionList.get('length');i++){
                questionList.objectAt(i).set('seq',i+1);
              }
          }
        });
        questionList.forEach(function(question){
          let seq = ['A','B','C','D','E'];
          let answers = answerList.filter(function(answer){
            return answer.get('question.id') == question.get('id');
          });
          for(let i=0;i<answers.get('length');i++){
            answers.objectAt(i).set('curIndex',seq[i]);
          }
          question.set('answerList',answers);
        });
        controller.set('questionList',questionList);
        _self.store.query('evaluatescorescope',{filter:{model:{id:id}}}).then(function(scoreScopeList){
          controller.set('scoreScopeList',scoreScopeList);
        });
      });

    }else{//点击新增进入的编辑页
      controller.set('detailEdit',true);
      let evaInfo = this.store.peekRecord('evaluatemodel',id);
        controller.set('evaInfo',evaInfo);
        let questionList = new Ember.A();
        controller.set('questionList',questionList);
        controller.set('scoreScopeList',null);
        let modelSource = evaInfo.get('modelSource');
        console.log('source remark',modelSource.get('id'),modelSource.get('remark'),modelSource.get('name'));
        if(modelSource.get('remark') == 'beijing'){
          controller.set('sourceType',true);
          let actionLevelList = _self.get('dataLoader').findDictList('actionLevel');
          controller.set('actionLevelList',actionLevelList);
        }else{
          controller.set('sourceType',false);
        }

    }

    this.store.query('evaluatescorescope',{filter:{model:{id:id}}}).then(function(scoreScopeList){
      controller.set('scoreScopeList',scoreScopeList);
    });
    this.store.query('nursinglevel',{}).then(function(levelList){
      controller.set('levelList',levelList);
    });
  }
});
