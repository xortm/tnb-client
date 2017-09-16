import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "userMyInfoCstag",
  infiniteModelName: "user",
  infiniteContainerName:"userMyInfoCstagContainer",
// curUserCstag:Ember.computed(function(){
//   if(source === 'cstag'){
//     this.set('curUserCstag' ,true);
//   }
//   if(source === 'introduce'){
//     this.set('curUserCstag' , false);
//   }
// }),
  actions:{
    sureAddCstag:function(){
      var model = this.get('model');
      var curUser = this.get("global_curStatus").getUser();
      this.store.findRecord("userPrivate",curUser.get("id")).then(function(userEnt){
        model.cstag.forEach(function(lan) {
          if(lan.get('checked')){
            userEnt.get('cstag').pushObject(lan);
          }
         if(lan.get('checked')===false) {
           userEnt.get('cstag').removeObject(lan);
          }
        });
        userEnt.save();
      });
      this.set('showCstag',false);

    },
    addCstag:function(){
      this.set('showCstag',true);
      // this.set('showCstag',false);
    },
  },
});
