import Ember from 'ember';
import Changeset from 'ember-changeset';
import ProjectInfoValidations from '../../../validations/project-info';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Controller.extend({
    statusService: Ember.inject.service("current-status"),
    queryCondition:'',
    mainController: Ember.inject.controller('business.mainpage'),
    addNewProject:false,
    name:'',

    projectCustomerList:Ember.computed('customerList',function(){
      let list = new Ember.A();
      let customerList = this.get('customerList');
      let projectList = this.get('projectList');
      if(customerList){
        customerList.forEach(function(customer){
          list.pushObject(customer);
        });
      }
      projectList.forEach(function(project){
        console.log("come in ?");
        list.forEach(function(customer){
          if(customer.get('id')==project.get('customer.id')){
            list.removeObject(customer);
          }
        });
      });
      return list;
    }),
    newProModel: Ember.computed('newPro', function() {
        let model = this.get("newPro");
        if (!model) {
            return null;
        }
        return new Changeset(model, lookupValidator(ProjectInfoValidations), ProjectInfoValidations);
    }),
    actions:{
      invalid() {
          //alert("invalid");
      },
      //跳转至编辑页
      toDetailPage(project){
        let id=project.get('id');
        this.get("mainController").switchMainPage('member-servicelist-detail',{id:id,customerId:project.get("customer.id"),editMode:"edit"});
      },
      selectCustomer(customer){
        console.log("name:",this.get("name"));
        this.set('customer',customer);
        this.get('newProModel').set('customer',customer);
      },
      addProject(){
        this.set('addNewProject',true);
      },
      invitation(){
        this.set('addNewProject',false);
      },
      saveNewProject(){
        var _self=this;
        var curUser = this.get("statusService").getUser();
        //var newPro=this.store.createRecord('nursingproject',{});
        var newPro=this.get('newPro');
        var newProModel=this.get('newProModel');
        var customer = this.get("customer");
        newProModel.set('name',this.get('name'));
        newProModel.set('customer',customer);
        newProModel.set('createUser',curUser);
        newProModel.set('delStatus',1);
        //let newProModel=new Changeset(newPro, lookupValidator(ProjectInfoValidations), ProjectInfoValidations);
        newProModel.validate().then(function(){
          // alert("validate ok!");
          if (newProModel.get('errors.length') === 0){
            // alert("newProModel.get ok!");
            // newProModel.save();
            // newProModel.save().then(function(){
            //   alert("newProModel.save ok!");
            // });
            newProModel.save().then(function(newPro){
              // alert("newProModel.save ok!");
              _self.set('addNewProject',false);
              console.log("id11111111111 newPro",newPro);
              console.log("id11111111111 id",newPro.get("id"));
              _self.set('name','');
              _self.get("mainController").switchMainPage('member-servicelist-detail',{editMode:"add",customerId:customer.get("id"),id:newPro.get('id')});
            });
          }else {
            // alert("else ok!");
            newProModel.set("validFlag", Math.random());
          }
        });

      },
    },

});
