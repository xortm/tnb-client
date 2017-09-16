import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
    pathConfiger: Ember.inject.service("path-configer"),
    code: DS.attr('string'),
    loginType: DS.attr('number'), //登录类型：1邮件2微信3手机号
    loginName: DS.attr('string'), //登录名
    name: DS.attr('string'), //用户名称
    entName: DS.attr('string'), //企业名称
    password: DS.attr('string'), //登录密码
    avatar: DS.attr('string'), //头像文件名
    IDavatar: DS.attr('string'), //证件照
    desc: DS.attr('string'), //自我描述---个性签名
    introduce: DS.attr('string'), //个人简介
    status: DS.attr('number'), //'状态   0：禁用 1：未认证 2：已申请认证 3:认证成功 4.认证失败
    age: DS.attr('number'), //年龄
    staffTel: DS.attr('number'), //电话号码
    staffMail: DS.attr('string'), //邮箱
    weixin: DS.attr('string'), //微信号

    curAddress: DS.attr('string'), //地址
    qqnum: DS.attr('string'), //QQ
    role: DS.belongsTo('role'), //对应角色
    //edinfo: DS.belongsTo('edinfo'), //对应企业信息的相关法人信息
    //cstag: DS.hasMany('dicttype'), //对应的客服标签,字典类型
    //extendInfo: DS.belongsTo('userextend'), //对应的扩展信息，如统计信息等
    //language: DS.hasMany('dicttype'),
    //inviteUser: DS.belongsTo('user'), //邀请人 id,
    inviter: DS.attr('string'), //邀请人
    regWay: DS.attr('number'), //注册途径
    verifyFailReason: DS.attr('string'), //审核失败原因
    // currentTask: DS.belongsTo('task'),
    /*currentTask: DS.belongsTo('task'),*/
    org: DS.belongsTo('organization'),

    errcode: DS.attr('number'),//错误类型，0：验证码错误
    passcode: DS.attr('string'),
    appPassWord: DS.attr('string'),
    certificateImage: DS.attr('string'),
    hbeaconID: DS.attr('string'),
    profession:DS.attr('string'),
    schoolName: DS.attr('string'),
    staffBirth: DS.attr('number'),
    staffCardCode: DS.attr('string'),//身份证号
    certificateName: DS.attr('string'),
    createDateTime: DS.attr('number'),
    lastUpdateDateTime: DS.attr('number'),
    isGroupFlag: DS.attr('number'),
    isNurseFlag: DS.attr('number'),
    remark: DS.attr('string'),
    lastUpdateUser:DS.belongsTo('user'),
    //crateUser:DS.belongsTo('user'),
    staffSex: DS.belongsTo('dicttype'),
    hireType:DS.belongsTo('dicttype'),
    privilege:DS.belongsTo('privilege'),
    staffStatus:DS.belongsTo('dicttype'),// 需要改一下
    staffMaritalStatus:DS.belongsTo('dicttype'),//婚姻状态
    staffEducation:DS.belongsTo('dicttype'),//学历
    staffContactRelation:DS.belongsTo('dicttype'),
    staffContactName:DS.attr("string"),
    staffContactTel:DS.attr("string"),
    staffCensus:DS.belongsTo("dicttype"),//籍贯
    staffNation:DS.belongsTo("dicttype"),//民族
    toPositionDate:DS.attr("number"),
  //  nurseGroup:DS.belongsTo("nursegroup",{inverse:'staffs'}),

    authCode:DS.attr("string"),
    tenant:DS.belongsTo("tenant"),//对应租户
    //customers:DS.hasMany('customer',{inverse:'staffs'}),//护工对应的顾客
    employee: DS.belongsTo('employee'),//挂接的员工



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

    certificateImageUrl: Ember.computed('certificateImage', function() {
        var certificateImage = this.get("certificateImage");
        if (!certificateImage) {
            certificateImage = "anonymous.png";
        }
        console.log("this.pathConfiger", this.get("pathConfiger"));
        return this.get("pathConfiger").getAvatarRemotePath(certificateImage);
    }),

    isCustomerService: Ember.computed('role', function() {
        if (this.get("role").get("id") === "2") {
            return true;
        }
        return false;
    }),
    emailHidden: Ember.computed('email', function() {
        var email = this.get('email');
        if (email) {
            var emailStr = email.toString();
            emailStr = '****' + emailStr.substring(6);
            return emailStr;
        }
    }),
    phoneHidden: Ember.computed('phone', function() {
        var phone = this.get('phone');
        if (phone) {
            console.log('fasgwefaefrcgfeasv rf', phone);
            var phoneStr = phone.toString();
            phoneStr = phoneStr.substring(0, 3) + '****' + phoneStr.substring(7);
            return phoneStr;
        }
    }),
    sexStr: Ember.computed('sex', function() {
        if (this.get('sex') === 1) {
            return "男";
        } else if (this.get('sex') === 2) {
            return "女";
        }
        return '';
    }),
    birthdayShow: Ember.computed('staffBirth',function() {//生日?
      var dateOri = this.get("staffBirth");
      if(!dateOri) {
        return '';
      }
      else {
        var date = new Date(dateOri*1000);
        date = date.getFullYear()+"-"+this.toDbl(date.getMonth()+1)+"-"+this.toDbl(date.getDate());
        return date;
      }
    }),
    createTimeShow: Ember.computed('createDateTime',function() {
      var dateOri = this.get("createDateTime");
      var date = new Date(dateOri*1000);
      if(date === 'Invalid Date'){
        date = '';
      }
      else{
        date = date.getFullYear()+"-"+this.toDbl(date.getMonth()+1)+"-"+this.toDbl(date.getDate())+" "+this.toDbl(date.getHours())+":"+this.toDbl(date.getMinutes());
      }
      return date;
    }),
    updateTimeShow: Ember.computed('lastUpdateDateTime',function() {
      var dateOri = this.get("lastUpdateDateTime");
      var date = new Date(dateOri*1000);
      if(date === 'Invalid Date'){
        date = '';
      }
      else{
        date = date.getFullYear()+"-"+this.toDbl(date.getMonth()+1)+"-"+this.toDbl(date.getDate())+" "+this.toDbl(date.getHours())+":"+this.toDbl(date.getMinutes());
      }
      return date;
    }),
    toDbl: function(value) {
      if(value<10)
      {
        return '0'+value;
      }
      else
      {
        return ''+value;
      }
    },
});
