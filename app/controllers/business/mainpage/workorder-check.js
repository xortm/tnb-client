import Ember from 'ember';

export default Ember.Controller.extend({
  dateService: Ember.inject.service('date-service'),

  workOrder:null,
  ordername:'',
  workOrderAddlist:{},
  time:'',
  content:'',
  completeList:[{
    id:1,
    typename:'已成单',
  },{
    id:0,
    typename:'未成单',
  },{
    id:2,
    typename:'已确认',
  },],
  showPopPasschangeModal:false,
  showPopPassworkorderModal:false,
  choosecolor:false,
  // chooseDateFrom:Ember.computed(function(){
  //   var date = new Date();
  //   var format = ("YYYY-MM-DD");
  //   return moment(date).format(format);
  // }),
  chooseDateTo:Ember.computed(function(){
    var date = new Date();
    var format = ("YYYY-MM-DD");
    return moment(date).format(format);
  }),
  freezeDisabled:Ember.computed('freezeReason',function() {
    if(!!this.get('freezeReason')) {
      return false;
    }
      return true;
  }),
actions:{
  freezeFunc(){
    var _self = this;
    var workOrder = this.get('workOrder');
    var freezeReason = this.get('freezeReason');
      _self.store.findRecord('workorder',workOrder.get('id')).then(function(workorderSearch) {
            workorderSearch.set('isSuccess',3);
            workorderSearch.set('freezeReason',freezeReason);
            console.log('in 111 1 ',workOrder.get('isSuccess'));
            _self.get("global_ajaxCall").set("action","freezeOrder");
            workorderSearch.save().then(function(){
               _self.set('freezemodal',false);
            });
        });
  },
  removefreezeFunc(){
    var _self = this;
    var workOrder = this.get('workOrder');
      _self.store.findRecord('workorder',workOrder.get('id')).then(function(workorderSearch) {
          workorderSearch.set('isSuccess',1);
          _self.get("global_ajaxCall").set("action","thawOrder");
          workorderSearch.save().then(function(){
           _self.set('freezeRemovemodal',false);
        });
      });
  },
  checkConfirm(){
    var _self = this;
    var workOrder = this.get('workOrder');
    workOrder.set('isSuccess',2);
    _self.get("global_ajaxCall").set("action","confirmOrder");
    workOrder.save().then(function(){
      console.log('setsuccess');
      _self.set('alertmodal',false);
    });
  },
  displayDetail(workOrder){//类似于changeCallItem方法
    console.log('thedatecome',workOrder);
    var _self = this;
    console.log('_self.get(workOrder) ?',_self.get('workOrder'));
    if(_self.get('workOrder')){
      console.log('in if now workOrderbefore exist');
        _self.get('workOrder').set('choosecolor',false);
    }
    if(workOrder){
    workOrder.set('choosecolor',true);
    _self.set('workOrder',workOrder);
    var addlist = _self.get('store').query('workorder-add',{sort:{createTime:'desc'},filter:{workorder:{id:workOrder.get('id')}}}).then(function(addlist){
      console.log('workorderaddlistget',addlist);
      _self.set('workOrderAddlist',addlist);
      //_self.set('choosecolor',true);
      //_self.set('workOrder',)//给每一个workOrder都set自己的choosecolor值，类似于CRL_status那种
    });
    _self.set('workOrderAddlist',addlist);
    }
    //_self.get('model.workOrderList').set('choosecolor',false);
    // _self.get('workOrderList').forEach(function(item){
    //   item.set('choosecolor',false);
    // });
    // _self.get('workOrder').set('choosecolor',true);
  },
  cusSelect(customer){
    this.set('customerSel',customer);
  },
  searchorder(){
    this.get('target').send('findQuery');
  },
  statuschoose(value){
    var _self = this;
    var curtask = this.get('curtask');
    this.set('status',value);
    this.get('target').send('findQuery');
  },
  cancelSubmit(){
    this.set("alertmodal",false);
  },
  cancelFreeze(){
    this.set("freezemodal",false);
  },
  cancelremoveFreeze(){
    this.set("freezeRemovemodal",false);
  },
  popSuccess(){
    console.log('popFollow in management');
    this.set("alertmodal",true);
    console.log('popFollow in check',this.get('alertmodal'));
  },
  popfreezeOrder(workOrder){//冻结
    console.log('');
      this.set("freezemodal",true);
  },
  popremovefreezeOrder(workOrder){//冻结
      this.set("freezeRemovemodal",true);
  },
  choosetime(){
function change(time){
  var date = new Date();
  date.setFullYear(time.substring(0,4));
  date.setMonth(time.substring(5,7)-1);
  date.setDate(time.substring(8,10));
  date.setHours(time.substring(11,13));
  date.setMinutes(time.substring(14,16));
  date.setSeconds(time.substring(17,19));
  return Date.parse(date)/1000;
}
var _self = this;
var endTime = this.chooseDateTo;
var a = this.get('dateService').getLastSecondStampOfDayString(endTime);
//var a = change(endTime);
console.log('time endTime',a);
var beginTime = this.chooseDateFrom;
var b = change(beginTime);
console.log('time beginTime',b);
_self.set('a',a);
_self.set('b',b);
  _self.get('target').send('findQuery');
    },
},
});
