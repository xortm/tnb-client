import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
var Customer = BaseModel.extend({
    pathConfiger: Ember.inject.service("path-configer"),
    dateService: Ember.inject.service("date-service"),
    //code: DS.attr('string'),
    //desc: DS.attr('string'),
    qrCodeUrl: DS.attr('string'), //二维码
    name: DS.attr('string'), //姓名
    enterprise: DS.attr('string'), //公司名称
    phone: DS.attr('number'), //电话号码
    email: DS.attr('string'), //邮箱
    weixin: DS.attr('string'), //微信号
    address: DS.attr('string'), //地址
    mark: DS.attr('number'), //标志,1呼入2呼出
    birthday: DS.attr('number'), //生日
    age: DS.attr('number'), //年龄
    qq: DS.attr('string'), //qq
    position: DS.attr('string'), //职位
    createTime: DS.attr('number'), //创建时间
    updateTime: DS.attr('number'), //更新时间
    isAllocated: DS.attr('number'), //是否已分配  0 ：未分配    1：已分配
    extendInfo: DS.attr('string'), //扩展信息
    remark: DS.attr('string'), //备注
    discountRate: DS.attr('string'), //折扣率
    //2016\11\8customer号新添加字段
    bed: DS.belongsTo('bed'), //所属床位
    lastUpdateUser: DS.belongsTo('user'),
    //crateUser:DS.belongsTo('user'),
    sex: DS.belongsTo('dicttype'), //性别,1男2女
    //staff:DS.belongsTo('dicttype'),//服务护工
    nursingGrade: DS.belongsTo('dicttype'), //护理级别
    incomeType: DS.belongsTo('dicttype'), //入住类型
    expenceType: DS.belongsTo('dicttype'), //付费类型
    diningStandard: DS.belongsTo('dicttypetenant'), //餐饮标准
    customerStatus: DS.belongsTo('dicttype'), //入住状态
    selfCareAbility: DS.belongsTo('dicttype'), //自理能力
    bloodType: DS.belongsTo('dicttype'), //血型
    religion: DS.belongsTo('dicttype'), //宗教信仰
    maritalStatus: DS.belongsTo('dicttype'), //婚姻状况
    educationLevel: DS.belongsTo('dicttype'), //学历（文化程度）
    cardCode: DS.attr("string"), //身份证号
    nationality: DS.belongsTo('dicttype'), //民族
    customerNative: DS.belongsTo('dicttype'), //籍贯
    customerPS: DS.attr("string"), //身体情况
    customerCustom: DS.attr("string"), //生活习惯
    customerCharacter: DS.attr("string"), //性格特点
    customerHobby: DS.attr("string"), //个人爱好
    customerDiet: DS.attr("string"), //饮食偏好
    guardianFirstName: DS.attr("string"), //第一监护人姓名
    guardianFirstContact: DS.attr("string"), //第一监护人电话
    guardianFirstGener: DS.belongsTo('dicttype'), //第一监护人性别
    firstRelation: DS.belongsTo("dicttype"), //第一监护人与老人关系
    guardianFirstCardCode: DS.attr("string"), //第一监护人身份证
    guardianFirstWork: DS.attr("string"), //第一监护人工作单位
    guardianFirstAddress: DS.attr("string"), //第一监护人地址

    guardianSecondName: DS.attr("string"), //第二监护人姓名
    guardianSecondContact: DS.attr("string"), //第二监护人电话
    guardianSecondGener: DS.belongsTo('dicttype'), //第二监护人性别
    secondRelation: DS.belongsTo("dicttype"), //第二监护人与老人关系
    guardianSecondCardCode: DS.attr("string"), //第二监护人身份证
    guardianSecondWork: DS.attr("string"), //第二监护人工作单位
    guardianSecondAddress: DS.attr("string"), //第二监护人地址

    guardianThirdName: DS.attr("string"), //第三监护人姓名
    guardianThirdContact: DS.attr("string"), //第三监护人电话
    guardianThirdGener: DS.belongsTo('dicttype'), //第三监护人性别
    thirdRelation: DS.belongsTo("dicttype"), //第三监护人与老人关系
    guardianThirdCardCode: DS.attr("string"), //第三监护人身份证
    guardianThirdWork: DS.attr("string"), //第三监护人工作单位
    guardianThirdAddress: DS.attr("string"), //第三监护人地址

    contractNO: DS.attr("string"), //合同编号  关联合同表
    checkInDate: DS.attr("number"), //入住时间
    checkOutDate: DS.attr("number"), //退房时间
    contractStartDate: DS.attr("number"), //合同开始时间
    contractEndDate: DS.attr("number"), //合同结束时间
    actualDeposit: DS.attr("string"), //保证金
    referencePrice: DS.attr("string"), //参考价格
    actualPrice: DS.attr("string"), //实际价格
    referenceDiningPrice: DS.attr("string"), //参考餐饮价格
    actualDiningPrice: DS.attr("string"), //实际餐饮价格
    actualNursingPrice: DS.attr("string"), //实际护理费用
    referenceNursingPrice: DS.attr("string"), //参考护理费用
    actualBedPrice: DS.attr("string"), //参考床位价格
    actualBedMonthPrice: DS.attr("string"), //实际床位价格
    headImg: DS.attr('string'), //头像文件名（头像地址）
    applyFlag: DS.attr("number"), //是否申请服务信息变更(0:未申请  1：已申请)
    customerBirthdayHabit: DS.belongsTo('dicttype'), //生日习惯(birtydayType)
    oldManType: DS.hasMany('dicttype'), //老人类型(OldManType)
    medicalInsuranceCategory: DS.belongsTo('dicttype'), //医保类别(MedicalInsuranceType)
    drugs: DS.hasMany('customerdrug'), //老人药品
    detailedInformation: DS.attr('string'), //个人详细情况
    tabooThing: DS.attr('string'), //忌讳的事
    importancePerson: DS.attr('string'), //重视的人
    importanceThing: DS.attr('string'), //重视的事
    employees: DS.hasMany('employee'), //护理人员
    addRemark: DS.attr('string'), //标识是否是直接添加老人(是：directCreate 否：normal)
    customerVipInfo: DS.belongsTo('customer-vip-info'),//会员信息
    town:DS.belongsTo('town'),//客户地址信息
    leaveStatus: DS.attr("number"), //是否请假中 0否1是
    customerExtend:DS.belongsTo('customer-extend'),//customer扩展表
    allTownName:Ember.computed('town',function(){//拼接所在地区
      let townName=this.get('town.name');
      let countyName=this.get('town.county.name');
      let cityName=this.get('town.county.city.name');
      let provinceName=this.get('town.county.city.province.name');
      let provinceId=this.get('town.county.city.province.id');
      if(townName){
        if(provinceId=='11'||provinceId=='12'||provinceId=='31'||provinceId=='50'){
          return provinceName+"-"+countyName+"-"+townName;
        }else {
          return provinceName+"-"+cityName+"-"+countyName;
        }
      }else {
        return null;
      }

    }),
    //计算总的参考价格
    realreferencePrice:Ember.computed('bed','diningStandard','levelPrice',function(){
      var bedPrice=this.get('bed.price');
      var diningPrice=this.get('diningStandard.typeValue');
      var levelPrice=this.get('levelPrice');
      if(!bedPrice){
        bedPrice=0;
      }
      if(!diningPrice){
        diningPrice=0;
      }
      if(!levelPrice){
        levelPrice=0;
      }
      return parseInt(bedPrice)+parseInt(diningPrice)+parseInt(levelPrice);
    }),
    //显示：参考床位价格
    bedPrice:Ember.computed('bed',function(){
      if(this.get('bed')){
        return this.get('bed.price');
      }else {
        return '';
      }
    }),
    diningPrice:Ember.computed('diningStandard',function(){
      if(this.get('diningStandard')){
        return this.get('diningStandard.typeValue');
      }else {
        return '';
      }
    }),
    oldManTypeName:Ember.computed('oldManType',function(){
      var str ='';
      var account=1;
      this.get('oldManType').forEach(function(oldManTypeObj){
        str+=oldManTypeObj.get('typename')+',';
      });
      return str.substring(0,str.length - 1);
    }),
    computeSex: Ember.computed("cardCode", function() {
        var cardCode = this.get("cardCode");
        if (!cardCode) {
            return;
        } //如果是空就return 因为为空下面 substr undefined报错
        if (parseInt(cardCode.substr(16, 1)) % 2 == 1) {
            return "男";
        } else {
            return "女";
        }
    }),

    computeBirthday: Ember.computed("cardCode", function() {
        var cardCode = this.get("cardCode");
        if (!cardCode) {
            return;
        } //如果是空就return 因为为空下面 substring undefined报错
        return cardCode.substring(6, 10) + "-" + cardCode.substring(10, 12) + "-" + cardCode.substring(12, 14);
    }),
    staffList: new Ember.A(),
    realActualDeposit: Ember.computed("actualDeposit", function() {
        var actualDeposit = this.get("actualDeposit");
        if (!actualDeposit) {
            return "" + "元";
        }
        return actualDeposit + "元";
    }),
    staffListString: Ember.computed("staffList", function() {
        var str = "";
        this.get("staffList").forEach(function(staff) {
            str = str + "," + staff.get("name");
        });
        if (str.length === 0) {
            str = "无";
        } else {
            str = str.substring(0, str.length - 1);
        }
        return str;
    }),
    avatarUrl: Ember.computed('headImg','name', function() {
      if(!this.get("name")){
        return null;
      }
      var avatar = this.get('headImg');
      if (!avatar) {
          avatar = "anonymous.png";
          return this.get("pathConfiger").getAvatarLocalPath(avatar);
      }
      return this.get("pathConfiger").getAvatarRemotePath(avatar);
    }),
    jujiaImgUrl: Ember.computed('headImg','name', function() {
      if(!this.get("name")){
        return null;
      }
      var avatar = this.get('headImg');
      if (!avatar) {
          avatar = "anonymous.png";
          return this.get("pathConfiger").getAvatarLocalPath(avatar);
      }
      return this.get("pathConfiger").getJujiaRemotePath(avatar);
    }),
    realUrl:Ember.computed('qrCodeUrl',function(){
      var qrCodeUrl=this.get('qrCodeUrl');
      return this.get("pathConfiger").getwechatQrPayRemotePath(qrCodeUrl);
    }),
    markStr: Ember.computed('mark', function() {
        var mark = this.get('mark');
        if (mark === 1) {
            return "半失能";
        }
        if (mark === 2) {
            return "全失能";
        }
        return "健康";
    }),
    phoneHidden: Ember.computed('phone', function() {
        var phone = this.get('phone');
        if (phone) {
            console.log('fasgwefaefrcgfeasv rf', phone);
            var phoneStr = phone.toString();
            phoneStr = phoneStr.substring(0, 3) + '****' + phoneStr.substring(7);
            return phoneStr;
        }
        return;
    }),
    birthdayShow: Ember.computed('birthday', function() {
        var dateOri = this.get("birthday");
        if (!dateOri) {
            return '';
        } else {
            var date = new Date(dateOri * 1000);
            date = date.getFullYear() + "-" + this.toDbl(date.getMonth() + 1) + "-" + this.toDbl(date.getDate());
            return date;
        }
    }),
    createTimeShow: Ember.computed('createTime', function() {
        var dateOri = this.get("createTime");
        var date = new Date(dateOri * 1000);
        if (date === 'Invalid Date') {
            date = '';
        } else {
            date = date.getFullYear() + "-" + this.toDbl(date.getMonth() + 1) + "-" + this.toDbl(date.getDate()) + " " + this.toDbl(date.getHours()) + ":" + this.toDbl(date.getMinutes());
        }
        return date;
    }),
    updateTimeShow: Ember.computed('updateTime', function() {
        var dateOri = this.get("updateTime");
        var date = new Date(dateOri * 1000);
        if (date === 'Invalid Date') {
            date = '';
        } else {
            date = date.getFullYear() + "-" + this.toDbl(date.getMonth() + 1) + "-" + this.toDbl(date.getDate()) + " " + this.toDbl(date.getHours()) + ":" + this.toDbl(date.getMinutes());
        }
        return date;
    }),
    familyRelation: Ember.computed("guardianFirstName,guardianFirstContact", function() {
        var name = this.get("guardianFirstName");
        var phone = this.get("guardianFirstContact");
        return name + "<" + phone + ">";
    }),
    birthdayTime: Ember.computed("birthday", function() {
        var birthday = this.get("birthday");
        console.log('birthday model is', birthday);
        if (!birthday) {
            return null;
        }
        return this.get("dateService").timestampToTime(birthday);
    }),
    checkInDateTime: Ember.computed("checkInDate", function() {
        var checkInDate = this.get("checkInDate");
        return this.get("dateService").timestampToTime(checkInDate);
    }),
    checkOutDateTime: Ember.computed("checkOutDate", function() {
        var checkOutDate = this.get("checkOutDate");
        return this.get("dateService").timestampToTime(checkOutDate);
    }),
    contractStartDateTime: Ember.computed("contractStartDate", function() {
        var contractStartDate = this.get("contractStartDate");
        return this.get("dateService").timestampToTime(contractStartDate);
    }),
    contractEndDateTime: Ember.computed("contractEndDate", function() {
        var contractEndDate = this.get("contractEndDate");
        return this.get("dateService").timestampToTime(contractEndDate);
    }),
    contractEndDateString: Ember.computed("contractEndDate", function() {
        var contractEndDate = this.get("contractEndDate");
        if(contractEndDate){
          return this.get("dateService").formatDate(contractEndDate, "yyyy-MM-dd");
        }else {
          return '';
        }
    }),
    contractStartDateString: Ember.computed("contractStartDate", function() {
        var contractStartDate = this.get("contractStartDate");
        if(contractStartDate){
          return this.get("dateService").formatDate(contractStartDate, "yyyy-MM-dd");
        }else {
          return '';
        }
    }),
    birthdayString: Ember.computed("birthday", function() {
        var birthday = this.get("birthday");
        return this.get("dateService").formatDate(birthday, "yyyy-MM-dd");

    }),
    checkInDateString: Ember.computed("checkInDate", function() {
        var checkInDate = this.get("checkInDate");
        return this.get("dateService").formatDate(checkInDate, "yyyy-MM-dd");

    }),
    checkOutDateString: Ember.computed("checkOutDate", function() {
        var checkOutDate = this.get("checkOutDate");
        return this.get("dateService").formatDate(checkOutDate, "yyyy-MM-dd");

    }),
    toDbl: function(value) {
        if (value < 10) {
            return '0' + value;
        } else {
            return '' + value;
        }
    },
    realDiscountRate:Ember.computed('realreferencePrice','actualPrice',function(){
      if(this.get('realreferencePrice')&&this.get('actualPrice')){
        var discountRate= (parseInt(this.get('realreferencePrice'))-parseInt(this.get('actualPrice')))/parseInt(this.get('realreferencePrice'));
        return (discountRate.toFixed(2)).toString();
      }else {
        return '';
      }
    }),
    realNursingGrade:Ember.computed('nursingGrade',function(){
      if(this.get('nursingGrade.typename')){
        return this.get('nursingGrade');
      }else {
        var obj={typename:'无'};
        return obj;
      }
    }),
    realBed:Ember.computed('bed',function(){
      var bed=this.get('bed');
      if(bed.get('id')){
        return bed ;
      }else {
        var obj={allBedName:'无床位'};
        return obj ;
      }
    })
});
export default Customer;
