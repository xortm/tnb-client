import Ember from 'ember';
import CardItem from '../ui/card-item';

export default CardItem.extend({
  constants:Constants,
  hasChoosed: false,//选中标志
  // service: null,
  count:Ember.computed('service',function(){
    let service = this.get('service');
    if(service.get("ent.countType.typecode")=='countTypeByTime'){
      return true;
    }else{
      return false;
    }
  }),
  frequency:Ember.computed('service','service.ent.frequency','flags',function(){
    let frequency;
      if(this.get('service.frequency')){
        frequency = this.get('service.frequency');
      }else{
        frequency = this.get('service.ent.frequency');
      }
    return frequency;
  }),
  period:Ember.computed('service.period','service.ent.period',function(){
    let period;
    if(this.get('service.period.typename')){
      period = this.get('service.period');
    }else{
      period = this.get('service.ent.period');
    }
    return period;
  }),
  referencePrice:Ember.computed('service.referencePrice',function(){
    if(this.get('service.referencePrice')){
      return this.get('service.referencePrice');
    }
  }),
  didInsertElement(){
    this._super(...arguments);
    let _self = this;
    this.$().mouseup(function(e){
      let frequency = $('.frequency');
      let period = $('.period');
      let serviceCheck = $('.service-check');
      if(frequency.length>0||period.length>0||serviceCheck.length>0){
        if(!frequency.is(e.target) && frequency.has(e.target).length === 0&&!period.is(e.target) && period.has(e.target).length === 0&&!serviceCheck.is(e.target) && serviceCheck.has(e.target).length === 0){
          _self.sendAction('checkService',_self.get('service'));
        }else{
          e.preventDefault();
          e.stopPropagation();
        }
      }
    });
  },
    actions:{
      checkNum(service){
        if(!isNaN(service.get('frequency'))){
        }else{
           App.lookup('controller:business.mainpage').showAlert("频次必须是数字");
           this.$(".frequency")[0].focus();
        }
      },
    chooseService(service){
      if(service.get('hasChoosed')){
        this.set("service.hasChoosed",false);
      }else{
        let period = this.get('period');
        let frequency = this.get('frequency');
        let referencePrice=this.get('referencePrice');//消费的实际价格
        service.set('referencePrice',referencePrice);
        service.set('ent.period',period);
        service.set('ent.frequency',frequency);
        service.set('period',period);
        service.set('frequency',frequency);
        this.set("service.hasChoosed",true);
      }
      this.sendAction("chooseService",service.get('ent'));//护理等级
      this.sendAction("chooseService",service);//护理方案
    }

  }
});
