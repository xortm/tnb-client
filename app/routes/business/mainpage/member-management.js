import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const {bizTypeWithdra_wash} = Constants;
// import RouteMixin from 'ember-cli-3pagination/remote/route-mixin';
export default BaseBusiness.extend(Pagination,{
  header_title:'会员管理',
  //tableSelector:'#datatable1_wrapper',
  model(){
    return {};
  },
  perPage: 12,
  buildQueryParams(){
    var _self = this;
    var params = this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter = {};
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          console.log("queryCondition:",curController.get('queryCondition'));
          // filter = $.extend({}, filter, {'[bed][room][name@$like]@$or1':curController.get('queryCondition')});
          // filter = $.extend({}, filter, {'[bed][name@$like]@$or1':curController.get('queryCondition')});
          filter = $.extend({}, filter, {'name@$like@$or1':curController.get('queryCondition')});
       }
    }
    params.filter = filter;
    sort = {
        '[createTime]': 'desc',
    };
    params.sort = sort;
    console.log("params is:", params);
    return params;
  },
  doQuery: function(){
    var _self = this;
    //显示加载标识
    // console.log('jiazaixianshi',_self.get("tableSelector"));
    // var mainpageController = App.lookup('controller:business.mainpage');
    // mainpageController.showTableLoading($(_self.get("tableSelector")));
    console.log('defaultCallaaaaaa');
    var params = this.buildQueryParams();//拼查询条件
    Ember.run.later(function(){
       _self.findPaged('customer',params).then(function(customerList){
         console.log('查到的所有用户是',customerList);
         //查询护理组
         var filterBedList=new Ember.A();
         var filter={};
         customerList.forEach(function(customer){
           filterBedList.pushObject(customer.get('bed'));
         });
         for(var i=0;i<customerList.length;i++){
           var j = i+1;
           var key = "bed][id@$or1---"+j;
           var value = filterBedList.objectAt(i).get('id');
           var filterNew = {};
           filterNew[key] = value;
           filter = $.extend({},filter, filterNew);
         }
         if(customerList.length!==0){
           _self.store.query('bednursegroup',{filter}).then(function(bednursegroupList){
             //构造护理人员
             //查询护理人员(通过查employeenursinggroup-查询所有的通过filter过滤)
             var groupList=new Ember.A();
             var filemployeenursinggroupList=new Ember.A();
             bednursegroupList.forEach(function(bednursegroup){
               groupList.pushObject(bednursegroup.get('group'));
             });
             _self.get('store').query('employeenursinggroup',{
               filter:{}
             }).then(function(employeenursinggroupList){
               customerList.forEach(function(customerObj){
                 groupList.forEach(function(group){
                   filemployeenursinggroupList = employeenursinggroupList.filter(function(employeenursinggroup){
                     return employeenursinggroup.get('group.id') == group.get('id');
                   });
                 });
                 var str ='';
                 filemployeenursinggroupList.forEach(function(filemployeenursinggroup){
                   if(filemployeenursinggroup){
                     str+=filemployeenursinggroup.get('employee.name')+',';
                   }
                 });
                 str=str.substring(0,str.length - 1);
                 customerObj.set('employeesName',str);
               });
             });
             //---------------------------
             //构造护理组
             _self.set('bednursegroupList',bednursegroupList);
             customerList.forEach(function(customerObj){
              var str='';
               let filbednursegroupList = bednursegroupList.filter(function(bednursegroup){
                 var a=bednursegroup.get('bed.id');
                 var b=customerObj.get('bed.id');
                 return a==b;
                 //return bednursegroup.get('bed.id') == customerObj.get('bed.id');
               });
               console.log('customer-service:filbednursegroupList',filbednursegroupList);
               if(filbednursegroupList.length<=0){
                 customerObj.set('groupsName','无');
                 return;
               }
               filbednursegroupList.forEach(function(filbednursegroup){
                 var groupName=filbednursegroup.get('group.name');
                 str+=groupName+',';
               });
               str=str.substring(0,str.length - 1);
               customerObj.set('groupsName',str);
            });
           });
         }
         //查询护理方案(带出护理级别)
         if(customerList.length!==0){
             _self.get('store').query('nursingproject',{
               filter:{
               },include:{nursingproject:"level"}
             }).then(function(nursingList){
               customerList.forEach(function(customerObj){
               let filnursingprojectList = nursingList.filter(function(nursingproject){
                 var a=nursingproject.get('customer.id');
                 var b=customerObj.get('id');
                 return a==b;
               });
               console.log('filnursingprojectList is',filnursingprojectList);
               if(filnursingprojectList.length<=0){
                 customerObj.set('nursingName','无');
                 customerObj.set('nursinglevelName','无');
                 return;
               }
               var nursingObj=filnursingprojectList.get('firstObject');
               if(nursingObj){
                 var nursingName=nursingObj.get('name');
                 console.log('nursingName is',nursingName);
                 var nursinglevelName=nursingObj.get('level.name');
                 console.log('nursinglevelName is',nursinglevelName);
                 customerObj.set('nursingId',nursingObj.get('id'));
                 customerObj.set('nursingName',nursingName);
                 customerObj.set('nursinglevelName',nursinglevelName);
               }
               customerObj.set('referenceNursingPrice',nursingObj.get('price'));
             });
           });

         }
         _self.getCurrentController().set("cusList",customerList,function(){
         });
       });
    },1);
  },
  actions:  {
    search:function(){
    this.doQuery();
    }
  },
  setupController(controller,model){
    controller.set('queryCondition',null);
    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
    controller.set("textShow",true);
}
});
