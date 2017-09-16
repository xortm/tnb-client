import Ember from 'ember';

export default Ember.Controller.extend({
    queryCondition:'',
    deviceProject:null,
    mainController: Ember.inject.controller('business.mainpage'),
    deviceProList:Ember.computed('devicetypeList',function(){
      let list = new Ember.A();
      let deviceTypeList = this.get('devicetypeList');
      if(!deviceTypeList){
        return null;
      }
        deviceTypeList.forEach(function(deviceType){
            let item = Ember.Object.create({});
            switch (deviceType.get('codeInfo')) {
              case 'daerma':
                item.set('typename','床垫');
                item.set('code','03');
                item.set('typecode','daerma');
                break;
              case 'yitikang':
                item.set('typename','体检');
                item.set('code','01');
                item.set('typecode','yitikang');
                break;
              case 'huami':
                item.set('typename','呼叫');
                item.set('code','02');
                item.set('typecode','huami');
                break;
            }
            if(!list.findBy('code',item.get('code'))){
              list.pushObject(item);
            }
        });
        return list;
    }),
    actions:{
      deviceProSelect(device){
        this.set('deviceProject',device);
        App.lookup('route:business.mainpage.device-maintain-management').doQuery();
      },
      search(){
        App.lookup('route:business.mainpage.device-maintain-management').doQuery();
      },
      //跳转至编辑页
      toDetailPage(device){
        if(device){
          let id=device.get('id');
          let itemId = device.get('item.id');
          this.get("mainController").switchMainPage('device-maintain-detail',{id:id,editMode:"edit",itemId:itemId});
        }else{
          this.get("mainController").switchMainPage('device-maintain-detail',{editMode:"add",id:''});
        }
      },
    }

});
