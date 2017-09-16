import Ember from 'ember';
import Changeset from 'ember-changeset';
import CustomerdrugValidations from '../../../validations/customerdrug';
import lookupValidator from 'ember-changeset-validations';
import CustomerdrugprojectValidations from '../../../validations/customerdrugproject';
import CustomerdrugprojectexeValidations from '../../../validations/customerdrugprojectexe';
export default Ember.Controller.extend(CustomerdrugValidations,{
  constants:Constants,
  detailDrug:false,
  detailDrugProject:false,
  detailDrugProjectexe:false,
  dateService: Ember.inject.service("date-service"),
  chooseDate:Ember.computed('showStartDate','showEndDate','timeCondition',function(){
    if(this.get('timeCondition')){
      let timeCondition = this.get('timeCondition');
      if(timeCondition == 'today'){
        return '今天';
      }else if(timeCondition == 'seven'){
        return '最近7天';
      }else if(timeCondition == 'thirty'){
        return '最近30天';
      }else{
        if(this.get('showStartDate')&&this.get('showEndDate')){
          return this.get('showStartDate')+'至'+this.get('showEndDate');
        }else{
          return '选择日期';
        }
      }
    }else{
      return '选择日期';
    }
  }),
  drugModel:Ember.computed('drugInfo',function(){
    let model = this.get("drugInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(CustomerdrugValidations), CustomerdrugValidations);
  }),

  projectModel:Ember.computed('projectInfo',function(){
    let model = this.get("projectInfo");
    if (!model) {
        return null;
    }
    if(this.get("projectInfo.customerDrug")){
      model.set('drug',this.get("projectInfo.customerDrug"));
    }
    return new Changeset(model, lookupValidator(CustomerdrugprojectValidations), CustomerdrugprojectValidations);
  }),

  projectexeModel:Ember.computed('projectexeInfo',function(){
    let model = this.get("projectexeInfo");
    if (!model) {
        return null;
    }

    return new Changeset(model, lookupValidator(CustomerdrugprojectexeValidations), CustomerdrugprojectexeValidations);
  }),

  drugList:Ember.computed('druglist','customerdrugList',function(){
    let druglist = this.get('druglist');
    let customerdrugList = this.get('customerdrugList');
    let list = new Ember.A();
    druglist.forEach(function(drug){
      drug.set('canUse',true);
      customerdrugList.forEach(function(customerdrug){
        if(drug.get('id')==customerdrug.get('drug.id')){
          drug.set('canUse',false);
        }
      });
    });
    druglist.forEach(function(drug){
      if(drug.get('canUse')){
        list.pushObject(drug);
      }
    });
    return list;
  }),

  projectdrugList:Ember.computed('customerdrugList','customerdrugprojectList',function(){
    let customerdrugList = this.get('customerdrugList');
    let customerdrugprojectList = this.get('customerdrugprojectList');
    let druglist = new Ember.A();
    let list = new Ember.A();
    customerdrugList.forEach(function(customerdrug){
      let drug = customerdrug.get('drug');
      druglist.pushObject(drug);
    });
    druglist.forEach(function(drug){
      drug.set('canUse',true);
      customerdrugprojectList.forEach(function(customerdrug){
        if(drug.get('id')==customerdrug.get('customerDrug.drug.id')){
          drug.set('canUse',false);
        }
      });
    });
    druglist.forEach(function(drug){
      if(drug.get('canUse')){
        list.pushObject(drug);
      }
    });
    return list;
  }),
  printModel:true,
  lookDrugList:Ember.computed('customerdrugprojectList','printModel','printModelFirst','printModelAll',function(){
    let customerdrugprojectList = this.get('customerdrugprojectList').sortBy('useDrugFreq');
    let printModel = this.get('printModel');
    let printModelFirst = this.get('printModelFirst');
    let printModelAll = this.get('printModelAll');

    if(printModelFirst){
      return customerdrugprojectList.filter(function(project){
        return project.get('customerDrug.drug.printType') ==1;
      });
    }else if(printModel){
      return customerdrugprojectList.filter(function(project){
        return project.get('customerDrug.drug.printType') !==1;
      });
    }else{
      return customerdrugprojectList;
    }
  }),
  timeIconList:Ember.computed('projectModel',function(){
      let list = new Ember.A();
      let timeArr = [{
        order:1,
        selected:false,
        icon:'assets/images/icon/1clock.png',
        name:'1点'
      },{
        order:2,
        selected:false,
        icon:'assets/images/icon/2clock.png',
        name:'2点'
      },{
        order:3,
        selected:false,
        icon:'assets/images/icon/3clock.png',
        name:'3点'
      },{
        order:4,
        selected:false,
        icon:'assets/images/icon/4clock.png',
        name:'4点'
      },{
        order:5,
        selected:false,
        icon:'assets/images/icon/5clock.png',
        name:'5点'
      },{
        order:6,
        selected:false,
        icon:'assets/images/icon/6clock.png',
        name:'6点'
      },{
        order:7,
        selected:false,
        icon:'assets/images/icon/7clock.png',
        name:'7点'
      },{
        order:8,
        selected:false,
        icon:'assets/images/icon/8clock.png',
        name:'8点'
      },{
        order:9,
        selected:false,
        icon:'assets/images/icon/9clock.png',
        name:'9点'
      },{
        order:10,
        selected:false,
        icon:'assets/images/icon/10clock.png',
        name:'10点'
      },{
        order:11,
        selected:false,
        icon:'assets/images/icon/11clock.png',
        name:'11点'
      },{
        order:12,
        selected:false,
        icon:'assets/images/icon/12clock.png',
        name:'12点'
      },{
        order:13,
        selected:false,
        icon:'assets/images/icon/1clock.png',
        name:'13点'
      },{
        order:14,
        selected:false,
        icon:'assets/images/icon/2clock.png',
        name:'14点'
      },{
        order:15,
        selected:false,
        icon:'assets/images/icon/3clock.png',
        name:'15点'
      },{
        order:16,
        selected:false,
        icon:'assets/images/icon/4clock.png',
        name:'16点'
      },{
        order:17,
        selected:false,
        icon:'assets/images/icon/5clock.png',
        name:'17点'
      },{
        order:18,
        selected:false,
        icon:'assets/images/icon/6clock.png',
        name:'18点'
      },{
        order:19,
        selected:false,
        icon:'assets/images/icon/7clock.png',
        name:'19点'
      },{
        order:20,
        selected:false,
        icon:'assets/images/icon/8clock.png',
        name:'20点'
      },{
        order:21,
        selected:false,
        icon:'assets/images/icon/9clock.png',
        name:'21点'
      },{
        order:22,
        selected:false,
        icon:'assets/images/icon/10clock.png',
        name:'22点'
      },{
        order:23,
        selected:false,
        icon:'assets/images/icon/11clock.png',
        name:'23点'
      },{
        order:0,
        selected:false,
        icon:'assets/images/icon/12clock.png',
        name:'0点'
      }];

      timeArr.forEach(function(item){
        let time = Ember.Object.create(item);
        list.pushObject(time);
      });
      if(this.get('projectModel.useDrugDate')){
        let useDrugDate = this.get('projectModel.useDrugDate');
        let useDrugArr = useDrugDate.split(",");
        useDrugArr.forEach(function(item){
          console.log('用药时间',parseInt(item));
          if(list.findBy('order',parseInt(item))){

            list.findBy('order',parseInt(item)).set('selected',true);
          }
        });
      }

      return list;
  }),
  timeList:Ember.computed('projectModel','timeIconList',function(){

    let list = new Ember.A();
    if(this.get('projectModel.useDrugDate')){
      let useDrugDate = this.get('projectModel.useDrugDate');
      let useDrugArr = useDrugDate.split(",");
      let timeIconList = this.get('timeIconList');
      useDrugArr.forEach(function(item){
        if(timeIconList.findBy('order',parseInt(item))){
          let time = timeIconList.findBy('order',parseInt(item));
          time.set('selected',true);
          list.pushObject(time);
        }
      });
    }
    return list;
  }),
  actions:{
    //执行情况删除
    delDrugProjectExe(drug){
      let _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定撤销此执行记录",function(){
        App.lookup('controller:business.mainpage').openPopTip("正在撤销");
        _self.set("showpopInvitePassModal",false);
        drug.set("delStatus", 1);
        drug.save().then(function() {
            App.lookup('controller:business.mainpage').showPopTip("撤销成功");
            _self.send('chooseDrugPlanexeTab');
        });
      });
    },
    //选择存取类型
    addFlagSelect(flag){
      this.set('drugModel.addFlag',flag);
    },
    //选择老人药品，查看存取记录
    selectCusDrug(drug){
      if(drug.get('selected')){
        drug.set('selected',false);
      }else{
        this.get('customerdrugList').forEach(function(drug){
          drug.set('selected',false);
        })
        drug.set('selected',true);
      }

    },
    //打印
    printImg(){
      $("<iframe ></iframe>", { id: 'myiframe' }).bind('load', function(event) {
          if (!this.contentWindow) {
              return;
          }
          var scripWidthCode = document.createElement('script');
          scripWidthCode.type ='text/javascript';
          scripWidthCode.innerText = 'var ad_unit="123";';
          this.contentWindow.document.getElementsByTagName('head')[0].appendChild(scripWidthCode);
          var scripWidthSrc = document.createElement('script');
          scripWidthSrc.type ='text/javascript';
          scripWidthSrc.src = 'http://abc.com/abc.js';
          var cssSrc = document.createElement('link');
          cssSrc.rel ='stylesheet';
          cssSrc.href = 'assets/images/print.css';
          this.contentWindow.document.getElementsByTagName('head')[0].appendChild(scripWidthSrc);
          this.contentWindow.document.getElementsByTagName('head')[0].appendChild(cssSrc);
          setTimeout(function(){
            let bdhtml=window.document.body.innerHTML;
            let sprnstr="<!--startprint-->";
            let eprnstr="<!--endprint-->";
            let prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17);
            prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));
            $('#myiframe').contents().find('body').html(prnhtml);
            document.getElementById('myiframe').contentWindow.print();
            $('#myiframe').remove();
          },1000)
      }).appendTo('body');
    },
    //分药查看
    lookDrug(){
      this.set('lookDrugModel',true);
    },
    //分药类型
    selectPrint(str){
      console.log(str);
      if(str==1){
        this.set('printModelFirst',true);
        this.set('printModel',false);
        this.set('printModelAll',false)
      }else if(str=='all'){
        this.set('printModelFirst',false);
        this.set('printModel',false);
        this.set('printModelAll',true)
      }else{
        this.set('printModelFirst',false);
        this.set('printModel',true);
        this.set('printModelAll',false)
      }
    },
    //时间搜索
    search(flag){
      let customer = this.get('curcustomer');
      let serchDrug = this.get('serchDrug');
      this.set("timeCondition", flag);
      this.set("beginDate", null);
      this.set("endDate", null);
      this.set('dateShow', false);
      App.lookup("route:business.mainpage.drug-administration").chooseDrugPlanexe(customer,serchDrug);
    },
    //时间选择器确定
    submmit(){
      let customer = this.get('curcustomer');
      let serchDrug = this.get('serchDrug');
      this.set('dateShow', false);
      this.set("timeCondition", 'flag');
      App.lookup("route:business.mainpage.drug-administration").chooseDrugPlanexe(customer,serchDrug);
    },
    //清空时间
    emptied(){
      let customer = this.get('curcustomer');
      let serchDrug = this.get('serchDrug');
      this.set("beginDate", null);
      this.set("endDate", null);
      this.set("timeCondition", null);
      this.set('dateShow', false);
      App.lookup("route:business.mainpage.drug-administration").chooseDrugPlanexe(customer,serchDrug);
    },
    changeBeginDateAction(date) {
        var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
        this.set("beginDate",date);
        this.set('showStartDate',stamp);
    },
    changeEndDateAction(date) {
        var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
        this.set("endDate",date);
        this.set('showEndDate',stamp);
    },
    dpShowAction(e){

    },
    exportLookDrug(){
      $(".look-drug-list").tableExport({type:'excel',escape:'false'});
    },
    //药品搜索
    selectCustomerDrug(drug){
      let customer = this.get('curcustomer');
      this.set('defaultCustomerDrug',drug);
      if(drug){
        let serchDrug = drug.get('drug.name');
        this.set('serchDrug',serchDrug);
        App.lookup("route:business.mainpage.drug-administration").chooseDrugPlanexe(customer,serchDrug);
      }else{
        App.lookup("route:business.mainpage.drug-administration").chooseDrugPlanexe(customer);
      }

    },
    exportWeekExcel(){
      let _self = this;
      let params;
      let customer = this.get('curcustomer');
      let filter;
      params = App.lookup("route:business.mainpage.drug-administration").pagiParamsSet();
      if (customer) {
      filter =  $.extend({}, filter, {customerDrug:{customer:{id:customer.get('id')}}});
      }
      let compareDate = this.get("dateService").getDaysBeforeTimestamp(7);
      filter = $.extend({}, filter, {
          'exeDate@$gte': compareDate
      });
      params.filter = filter;
      params.sort = {exeDate:'desc'};
      App.lookup("route:business.mainpage.drug-administration").set('perPage',200);
      let customerdrugList = App.lookup("route:business.mainpage.drug-administration").findPaged('customerdrugprojectexe',params).then(function(customerdrugList){
        let customerdrugprojectList;
        if(_self.get('customerdrugprojectList')){
          customerdrugprojectList = _self.get('customerdrugprojectList');
          customerdrugList.forEach(function(customerdrug){
            customerdrugprojectList.forEach(function(project){
              if(customerdrug.get('customerDrug.drug.name')==project.get('customerDrug.drug.name')){
                customerdrug.set('project',project);
              }
            });
          });
        }else{
           _self.store.query('customerdrugproject',{}).then(function(customerdrugprojectList){
             customerdrugList.forEach(function(customerdrug){
               customerdrugprojectList.forEach(function(project){
                 if(customerdrug.get('customerDrug.drug.name')==project.get('customerDrug.drug.name')){
                   customerdrug.set('project',project);
                 }
               });
             });
           });
        }
        _self.set('exportList',customerdrugList);
        Ember.run.schedule('afterRender',function(){
          $(".export-block").tableExport({type:'excel',escape:'false'});
        });
      });
    },
    exportDayExcel(){
      let _self = this;
      let params;
      let customer = this.get('curcustomer');
      let filter;
      params = App.lookup("route:business.mainpage.drug-administration").pagiParamsSet();
      if (customer) {
      filter =  $.extend({}, filter, {customerDrug:{customer:{id:customer.get('id')}}});
      }
      let compareDate = this.get("dateService").getTodayTimestamp();
      filter = $.extend({}, filter, {
          'exeDate@$gte': compareDate
      });
      params.filter = filter;
      params.sort = {exeDate:'desc'};
      App.lookup("route:business.mainpage.drug-administration").set('perPage',100);
      let customerdrugList = App.lookup("route:business.mainpage.drug-administration").findPaged('customerdrugprojectexe',params).then(function(customerdrugList){
        let customerdrugprojectList;
        if(_self.get('customerdrugprojectList')){
          customerdrugprojectList = _self.get('customerdrugprojectList');
          customerdrugList.forEach(function(customerdrug){
            customerdrugprojectList.forEach(function(project){
              if(customerdrug.get('customerDrug.drug.name')==project.get('customerDrug.drug.name')){
                customerdrug.set('project',project);
              }
            });
          });
        }else{
           _self.store.query('customerdrugproject',{}).then(function(customerdrugprojectList){
             customerdrugList.forEach(function(customerdrug){
               customerdrugprojectList.forEach(function(project){
                 if(customerdrug.get('customerDrug.drug.name')==project.get('customerDrug.drug.name')){
                   customerdrug.set('project',project);
                 }
               });
             });
           });
        }
        _self.set('exportList',customerdrugList);
        Ember.run.schedule('afterRender',function(){
          $(".export-block").tableExport({type:'excel',escape:'false'});
        });
      });
    },
    exportToAllExcel(){
      let _self = this;
      let params;
      let customer = this.get('curcustomer');
      let filter;
      params = App.lookup("route:business.mainpage.drug-administration").pagiParamsSet();
      if (customer) {
      filter =  $.extend({}, filter, {customerDrug:{customer:{id:customer.get('id')}}});
      }
      params.filter = filter;
      params.sort = {exeDate:'desc'};
      App.lookup("route:business.mainpage.drug-administration").set('perPage',9999);
      let customerdrugList = App.lookup("route:business.mainpage.drug-administration").findPaged('customerdrugprojectexe',params).then(function(customerdrugList){
        let customerdrugprojectList;
        if(_self.get('customerdrugprojectList')){
          customerdrugprojectList = _self.get('customerdrugprojectList');
          customerdrugList.forEach(function(customerdrug){
            customerdrugprojectList.forEach(function(project){
              if(customerdrug.get('customerDrug.drug.name')==project.get('customerDrug.drug.name')){
                customerdrug.set('project',project);
              }
            });
          });
        }else{
           _self.store.query('customerdrugproject',{}).then(function(customerdrugprojectList){
             customerdrugList.forEach(function(customerdrug){
               customerdrugprojectList.forEach(function(project){
                 if(customerdrug.get('customerDrug.drug.name')==project.get('customerDrug.drug.name')){
                   customerdrug.set('project',project);
                 }
               });
             });
           });
        }
        _self.set('exportList',customerdrugList);
        Ember.run.schedule('afterRender',function(){
          $(".export-block").tableExport({type:'excel',escape:'false'});
        });
      });
    },
    exportCurPageExcel(){
      let _self = this;
      let params;
      let customer = this.get('curcustomer');
      let filter;
      params = App.lookup("route:business.mainpage.drug-administration").pagiParamsSet();
      if (customer) {
      filter =  $.extend({}, filter, {customerDrug:{customer:{id:customer.get('id')}}});
      }
      params.filter = filter;
      params.sort = {exeDate:'desc'};
      App.lookup("route:business.mainpage.drug-administration").set('perPage',10);
      let customerdrugList = App.lookup("route:business.mainpage.drug-administration").findPaged('customerdrugprojectexe',params).then(function(customerdrugList){
        let customerdrugprojectList;
        if(_self.get('customerdrugprojectList')){
          customerdrugprojectList = _self.get('customerdrugprojectList');
          customerdrugList.forEach(function(customerdrug){
            customerdrugprojectList.forEach(function(project){
              if(customerdrug.get('customerDrug.drug.name')==project.get('customerDrug.drug.name')){
                customerdrug.set('project',project);
              }
            });
          });
        }else{
           _self.store.query('customerdrugproject',{}).then(function(customerdrugprojectList){
             customerdrugList.forEach(function(customerdrug){
               customerdrugprojectList.forEach(function(project){
                 if(customerdrug.get('customerDrug.drug.name')==project.get('customerDrug.drug.name')){
                   customerdrug.set('project',project);
                 }
               });
             });
           });
        }
        _self.set('exportList',customerdrugList);
        Ember.run.schedule('afterRender',function(){
          $(".export-block").tableExport({type:'excel',escape:'false'});
        });
      });
    },
    selectFinishLevel(finishLevel){
      this.set('projectexeModel.finishLevel',finishLevel);
    },
    selectUser(user){
      this.set('projectexeModel.lastUpdateUser',user);
    },
    //选择时间
    chooseTime(time){
      let list = this.get('timeList');
      if(time.get('selected')){
        time.set('selected',false);
        list.removeObject(time);
      }else{
        time.set('selected',true);
        list.pushObject(time);
      }
      let timeArr = new Array(list.get('length'));
      let i = 0;
      list.forEach(function(time){

        timeArr[i]=time.get('order');
        i++;
      });
      if(i==list.get('length')){
        let str = timeArr.join(",");
        this.set('projectModel.useDrugDate',str);
      }
      this.set('projectModel.useDrugFreq',list.get('length'));
    },
    //弹层取消
    invitation(){
      this.set("detailDrug",false);
      this.set('detailDrugProject',false);
      this.set('detailDrugProjectexe',false);
      this.set('showpopInvitePassModal',false);
      this.set('lookDrugModel',false);
    },
    invalid() {
        //alert("error");
    },
    //点击选择老人
    chooseCustomer(customer){
      if (!customer) {
        return;
      }
      let _self = this;
      this.set('curcustomer',customer);
      let curDrugList = this.get('curDrugList');
      let showFlag=0;
      if (this.get('projectexeActive') === true) {
          showFlag = 1;
          this.send('chooseDrugPlanexeTab');
      }
      App.lookup("route:business.mainpage.drug-administration").doQueryDrug(customer);
      if (this.get('projectActive') === true) {
          showFlag = 1;

          this.send('chooseDrugPlanTab');
      }
      if (this.get('drugActive') === true) {
          showFlag = 1;
          this.send('chooseDrugTab', customer);
      }
      if (showFlag === 0) {
          this.send('chooseDrugTab', customer);
      }

      let customerShowList = this.get('customerShowList');
      customerShowList.forEach(function(customer){
        customer.set('hasChoosed',false);
      });
      customer.set('hasChoosed',true);
      this.get('store').query('nursingproject',{
        filter:{
          '[customer][id]':_self.get('customerInComp.id')
        },include:{nursingproject:"level"}
      }).then(function(nursingList){
        let nursingObj=nursingList.get('firstObject');
        if(nursingObj){
          let nursingName=nursingObj.get('name');
          let nursinglevelName=nursingObj.get('level.name');
          _self.get('curcustomer').set('levelName',nursinglevelName);
        }
      });
      this.set('timeCondition',null);
      this.set('serchDrug',null);
      this.set('defaultCustomerDrug',null);
    },
    //点击药品管理
    chooseDrugTab(customer){
      customer = this.get('curcustomer');
      this.set('drugActive',true);
      this.set('projectexeActive',false);
      this.set('projectActive',false);
      App.lookup("route:business.mainpage.drug-administration").doQueryDrug(customer);
    },
    //点击用药计划
    chooseDrugPlanTab(){
      let customer = this.get('curcustomer');
      this.set('drugActive',false);
      this.set('projectexeActive',false);
      this.set('projectActive',true);
      App.lookup("route:business.mainpage.drug-administration").doQueryDrugPlan(customer);
    },
    //点击执行情况
    chooseDrugPlanexeTab(){
      let customer = this.get('curcustomer');
      this.set('projectexeActive',true);
      this.set('projectActive',false);
      this.set('drugActive',false);
      App.lookup("route:business.mainpage.drug-administration").chooseDrugPlanexe(customer);
    },
    //鼠标移入移出药品
    chooseDrug(drug){
      drug.set('hasSelected',true);
    },
    noChooseDrug(drug){
      drug.set('hasSelected',false);
    },
    //新增和编辑药品
    detailDrug(drug){
      if(drug){
        drug.set('addDrugNum',0);
        this.set('drugInfo',drug);
        this.set('detailDrug',true);
      }else{
        let customerdrugList = this.get('customerdrugList');
        let druglist = this.get('druglist');
        if(customerdrugList.get('length')==druglist.get('length')){
          App.lookup('controller:business.mainpage').showAlert("无法添加药品");
        }else{
          let drug = this.store.createRecord('customerdrug',{});
          drug.set('editModel','add');
          drug.set('drugNum',0);
          drug.set('addDrugNum',0);
          this.set('drugInfo',drug);
          this.set('detailDrug',true);
        }
      }
    },
    //选择药品名称
    selectDrug(drug){
      this.set('drugModel.drug',drug);
    },
    //保存药品
    saveDrug(){
      let _self = this;
      let drugModel = this.get('drugModel');
      let customer = this.get('curcustomer');
      let customerShowList = this.get('customerShowList');
      if(drugModel.get('editModel')=='add'){
        console.log('drug.editModel',drugModel.get('editModel'));
        drugModel.set('customer',customer);
      }
      drugModel.validate().then(function(){
        if(drugModel.get('errors.length')===0){
          drugModel.save().then(function(){
            _self.set('detailDrug',false);
            _self.send('chooseDrugTab',customer);
            if(drugModel.get('editModel')=='add'){
              customerShowList.findBy('id',customer.get('id')).set('drugCount',_self.get('customerdrugList.length')+1);
            }


          },function(err){
            let error = err.errors[0];
            if(error.code==="14"){
              drugModel.validate().then(function(){
                drugModel.addError('addDrugNum',['出库数量不得大于库存数量']);
                drugModel.set("validFlag",Math.random());
              });
            }
          });
        }else{
          drugModel.set('validFlag',Math.random());
        }
      });
    },
    //删除药品
    delDrug(drug){
      let _self = this;
      let customer = this.get('curcustomer');
      let customerShowList = this.get('customerShowList');
      drug.set('delStatus',1);
      drug.save().then(function(){
        _self.send('chooseDrugTab',customer);
        customerShowList.findBy('id',customer.get('id')).set('drugCount',_self.get('customerdrugList.length')-1);
      },function(err){
        App.lookup('controller:business.mainpage').showPopTip("删除失败",false);
        let error = err.errors[0];
        if(error.code==="0"){
          App.lookup('controller:business.mainpage').showAlert('该药品已安排用药计划，无法删除！')
        }
      });
    },
    //新增和编辑用药计划
    detailDrugProject(drug){
      if(drug){
        this.set('projectInfo',drug);
        this.set('detailDrugProject',true);
      }else{
        let customerdrugprojectList = this.get('customerdrugprojectList');
        let customerdrugList = this.get('customerdrugList');
        if((customerdrugprojectList.get('length')==customerdrugList.get('length'))||(customerdrugList.get('length')===0)){
          App.lookup('controller:business.mainpage').showAlert("无法添加用药计划");
        }else{
          this.set('projectInfo',this.store.createRecord('customerdrugproject',{}));
          this.set('detailDrugProject',true);
        }
      }
    },
    //用药计划中选择药品
    selectProjectDrug(drug){
      let customerdrug = this.get('customerdrugList').findBy('drug.id',drug.get('id'));
      this.set('projectInfo.customerDrug',customerdrug);
      this.set('projectModel.drug',drug);
      this.set('projectModel.useDrugSpec',drug.get('drugSpec'));
    },
    //保存用药计划
    saveDrugProject(){
      let _self = this;
      let projectModel = this.get('projectModel');
      let customer = this.get('curcustomer');

      projectModel.validate().then(function(){
        if(!projectModel.get('useDrugDate')){
          projectModel.addError('useDrugDate',['用药时间不能为空']);
          App.lookup('controller:business.mainpage').showAlert("用药时间不能为空");
        }
        if(projectModel.get('errors.length')===0){
          projectModel.save().then(function(){
            _self.set('detailDrugProject',false);
            _self.send('chooseDrugPlanTab');
          });
        }else{
          projectModel.set('validFlag',Math.random());
        }
      });
    },
    //删除用药计划
    delDrugProject(drug){
      let _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此用药计划",function(){
        _self.send('cancelPassSubmit',drug);
      });
    },
    cancelPassSubmit(drug){
      let _self = this;
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      drug.set("delStatus", 1);
      drug.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          _self.send('chooseDrugPlanTab');
      });
    },
    //新增计划执行
    detailDrugProjectexe(drug){
      let customer = this.get('curcustomer');
      let _self = this;
      //let sysTime = _self.get("dataLoader").getNowTime();
      // let date = this.get("dateService").timestampToTime(new Date());
      let firstSec = this.get("dateService").getFirstSecondStampOfDay(new Date());
      //查询当前老人今天的，这种药品的用药计划执行情况
      this.store.query('customerdrugprojectexe',{filter:{customerDrug:{customer:{id:customer.get('id')}},"lastUpdateDateTime@$gte":firstSec}}).then(function(projectExeList){
        //计划用药时间，做power-select列表
        let list = new Ember.A();
        let dateList = drug.get('useDrugDate').split(',');
        for(let i=0;i<dateList.length;i++){
          let item = Ember.Object.create({});
          item.set('name',dateList[i]+'点');
          item.set('num',dateList[i]);
          if(!projectExeList.findBy('useDrugDate',dateList[i])){
            list.pushObject(item);
          }
        }
        _self.set('drugDateList',list);

      });
      this.set('detailDrugProjectexe',true);
      this.set('projectInfo',drug);
      this.set('projectexeInfo',this.store.createRecord('customerdrugprojectexe',{}));
      this.set('projectexeModel.customerDrug',drug.get('customerDrug'));
      this.set('projectexeModel.drugSpec',drug.get('useDrugSpec'));
      this.set('projectexeModel.drugProject',drug);
    },
    selectUseDrugDate(drug){
      this.set('projectexeModel.useDrug',drug);
      this.set('projectexeModel.useDrugDate',drug.get('num'));
    },
    //保存执行情况
    saveDrugProjectexe(){
      let _self = this;
      let projectModel = this.get('projectexeModel');
      let customer = this.get('curcustomer');
      projectModel.validate().then(function(){
        if(projectModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在执行");
          projectModel.save().then(function(){
            _self.set('detailDrugProjectexe',false);
            _self.send('chooseDrugPlanexeTab');
              App.lookup('controller:business.mainpage').showPopTip("执行成功");
          });
        }else{
          projectModel.set('validFlag',Math.random());
        }
      });
    },
    //执行情况时间选择
    changeExeDate(date){
      let stamp = this.get("dateService").timeToTimestamp(date);
      this.set("projectexeModel.exeDate", stamp);
    },
    useDrugResultSelect(result){
      this.set('projectexeModel.useDrugResult',result);
      this.set('projectexeInfo.useDrugResult',result);
    }
  }
});
