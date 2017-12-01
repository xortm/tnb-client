import DS from 'ember-data';
import BaseModel from './base-model';
const {leaveStatus1,leaveStatus2,leaveStatus3,leaveStatus4,leaveStatus5,leaveStatus6,consultStatus6,consultStatus7} = Constants;

var Customerbusinessflow = BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateUser:DS.belongsTo('user'),//更改者
  createDateTime:DS.attr('number'),//创建时间
  lastUpdateTime:DS.attr('number'),//更改时间
  advTel:DS.attr('string'),//咨询人电话
  advName:DS.attr('string'),//咨询人姓名
  isDirectIn:DS.attr('number'),//是否直接入住，0不是，1是
  isDirectOrder:DS.attr('number'),//是否直接预定，0不是，1是
  orderDate:DS.attr('number'),//办理预定时间
  orderStaff:DS.belongsTo('employee'),//办理预定员工
  orderMoney:DS.attr('string'),//保证金金额
  orderBed:DS.belongsTo('bed'),//预定床位号
  orderInTime:DS.attr('number'),//入院时间
  orderRemark:DS.attr('string'),//预定备注
  cancelRemark:DS.attr('string'),//退订原因
  orderStatus:DS.belongsTo('dicttype'),//预定状态

  experienceDate:DS.attr('number'),//办理试住日期
  experienceStaff:DS.belongsTo('employee'),//办理试住员工
  experienceStartTime:DS.attr('number'),//试住开始时间
  experienceEndTime:DS.attr('number'),//试住结束时间
  experienceBed:DS.belongsTo('bed'),//试住床位号
  experienceRemark:DS.attr('string'),//试住备注
  experienceNursingGrade:DS.belongsTo('nursinglevel'),//试住护理级别
  experienceReferencePrice:DS.attr('string'),//试住参考价格
  experiencePrice:DS.attr('string'),//试住实际价格
  tryContractNO:DS.attr('string'),//试住合同编号

  checkInDate:DS.attr('number'),//办理入住日期
  checkInStaff:DS.belongsTo('employee'),//办理入住员工
  checkInStartTime:DS.attr('number'),//入住开始时间
  checkInEndTime:DS.attr('number'),//入住结束时间
  checkInRemark:DS.attr('string'),//入住备注
  checkInNursingGrade:DS.belongsTo('nursinglevel'),//入住护理级别
  checkInReferencePrice:DS.attr('string'),//入住参考价格
  checkInPrice:DS.attr('string'),//入住实际价格
  checkInBed:DS.belongsTo('bed'),//入住床位号
  inPreference:DS.hasMany('dicttype'),//入住偏好
  inContractNO:DS.attr('string'),//入住合同编号

  leaveDate:DS.attr('number'),//退住日期
  leaveRecordDate:DS.attr('number'),//退住登记日期
  leaveStaff:DS.belongsTo('employee'),//办理退住员工
  leaveRemark:DS.attr('string'),//退住备注
  leaveStatus:DS.belongsTo('dicttype'),//退住状态
  leaveDateReal:DS.attr('number'),//实际退住日期
  customerAddr:DS.attr('string'),//老人地址
  customerAge:DS.attr('number'),//老人年龄
  customerBrith:DS.attr('number'),//老人生日
  customerCardCode:DS.attr('string'),//老人身份证号
  customerTel:DS.attr('string'),//老人电话
  customerEducation:DS.belongsTo('dicttype'),//老人教育级别
  customerGender:DS.belongsTo('dicttype'),//老人性别
  customerGenderFlag:Ember.computed('customerGender',function(){
    let customerGender = this.get('customerGender');
    let customerGenderFlag = {};
    if(customerGender){
      if(customerGender.get('typecode')=='sexTypeMale'){
        customerGenderFlag.man = true;
      }
      if(customerGender.get('typecode')=='sexTypeFemale'){
        customerGenderFlag.woman = true;
      }
    }
    return customerGenderFlag;
  }),
  customerName:DS.attr('string'),//老人姓名
  customerNative:DS.belongsTo('dicttype'),//老人籍贯
  customerPS:DS.attr('string'),//老人身体情况
  consultRelation:DS.belongsTo('dicttype'),//咨询人与老人关系
  customerSelfCareAbility:DS.belongsTo('dicttype'),//老人自理能力
  customerNationality:DS.belongsTo('dicttype'),//老人民族
  status:DS.belongsTo('dicttype'),//入住状态
  customer:DS.belongsTo('customer'),//老人（办理试住或入住时生成老人信息）
  consultInfo:DS.belongsTo('consultinfo'),//咨询表
  tempFlag:DS.attr('number'),//办理状态:暂存标识，1暂存，0否
  diningStandard:DS.belongsTo('dicttypetenant'),//餐饮标准
  leaveReason:DS.belongsTo('dicttype'),//退住原因
  advWay:DS.hasMany('dicttype'),//营销渠道
  //新增字段
  guardianFirstName:DS.attr('string'),//联系人姓名
  guardianFirstCardCode:DS.attr('string'),//联系人身份证
  guardianFirstGener:DS.belongsTo('dicttype'),//联系人性别
  guardianFirstGenerFlag:Ember.computed('guardianFirstGener',function(){
    let guardianFirstGener = this.get('guardianFirstGener');
    let guardianFirstGenerFlag = {};
    if(guardianFirstGener){
      if(guardianFirstGener.get('typecode')=='sexTypeMale'){
        guardianFirstGenerFlag.man = true;
      }
      if(guardianFirstGener.get('typecode')=='sexTypeFemale'){
        guardianFirstGenerFlag.woman = true;
      }
    }
    return guardianFirstGenerFlag;
  }),
  guardianFirstContact:DS.attr('number'),//联系人的联系方式
  firstRelation:DS.belongsTo('dicttype'),//联系人与老人关系
  guardianFirstWork:DS.attr('string'),//联系人工作单位
  guardianFirstAddress:DS.attr('string'),//联系人住址
  bedPrice:DS.attr('number'),//床位实际价格
  diningStandardPrice:DS.attr('number'),//餐饮实际价格
  nursinglevel:DS.belongsTo('nursinglevel'),//护理等级
  levelPrice:DS.attr('number'),//护理实际价格
  qrCodeUrl: DS.attr('string'), //二维码
  headImg: DS.attr('string'), //头像文件名（头像地址）
  customerStatus:DS.belongsTo('dicttype'),//老人的入住状态
  customerOldManType:DS.hasMany('dicttype'), //老人类型(OldManType)
  customerMedicalInsuranceCategory: DS.belongsTo('dicttype'), //医保类别(MedicalInsuranceType)
  town:DS.belongsTo('town'),//客户地址信息
  backRemark: DS.attr('string'),//申请退住的时候设置为 out (新增一条退住的时候)
  totalPrice: DS.attr("number"), //总价格
  chargeType: DS.belongsTo('dicttype'), //账单计费类型
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
  cusName:Ember.computed.alias('customer.name'),
  cusCardCode:Ember.computed.alias('customer.cardCode'),
  cusSex:Ember.computed.alias('customer.sex'),
  cusEdu:Ember.computed.alias('customer.educationLevel'),
  cusCare:Ember.computed.alias('customer.selfCareAbility'),
  cusNative:Ember.computed.alias('customer.customerNative'),
  cusTel:Ember.computed.alias('customer.phone'),
  customerOldManTypeName:Ember.computed('customerOldManType',function(){
    var str ='';
    var account=1;
    this.get('customerOldManType').forEach(function(oldManTypeObj){
      str+=oldManTypeObj.get('typename')+',';
    });
    return str.substring(0,str.length - 1);
  }),
//咨询转预定的时候计算老人的生日
  birthdayTime:Ember.computed('customer',function(){
    let customer=this.get('customer');
    if(customer.get('birthday')){
      return this.get("dateService").timestampToTime(customer.get('birthday'));
    }else {
      return null;
    }
  }),
  birthTime: Ember.computed("customerBrith", function() {
      var birthday = this.get("customerBrith");
      if (!birthday) {
          return null;
      }
      return this.get("dateService").timestampToTime(birthday);
  }),
  birthdayString: Ember.computed("customerBrith", function() {
      var birthday = this.get("customerBrith");
      if(birthday){
        return this.get("dateService").formatDate(birthday, "yyyy-MM-dd");
      }else{
        return '';
      }

  }),
  telphone:Ember.computed('advTel','cusTel',function(){
    let advTel = this.get('advTel');
    let cusTel = this.get('cusTel');
    if(cusTel){
      return cusTel;
    }else{
      return advTel;
    }
  }),

  tempFlagName:Ember.computed('tempFlag',function(){
    let temp = this.get('tempFlag');

      if(temp==1){
        return '暂存';
      }else{
        return '已提交';
      }

  }),

  leaveStatusTypecodNumber:Ember.computed("leaveStatus",function(){
    var leaveStatus = this.get("leaveStatus");
    if(leaveStatus.get("typecode")===Constants.leaveStatus3){
      return 1;
    }else if(leaveStatus.get("typecode")===Constants.leaveStatus5||leaveStatus.get("typecode")===Constants.leaveStatus2){
      return 2;
    }else if(leaveStatus.get("typecode")===Constants.leaveStatus6){
      return 3;
    }

  }),
  customerstatus:Ember.computed("leaveStatus",function(){

    var leaveStatus = this.get("leaveStatus");
    var str = "";
    if(leaveStatus.get("typecode")===Constants.leaveStatus1){
      str = "申请退住";
    }else if(leaveStatus.get("typecode")===Constants.leaveStatus2){
      str = "费用结算中";
    }else if(leaveStatus.get("typecode")===Constants.leaveStatus3){
      str = "完成退住";
    }else if(leaveStatus.get("typecode")===Constants.leaveStatus4){
      str = "审核已通过";
    }else if(leaveStatus.get("typecode")===Constants.leaveStatus5){
      str = "已作废";

    }else if(leaveStatus.get("typecode")===Constants.leaveStatus6){
      str = "费用结算完成";
    }
    return str;
  }),

  customerStatusClick:Ember.computed("leaveStatus",function(){
    var leaveStatus = this.get("leaveStatus");
    var str = "";
    if(leaveStatus.get("typecode")===Constants.leaveStatus1){
      str = "审核通过   ";

    }
    // else if(leaveStatus.get("typecode")===Constants.leaveStatus2){
    //   str = "完成结算";
    // }
    return str;
  }),

  theLeaveDate:Ember.computed("leaveDate",function(){
    var leaveDate = this.get("leaveDate");
    return this.get("dateService").timestampToTime(leaveDate);
  }),
  leaveDateString:Ember.computed("leaveDate",function(){
    var leaveDate = this.get("leaveDate");
    return this.get("dateService").formatDate(leaveDate,"yyyy-MM-dd");
  }),

  theLeaveRecordDate:Ember.computed("leaveRecordDate",function(){
    var leaveRecordDate = this.get("leaveRecordDate");
    return this.get("dateService").timestampToTime(leaveRecordDate);
  }),
  leaveRecordDateString:Ember.computed("leaveRecordDate",function(){
    var leaveRecordDate = this.get("leaveRecordDate");
    return this.get("dateService").formatDate(leaveRecordDate,"yyyy-MM-dd");
  }),

  //控制跳转页面：预定转试住，试住转入住。预定转入住
  operatingName:Ember.computed('status',function(){
    let status = this.get('status');
    let name = '';
    if(status){
      if(status.get('typecode')=='consultStatus3'){
        name = '转试住';
      }

    }
    return name;
  }),

  scheduled:Ember.computed('status',function(){
    let status = this.get('status');
    if(status){
      if(status.get('typecode')=='consultStatus3'){
        return true;
      }else{
        return false;
      }
    }
  }),
  tryed:Ember.computed('status',function(){
    let status = this.get('status');
    if(status){
      if(status.get('typecode')=='consultStatus4'){
        return true;
      }else{
        return false;
      }
    }
  }),
  bedShowPrice:Ember.computed('orderBed','checkInBed','experienceBed',function(){
    let orderBed = this.get('orderBed.price');
    let experienceBed = this.get('experienceBed.price');
    let checkInBed = this.get('checkInBed.price');
    if(checkInBed){
      return checkInBed;
    }else if(experienceBed){
      return experienceBed;
    }else{
      return orderBed;
    }
  }),
  //入院时间
  orderTime:Ember.computed('orderInTime',function(){
    let orderDate = this.get("orderInTime");
    return this.get("dateService").timestampToTime(orderDate);
  }),
  orderTimeString:Ember.computed("orderInTime",function(){
    var orderTimeDate=this.get("orderInTime");
    return this.get("dateService").formatDate(orderTimeDate,"yyyy-MM-dd");

  }),
  //预定办理时间
  orderDateTime:Ember.computed('orderDate',function(){
    let orderDate = this.get("orderDate");
    return this.get("dateService").timestampToTime(orderDate,"yyyy-MM-dd");
  }),
  orderDateTimeString:Ember.computed("orderDate",function(){
    var orderTimeDate=this.get("orderDate");
    return this.get("dateService").formatDate(orderTimeDate,"yyyy-MM-dd");

  }),
  //试住开始时间
  experienceStartTimeDate:Ember.computed('experienceStartTime',function(){
    let experienceStartTimeDate = this.get('experienceStartTime');
    return this.get("dateService").timestampToTime(experienceStartTimeDate);
  }),
  experienceStartTimeDateString:Ember.computed("experienceStartTime",function(){
    var experienceStartTimeDate=this.get("experienceStartTime");
    return this.get("dateService").formatDate(experienceStartTimeDate,"yyyy-MM-dd");

  }),
  //试住结束时间
  experienceEndTimeDate:Ember.computed('experienceEndTime',function(){
    let experienceEndTimeDate = this.get('experienceEndTime');
    return this.get("dateService").timestampToTime(experienceEndTimeDate);
  }),
  experienceEndTimeDateString:Ember.computed("experienceEndTime",function(){
    var experienceEndTimeDate=this.get("experienceEndTime");
    return this.get("dateService").formatDate(experienceEndTimeDate,"yyyy-MM-dd");

  }),
  //试住办理时间
  experienceDateTime:Ember.computed('experienceDate',function(){
    let experienceDate = this.get("experienceDate");
    return this.get("dateService").timestampToTime(experienceDate);
  }),
  experienceDateTimeString:Ember.computed("experienceDate",function(){
    var experienceDateTime=this.get("experienceDate");
    return this.get("dateService").formatDate(experienceDateTime,"yyyy-MM-dd");

  }),
  //入住开始时间
  checkInStartTimeDate:Ember.computed('checkInStartTime',function(){
    let checkInStartTimeDate = this.get('checkInStartTime');
    if(!checkInStartTimeDate){
      return null;
    }
    return this.get("dateService").timestampToTime(checkInStartTimeDate);
  }),
  checkInStartTimeDateString:Ember.computed("checkInStartTime",function(){
    var checkInStartTimeDate=this.get("checkInStartTime");
    return this.get("dateService").formatDate(checkInStartTimeDate,"yyyy-MM-dd");
  }),
  //入住结束时间
  checkInEndTimeDate:Ember.computed('checkInEndTime',function(){
    let checkInEndTimeDate = this.get('checkInEndTime');
    if(!checkInEndTimeDate){
      return null;
    }
    return this.get("dateService").timestampToTime(checkInEndTimeDate);
  }),
  checkInEndTimeDateString:Ember.computed("checkInEndTime",function(){
    var checkInEndTimeDate=this.get("checkInEndTime");
    return this.get("dateService").formatDate(checkInEndTimeDate,"yyyy-MM-dd");
  }),
  //入住办理时间
  checkInDateTime:Ember.computed('checkInDate',function(){
    let checkInDate = this.get("checkInDate");
    if(!checkInDate){
      return null;
    }
    return this.get("dateService").timestampToTime(checkInDate);
  }),
  checkInDateTimeString:Ember.computed("checkInDate",function(){
    var checkInDateTime=this.get("checkInDate");
    return this.get("dateService").formatDate(checkInDateTime,"yyyy-MM-dd");
  }),
  //实际退住日期
  leaveDateRealTime:Ember.computed('leaveDateReal',function(){
    let leaveDateReal = this.get("leaveDateReal");
    if(!leaveDateReal){
      return null;
    }
    return this.get("dateService").timestampToTime(leaveDateReal);
  }),
  leaveDateRealTimeString:Ember.computed("leaveDateReal",function(){
    var leaveDateRealTime=this.get("leaveDateReal");
    return leaveDateRealTime?this.get("dateService").formatDate(leaveDateRealTime,"yyyy-MM-dd"):'';
  }),
  //分配的床位信息
  bed:Ember.computed('status','orderBed','checkInBed','experienceBed',function(){
    let status = this.get('status');
    let bed;
    if(status){
      if(status.get('typecode')=='consultStatus3'){
        bed = this.get('orderBed');
      }
      if(status.get('typecode')=='consultStatus4'){
        bed = this.get('experienceBed');
      }
      if(status.get('typecode')=='consultStatus5'){
        bed = this.get('checkInBed');
      }
    }
    return bed;
  }),
  //经办人信息
  staff:Ember.computed('status','orderStaff','checkInStaff','experienceStaff',function(){
    let status = this.get('status');
    let staff;
    if(status){
      if(status.get('typecode')=='consultStatus3'){
        staff = this.get('orderStaff');
      }
      if(status.get('typecode')=='consultStatus4'){
        staff = this.get('experienceStaff');
      }
      if(status.get('typecode')=='consultStatus5'){
        staff = this.get('checkInStaff');
      }
    }
    return staff;
  }),
  inPreferenceName:Ember.computed('inPreference',function(){
    let inPreference = this.get('inPreference');
    if(!inPreference){
      return '无';
    }
    let name = '';
    inPreference.forEach(function(preference){
      name += preference.get('typename') + ',';
    });
    return name.substring(0,name.length-1);
  }),
  advWayName:Ember.computed('advWay',function(){
    let advWays = this.get('advWay');
    if(!advWays){
      return '无';
    }
    let name = '';
    advWays.forEach(function(advWay){
      name += advWay.get('typename') + ',';
    });
    return name.substring(0,name.length-1);
  }),
  avatarUrl: Ember.computed('headImg', function() {
      var avatar = this.get('headImg');
      if (!avatar) {
          avatar = "anonymous.png";
          return this.get("pathConfiger").getAvatarLocalPath(avatar);
      }
      return this.get("pathConfiger").getAvatarRemotePath(avatar);
  }),
  realUrl:Ember.computed('qrCodeUrl',function(){
    var qrCodeUrl=this.get('qrCodeUrl');
    return this.get("pathConfiger").getwechatQrPayRemotePath(qrCodeUrl);
  }),
  orderType:Ember.computed('status','orderStatus',function(){
    let status = this.get('status');
    let orderStatus = this.get('orderStatus');
      if(orderStatus.get('typecode')=='orderStatus1'){
        this.set('couldCancel',true);
        return '已预定';
      }else{
        this.set('couldCancel',false);
        return '已取消';
      }
  }),
  //退住的账单状态，checkinremark
  billStatusName:Ember.computed('checkInRemark','leaveStatus',function(){
    let checkInRemark = this.get('checkInRemark');
    let leaveStatus = this.get('leaveStatus');
    if(checkInRemark == 'none'){
      return '账单未出';
    }else if(checkInRemark == 'created'){
      if(leaveStatus.get('typecode')!==Constants.leaveStatus3){
        this.set('couldBack',true);
      }else{
        this.set('couldBack',false);
      }

      return '账单已出';
    }else if(checkInRemark == 'done'){
      if(leaveStatus.get('typecode')!==Constants.leaveStatus3){
        this.set('couldBack',true);
      }else{
        this.set('couldBack',false);
      }
      return '账单结算完成';
    }
  }),
  detailBack:Ember.computed('leaveStatus',function(){
    let leaveStatus = this.get('leaveStatus');
    if(leaveStatus.get('typecode')==Constants.leaveStatus1){
      return true;
    }else{
      return false;
    }
  }),
});

export default Customerbusinessflow;
