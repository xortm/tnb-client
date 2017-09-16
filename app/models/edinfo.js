import DS from 'ember-data';
import BaseModel from './base-model';
import Ember from 'ember';
// import { belongsTo, hasMany } from 'ember-data/relationships';
export default BaseModel.extend({
  legalname:DS.attr('string'),//法人名
  idType:DS.belongsTo('dicttype'),//证件类型
  idcardNum:DS.attr('string'),//证件号
  legalTel:DS.attr('string'),//办公室电话：
  legalPhone:DS.attr('string'),//法人手机号码
  legalEmail:DS.attr('string'),//法人邮箱
  idPhoto:DS.attr('string'),//证件照
  idPhotoReverse:DS.attr('string'),//证件照反面
  businessLicense:DS.attr('string'),//营业执照
  companyPhotos:DS.attr('string'),//企业照片
  entIdAddress:DS.attr('string'),//单位证件住所
  entIdType:DS.belongsTo('dicttype'),//企业证件类型',
  entIdNumber:DS.attr('string'),//企业证件号码',
  pathConfiger: Ember.inject.service("path-configer"),

  idPhotoUrl:Ember.computed('idPhoto',function(){
    var idPhoto = this.get("idPhoto");
    if(!idPhoto){
      idPhoto = "../headImg/anonymous.png";
    }
    return this.get("pathConfiger").getidcardRemotePath(idPhoto);
  }),

  idPhotoReverseUrl:Ember.computed('idPhotoReverse',function(){
    var idPhotoReverse=this.get('idPhotoReverse');
    if(!idPhotoReverse){
      idPhotoReverse="../headImg/anonymous.png";
    }
    return this.get("pathConfiger").getidcardRemotePath(idPhotoReverse);
  }),
  businessLicenseUrl:Ember.computed('businessLicense',function(){
    var businessLicense = this.get("businessLicense");
    if(!businessLicense){
      businessLicense = "anonymous.png";
    }
    return this.get("pathConfiger").getQualificationImgRemotePath(businessLicense);
  }),
  companyPhotosUrl:Ember.computed('companyPhotos',function(){
    var companyPhotos = this.get("companyPhotos");
    if(!companyPhotos){
      companyPhotos = "anonymous.png";
    }
    return this.get("pathConfiger").getQualificationImgRemotePath(companyPhotos);
  }),
});
