import Ember from 'ember';
import CardItem from '../ui/card-item';

export default CardItem.extend({
  classStatic: true,
  classNameBindings: ['classStatic:short-list-line','classStatic:pointer','bgClass'],
  bgClass: Ember.computed("hasSelected",function(){
    if(this.get("question.hasSelected")){
      return "bg-accent";
    }
    return "";
  }),
  realSeq: Ember.computed("seq",function(){
    return this.get("seq") + 1;
  }),

  hasSelected: false,//选中标志
  question: null,//对应的问题数据
  name:Ember.computed('seq',function(){
    return "input"+this.get('seq');
  }),
  edit:false,
  actions:{
    // select(){
    //
    //   console.log('有我！');
    //   this.set("question.hasSelected",true);
    //   this.sendAction("chooseQuestion",this.get("question"));
    // },
    toedit(){
      this.set('edit',true);
    },
    cancel(){
      this.set('edit',false);
    },
    delQuestion(){
      this.sendAction('delQuestion',this.get("question"));
    },
    saveNewQuestion(){
      this.set('edit',false);
      this.sendAction('saveNewQuestion',this.get("question"));
    },
    toAddAnswer(){
      this.sendAction('toAddAnswer');
    },
    upOrder(){
      this.sendAction('upOrder');
    }
  }
});
