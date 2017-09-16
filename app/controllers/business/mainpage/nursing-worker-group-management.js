import Ember from 'ember';

export default Ember.Controller.extend({
    constants: Constants,
    mainController: Ember.inject.controller('business.mainpage'),
    exportAll:true,
    actions:{
      exportToAllExcel(){
        let _self = this;
        let params;
        if(this.get('searchType')){
          params = App.lookup("route:business.mainpage.nursing-worker-group-management").buildQueryParams(this.get('searchType'));
        }else{
          params = App.lookup("route:business.mainpage.nursing-worker-group-management").buildQueryParams();
        }
        App.lookup("route:business.mainpage.nursing-worker-group-management").set('perPage',100);
        App.lookup("route:business.mainpage.nursing-worker-group-management").findPaged('nursegroup',params).then(function(nursegroupList){
          nursegroupList.forEach(function(nursegroup){
            App.lookup("route:business.mainpage.nursing-worker-group-management").getStaffByNurseGroup(nursegroup);
            App.lookup("route:business.mainpage.nursing-worker-group-management").getCustomerByNurseGroup(nursegroup);
          });
            _self.set('exportList',nursegroupList);
            Ember.run.schedule('afterRender',function(){
              $(".export-block").tableExport({type:'excel',escape:'false'});
            });

        });

      },
      search(type){
        if(this.get('queryCondition')){
          if(this.get('searchType')){
            App.lookup("route:business.mainpage.nursing-worker-group-management").doQuery(this.get('searchType'));
          }else{
            App.lookup("route:business.mainpage.nursing-worker-group-management").doQuery();
          }
        }else{
          App.lookup("route:business.mainpage.nursing-worker-group-management").doQuery();
        }
      },
      searchType(type){
        this.set('searchType',type);
        if(type=='staff'){
          this.set('queryStaff',true);
          this.set('queryCustomer',false);
        }
        if(type=='customer'){
          this.set('queryStaff',false);
          this.set('queryCustomer',true);
        }
      },
      toNurseGroupDetailPage(nurseGroup){
        if(nurseGroup){
          let id=nurseGroup.get('id');
          this.get("mainController").switchMainPage('nursing-worker-group-detail',{id:id,editMode:"edit"});
        }else{
          this.get("mainController").switchMainPage('nursing-worker-group-detail',{editMode:"add"});
        }
      },

    }

});
