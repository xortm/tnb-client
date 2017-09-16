import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Ember.Controller.extend({
  dateService: Ember.inject.service('date-service'),

  workOrder:null,
  ordername:'',
  workOrderAddlist:{},
  time:'',
  content:'',
  showPopPasschangeModal:false,
  showPopPassworkorderModal:false,
  choosecolor:false,
  applyDisabled: Ember.computed(function() {
    console.log('fsdfnpowenf',this.get('customerSel'));
    if(this.get('theme') && this.get('customerSel')) {
      return false;
    }
    else {
      return true;
    }
  }).property('theme','customerSel'),
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
  saveDisabled: Ember.computed(function() {
    if(this.get('theme')&&this.get('customerSel')) {
      console.log('false here in js');
      return false;
    }
    else {
      console.log('true here in js');
      return true;
    }
  }).property('theme','customerSel'),
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
actions:{
  displayDetail(workOrder){//类似于changeCallItem方法
    console.log('thedatacome',workOrder);
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
      });
      _self.set('workOrderAddlist',addlist);
    }
    //_self.get('model.workOrderList').set('choosecolor',false);
    // _self.get('workOrderList').forEach(function(item){
    //   item.set('choosecolor',false);
    // });
    // _self.get('workOrder').set('choosecolor',true);
  },
  confirm(){//成单
    var workOrder = this.get('workOrder');
    // console.log('item get',workOrder);
    var _self = this;
    // console.log('workOrder1',workOrder.get('id'));
    // _self.get('store').query('workorder',{filter:{id:workOrder.get('id')}}).then(function(workOrder){
    //   var workOrder1 = workOrder.get('firstObject');
    //   console.log('workOrder1',workOrder1);
      workOrder.set('isSuccess','1');
       _self.get("global_ajaxCall").set("action","succOrder");
      workOrder.save().then(function(){
        console.log('setsuccess management');
        _self.set('alertmodal',false);  
      });
    // });

  },
  successOrder(workOrder){
    this.set('alertmodal',true);
  },
  cancelSubmit(){
    this.set('alertmodal',false);
  },
  followOrder(){//先取值 再创建 再赋值
    var _self = this;
    console.log('followOrder in management');
    var curUser = this.get("global_curStatus").getUser();
    var curOrder = this.get('workOrder');
    //var remindtime = this.get('time');console.log('remindtimeget',remindtime);
    var content = this.get('content');console.log('contentget',content);

    var orderAdd = this.store.createRecord('workorder-add',{});
    var user = this.store.createRecord('user',{});
    var order = this.store.createRecord('workorder',{});
    //var createtime = new Date();
    user.set('id',curUser.get('id'));
    order.set('id',curOrder.get('id'));
    orderAdd.set('additional',user);
    orderAdd.set('workorder',order);
    orderAdd.set('content',content);
    orderAdd.set('additionalType','1');
    var workorder = _self.get('workOrder');
    orderAdd.save().then(function(oadd){
      console.log('save ok,orderAdd',oadd);
      _self.send('displayDetail',workorder);//实时追加
    });
    // alert('追加完成！');
    this.set("showPopPasschangeModal",false);
  },
  addWorkorder(){
    var _self = this;
    var curTask = this.get('global_curStatus').getTask().get('task');
    var curUser = this.get('global_curStatus').getUser();
    var a = new Array();
    console.log('showPopPassworkorderModal in ');
    this.set('theme','');
    this.set('description','');
    this.set('customerSel','');
    // this.set('customerSel',{});
    this.set('showPopPassworkorderModal',true);
    _self.get('store').query('cs-customer',{filter:{cs:{id:curUser.get('id')},customer:{task:{id:curTask.get('id')}}}}).then(function(customers){
      _self.set('customers',customers);
    });
    console.log('customersget in controller',_self.get('customers'));
  },
  saveWorkorder(){
    var _self = this;
    var curUser =  this.get("global_curStatus").getUser();
    var curTask = this.get('global_curStatus').getTask().get('task');
    var title = this.get('theme');
    var desc = this.get('description');
    var cus = this.get('customerSel').get('customer');

    var workorder = this.store.createRecord('workorder',{});
    var user = this.store.createRecord('user',{});
    var task = this.store.createRecord('task',{});
    var cust = this.store.createRecord('customer',{});

    user.set('id',curUser.get('id'));
    task.set('id',curTask.get('id'));
    cust.set('id',cus.get('id'));

    workorder.set('title',title);
    workorder.set('desc',desc);
    workorder.set('isSuccess',0);
    workorder.set('creater',user);
    workorder.set('header',user);
    workorder.set('task',task);
    workorder.set('customer',cus);
    workorder.save().then(function(){
      _self.get('target').send('refreshroute');

      // alert('创建完成！');
      _self.set('showPopPassworkorderModal',false);
    });
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
  cancelPassSubmit(){
    this.set("showPopPasschangeModal",false);
  },
  cancelPassworkorderSubmit(){
    this.set("showPopPassworkorderModal",false);
  },
  popFollow(){
    console.log('popFollow in management');
    this.set("showPopPasschangeModal",true);
          console.log('popFollow in mana',this.get('showPopPasschangeModal'));
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
