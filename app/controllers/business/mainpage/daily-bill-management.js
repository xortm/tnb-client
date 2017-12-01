import Ember from 'ember';

export default Ember.Controller.extend({

    exportAll:true,
    constants: Constants,
    queryCondition:'',
    mainController: Ember.inject.controller('business.mainpage'),
    dataLoader:Ember.inject.service('data-loader'),
    statusList:Ember.computed(function(){
      let list = new Ember.A();
      let status0 = Ember.Object.create({
        name:'未提交',
        typecode:'billStatus0'
      });
      list.pushObject(status0);
      let status1 = Ember.Object.create({
        name:'已提交',
        typecode:'billStatus1'
      });
      list.pushObject(status1);
      let status2 = Ember.Object.create({
        name:'审核通过',
        typecode:'billStatus2'
      });
      list.pushObject(status2);
      let status3 = Ember.Object.create({
        name:'审核未通过',
        typecode:'billStatus3'
      });
      list.pushObject(status3);
      return list;
    }),
    actions:{
      exportToAllExcel(){
        let _self = this;
        let params = App.lookup("route:business.mainpage.nursing-worker-group-management").buildQueryParams();
        App.lookup("route:business.mainpage.nursing-worker-group-management").set('perPage',100);
        App.lookup("route:business.mainpage.nursing-worker-group-management").findPaged('customerbill',params).then(function(customerbillList){
            _self.set('exportList',customerbillList);
            Ember.run.schedule('afterRender',function(){
              $(".export-block").tableExport({type:'excel',escape:'false'});
            });

        });

      },
      //跳转至编辑页
      toDetailPage(bill){
        let _self = this;
        let constants = this.get('constants');
        let id = bill.get('id');
        if(bill.get('billStatus.typecode')==constants.billStatus1||bill.get('billStatus.typecode')==constants.billStatus2){
          this.get("mainController").switchMainPage('daily-bill-detail',{id:id,editMode:"readOnly"});
        }else{
          this.get("mainController").switchMainPage('daily-bill-detail',{id:id,editMode:"detail"});
        }
      },
      selectStatus(status){
        this.set('status',status);
        if(status){
          this.set('searchStatus',status.get('typecode'));
        }else{
          this.set('searchStatus','');
        }
        App.lookup("route:business.mainpage.daily-bill-management").doQuery();
      },
      toEdit(bill){
        let id = bill.get('id');
        this.get("mainController").switchMainPage('daily-bill-detail',{id:id,editMode:"edit"});
      },
      toAdd(){
        this.get("mainController").switchMainPage('daily-bill-detail',{editMode:"add"});
      },
      //提交
      commit(bill){
        this.set('popSubmit',true);
        this.set('curBill',bill)
      },
      submit(){
        let _self = this;
        let billInfo = this.get('curBill');
        let status = this.get("dataLoader").findDict("billStatus1");
        billInfo.set('billStatus',status);
        billInfo.save().then(function(){
          App.lookup('controller:business.mainpage').openPopTip("正在提交");
          _self.set('popSubmit',false);
          let mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('daily-bill-management');
          App.lookup('controller:business.mainpage').showPopTip("提交成功");
          _self.set('curBill',null);
        });
      },
      recall(){
        this.set('popSubmit',false);
        this.set('curBill',null);
      },
    }

});
