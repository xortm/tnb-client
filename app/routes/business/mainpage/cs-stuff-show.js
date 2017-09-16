import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const { taskApplyStatus_applyFail,taskApplyStatus_refuseInvitation} = Constants;

export default BaseBusiness.extend(Pagination,{
  header_title: '查看所有客服',
  model() {
    // this.set('header_title','查看所有客服');
    return {};
  },
  doQuery: function(){
    var _self = this;
    var curTask = this.get("global_curStatus").getTask();
    var params = this.buildQueryParams();
    var csList = this.findPaged('user',params,function(nums){
      nums.forEach(function(csItem) {
        csItem.set("inviteInfo",false);
        csItem.set("taskInfo",false);
        csItem.set("csStatus",'');
        csItem.set("audit",false);
        csItem.set("csAudit",false);
        csItem.set("isInvite",false);
        if(!curTask||!curTask.get("id")) {
          csItem.set("inviteStatus","邀请");
        }
        else {
          _self.store.query('user-task',{filter:{task:{id:curTask.get("id")},user:{id:csItem.get('id')}}}).then(function(userTasks) {
            var userTask = userTasks.get('firstObject');
            if(!userTask || userTask.get('status').get('typecode') === taskApplyStatus_applyFail || userTask.get('status').get('typecode') === taskApplyStatus_refuseInvitation) {
            }
            else {
              csItem.set("csStatus",'已在我的客服');
            }
          });
        }
      });
    });
    this.getCurrentController().set("csList",csList);
    console.log('doQuery csList',csList);
  },
  buildQueryParams: function(){
    var params = this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter = {role:{id:'2'}};
    var sort;
    if(curController) {
      if(curController.get('sortType') === 'workHour') {
        sort={extendInfo:{workHour:'desc'}};
        params.sort = sort;
      }
      else if(curController.get('sortType') === 'createTime') {
        sort={createTime:'desc'};
        params.sort = sort;
      }
      if(curController.get('sexArray.name'))
      {
        for (var i = 0; i < curController.get('sexArray.name').length; i++) {
          filter['sex@$or1---'+i] = curController.get('sexArray.name')[i];
        }
      }
      if(curController.get('languagesArray.name'))
      {
        for (var i = 0; i < curController.get('languagesArray.name').length; i++) {
          filter['language---'+i] = {};
          filter['language---'+i]['typecode@$or2---'+i] = curController.get('languagesArray.name')[i];
        }
      }
      if(curController.get('fieldsArray.name'))
      {
        for (var i = 97; i < 97+curController.get('fieldsArray.name').length; i++) {
          filter['cstag---'+String.fromCharCode(i)] = {};
          filter['cstag---'+String.fromCharCode(i)]['typecode@$or3---'+String.fromCharCode(i)] = curController.get('fieldsArray.name')[i-97];
        }
      }
      if(curController.get('csname'))
      {
        filter['name@$like'] = curController.get('csname');
      }
    }
    params.filter = filter;
    console.log("params is:",params);
    return params;
  },
  queryUserTask: function(curTask,csItem) {
    return this.store.query('user-task',{filter:{task:{id:curTask.get("id")},user:{id:csItem.get('id')}}});
  },
  setupController: function(controller,model){
    var sex = controller.get('userSex');
    var languages = controller.get('userLanguages');
    var fields = controller.get('userFields');
    var sortType = controller.get('sortType');
    var sexArray = controller.get('sexArray');
    var languagesArray = controller.get('languagesArray');
    var fieldsArray = controller.get('fieldsArray');
    var selectContext = controller.get('selectContext');
    this._super(controller, model);
    this.defineController(controller,model);
    console.log("controller in",controller);
    var curTask = this.get("global_curStatus").getTask();
    var curUser = this.get("global_curStatus").getUser();
    controller.set('curTask',curTask);
    controller.set('curUser',curUser);
    controller.set('userSex',sex);
    controller.set('userLanguages',languages);
    controller.set('userFields',fields);
    controller.set('sortType',sortType);
    if(selectContext) {
      if(fieldsArray) {
        controller.set('fieldsArray',fieldsArray);
        selectContext.field.forEach(function(item) {
          if(item.selected) {
            item.selec=true;
          }
          else {
            item.selec=false;
          }
        });
      }
      if(languagesArray) {
        controller.set('languagesArray',languagesArray);
        selectContext.language.forEach(function(item) {
          if(item.selected) {
            item.selec=true;
          }
          else {
            item.selec=false;
          }
        });
      }
      if(sexArray) {
        controller.set('sexArray',sexArray);
        selectContext.sex.forEach(function(item) {
          if(item.selected) {
            item.selec=true;
          }
          else {
            item.selec=false;
          }
        });
      }
      controller.set('selectContext',selectContext);
    }

    this.doQuery();
  },

  defineController: function(controller,model){
    var _self = this;
    controller.reopen({
      sortType: '',
      userSex: '',
      userLanguages: '',
      userFields: '',
      sexArray:{text:Array(),name:Array()},//所选性别
      languagesArray:{text:Array(),name:Array()},//所选语言
      fieldsArray:{text:Array(),name:Array()},//所选擅长领域
      titleText: [{name:"sex",text:"性别"},{name:"language",text:"语言"},{name:"field",text:"擅长领域"}],
      selectContext: Ember.computed(function() {
        this.queryDict();
      }),
      queryDict: function() {
        var self = this;
        var ctext = {};
        ctext.sex = new Array();
        ctext.language = new Array();
        ctext.field = new Array();
        var sexval1 = {name:1,text:'男',selected:false};
        var sexval2 = {name:2,text:'女',selected:false};
        ctext.sex.push(sexval1);
        ctext.sex.push(sexval2);
        this.store.query('dicttype',{filter:{typegroup:{typegroupcode:'tasktype'},'remark@$or1---1':1,'remark@$or1---2':2}}).then(function(tasktypes) {
          tasktypes.forEach(function(tasktype) {
            var value = {text:tasktype.get('typename'),name:tasktype.get('typecode'),selected:false};
            ctext.field.push(value);
          });
          self.store.query('dicttype',{filter:{typegroup:{typegroupcode:'csLanguage'}}}).then(function(lantypes) {
            lantypes.forEach(function(lantype) {
              var value = {text:lantype.get('typename'),name:lantype.get('typecode'),selected:false};
              ctext.language.push(value);
            });
            self.set('selectContext',ctext);
          });
        });
      },
      /*删除数组中的某个元素*/
      removeItem: function (arr, val) {
        var len = arr.get('length');
        for (var i = 0; i < len; i++) {
          if (arr[i] === val)
          {
            arr.splice(i, 1);
            return arr;
          }
        }
      },
      /*选择筛选项*/
      selectItem: function (title, item) {
        var self = this;
        if(title.name === "field")
        {
          self.get('fieldsArray.text').push(item.text);
          self.get('fieldsArray.name').push(item.name);
        }
        if(title.name === "language")
        {
          self.get('languagesArray.text').push(item.text);
          self.get('languagesArray.name').push(item.name);
        }
        if(title.name === "sex")
        {
          self.get('sexArray.text').push(item.text);
          self.get('sexArray.name').push(item.name);
        }
      },
      /*取消选择筛选项*/
      cancelSelectItem: function (title, item) {
        var self = this;
        if(title.name === "field")
        {
          self.set('fieldsArray.text',self.removeItem(self.get('fieldsArray.text'),item.text));
          self.set('fieldsArray.name',self.removeItem(self.get('fieldsArray.name'),item.name));
        }
        if(title.name === "language")
        {
          self.set('languagesArray.text',self.removeItem(self.get('languagesArray.text'),item.text));
          self.set('languagesArray.name',self.removeItem(self.get('languagesArray.name'),item.name));
        }
        if(title.name === "sex")
        {
          self.set('sexArray.text',self.removeItem(self.get('sexArray.text'),item.text));
          self.set('sexArray.name',self.removeItem(self.get('sexArray.name'),item.name));
        }
      },
      actions: {
        experienceSort: function() {
          this.set('sortType','workHour');
          _self.doQuery();
        },
        createTimeSort: function() {
          this.set('sortType','createTime');
          _self.doQuery('createTime');
        },
        searchCs: function() {
          _self.doQuery();
        },

        /*条件显示与查询*/
        isSelected: function (title,item) {
          var self = this;
          self.set('userFields','');
          self.set('userLanguages','');
          self.set('userSex','');
          if(item.selected)
          {
            self.selectItem(title, item);
          }
          else
          {
            self.cancelSelectItem(title, item);
          }
          /*条件显示*/
          self.get('fieldsArray.text').forEach(function(item) {
            self.set('userFields',self.get('userFields')+item+' | ');
          });
          self.get('languagesArray.text').forEach(function(item) {
            self.set('userLanguages',self.get('userLanguages')+item+' | ');
          });
          self.get('sexArray.text').forEach(function(item) {
            self.set('userSex',self.get('userSex')+item+' | ');
          });
          /*条件查询*/
          _self.doQuery();
        },
      }
    });
    controller.setProperties(model);
  },
});
