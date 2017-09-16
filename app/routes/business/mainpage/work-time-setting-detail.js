import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },
  dataLoader: Ember.inject.service("data-loader"),
  detailEdit:true,
  header_title:'班次信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    let _self = this;
    // this.store.unloadAll('worktimesetting');
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    this.store.query('worktimesetting',{}).then(function(workTimeList){
      //已有排班的颜色列表
      let colorList = new Ember.A();
      workTimeList.forEach(function(worktime){
        colorList.pushObject(worktime.get('colorFlag'));
      });
      //所有的颜色列表
      let allColorList = _self.get("dataLoader").findDictList("colorType").sortBy('typecode');
      allColorList.forEach(function(color){
        let name;
        switch (color.get('typecode')) {
          case 'colorType1':
            name =  "work-color-1";
            break;
          case 'colorType2':
            name =  "work-color-2";
            break;
          case 'colorType3':
            name =  "work-color-3";
            break;
          case 'colorType4':
            name =  "work-color-4";
            break;
          case 'colorType5':
            name =  "work-color-5";
            break;
          case 'colorType6':
            name =  "work-color-6";
            break;
          case 'colorType7':
            name =  "work-color-7";
            break;
          case 'colorType8':
            name =  "work-color-8";
            break;
          case 'colorType9':
            name =  "work-color-9";
            break;
          default:
            name = "work-color-9";
            break;
        }
        color.set('colorName',name);
        return color;
      });
      controller.set('colorList',allColorList);
      if(editMode=='edit'){
        controller.set('detailEdit',false);
        let worktimesettingInfo = _self.store.peekRecord('worktimesetting',id);
        controller.set('worktimesettingInfo',worktimesettingInfo);
      }else{
        let worktimesettingInfo = _self.store.createRecord('worktimesetting',{});
        worktimesettingInfo.set('startTime',null);
        worktimesettingInfo.set('endTime',null);
        controller.set('detailEdit',true);
        controller.set('worktimesettingInfo',worktimesettingInfo);
      }
    });

  }
});
