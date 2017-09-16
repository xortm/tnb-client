import Ember from 'ember';

export default Ember.Component.extend({
  dateService:Ember.inject.service('date-service'),
  actions:{
    chooseStaff: function(data) {
        var itemId = "choose_staff_" + data.get("id");
        $("#" + itemId).addClass("tapped");
        setTimeout(function() {
            $("#" + itemId).removeClass("tapped");
        }, 200);
        var _self = this;
        var source = this.get("source");
        var infoId = _self.get("infoId");
        this.set("theChoose", data);

    },
    save(){
      let _self = this;
      let flag = this.get('editType');

      let elementId = "#save-date-staff";
      $(elementId).addClass("tapped");
      Ember.run.later(function() {
          $(elementId).removeClass("tapped");
          Ember.run.later(function() {
            if(flag=='staff'){
              let user = _self.get('theChoose');
              _self.sendAction('saveUser',user);
            }
            if(flag=='date'){
              let date = $('#FromDate').val();
              let timeData = _self.get("dateService").timeStringToTimestamp(date);
              if (!timeData) {
                  _self.set('succeed', '时间不能为空！');
                  return;
              }
              _self.sendAction('saveUser',timeData);
            }
          }, 100);
      }, 200);
    },
  }
});
