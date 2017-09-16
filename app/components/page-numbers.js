import Ember from 'ember';
import Util from 'ember-cli-pagination/util';
import PageItems from 'ember-cli-pagination/lib/page-items';
import Validate from 'ember-cli-pagination/validate';

export default Ember.Component.extend({
  currentPageBinding: "content.page",
  totalPagesBinding: "content.totalPages",
  totalCount: Ember.computed("changeFlagCnt","content",function(){
    console.log("content meta is",this.get("content"));
    return this.doCount(this.get("content"));
  }),
  doCount: function(content){
    var _self = this;
    if(content.meta){
      return content.meta["total_count"];
    }
    content.then(function(contentData){
      console.log("content.total_count is",contentData.meta["total_count"]);
      _self.set("totalCount",contentData.meta["total_count"]);
    });
    return 0;
  },
  export:false,
  hasPages: Ember.computed.gt('totalPages', 1),

  watchInvalidPage: function() {
    console.log("content change");
    //重新计算总数
    this.doCount(this.get("content"));
    var me = this;
    var c = this.get('content');
    if (c && c.on) {
      c.on('invalidPage', function(e) {
        me.sendAction('invalidPageAction',e);
      });
    }
  }.observes("content"),

  truncatePages: true,
  numPagesToShow: 10,

  validate: function() {
    if (Util.isBlank(this.get('currentPage'))) {
      Validate.internalError("no currentPage for page-numbers");
    }
    if (Util.isBlank(this.get('totalPages'))) {
      Validate.internalError('no totalPages for page-numbers');
    }
  },

  pageItemsObj: Ember.computed(function(){
    return PageItems.create({
      parent: this,
      currentPageBinding: "parent.currentPage",
      totalPagesBinding: "parent.totalPages",
      truncatePagesBinding: "parent.truncatePages",
      numPagesToShowBinding: "parent.numPagesToShow",
      showFLBinding: "parent.showFL"
    });
  }),

  //pageItemsBinding: "pageItemsObj.pageItems",

  pageItems: Ember.computed("pageItemsObj.pageItems","pageItemsObj",function(){
    this.validate();
    return this.get("pageItemsObj.pageItems");
  }),

  canStepForward: Ember.computed("currentPage", "totalPages",function(){
    var page = Number(this.get("currentPage"));
    var totalPages = Number(this.get("totalPages"));
    return page < totalPages;
  }),

  canStepBackward: Ember.computed("currentPage",function(){
    var page = Number(this.get("currentPage"));
    return page > 1;
  }),

  actions: {
    pageClicked: function(number) {
      Util.log("PageNumbers#pageClicked number " + number);
      this.set("currentPage", number);
      this.sendAction('pageChange',number);
    },
    incrementPage: function(num) {
      var currentPage = Number(this.get("currentPage")),
          totalPages = Number(this.get("totalPages"));

      if(currentPage === totalPages && num === 1) { return false; }
      if(currentPage <= 1 && num === -1) { return false; }
      this.incrementProperty('currentPage', num);

      var newPage = this.get('currentPage');
      this.sendAction('pageChange',newPage);
    },
    //导出到excel功能
    exportToExcel(){
      if(this.get('exportCurPage')){
        this.sendAction("exportCurPageExcel");
      }else{
        $(".dataTables_wrapper table").tableExport({type:'excel',escape:'false'});
      }

    },
    //导出全部到excel
    exportAllExcel(){
      this.sendAction("exportAllExcel");
    },
    exportDayExcel(){
      this.sendAction("exportDayExcel");
    },
    exportWeekExcel(){
      this.sendAction("exportWeekExcel");
    },
    showAllExlecl(){
      var allExlecl = this.get("allExlecl");
      if(allExlecl){
        this.set("allExlecl",false);
      }else {
        this.set("allExlecl",true);
      }
    },
  }
});
