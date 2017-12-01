import Ember from 'ember';

export default Ember.Mixin.create({
  // recognizers:"tap",
  disabled:false,//是否禁止拖动
  processFlag: false,//是否正在处理的标志
  dragble: false,//是否有左右拖拽的功能
  moveDom: null,//可移动的部分（元素）
  maxOffSet:172,//滑动拉出的距离//向左滑动拉出的距离
  // leftOffSet:86,//向滑动拉出的距离
  rightOffSet:87,//滑动拉出的距离
  // switchFlag: false,//是否处于滑动模式
  //拖拽相关属性
  penProp: {
    x:0,
    y:0,
  },
  switchFlagObs:function(){
    let _self = this;
    if(this.get("switchFlag")){
      Ember.run.later(function(){
        _self.reset();
      },5000);
    }
  }.observes("switchFlag"),
  getScrollFlag: function(){
    let domId = this.get("scrollFlagDomId");
    let dom = $("#" + domId);
    console.log("getScrollFlag dom is",dom);
    let flag = dom.attr("scrollFlag");
    if(!flag||flag==="no"){
      return false;
    }
    return true;
  },
  didInsertElement: function(){
    var _self = this;
    var w = $(window).width();
    this.set('width',w);
    var width = this.get("width");
    if(!width){
      width = this.$().width();
      this.set('width',width);
    }
    //如果禁止拖动，则不继续定义
    console.log("disabled11111",this.get("disabled"));
    //这是判断list长度方法
    this.sendAction("didInsertAct",this.get("name"));
    if(this.get("disabled")){
      return;
    }
    //可移动区域为本级的子元素
    var moveDom = this.$();
    this.set("moveDom",moveDom);
    console.log("dom in"+moveDom);
    moveDom.hammer({}).bind("panstart", function(e){
      console.log("panstart in,scrollFlag:" + _self.getScrollFlag());
      e.preventDefault();
      _self.panStart(e);
    });
    moveDom.hammer({}).bind("panend", function(e){
      _self.panEnd(e);
    });
  },
  //复位
  reset(){
    // this.offsetDom(0);
    this.offsetDom(-87);
    this.set("switchFlag", false);
  },
  //实现拖拽效果
  panStart(e){
    if(this.getScrollFlag()){
      console.log("panstart need prevent");
      return;
    }
    //发送移动事件，后续处理
    this.sendAction("panStartAction");
    console.log("panStartAction in",e);
    var _self = this;
    var moveDom = this.get("moveDom");
    //设置
    this.set("penProp.x",moveDom.offset().left);
    this.set("penProp.y",moveDom.offset().top);
    console.log("penProp x:" + this.get("penProp.x"));
    var maxDom = this.get("moveDom").find("div[name='listContainer']");
    var marginLeft = parseInt(maxDom.css('margin-left'));
    console.log("1111111111marginLeft",marginLeft);
    if(marginLeft>=0||marginLeft<=-172){//没有效果
      console.log("1111111111 0 -172");
      return;
    }else{
      moveDom.hammer({}).bind("panmove", function(e){
        _self.panMove(e);
      });
    }
  },
  panMove(e){
    if(this.getScrollFlag()){
      return;
    }
    console.log("panMoveAction in",e);
    var moveDom = this.get("moveDom");
    //根据当前拖拽的坐标变换位置
    var leftOff = this.get("penProp.x") + e.gesture.deltaX;//这里要根据margin值给予左滑右滑
    let maxDom = this.get("moveDom").find("div[name='listContainer']");
    let marginLeft = parseInt(maxDom.css('margin-left'));
    //左划处理
    if(leftOff<0){
      var checkOff = leftOff * -1;
      //只有不超出指定范围才可以继续滑动
      var width = this.get("maxOffSet");
      console.log("leftOff is:" + checkOff + " and width:" + width);
      if(checkOff<=width){
        if(marginLeft>-87){
          leftOff = leftOff;
        }else {
          leftOff = leftOff + -87;
        }
        this.offsetDom(leftOff);
        this.set("ctrl_leftOff",checkOff);
      }
    }
    else {//else 就是右划了
      var width2 = this.get("rightOffSet");
      if(leftOff<=width2){
        if(marginLeft<-87){
          leftOff = -172 + leftOff;
        }else {
          leftOff = leftOff + -87;
        }
        this.offsetDom(leftOff);
        this.set("ctrl_leftOff",leftOff);
      }
    }
  },
  panEnd(e){
    if(this.getScrollFlag()){
      return;
    }
    this.sendAction("panEndAction");
    var _self = this;
    console.log("panEnd in",e);
    //如果当前正在处理end事件，则忽略
    if(this.get("processFlag")){
      return;
    }
    this.set("processFlag",true);
    var moveDom = this.get("moveDom");
    var checkOff = this.get("ctrl_leftOff");
    var offset = this.get("maxOffSet");
    console.log("checkOff is:" + checkOff + " and offset:" + offset);
    if(!this.get("switchFlag")&&checkOff&&checkOff>0){
      //如果移动距离大于0，则进行滑动定位
      console.log("need tz,offset:" + offset);
      this.offsetDom(offset*-1);
      this.set("switchFlag",true);
    }else if(this.get("switchFlag")&&checkOff<offset){// margin-left 大于86 小于 172 就是复位(小于86 也要复位)
      //如果反向滑动，则进行复位
      console.log("need reset");
      this.reset();
    }else if(!this.get("switchFlag")&&checkOff&&checkOff<0){
      var rightOffSet = this.get("rightOffSet");
      this.offsetDom(0);
      console.log("rightOffSet");
      this.set("switchFlag",true);
    }
    moveDom.off("panmove");
    //延时后放开事件锁
    Ember.run.later(function(){
      _self.set("processFlag",false);
    },500);
  },
  offsetDom(offset){
    let maxDom = this.get("moveDom").find("div[name='listContainer']");
    let leftDom = this.get("moveDom").find("div[name='listContainer'] .col-xs-left");
    let contentDom = this.get("moveDom").find("div[name='listContainer'] .col-xs-middle");
    let funcDom = this.get("moveDom").find("div[name='listContainer'] .col-xs-right");
    console.log("contentDom is",contentDom);
    console.log("funcDom is",funcDom);
    maxDom.css('margin-left',offset + "px");
  },
  panMoveProcAction(e){
    //下级实现
  },

});
