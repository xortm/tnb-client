import Ember from 'ember';
export default Ember.Controller.extend({
  feedService: Ember.inject.service('feed-bus'),
  dateService:Ember.inject.service('date-service'),
  service_PageConstrut:Ember.inject.service("page-constructure"),

i:0,
  tasksname: '',
  title:"",
  content:"",
  editEnd:true,
  fail1:true,//标题、内容必须填写！
  showAddContents:false,//弹框
  //判断是客服端还是企业端如果是1就是企业端，如果是2的话则是客服端
  cancel:Ember.computed('modification', function(){
    if(this.get('modification')){
      return "取消";
    }return '全选';
  }),
  iconClass:Ember.computed('modification',function(){
    if(this.get('modification')){
      return "fa-remove";
    }return "fa-check";
  }),
  init(){
    var curUser = this.get("global_curStatus").getUser();
    if (curUser.get('role').get("id") === '2'){
      this.set('editEnd',false);
      console.log("If it is 2 is enterprise , role is==== ",curUser.get('role').get("id") );
    }else{
      this.set('editEnd',true);
      this.set('checkedSelected',true);
      console.log("If is 1 is the end of the service , role is==== ",curUser.get('role').get("id") );
    }
  },
  //保存弹出框里的内容
  addContent: function(title,content,task){
    var _self = this;
    this.set('fail1',true);
    this.set("showAddContents",false);
    if((!title)|(!content)){
      this.set('fail1',false);
      this.set("showAddContents",true);
      console.log("title is null,content is null");
    }else {
      this.set('title','');
      this.set('content','');
      var knowledgeBase = this.store.createRecord("knowledge-base",{});
      console.log("knowledgeBase11111111111111",knowledgeBase);
      knowledgeBase.set("title",title);
      knowledgeBase.set("content",content);
      knowledgeBase.set("task",task);
      knowledgeBase.set("delStatus",0);
      console.log("knowledgeBase get content",knowledgeBase.get("content"));
      knowledgeBase.save().then(function(knowledgeSaved){
        knowledgeSaved.get("updateTime");
        console.log("target",_self.get('target'));
        _self.get('target').send("reloadModel");
      });
    }
    console.log("ok");
  },
  actions:{
    addKnowledgeBase: function(){
      this.set("showAddContents",true);
    },//“添加”按钮
    deleteKnowLedgeBase:function(){
      var _self=this;
      var managementList = this.get('managementList');
      managementList.forEach(function(man) {
        console.log('1111111112222',man.get('checked'));
      });
      var  curTask = this.get("global_curStatus").getTask();
      this.store.query("knowledge-base",{filter:{task:{id:curTask.get("id")}}}).then(function(userEnt){
        userEnt.forEach(function(lan){
          console.log('this is checked',lan.get('checked'));
          if(lan.get('checked')){
            lan.set('delStatus',1);
            lan.save().then(function(){
              _self.get('target').send("reloadModel");
            });
          }
        });
        // userEnt.save();
      });
    },//“删除”按钮
    allKnowLedgeBaseBut:function(){
      this.toggleProperty('modification');
      var  curTask = this.get("global_curStatus").getTask();
      var _self=this;
      this.store.query("knowledge-base",{filter:{task:{id:curTask.get("id")}}}).then(function(userEnt){
        userEnt.forEach(function(lan){
          if(_self.get('cancel')==="取消"){
          lan.set('checked',true);
        }
          else{
            lan.set('checked',false);
            }
          /*lan.toggleProperty('checked');*/
        });
      });
    },//“全选/取消”按钮
    cancelPassSubmit: function(){
      this.set("showAddContents",false);
    },//弹框“取消”按钮
    // 确认按钮
    changePassSubmit: function(){
      var curTask= this.get("global_curStatus").getTask();
      this.set("task",this.store.createRecord("task", {}));
      console.log('yescurtask',curTask);
      this.get("task").set("id",curTask.get('id'));
      var title=this.get("title");
      var content=this.get("content");
      var task=this.get("task");
      this.addContent(title,content,task);//传入title，content，task等值；
      console.log("yes");
    },
  },
});
