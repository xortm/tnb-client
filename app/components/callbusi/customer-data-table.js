import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
export default Ember.Component.extend({
  statusService: Ember.inject.service("current-status"),
  store: Ember.inject.service("store"),
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  dataLoader: Ember.inject.service("data-loader"),

  init:function(){
    let _self = this;
    _self._super(...arguments);
    _self.get('store').query('statquery', {
      filter: {
        queryType:"queryCustomer",
      }
    }).then(function(dataList) {
      let data = dataList.get("firstObject");
      console.log("data in query:",data);
      let dataStr = data.get("passengersGrade");
      let dataJson = JSON.parse(dataStr);
      let customerData = dataJson.customerData[0];
      console.log("customerData in query:",customerData);
      let levelData = dataJson.levelData[0];
      console.log("levelData in query:",levelData);
      let timeStat = dataJson.timeStat[0];
      console.log("timeStat in query:",timeStat);
      // let timeStatSort = timeStat.sortBy;
      // console.log("timeStat in query:",timeStat);

      //计算在院老人统计数据
      let customerStatusIn = customerData.customerStatusIn;
      let customerStatusTry = customerData.customerStatusTry;
      let customerLeave = customerData.customerLeave;
      let customerAll = customerStatusIn + customerStatusTry;
      let customerStatusIn1 = Math.round(customerStatusIn / customerAll * 10000) / 100.00 + "%";
      let customerStatusTry1 = Math.round(customerStatusTry / customerAll * 10000) / 100.00 + "%";
      let customerLeave1 = Math.round(customerLeave / customerAll * 10000) / 100.00 + "%";
      _self.set("customerStatusIn",customerStatusIn);
      _self.set("customerStatusTry",customerStatusTry);
      _self.set("customerLeave",customerLeave);
      _self.set("customerAll",customerAll);
      _self.set("customerStatusIn1",customerStatusIn1);
      _self.set("customerStatusTry1",customerStatusTry1);
      _self.set("customerLeave1",customerLeave1);
      _self.set("customerAll1","100%");
      //计算在院老人性别统计数据
      let sexTypeMale = customerData.sexTypeMale;
      let sexTypeFemale = customerData.sexTypeFemale;
      let sexAll = sexTypeMale + sexTypeFemale;
      let sexTypeMale1 = Math.round(sexTypeMale / sexAll * 10000) / 100.00 + "%";
      let sexTypeFemale1 = Math.round(sexTypeFemale / sexAll * 10000) / 100.00 + "%";
      _self.set("sexTypeMale",sexTypeMale);
      _self.set("sexTypeFemale",sexTypeFemale);
      _self.set("sexAll",sexAll);
      _self.set("sexTypeMale1",sexTypeMale1);
      _self.set("sexTypeFemale1",sexTypeFemale1);
      _self.set("sexAll1","100%");
      //自理能力统计
      let levelDataArr = new Ember.A();
      for(let i in levelData){
        let name = _self.get("dataLoader").findDict(i).get("typename");
        let percent = Math.round(levelData[i] / customerAll * 10000) / 100.00 + "%";
        let item = Ember.Object.create({});
        item.set("code",i);
        item.set("name",name);
        item.set("num",levelData[i]);
        item.set("percent",percent);
        levelDataArr.pushObject(item);
      }
      _self.set("levelDataArr",levelDataArr.sortBy("code"));
      console.log("levelDataArr:",levelDataArr.sortBy("code"));
      //年龄结构统计
      let timeStatArr = new Ember.A();
      for(let i in timeStat){
        console.log("in in for:",i);
        let name = _self.get("dataLoader").findDict(i).get("typename");
        let percent = Math.round(timeStat[i] / customerAll * 10000) / 100.00 + "%";
        let item = Ember.Object.create({});
        item.set("code",i);
        item.set("name",name);
        item.set("num",timeStat[i]);
        item.set("percent",percent);
        console.log("item in for:",item);
        timeStatArr.pushObject(item);
      }
      _self.set("timeStatArr",timeStatArr.sortBy("code"));
      console.log("timeStatArr:",timeStatArr.sortBy("code"));




    });

  },




});
