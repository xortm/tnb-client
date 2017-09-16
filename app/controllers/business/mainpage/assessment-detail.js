import Ember from 'ember';

export default Ember.Controller.extend({
  assessmengList:Ember.computed('allAssessmentList',function(){
    let allAssessmentList = this.get('allAssessmentList');
    if(!allAssessmentList){
      return ;
    }
    let parentList = new Ember.A();
    let childrenList = new Ember.A();
    allAssessmentList.forEach(function(assessmentResult){
      console.log('assessmentResult',assessmentResult.get('assessmentIndicator.id'));
      let item = Ember.Object.create();
      item.set('score',assessmentResult.get('score'));
      item.set('assessment',assessmentResult.get('assessmentIndicator'))
      if(assessmentResult.get('assessmentIndicator.level')==0){
        //所有的考核项目
        parentList.pushObject(item);
      }else{
        //所有的考核细项
        childrenList.pushObject(item);
      }
    });
    parentList.forEach(function(parent,index){
      //将考核细项分给对应的考核项目
      let children = new Ember.A();
      childrenList.forEach(function(child){
        if(child.get('assessment.parent.id')==parent.get('assessment.id')){
          children.pushObject(child);
        }
      });
      if(children.get('length')>0){
        for(let i=1;i<=children.get('length');i++){
          children.objectAt(i-1).set('index',i);
        }
      }
      console.log('children',children.get('length'));
      parent.set('index',index+1);
      parent.set('children',children);
    });
    console.log('parentList',parentList.get('length'));
    return parentList;
  }),
  actions:{

  }
});
