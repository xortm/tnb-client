import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Changeset from 'ember-changeset';
import CustomerValidations from '../../validations/customer-live-info';
import lookupValidator from 'ember-changeset-validations';

export default BaseItem.extend(CustomerValidations, {
    constants: Constants,
    statusService: Ember.inject.service("current-status"),
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    dataLoader: Ember.inject.service("data-loader"),
    customerModel: Ember.computed("customerInComp", function() {
        var model = this.get("customerInComp");
        console.log("model customerInComp", model);
        if (!model) {
            return null;
        }
        return new Changeset(model, lookupValidator(CustomerValidations), CustomerValidations);
    }),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.customer-service');
        //route.refresh();
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    detailModify: Ember.computed("addMode", function() {
        var addMode = this.get("addMode");
        if (addMode) {
            return true;
        } else {
            return false;
        }
    }),
    defaultBed: Ember.computed('customerInComp.bed', function() {
        console.log("customerInComp.bed", this.get('customerInComp.bed'));
        return this.get('customerInComp.bed');
    }),
    didInsertElement: function() {
        var _self = this;
    },
    changeObs: function() {
        var _self = this;
        //老人对应设备
        //修改版(查所有的设备类型和设备表，分出对应的数组)
        this.get('store').query('devicetype', {}).then(function(devicetypeList) { //所有的设备类型表
            _self.get('store').query('device', {
                filter: {
                    '[status][typecode]': 'deviceStatus1',
                    'deviceStatus': 1
                }
            }).then(function(alldeviceList) { //所有的设备表
                _self.get('store').query('customerdevice', { //客户设备对照表
                    filter: {
                        '[customer][id]': _self.get('customerInComp.id')
                    }
                }).then(function(customerdeviceList) {
                  //查询device-type-item(过滤需要显示的方案devicetype)
                  _self.get('store').query('device-type-item',{
                    filter:{
                      '[item][typecode@$like]@$or1---1': 'deviceType6',
                      '[item][typecode@$like]@$or1---2': 'deviceType5',
                      '[item][typecode@$like]@$or1---3': 'deviceType4'
                    }
                  }).then(function(deviceItemList){
                    let realDevicetypeList = new Ember.A();
                    console.log("devicetypeList:",devicetypeList);
                    console.log("alldeviceList:",alldeviceList);
                    console.log("customerdeviceList:",customerdeviceList);
                    console.log("deviceItemList:",deviceItemList);
                    let number = -1;
                    devicetypeList.forEach(function(devicetype) {
                        number = ++number;
                        //let devicetypeObj={};
                        let codeInfo = devicetype.get('codeInfo');
                        //获取客户设备对照表数组
                        let filCustomerdeviceList = customerdeviceList.filter(function(customerdevice) {
                            return customerdevice.get('device.type.codeInfo') == devicetype.get('codeInfo');
                        });
                        let computeDeviceObj = null;
                        let computeCustomerDeviceObj = null;
                        if (filCustomerdeviceList.get('firstObject.id')) {
                            computeDeviceObj = filCustomerdeviceList.get('firstObject.device');
                            console.log('设备编号',computeDeviceObj.get('seq'));
                            computeCustomerDeviceObj = filCustomerdeviceList.get('firstObject');
                        }
                        //获取设备表数组
                        let filDeviceList = alldeviceList.filter(function(device) {
                            return device.get('type.codeInfo') == devicetype.get('codeInfo');
                        });
                        //过滤租户没有选择的方案
                        let filDeviceItemList=deviceItemList.filter(function(deviceItem){
                          return deviceItem.get('type.codeInfo') == devicetype.get('codeInfo');
                        });
                        let isShow = false;
                        if(filDeviceItemList.get('length')){
                          isShow=true;
                        }
                        let obj = Ember.Object.extend({
                            deviceName: devicetype.get('deviceName'),
                            deviceList: filDeviceList,
                            deviceCode: devicetype.get('codeInfo'),
                            deviceObj: computeDeviceObj,
                            customerDeviceObj: computeCustomerDeviceObj,
                            number: number % 2,
                            isShow:isShow
                        });
                        realDevicetypeList.push(obj.create());
                    });
                    _self.set('realDevicetypeList', realDevicetypeList);
                    });
                });
            });
        });
    }.observes("accountFlag").on('init'),
    actions: {
        dpShowAction(e) {},
        invalid() {
            //alert("invalid");
        },
        //修改
        detailModifyClick: function() {
            this.set('detailModify', true);
        },
        //保存按钮
        detailSaveClick: function() {
            var _self = this;
            var saveCustomerDeviceList = new Ember.A(); //存储老人设备对照表数组
            var realDevicetypeList = this.get('realDevicetypeList'); //页面上循环的数组
            realDevicetypeList.forEach(function(realDevicetype) { //
                var deviceObj = realDevicetype.get('deviceObj'); //数组里面存储的设备对象
                var customerDeviceObj = realDevicetype.get('customerDeviceObj'); //数组里面存储的老人设备-对象
                if (deviceObj && deviceObj.get('id')) { //设备存在
                    if (customerDeviceObj && customerDeviceObj.get('id')) { //老人对照表存在
                        customerDeviceObj.set('device', deviceObj);
                        saveCustomerDeviceList.pushObject(customerDeviceObj);
                    } else {
                        //console.log('没有customerDeviceObj的id',customerDeviceObj.get('id'));
                        let customerDevice = _self.get('store').createRecord('customerdevice', {
                            customer: _self.get('customerInComp'),
                            device: deviceObj,
                        });
                        saveCustomerDeviceList.pushObject(customerDevice);
                    }
                } else { //设备不存在
                    if (customerDeviceObj && customerDeviceObj.get('id')) { //客户设备表存在
                        //customerDeviceObj.set('device', deviceObj);
                        customerDeviceObj.set('delStatus', 1);
                        saveCustomerDeviceList.pushObject(customerDeviceObj);
                    }
                }
            });
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            if (saveCustomerDeviceList.get('length') > 0) {
                saveCustomerDeviceList.forEach(function(customerdevice) {
                    customerdevice.save().then(function() {
                        App.lookup('controller:business.mainpage').showPopTip("保存成功");
                        _self.set('detailModify', false);
                        _self.set('accountFlag', 0);
                    });
                });
            }
        },
        //取消按钮
        cancelClick: function() {
            var mainpageController = App.lookup('controller:business.mainpage');
            this.set('detailModify', false);
            //alert("详情");
            if (!this.get('addMode')) {
                this.get("customerInComp").rollbackAttributes();
                this.set("customerModel", new Changeset(this.get("customerInComp"), lookupValidator(CustomerValidations), CustomerValidations));
            }
            if (this.get("addMode")) {
                mainpageController.switchMainPage('customer-service', {
                    //flag: 'edit-add'
                });
            }
        },
        //删除按钮
        delById: function() {
            var _self = this;
            var delList = new Ember.A();
            var customerInComp = this.get('customerInComp');
            var realDevicetypeList = this.get('realDevicetypeList'); //页面上循环的数组
            var mainpageController = App.lookup('controller:business.mainpage');
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除老人设备信息", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                realDevicetypeList.forEach(function(realDevicetype) {
                    var customerDeviceObj = realDevicetype.get('customerDeviceObj'); //数组里面存储的老人设备-对象
                    if (customerDeviceObj && customerDeviceObj.get('id')) {
                        customerDeviceObj.set('delStatus', 1);
                        delList.pushObject(customerDeviceObj);
                    }
                });
                if (delList.get('length') > 0) {
                    delList.forEach(function(delObj) {
                        delObj.save().then(function() {
                            App.lookup('controller:business.mainpage').showPopTip("删除成功");
                            mainpageController.switchMainPage('customer-service', {});
                        });
                    });
                }

            });
        },
        diningSelect: function(diningDict) {
            this.get("customerInComp").set("diningStandard", diningDict);
        }, //餐饮标准字典
        nursingSelect: function(nursingDict) {
            this.get("customerInComp").set("nursingGrade", nursingDict);
        }, //护理等级字典
        selectParent(bed) {
            //this.set("customerInComp").set("bed",bed);
            this.get('customerModel').set("bed", bed);
            this.set("defaultBed", bed);
        }, //床位信息

        changeContractStartAction(date) {
            var stamp = this.get("dateService").getLastSecondStampOfDay(date);
            this.set("customerModel.contractStartDate", stamp);
        },
        changeContractEndAction(date) {
            var stamp = this.get("dateService").getLastSecondStampOfDay(date);
            this.set("customerModel.contractEndDate", stamp);
        },
        nursingClick() { //点击跳转到护理方案
            var mainpageController = App.lookup('controller:business.mainpage');
            var nursingId = this.get('customerInComp.nursingId');
            mainpageController.switchMainPage('nursingproject-detail', {
                customerflag: true,
                id: nursingId,
                editMode: 'edit'
            });
        },
        selectDevice(dictCode, dictDevice) {
            if (dictDevice) {
                let codeInfo = dictDevice.get('type.codeInfo');
                let realDevicetypeList = this.get('realDevicetypeList');
                realDevicetypeList.forEach(function(realDevicetypeObj) {
                    if (realDevicetypeObj.get('deviceCode') == codeInfo) {
                        realDevicetypeObj.set('deviceObj', dictDevice);
                    }
                });
            } else {
                let realDevicetypeList = this.get('realDevicetypeList');
                realDevicetypeList.forEach(function(realDevicetypeObj) {
                    if (realDevicetypeObj.get('deviceCode') == dictCode) {
                        realDevicetypeObj.set('deviceObj', dictDevice);
                    }
                });
            }
        },
    }
});
