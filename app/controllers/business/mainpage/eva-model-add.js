import Ember from 'ember';
import Changeset from 'ember-changeset';
export default Ember.Controller.extend( {
    constants: Constants,
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),
    feedBus: Ember.inject.service("feed-bus"),
    hasChoosed: "false",
    actions: {
        chooseModel(useModel) {
            if (useModel.get('hasChoosed')) {
                useModel.set('hasChoosed', false);
            } else {
                useModel.set('hasChoosed', true);
                console.log('useModel:hasChoosed',useModel.get('hasChoosed'));
            }
        },
        nextClick() {
          var _self = this;
            var mainpageController = App.lookup('controller:business.mainpage');
                //获取选择的模板
                var useModelList = _self.get('useModelList');
                var useModelAry = new Ember.A();
                let idStr = '';
                useModelList.forEach(function(useModel) {
                    if (useModel.get('hasChoosed')) {
                      idStr = useModel.get('id') + ',';
                      useModelAry.push(useModel);
                    }
                });
                idStr = idStr.substring(0,idStr.length-1);
                //如果沒有选择模板则无法进行‘下一步’
                if(useModelAry.length<=0){
                  App.lookup('controller:business.mainpage').showAlert("请选择需要评估的模板！");
                  return;
                }
                //通过全局服务进行上下文传值
                let selectCustomer = _self.get('feedBus.evaCustomer');
                let batch = _self.store.createRecord('evaluatebatch',{});
                batch.set('customer',selectCustomer);
                batch.set('remark','ID'+idStr);
                batch.save().then(function(newBatch){
                  _self.set('feedBus.evaCustomer',null);
                  mainpageController.switchMainPage('eva-detail', {
                      editMode: "add",
                      id: newBatch.get('id')
                  });
                });

        }
    }
});
