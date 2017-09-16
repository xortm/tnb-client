import Ember from 'ember';
import config from '../config/environment';
/*
 * 路径转换服务
 */
export default Ember.Service.extend({
  // baseRemotePath: config.resourceHost + "/assets/mockData/image",
  basePath:Ember.computed(function(){
    return config.host;
  }),
  baseImgRemotePath: config.imgHost,
  baseRemotePath:config.resourceHost,
  //普通头像上传
  uploadUrl: Ember.computed(function() {
    return config.host + "/upload";
  }),
  //富文本编辑图片上传
  uploadEditorUrl: Ember.computed(function() {
    return config.host + "/image/editor";
  }),
  //excel上传url
  uploadExcelUrl: Ember.computed(function() {
    return config.host + "/excelUpload";
  }),
  //批量上传右面的 a链接
  templateUrl: Ember.computed(function() {
    return config.resourceHost + "/template";
  }),
  //全都导出到excel表格
  exportAllUrl: Ember.computed(function() {
    return config.resourceHost + "/excel/";
  }),
  //居家项目本地路径
  getJujiaLocalPath: function(avatar){
    return "./assets/images/kangyi/" + avatar;
  },
  //居家项目服务器路径
  getJujiaRemotePath: function(avatar){
    return this.baseImgRemotePath + "/reportImg/" + avatar;
  },
  //头像服务器路径
  getAvatarRemotePath: function(avatar){
    return this.baseImgRemotePath + "/headImg/" + avatar;
  },
  getEditorRemotePath: function(){
    return this.baseImgRemotePath + "/editorImg/" ;
  },
  //头像本地路径
  getAvatarLocalPath: function(avatar){
    return "./assets/images/avatars/" + avatar;
  },
  //图片本地路径
  getIconLocalPath: function(imageFileName){
    return "assets/images/icon/" + imageFileName;
  },
  //默认头像服务器路径
  // getAnonymousRemotePath: function(){
  //   return this.baseImgRemotePath + "/anonymous.png";
  // },
  //
  getAudioRemotePath:function(audio){
    return this.baseRemotePath + "/audio/" + audio;
  },
  //资质文件本地路径
  getQualificationImgRemotePath: function(idcard){
      return this.baseImgRemotePath + "/qualificationImg/" + idcard;
  },
  //证件照本地路径
  getidcardRemotePath:function(idcard){
      return this.baseImgRemotePath + "/idcardImg/" + idcard;
  },
  //任务本地路径
  getTaskiconRemotePath: function(iconfile){
      return this.baseImgRemotePath + "/iconFile/" + iconfile;
  },
  //微信二维码路径
  getwechatQrPayRemotePath:function(wechatQrPay){
      return this.baseImgRemotePath + "/QRimg/" + wechatQrPay;
  },
});
