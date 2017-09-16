import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service("store"),
    cityShow: true,
    didInsertElement: function() {
        var _self = this;
        //判断town是否有值
        var townInfo = this.get('modelInfo.town');
        var allTownName = this.get('modelInfo.allTownName');
        var provinceInfoId = townInfo.get('county.city.province.id');
        if (townInfo&&townInfo.get('id')) {
            this.set('chooseAddress', allTownName);
            this.set('selectProvince', townInfo.get('county.city.province'));
            this.set('selectCity', townInfo.get('county.city'));
            this.set('selectCountry', townInfo.get('county'));
            this.set('selectTown', townInfo);
            if (provinceInfoId == '11' || provinceInfoId == '12' || provinceInfoId == '31' || provinceInfoId == '50') {
                this.set('cityShow', false); //不需要显示城市
                //查询county
                this.get('store').query('county', {
                    filter: {
                        'remark@$likeAfter': provinceInfoId
                    }
                }).then(function(countyList) {
                    _self.set('countyList', countyList);
                });
                //查询town
                this.get('store').query('town', {
                    filter: {
                        '[county][id]': townInfo.get('county.id')
                    }
                }).then(function(townList) {
                    _self.set('townList', townList);
                });
            } else {
                this.set('cityShow', true); //需要显示城市
                //查询city
                this.get('store').query('city', {
                    filter: {
                        '[province][id]': provinceInfoId
                    }
                }).then(function(cityList) {
                    _self.set('cityList', cityList);
                });
                //查询county
                this.get('store').query('county', {
                    filter: {
                        '[city][id]': townInfo.get('county.city.id')
                    }
                }).then(function(countyList) {
                    _self.set('countyList', countyList);
                });
            }
        } else {
            this.set('chooseAddress', '请选择所属地区');
        }
        //查询所有的省、直辖市
        this.get('store').query('province', {}).then(function(provinceList) {
            provinceList.forEach(function(obj) {
                obj.set('provincePinyin', obj.get('name'));
            });
            console.log('provinceList is',provinceList);
            _self.set('provinceList', provinceList);
        });
    },
    actions: {
        showAddress() {
            this.set('isShow', true);
            this.didInsertElement();
        },
        hideAddress() {
            this.set('isShow', false);
        },
        //选择省、直辖市
        selectProvince(province) {
            var _self = this;
            if (province) {
                this.set('selectProvince', province);
                this.set('selectCity', null);
                this.set('selectCountry', null);
                this.set('selectTown', null);
                this.set('cityList', new Ember.A());
                this.set('countyList', new Ember.A());
                this.set('townList', new Ember.A());
                var provinceId = province.get('id');
                if (provinceId == '11' || provinceId == '12' || provinceId == '31' || provinceId == '50') { //直辖市-则直接查询对应的区县
                    this.set('cityShow', false); //不需要显示城市
                    this.get('store').query('county', {
                        filter: {
                            //'id@$likeAfter@$or1':provinceId
                            'remark@$likeAfter': provinceId
                        }
                    }).then(function(countyList) {
                        countyList.forEach(function(obj) {
                            obj.set('countyPinyin', obj.get('name'));
                        });
                        _self.set('countyList', countyList);
                    });
                } else { //其他省
                    this.set('cityShow', true); //需要显示城市
                    this.get('store').query('city', {
                        filter: {
                            '[province][id]': provinceId
                        }
                    }).then(function(cityList) {
                        cityList.forEach(function(obj) {
                            obj.set('cityPinyin', obj.get('name'));
                        });
                        _self.set('cityList', cityList);
                    });
                }
            } else {
                this.set('selectProvince', null);
            }
        },
        selectCity(city) {
            var _self = this;
            if (city) {
                this.set('selectCity', city);
                this.set('selectCountry', null);
                this.set('selectTown', null);
                this.set('countyList', new Ember.A());
                this.set('townList', new Ember.A());
                this.get('store').query('county', {
                    filter: {
                        '[city][id]': city.get('id')
                    }
                }).then(function(countyList) {
                    countyList.forEach(function(obj) {
                        obj.set('countyPinyin', obj.get('name'));
                    });
                    _self.set('countyList', countyList);
                });
            } else {

            }
        },
        selectCountry(county) {
            var _self = this;
            if (county) {
                this.set('selectCountry', county);
                this.set('selectTown', null);
                this.set('townList', new Ember.A());
                this.get('store').query('town', {
                    filter: {
                        '[county][id]': county.get('id')
                    }
                }).then(function(townList) {
                    townList.forEach(function(obj) {
                        obj.set('townPinyin', obj.get('name'));
                    });
                    _self.set('townList', townList);
                    _self.set('selectTown', townList.get('firstObject'));
                });
            } else {
                this.set('selectCountry', null);
            }
        },
        selectTown(town) {
            if (town) {
                this.set('selectTown', town);
            } else {
                this.set('selectTown', null);
            }
        },
        submmit() {
            var _self = this;
            this.set('isShow', false);
            //拼接chooseAddress
            let selectProvince = this.get('selectProvince');
            let selectCity = this.get('selectCity');
            let selectCountry = this.get('selectCountry');
            let selectTown = this.get('selectTown');
            let str = '';
            if (selectProvince && selectCountry && selectTown) {
                if (selectCity) {
                    str += selectProvince.get('name') + '-' + selectCity.get('name') + '-' + selectCountry.get('name');
                } else {
                    str += selectProvince.get('name') + '-' + selectCountry.get('name') + '-' + selectTown.get('name');
                }
            } else {
                str = '请选择所属地区';
            }
            this.set('chooseAddress', str);
            this.sendAction('selectTown', selectTown);
        }
    }
});
