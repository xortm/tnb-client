import Ember from 'ember';

export default Ember.Controller.extend({
  flag: 0,
  bedShow:true,
  editModel:false,
  dateService:Ember.inject.service('date-service'),
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
  saveKind(str){
    this.send('saveEditor',str);
  },
  actions: {
    //编辑器内容上传
    saveEditor(str){
      let _self = this;
      let curData = this.get('curData');
      let base = new Base64();
      if(!str){
        str = '<p>请添加内容</p>';
      }
      let remark = base.encode(str);
      curData.set('remark',remark);

      curData.save().then(function(doc){
        _self.set('curData',doc);
        if(curData.get('type')=='标准'){
          _self.get('chargeList').forEach(function(doc){
            doc.set('hasSelected',false);
          });
        }
        if(curData.get('type')=='话术'){
          _self.get('marketList').forEach(function(market){
            market.set('hasSelected',false);
          })
        }
        _self.set('editModel',false);
        _self.send('readDetail',doc);
        App.lookup('controller:business.mainpage').showSimPop('保存成功');
      });

      //base64处理函数
      function Base64() {
         // private property
         const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
         // public method for encoding
         this.encode = function (input) {
          var output = "";
          var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
          var i = 0;
          input = _utf8_encode(input);
          while (i < input.length) {
           chr1 = input.charCodeAt(i++);
           chr2 = input.charCodeAt(i++);
           chr3 = input.charCodeAt(i++);
           enc1 = chr1 >> 2;
           enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
           enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
           enc4 = chr3 & 63;
           if (isNaN(chr2)) {
            enc3 = enc4 = 64;
           } else if (isNaN(chr3)) {
            enc4 = 64;
           }
           output = output +
           _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
           _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
          }
          return output;
         }

         // public method for decoding
         this.decode = function (input) {
          var output = "";
          var chr1, chr2, chr3;
          var enc1, enc2, enc3, enc4;
          var i = 0;
          input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
          while (i < input.length) {
           enc1 = _keyStr.indexOf(input.charAt(i++));
           enc2 = _keyStr.indexOf(input.charAt(i++));
           enc3 = _keyStr.indexOf(input.charAt(i++));
           enc4 = _keyStr.indexOf(input.charAt(i++));
           chr1 = (enc1 << 2) | (enc2 >> 4);
           chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
           chr3 = ((enc3 & 3) << 6) | enc4;
           output = output + String.fromCharCode(chr1);
           if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
           }
           if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
           }
          }
          output = _utf8_decode(output);
          return output;
         }

         // private method for UTF-8 encoding
         var _utf8_encode = function (string) {
          string = string.replace(/\r\n/g,"\n");
          var utftext = "";
          for (var n = 0; n < string.length; n++) {
           var c = string.charCodeAt(n);
           if (c < 128) {
            utftext += String.fromCharCode(c);
           } else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
           } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
           }

          }
          return utftext;
         }

         // private method for UTF-8 decoding
         var _utf8_decode = function (utftext) {
          var string = "";
          var i = 0;
          var c = 0;
          var c1 = 0;
          var c2 = 0;
          var c3;
          while ( i < utftext.length ) {
           c = utftext.charCodeAt(i);
           if (c < 128) {
            string += String.fromCharCode(c);
            i++;
           } else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
           } else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
           }
          }
          return string;
         }
       };
    },
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
    //查看内容
    readDetail(data){
      let _self = this;
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
        let str = data.get('remark');
        let base = new Base64();
        let remark = base.decode(str);
        if(str == _self.get('dateService').base64_encode(_self.get('dateService').base64_decode(str))) {//判断是否经过base64转码
           $('#data-content').append(remark);
         }else{
           $('#data-content').append(str);
         }
      });
      //base64处理函数
      function Base64() {
         // private property
         const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
         // public method for encoding
         this.encode = function (input) {
          var output = "";
          var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
          var i = 0;
          input = _utf8_encode(input);
          while (i < input.length) {
           chr1 = input.charCodeAt(i++);
           chr2 = input.charCodeAt(i++);
           chr3 = input.charCodeAt(i++);
           enc1 = chr1 >> 2;
           enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
           enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
           enc4 = chr3 & 63;
           if (isNaN(chr2)) {
            enc3 = enc4 = 64;
           } else if (isNaN(chr3)) {
            enc4 = 64;
           }
           output = output +
           _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
           _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
          }
          return output;
         }

         // public method for decoding
         this.decode = function (input) {
          var output = "";
          var chr1, chr2, chr3;
          var enc1, enc2, enc3, enc4;
          var i = 0;
          input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
          while (i < input.length) {
           enc1 = _keyStr.indexOf(input.charAt(i++));
           enc2 = _keyStr.indexOf(input.charAt(i++));
           enc3 = _keyStr.indexOf(input.charAt(i++));
           enc4 = _keyStr.indexOf(input.charAt(i++));
           chr1 = (enc1 << 2) | (enc2 >> 4);
           chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
           chr3 = ((enc3 & 3) << 6) | enc4;
           output = output + String.fromCharCode(chr1);
           if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
           }
           if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
           }
          }
          output = _utf8_decode(output);
          return output;
         }

         // private method for UTF-8 encoding
         var _utf8_encode = function (string) {
          string = string.replace(/\r\n/g,"\n");
          var utftext = "";
          for (var n = 0; n < string.length; n++) {
           var c = string.charCodeAt(n);
           if (c < 128) {
            utftext += String.fromCharCode(c);
           } else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
           } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
           }

          }
          return utftext;
         }

         // private method for UTF-8 decoding
         var _utf8_decode = function (utftext) {
          var string = "";
          var i = 0;
          var c = 0;
          var c1 = 0;
          var c2 = 0;
          var c3;
          while ( i < utftext.length ) {
           c = utftext.charCodeAt(i);
           if (c < 128) {
            string += String.fromCharCode(c);
            i++;
           } else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
           } else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
           }
          }
          return string;
         }
       };
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
        newData.set('remark','请添加内容');
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
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除？",function(){
        _self.send('cancelPassSubmit',data);
      });
    },
    //弹窗确定，删除记录
    cancelPassSubmit(data){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
      this.set("showpopInvitePassModal",false);
      let _self = this;
      data.set('delStatus',1);
      data.save().then(function(){
        App.lookup('controller:business.mainpage').showPopTip("删除成功");
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
