import Ember from 'ember';

export default Ember.Component.extend({
  classStatic: true,
  classNameBindings:["classStatic:col-xs-3","classStatic:footer-nav",'selected:selected'],
  expanded: false,
  didInsertElement() {
    this._super(...arguments);
    this.set("firstRender",true);
  },
  didRender() {
    console.log("didRender in group,menu:" + this.get("menu.code") + " and selected:" + this.get("selected"));
    console.log("oriSelected:" + this.get("oriSelected") + " and selected:" + this.get("selected") + " and selectPrevent:" + this.get("selectPrevent"));
    this._super(...arguments);
    //第一次渲染时不处理
    if(this.get("firstRender")){
      this.set("firstRender",false);
      //刚进入的时候，只做默认选择第一项的渲染
      if(this.get("selected")){
        this.get("menus.firstObject").set("groupSelected",true);
        this.set("oriSelected",true);
      }
      return;
    }
    var _self = this;
    if(this.get("selectPrevent")){
      if(!this.get("selected")){
        this.set("selectPrevent",false);
      }
      return;
    }
    if (this.get("selected")) {
      //设置标志，避免事件无限广播
      this.set("selectPrevent",true);
      if(!this.get("oriSelected")){
        //处理从别的菜单项跳过来的情况
        Ember.run.next(this,function() {
          //标记本菜单组已被选择
          _self.set("oriSelected",true);
          //给自己发送menuChange事件
          _self.send("groupMenuChange");
        });
      }else{
        //处理本级子菜单切换，发送相应事件
        this.send("subMenuClick",this.get("choiceMenu"));
      }
    }else{
      this.set("oriSelected",false);
      //收起
      this.set("groupExpanded",false);
    }
  },
  actions:{
    menuClick(menu){
      console.log("menuSelect in,menuCode:" + menu.get("code"));
      //记录当前选择的子菜单
      this.set("choiceMenu",menu);
      //如果是未选中，则根据当前菜单，向上级发送菜单切换事件
      this.sendAction("menuClick",this.get("menu"));
      //打开选择保护
      this.set("selectPrevent",false);
      return;
    },
    groupMenuChange(){
      //点击不同子菜单,则肯定是展开状态，先收起
      this.set("groupExpanded",false);
      //设置当前子菜单
      let menuCurrent = this.get("menus").findBy("selected",true);
      menuCurrent.set("selected",false);
      this.get("choiceMenu").set("selected",true);
      //发送菜单切换事件，以进行页面跳转
      this.sendAction("menuChange",this.get("menu"),this.get("choiceMenu.code"));

    },
    //子菜单变化
    subMenuClick(menu){
      console.log("subMenuClick in,menu:",menu);
      if(this.get("groupExpanded")){
        //已展开的收起
        this.set("groupExpanded",false);
        let menuCurrent = this.get("menus").findBy("selected",true);
        if(menu.get("code")!==menuCurrent.get("code")){
          //如果是不同子菜单切换，则发送页面切换请求
          menuCurrent.set("selected",false);
          menu.set("selected",true);
          //记录选择菜单到本地
          if(this.get("menu.code")==="menuGroupCare"){
            localStorage.setItem(Constants.uickey_careChoice,menu.get("code"));
          }
          this.sendAction("menuChange",this.get("menu"),this.get("choiceMenu.code"));
        }
      }else{
        //如果是收起状态则展开
        this.set("groupExpanded",true);
      }
    }
  }
});
