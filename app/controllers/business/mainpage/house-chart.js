import Ember from 'ember';

export default Ember.Controller.extend({
  flag: 0,
  bedShow:true,
  editModel:false,

  floorsObs:function(){
    let _self = this;
    let floors = this.get('curbuilding.floors');
    if(!this.get('bedReady')){
      return ;
    }
    if(this.get('curbuilding.floors.length')==this.get('curbuilding.floorNum')){
      let sortfloors = floors.sortBy('seq').reverse();
      sortfloors.forEach(function(floor){
        let rooms = floor.get('rooms');
        rooms = rooms.sortBy('name');
        floor.set('rooms',rooms);
      });
      this.get('curbuilding').set('curfloors',sortfloors);
      //页面渲染完成后，得到父元素的高度，设为默认高度
      Ember.run.schedule('afterRender',function(){
        let height = $('#house-chart').height();
        _self.set('defaultHeight',height);
      });
    }
  }.observes('curbuilding.floors','flag'),
  actions: {
    //选择楼宇
    selectBuild(build) {
      var _self = this;
      let process = function(data) {
        data.set("hasInit",true);
        let floors = data.get('floors');
        //将每个楼层下的房间，设为未选状态
        floors.forEach(function(floor){
          let room = floor.get('rooms').findBy('hasSelected',true);
          if(room){
            room.set('hasSelected',false);
          }

        });
        let sortFloors = floors.sortBy('seq');//楼层排序
        data.set('floors',sortFloors);
        _self.set('curbuilding', data);
        _self.incrementProperty('flag');
        if(!floors.get('length')){
          _self.set('curRoom',null);
        }
      };
      //暂停数据修补
      this.get("global_dataLoader").set("roomRebuild",true);
      this.get("global_dataLoader").set("floorRebuild",true);
      _self.store.findRecord("building", build.get("id")).then(function(data){
        _self.set('curRoom',null);
        process(data);
        //重启数据修补
        _self.get("global_dataLoader").set("roomRebuild",false);
        _self.get("global_dataLoader").set("floorRebuild",false);
      });
      let buildingList = this.get('buildingList');
      buildingList.forEach(function(build){
        build.set('hasChoosed',false);
      });
      build.set('hasChoosed',true);
    },
    //选择房间
    selectRoom(room) {
      let _self = this;
      let customerList = this.get('customerList');
        let floor = room.get('floor');
        let rooms = floor.get('rooms');
        room.set('hasSelected',true);
        this.set('curRoom',room);
        if(!room.get('beds')){
          room.set('beds',new Ember.A());
        }else{
          let beds = room.get('beds');
          let customerList = _self.get('customerList');
          beds.forEach(function(bed){
            let customer = customerList.filter(function(customer){
              return customer.get('bed.id') == bed.get('id');
            });
            //如果床位有人，绑定老人信息
            if(customer){
              bed.set('customer',customer.get('firstObject'));
            }
          });
        }
      Ember.run.schedule('afterRender',function(){
        let height = $('#bed-list').height();
        let defaultHeight = _self.get('defaultHeight');
        $('#house-chart').css('height',height+defaultHeight+100);
      });

    },
    noSelectRoom(room){
      room.set('hasSelected',false);
    },
    chooseTab(str){
      let _self = this;
      switch (str) {
        case 'houseTab':
          _self.set('houseTab',true);
          _self.set('chargeTab',false);
          _self.set('marketingTab',false);
          break;
        case 'chargeTab':
          _self.set('houseTab',false);
          _self.set('chargeTab',true);
          _self.set('marketingTab',false);
          break;
        case 'marketingTab':
          _self.set('houseTab',false);
          _self.set('chargeTab',false);
          _self.set('marketingTab',true);
          break;
        default:
      }
      if(this.get('chargeList')){
        this.get('chargeList').forEach(function(charge){
          charge.set('hasSelected',false);
          charge.set('edited',false);
        });
      }
      if(this.get('marketList')){
        this.get('marketList').forEach(function(market){
          market.set('hasSelected',false);
          market.set('edited',false);
        });
      }
      _self.set('curData',null);
      this.set('editModel',false);
    },
    readDetail(data){
      if(data.get('type')=='标准'){
        this.get('chargeList').forEach(function(charge){
          charge.set('hasSelected',false);
        })
      }
      if(data.get('type')=='话术'){
        this.get('marketList').forEach(function(market){
          market.set('hasSelected',false);
        })
      }
      data.set('hasSelected',true)
      $('#data-content').empty();
      if(this.get('curData')){
        this.set('editModel',false);
        this.set('curData',null);
        this.set('curData',data);
      }else{
        this.set('curData',data);
        console.log('curData',data.get('title'),data.get('remark'));
      }
      Ember.run.schedule('afterRender',function(){
        if(data.get('remark')){
          $('#data-content').append(data.get('remark'));
        }else{
          $('#data-content').append('<div>请填写内容</div>');
        }

      })

    },
    detailEditClick(){
      this.set('editModel',true);
    },
    cancel(str){
      this.set('editModel',false);
      Ember.run.schedule('afterRender',function(){
        $('#data-content').append(str);
      })
    },
    add(str){
      let item;
      if(str=="charge"){
        item = this.store.createRecord('charging-standard',{});
        item.set('type','标准');
      }
      if(str=="market"){
        item = this.store.createRecord('market-skill',{});
        item.set('type','话术');

      }
      this.set('addData',item);
      this.set('addModel',true);
    },
    save(str){
      let _self = this;
      let curData = this.get('curData');
      if(str.length>0){
        curData.set('remark',str);
      }else{
        let holder = '<p>请添加内容</p>';
        curData.set('remark',holder);
      }

      curData.save().then(function(){
        App.lookup('controller:business.mainpage').showPopTip('保存成功');
      });

    },
    saveToRead(str){
      let _self = this;

      let curData = this.get('curData');
      if(str.length>0){
        curData.set('remark',str);
      }else{
        let holder = '<p>请添加内容</p>';
        curData.set('remark',holder);
      }

      curData.save().then(function(){
        _self.set('editModel',false);
        _self.send('readDetail',curData);
        App.lookup('controller:business.mainpage').showPopTip('保存成功');
      });

    },
    saveNew(){
      let newData = this.get('addData');
      let _self = this;
      if(newData.get('title.length')>0){
        newData.save().then(function(){
          if(newData.get('type')=='标准'){
            _self.store.query('charging-standard',{}).then(function(chargeList){
              chargeList.forEach(function(charge){
                charge.set('type','标准');
              });
              _self.set('chargeList',chargeList);
            })
          };
          if(newData.get('type')=='话术'){
            _self.store.query('market-skill',{}).then(function(marketList){
              marketList.forEach(function(market){
                market.set('type','话术');
              });
              _self.set('marketList',marketList);
            });
          }
          _self.send('readDetail',newData);
          _self.send('detailEditClick');
          _self.set('addModel',false);
        });
      }else{
        App.lookup('controller:business.mainpage').showAlert("请输入标题");
      }

    },
    invitation(){
      this.set('addData',null);
      this.set("addModel",false);
    },
    chooseData(data){
      if(data.get('type')=='标准'){
        this.get('chargeList').forEach(function(charge){
          charge.set('hasChoosed',false);
        })
        data.set('hasChoosed',true);
      }
      if(data.get('type')=='话术'){
        this.get('marketList').forEach(function(market){
          market.set('hasChoosed',false);
        })
        data.set('hasChoosed',true);
      }
    },
    leaveData(data){
      data.set('hasChoosed',false);
    },
    edit(data){
      data.set('edited',true);
    },
    del(data){
      let _self = this;
      data.set('delStatus',1);
      data.save().then(function(){
        if(data.get('type')=='标准'){
          _self.store.query('charging-standard',{}).then(function(chargeList){
            chargeList.forEach(function(charge){
              charge.set('type','标准');
            });
            _self.set('chargeList',chargeList);
          })
        };
        if(data.get('type')=='话术'){
          _self.store.query('market-skill',{}).then(function(marketList){
            marketList.forEach(function(market){
              market.set('type','话术');
            });
            _self.set('marketList',marketList);
          });
        }
      });
      this.set('curData',null);
    },
    saveTitle(data){
      data.save().then(function(){
        data.set('edited',false);
      });
    },
  }
});
