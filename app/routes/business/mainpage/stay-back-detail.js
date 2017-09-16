import Ember from 'ember';
import BaseBusiness from '../base-business';
const {leaveStatus1,leaveStatus2,leaveStatus3,leaveStatus4,leaveStatus5,
  consultStatus5,consultStatus4,consultStatus6,consultStatus7,leaveReason} = Constants;

export default BaseBusiness.extend({
  dateService: Ember.inject.service("date-service"),
  queryParams: {
      customerflowId: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },
  header_title:'修改退住登记',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode = controller.get('editMode');
    var id = controller.get('customerflowId');
    let today = this.get('dateService').getCurrentTime()-1;
    today = this.get("dateService").timestampToTime(today);

    controller.set('today',today);
    if(editMode=='edit'){
      controller.set('lookDetail',false);
      controller.set('detailEdit',false);
      var customerflowedit = this.store.peekRecord("customerbusinessflow",id);
      controller.set('customerflow',customerflowedit);
      // this.store.findRecord('customerbusinessflow',id).then(function(customerflow){
      //   controller.set('customerflow',customerflow);
      //   console.log("customerflow11111111",customerflow);
      // });
    }else if(editMode=='look'){
      controller.set('detailEdit',false);
      controller.set('lookDetail',true);
      var customerflowlook = this.store.peekRecord("customerbusinessflow",id);
      controller.set('customerflow',customerflowlook);
      // this.store.findRecord('customerbusinessflow',id).then(function(customerflow){
      //   controller.set('customerflow',customerflow);
      //   console.log("customerflow11111111",customerflow);
      // });
    }
    else{
      controller.set('lookDetail',false);
      controller.set('detailEdit',true);
      var customerflow = this.store.createRecord('customerbusinessflow',{});

      // controller.set('customerflow.leaveStaff','');
      // controller.set('customerflow.leaveReason','');
      // controller.set('customerflow.leaveRemark','');
      controller.set('customerflow',customerflow);

    }

    this.store.query('employee',{filter:{
      staffStatus:{'typecode@$not':Constants.staffStatusLeave}
    }}).then(function(userList){
      userList.forEach(function(item){
        item.set("namePinyin",item.get("name"));
      });
      controller.set('userList',userList);//登记人  护工
      console.log("userList11111111",userList);
    });


    this.store.query('customerbusinessflow',{
      filter:{
        'status---1':{'typecode@$or1---1':Constants.consultStatus5},//入住
        'status---2':{'typecode@$or1---2':Constants.consultStatus4},//试住
      }
    }).then(function(customerflowInBedList){
      controller.set('customerflowInBedList',customerflowInBedList);//入住试住 老人customerflow
      controller.set("inBedFlag",true);
    });
    this.store.query('customerbusinessflow',{
      filter:{
        'leaveStatus---1':{'typecode@$or1---1':Constants.leaveStatus1},
        'leaveStatus---2':{'typecode@$or1---2':Constants.leaveStatus2},
        'leaveStatus---3':{'typecode@$or1---3':Constants.leaveStatus3},
        'leaveStatus---4':{'typecode@$or1---4':Constants.leaveStatus4},
      }
    }).then(function(leaveList){
      controller.set('leaveList',leaveList);//退住老人(不包括作废)
      controller.set("leaveFlag",true);
    });


  }
});
