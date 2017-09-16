import Ember from 'ember';

export default Ember.Controller.extend({
    mainController: Ember.inject.controller('business.mainpage'),
    constants: Constants,
    staffStatus:{},
    exportDef:{
      "model":"employee",
      "export":{
        "title":"员工列表",
        "cols":[{"name":"name","title":"员工姓名"},
                {"name":"staffSex.typename","title":"性别"},
                {"name":"age","title":"年龄"},
                {"name":"position.typename","title":"岗位"},
                {"name":"department.name","title":"所属部门"},
                {"name":"staffTel","title":"联系电话"}],
        //  "format":[
        //    {
        //      "colName":"createTime",//需要格式化字段的字段名
        //      "format":"yyyy-MM-dd"   //格式化表达式
        //    }
        //  ]
        },
    },
    // exportAll:true,
    actions: {
        enterDetail: function(staff) {
            var id = staff.get("id");
            console.log("id1111111111",id);
            var params ={
              editMode:"edit",
              id:id
            };
            this.get("mainController").switchMainPage('staff-add-detail',params);
        },
        /*删除*/
        delOrg: function(staff) {
            org.set("delStatus", 1);
            var _self = this;
            org.save().then(function() {
                _self.get('target').send('saveRefresh');
            });
        },
        /*增添*/
        addStaff: function() {
            var params ={
              editMode:"add",
            };
            this.get("mainController").switchMainPage('staff-add-detail',params);
        },
        /*跳转页面*/
        toOperation(staff){
          let id=staff.get('id');
          this.get("mainController").switchMainPage('customer-nursing-setting',{id:id});
        },
        statusSelect:function(currentDict){
           this.set("staffStatus",currentDict);
           App.lookup("route:business.mainpage.staff-management").doQuery();
        }
    }
});
