import Ember from 'ember';
import BaseItem from './base-ui-item';

export default BaseItem.extend({
  tagName: "div",
  classNames:["pop-menu"],
  trigBtnName:null,

  attributeBindings: Ember.computed(function () {
    var attrs = _super();
    var bindingAttrs = [];
    return attrs.concat(bindingAttrs);
  }),

  didInsertElement: function() {
    //动态计算留白
    var width = 0;
		this.$().children().each(function(){
			if($(this).width()>width){
        width = $(this).width();
      }
		});
    //加宽
		width = width + 40;
		console.log("width size:" + width);
		this.$().css("right",0);
    this.$().width(width);
		//屏蔽其他页面点击
		// PageContainer.pointerArea(function(){
		// 	_self.setupHide();
		// });
  },

});
