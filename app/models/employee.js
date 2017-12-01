import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    code: DS.attr('string'),
    loginType: DS.attr('number'), //登录类型：1邮件2微信3手机号
    name: DS.attr('string'), //名称
    entName: DS.attr('string'), //企业名称
    avatar: DS.attr('string'), //头像文件名
    IDavatar: DS.attr('string'), //证件照
    desc: DS.attr('string'), //自我描述---个性签名
    introduce: DS.attr('string'), //个人简介
    status: DS.attr('number'), //'状态   0：禁用 1：未认证 2：已申请认证 3:认证成功 4.认证失败
    age: DS.attr('number'), //年龄
    staffTel: DS.attr('number'), //电话号码
    staffMail: DS.attr('string'), //邮箱
    weixin: DS.attr('string'), //微信号
    systemusers: DS.hasMany('user',{inverse:'employee'}),//挂接系统用户
    curAddress: DS.attr('string'), //地址
    qqnum: DS.attr('string'), //QQ
    role: DS.belongsTo('role'), //对应角色
    // extendInfo: DS.belongsTo('userextend'), //对应的扩展信息，如统计信息等

    position: DS.belongsTo('dicttype'),//岗位
    //inviteUser: DS.belongsTo('user'), //邀请人 id,
    regWay: DS.attr('number'), //注册途径
    verifyFailReason: DS.attr('string'), //审核失败原因
    special: DS.attr('string'), //特长
    qualificationType: DS.attr('string'), //职业资格

    org: DS.belongsTo('organization'),

    errcode: DS.attr('number'),//错误类型，0：验证码错误
    certificateImage: DS.attr('string'),
    hbeaconID: DS.attr('string'),
    profession:DS.attr('string'),
    schoolName: DS.attr('string'),
    staffBirth: DS.attr('number'),//出生日期 生日
    staffCardCode: DS.attr('string'),//身份证号
    certificateName: DS.attr('string'),
    createDateTime: DS.attr('number'),
    lastUpdateDateTime: DS.attr('number'),
    isGroupFlag: DS.attr('number'),
    isNurseFlag: DS.attr('number'),
    remark: DS.attr('string'),
    lastUpdateUser:DS.belongsTo('user'),
    //crateUser:DS.belongsTo('user'),
    staffSex: DS.belongsTo('dicttype'),//性别
    hireType:DS.belongsTo('dicttype'),//雇佣类型
    privilege:DS.belongsTo('privilege'),
    staffStatus:DS.belongsTo('dicttype'),//工作状态
    staffMaritalStatus:DS.belongsTo('dicttype'),//婚姻状态
    staffEducation:DS.belongsTo('dicttype'),//学历
    staffContactRelation:DS.belongsTo('dicttype'),
    staffContactName:DS.attr("string"),
    staffContactTel:DS.attr("string"),
    staffCensus:DS.belongsTo("dicttype"),//籍贯
    staffNation:DS.belongsTo("dicttype"),//民族
    department:DS.belongsTo("department"),//所属部门
    toPositionDate:DS.attr("number"),//到岗时间
    contractEndDate:DS.attr("number"),//合同截止日期
    leaderFlag:DS.attr("number"),//是否是领导人
    // nurseGroup:DS.belongsTo("nursegroup"),
    departureDate:DS.attr('number'),//离职日期
    authCode:DS.attr("string"),
    // tenant:DS.belongsTo("tenant"),//对应租户
    customers:DS.hasMany('customer'),//护工对应的顾客
    bracelet:DS.belongsTo("device"),//手环
    url:DS.attr("string"),///execl表格导出url
    town:DS.belongsTo('town'),//客户地址信息
    departureFlag:Ember.computed('staffStatus',function(){
      let staffStatus = this.get('staffStatus');
      if(staffStatus.get('typecode')=='staffStatusLeave'){
        return true;
      }else{
        return false;
      }
    }),
    departureDateString:Ember.computed("departureDate",function(){
      var departureDate = this.get("departureDate");
      return departureDate?this.get("dateService").formatDate(departureDate,"yyyy-MM-dd"):null;
    }),
    departureDateTime:Ember.computed("departureDate",function(){
      var departureDate = this.get("departureDate");
      return departureDate?this.get("dateService").timestampToTime(departureDate):null;
    }),
    //根据规则拼出完整的url
    avatarUrl: Ember.computed('avatar', function() {
        var avatar = this.get("avatar");
        if (!avatar) {
            avatar = "anonymous.png";
            return this.get("pathConfiger").getAvatarLocalPath(avatar);
        }
        console.log("this.pathConfiger", this.get("pathConfiger"));
        return this.get("pathConfiger").getAvatarRemotePath(avatar);
    }),



    toPositionDateString:Ember.computed("toPositionDate",function(){
      var toPositionDate = this.get("toPositionDate");
      return this.get("dateService").formatDate(toPositionDate,"yyyy-MM-dd");
    }),
    theToPositionDate:Ember.computed("toPositionDate",function(){
      var toPositionDate = this.get("toPositionDate");
      return this.get("dateService").timestampToTime(toPositionDate);
    }),

    contractEndDateString:Ember.computed("contractEndDate",function(){
      var contractEndDate = this.get("contractEndDate");
      return this.get("dateService").formatDate(contractEndDate,"yyyy-MM-dd");
    }),
    theContractEndDateDate:Ember.computed("contractEndDate",function(){
      var contractEndDate = this.get("contractEndDate");
      return this.get("dateService").timestampToTime(contractEndDate);
    }),

    staffBirthString:Ember.computed("staffBirth",function(){
      var staffBirthDate = this.get("staffBirth");
      return this.get("dateService").formatDate(staffBirthDate,"yyyy-MM-dd");
    }),
    theStaffBirthDate:Ember.computed("staffBirth",function(){
      var staffBirthDate = this.get("staffBirth");
      return this.get("dateService").timestampToTime(staffBirthDate);
    }),
    leaderFlagString:Ember.computed("leaderFlag",function(){
      var leaderFlag = this.get("leaderFlag");
      var str ='';
      if(leaderFlag){
        str = "是";
      }else {
        str= "否";
      }
      return str ;
    }),

});
